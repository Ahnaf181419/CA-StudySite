# Architecture

A single-page React app, hash-routed, no backend, no external requests. Everything renders from
local data files — the site is fully usable offline once loaded.

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 | hash navigation uses React state; question disclosures are native HTML |
| Build | Vite 8 + rolldown | fast, zero config; `base` switches to `/CA-StudySite/` when `GITHUB_ACTIONS` is set |
| Styling | Tailwind 4 (`@theme` tokens) | the whole palette is 7 grayscale tokens — theming means editing one block |
| Math/formatting | `src/lib/md.jsx` (~30 lines) | the content needs `**bold**`, `` `code` ``, `^{sup}`, `_{sub}` — KaTeX would be dead weight |
| Tests | `node:test` | content-integrity checks run in milliseconds, no test framework |

Deliberately absent: a router library (three routes), KaTeX, an animation library, fonts (system
stack), external state management.

## Data model

```
src/data/
  syllabus.js          → MODULES: the eight modules in teaching order
  foundations.js ch7.js arith.js ch8a.js ch8b.js ch5.js ch4io.js olderPapers.js
                       → one file per module
  topics.js            → TOPICS: topic registry (id → name, module link, class-notes signal)
  papers/
    index.js           → PAPERS: assembles papers, computes per-topic counts + repeat badges
    fall22.js … fall24.js → one file per past paper
```

### Lecture module shape

```js
{
  id: 'ch7', chapter: 'Chapter 7 · Slides 5', title: '…', blurb: '…',
  tags: […],                       // chips on the module card
  prereq: […],                     // prerequisite callout on the module page
  sections: [{ heading, blocks }]  // ordered; headings must be unique (tested)
}
```

### Block types (rendered by `src/components/Blocks.jsx`)

| Type | Renders as | Used for |
|---|---|---|
| `p` | paragraph | explanations |
| `h` | sub-heading | dividing a long section |
| `list` | bulleted / `ordered: true` numbered list | slide enumerations, steps |
| `practice` | prompt and collapsed worked answer (`prompt`, `blocks`) | independent checkpoint within a lecture |
| `steps` | numbered squares | procedures (read-out-loud order matters) |
| `table` | bordered table (`head`, `rows`, optional `caption`) | control sequences, comparisons |
| `timing` | **pipeline chart**: clock columns × instruction rows (optional `start` cycle) | the exam's stage tables; `cell` may be `{ t, dim, box }` for stalls/discards |
| `pre` | monospace block | formulas, address splits, assembly |
| `note` | grey panel | rules, memory aids |
| `think` | black "How to think about it" panel | the requested reasoning coaching |
| `exam` | left-bar callout | where this appears in past papers |
| `diagram` | SVG figure (`id`, `caption`) | see below |
| `answer` | boxed final answer | end of every solution |
| `example` | titled sub-article | worked examples |

Inline text is formatted by `src/lib/md.jsx`: `**bold**`, `*em*`, `` `code` ``, `^{sup}`, `_{sub}`.

### Paper/question shape

```js
{
  id: 'Q2a', topic: 'branch',        // topic id must exist in topics.js (tested)
  marks: '[10: 2+2+4+2]', inNotes: true,   // inNotes → badge (asked/emphasized in class notes)
  flagged: true,                     // outside the current slide set (2022 MIPS track)
  q: '…', pattern: '…',              // question text; how it repeats across papers
  think: […],                        // how to approach it — rendered before the solution
  solution: [blocks],                // full exam-format answer (tested non-empty)
  repeats: 3,                        // distinct papers asking this topic (computed if omitted)
}
```

`papers/index.js` computes `counts` (per-paper topic histogram, shown on the paper list, tested
to match) and fills `repeats` from cross-paper presence when a question doesn't pin it.

### Patterns view

Nothing is hand-maintained: the topic × paper matrix, repeat counts and badges are all derived
at render time from `PAPERS` × `TOPICS`. Adding a paper updates the analysis automatically.

## Diagrams

Hand-built monochrome SVGs, ~36 figures, organized per chapter in `src/components/diagrams/`
with shared primitives in `base.jsx` (`Svg`, `Box`, `T`, `W`, `Bus`, `ALUshape`, `Muxshape`).

Two invariants (both enforced):

1. **Registry is the single source of truth** — `diagrams/registry.js` lists every id;
   `Diagram.jsx` throws at module load if a registry id has no component or vice versa.
2. **Data references must resolve** — the content test fails if any `diagram` block names an id
   not in the registry.

Colors never appear literally in figure files. Everything goes through CSS variables
(`--dg-ink`, `--dg-panel`, `--dg-panel2`, `--dg-line`, defined next to the Tailwind tokens in
`src/index.css`), applied via `style` attributes — presentation attributes (`fill="var(…)"`) do
not resolve CSS variables in all browsers. Theming the site therefore re-themes every figure.

Foundations uses the single-bus and register-gating figures. The same registry serves the past-paper solutions.

## Routing and views

Hash routing in `App.jsx` (`#/lectures[/:module[/:section]]`, `#/qb[/:paper[/:question]]`, `#/patterns`) — no history
API, so the site works from any static host including `file://` builds.

- `Lectures.jsx` — module cards → module contents, practice links and previous/next navigation
- `QuestionBank.jsx` — paper cards → question list; each question has native `<details>` controls for its hint and solution
- `Patterns.jsx` — the derived matrix and trend cards

## Theming

Dark, strict monochrome. Tokens in `src/index.css`:

```
paper  #111114   page background        line2  #41434c   stronger border
panel  #1a1b1f   inset surfaces         ash    #8f9099   secondary text
panel2 #232429   raised surfaces        ink    #ececf2   text / strokes
line   #2c2d33   borders
```

`color-scheme: dark` is set on `:root` (scrollbars, form controls), plus a `theme-color` meta
and an inline SVG favicon in `index.html`.

## Build, test, deploy

- `npm test` — 8 content-integrity checks, including question deep-link IDs, worked checkpoints and timing chart widths
- `npm run build` — single-chunk bundle (~580 kB / ~185 kB gzip); the size warning is expected
  and accepted
- `.github/workflows/deploy.yml` — on push to `main`: test → build → GitHub Pages.
  Pages is enabled with `build_type=workflow`; `configure-pages` carries `enablement: true`.
