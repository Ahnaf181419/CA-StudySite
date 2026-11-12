# CSE 2213 — Computer Architecture study site

A self-contained React study site built from one student's CA materials: the faculty slide set,
the handwritten class notes, and every past paper in the folder. No quizzes, no flashcards —
lecture explanations and question-bank analysis only.

## Commands

- `npm run dev` — dev server (LAN-accessible, `--host`)
- `npm test` — content-integrity checks (`src/lib/data.test.js`): every diagram id referenced in
  content exists, every question has a topic/marks/solution, no duplicate section headings,
  per-paper counts add up. Must pass before every commit.
- `npm run build` — production build. CI sets `GITHUB_ACTIONS`, which switches the Vite base to
  `/CA-StudySite/` for GitHub Pages.

## Content rules (most important)

1. **Lecture content comes only from the slide set** (Hamacher chapters 4, 5, 7, 8 + the P&H §3.5
   self-study pointer), expanded with prerequisite context and "how to think about it" sections.
   The class notes supply the worked three-bus control sequences, the exam pointers ("for exam:
   draw the RAM chip organization", "exercise 3.27, 3.29") and the priority signals.
   Never invent topics, formulas or numbers.
2. **Question bank** = every sub-question of the six papers (Fall 2022 … Fall 2024), each with an
   exam-format solution: think-box, steps, tables/timing charts, boxed answer. Question text was
   recovered from scans via OCR + transcription passes; where the scan was ambiguous the solution
   states its reading openly.
3. **The 2022 papers follow the MIPS/P&H track** (machine encoding, single-cycle datapath,
   Hamming, RAID, QPI) which is outside the current Hamacher slide set — those questions carry
   `flagged: true` and a visible "outside current slides" tag. Solutions use the standard P&H method.
4. **Patterns view** computes topic × paper overlap from the papers data (no hand-maintained
   matrix): repeats, "in notes" markers and per-topic trend notes come from `src/data/topics.js`.

## Layout

- `src/data/syllabus.js` — the six modules in teaching order (datapath → arithmetic →
  pipelining ×2 → memory → I/O).
- `src/data/ch*.js`, `arith.js` — one file per module: `{ id, chapter, title, blurb, tags, prereq,
  sections: [{ heading, blocks }] }`. Block types: `p`, `list`, `table`, `note`, `think`
  (how-to-think callout), `exam`, `pre`, `timing` (pipeline charts), `diagram`, `answer`,
  `example`, `steps`, `h`, `practice` (try-it checkpoint with a hidden worked answer; every
  module needs one). A test rejects unknown types. Text supports `**bold**`, `*em*`, `` `code` ``, `^{sup}`, `_{sub}`.
- `src/data/papers/*.js` — one file per paper: `{ questions: [{ id, topic, marks, q, pattern,
  think, solution, repeats, inNotes, flagged }] }`.
- `src/data/topics.js` — topic registry: module link + the class-notes signal per topic.
- `src/components/diagrams/` — hand-built monochrome SVG figures, one file per chapter.
  `registry.js` is the single source of truth for ids; `Diagram.jsx` fails loudly on drift.
- `src/lib/md.jsx` — the tiny inline formatter (no KaTeX; the content needs none).

## Design

- Strict monochrome: `paper / panel / line / ash / ink` tokens in `src/index.css`. Light theme
  only, system fonts, no external requests.
- Diagrams are inline SVG with shared primitives in `diagrams/base.jsx` (`Box`, `T`, `W`, `Bus`,
  `ALUshape`, `Muxshape`). Every figure was checked in a browser against its slide source
  (components, connection directions, no text outside the viewBox).
- iPad/phone friendly: single column, no horizontal scroll at 390px, tap targets ≥ 44px.

## Git

Commit as the student: `user.name Ahnaf181419`, `user.email muhammad.ahnaf.sarker@gmail.com`.
Never commit the source PDFs/scans (`Classnotes/`, `Slides/`, `QuestionBank/`), `node_modules/`
or `dist/`. GitHub Actions deploys `main` to GitHub Pages on every push.
