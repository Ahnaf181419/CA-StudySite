# Maintenance — how to extend the site

Everything is plain data files; no generator step. Run `npm test` before committing — it fails
loudly on the mistakes below.

## Add a past paper

1. Create `src/data/papers/<term><year>.js` exporting the paper object
   (copy the shape from `fall24.js` — the smallest current paper).

   ```js
   export default {
     id: 'fall25', name: 'Fall 2025', short: 'F25', date: '…',
     marks: '… · …', note: 'one line on how it relates to the slide set',
     instruction: '…', format: '…',
     questions: [{
       id: 'Q1a', topic: 'cache',            // topic MUST exist in src/data/topics.js
       marks: '[6]', inNotes: true,          // set when the class notes cover/emphasize it
       q: 'verbatim text (recover via OCR, cross-check by eye)',
       pattern: 'how this repeats across papers',   // optional but valuable
       think: ['how to approach it'],
       solution: [ /* blocks */ ],
     }],
   }
   ```

2. Import it in `src/data/papers/index.js` and add it to the ordered list.
   Repeat badges and the Patterns matrix update themselves from the data.

Rules enforced by tests: every question needs `topic`, `marks`, `q` and a non-empty
`solution`; per-paper `counts` are computed for you (never hand-maintain them). Set
`flagged: true` on questions outside the current slide set.

## Add / edit a lecture section

Lecture modules live in `src/data/<module>.js`. Add a section object
`{ heading: '…', blocks: […] }` — headings must be **unique within the module** (tested); the
section nav and prev/next links are derived automatically.

Block reference: see [architecture.md](architecture.md). Keep the discipline that keeps the
site trustworthy:

- content comes from the slides / notes / papers — if you add an interpretation (like the
  assumptions register in [content.md](content.md)), record it there;
- end numerical sections with the boxed `answer` block and give every worked table its check
  (`mod` cross-check, remainder identity, cycle count);
- use the `think` block for the reasoning recipe and `exam` for where papers ask it.

## Add a diagram

1. Draw it once in the right chapter file under `src/components/diagrams/` using the primitives
   from `base.jsx` (`Svg`, `Box`, `T`, `W`, `Bus`, `ALUshape`, `Muxshape`).
   **Never hardcode a color** — use `var(--dg-ink)`, `var(--dg-panel)`, `var(--dg-panel2)`,
   `var(--dg-line)` through `style` attributes, or the whole figure breaks on theme change.
2. Register the id in `src/components/diagrams/registry.js` **and** map it in
   `Diagram.jsx` — a mismatch throws at load time (either direction).
3. Reference it from content with `{ type: 'diagram', id: '…', caption: '…' }`. The test fails
   if the id is missing from the registry.

Geometry rules learned the hard way: keep every `<T>` text inside the `viewBox` (check: text
`getBBox().right` ≤ viewBox width — long footnote lines get split, not shrunk); give arrows a
real target coordinate, not an approximation; one bus output per wire.

## Verify a change

```sh
npm test              # content integrity — 5 suites, <100 ms
npm run build         # production build
npm run preview       # serve dist/ and click through the changed routes
```

In the browser, the quick sweep that caught every past bug:

- console errors on each route (should be zero, including after expanding a question);
- diagram text inside the viewBox (see the snippet in git history of this repo, or eyeball it);
- `document.documentElement.scrollWidth === clientWidth` at 390 px width for anything new.

## Deploy

Push to `main`. GitHub Actions runs test → build → Pages (`.github/workflows/deploy.yml`);
Pages is already enabled with `build_type=workflow`. The workflow's `configure-pages` step has
`enablement: true`, so it works even on a fresh fork after enabling Actions.

Commit identity (house convention): `user.name Ahnaf181419`,
`user.email muhammad.ahnaf.sarker@gmail.com`. Never commit `Classnotes/`, `Slides/`,
`QuestionBank/`, `node_modules/` or `dist/` — they are gitignored.
