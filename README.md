# CSE 2213 · Computer Architecture — study site

**Live site: https://ahnaf181419.github.io/CA-StudySite/**

A self-contained study site built from the course materials in this folder: the faculty slide set
(Hamacher chapters 4, 5, 7, 8 + the P&H §3.5 self-study pointer), the handwritten class notes, and
every past paper (Fall 2022 → Fall 2024). Chapter 7 covers the exam scope only (from multibus,
slide 30, onward).

Three views, dark monochrome and distraction-free:

- **Lectures** — every exam-syllabus slide topic explained from prerequisites up, each section
  closing with a "how to think about it" box for exam use, plus 36 hand-drawn SVG diagrams.
- **Question bank** — every sub-question of all six papers with a full exam-format solution
  (steps, timing charts, figures, boxed answers). Repeated questions and class-notes priorities
  are badged.
- **Patterns** — topic × paper matrix with repeat counts, notes-priority markers and per-topic
  trend notes, so preparation effort can be aimed where it repeats.

## Run locally

```sh
npm install
npm run dev        # dev server
npm test           # content-integrity tests (must pass before committing)
npm run build      # production build to dist/
```

Deploys to GitHub Pages automatically on every push to `main` (see `.github/workflows/deploy.yml`).
