# CSE 2213 · Computer Architecture — study site

**Live site: https://ahnaf181419.github.io/CA-StudySite/**

A self-contained study site for the faculty slides, class notes and six past finals (2022–2024).
Start with Foundations, work through the six course modules, then use the older-paper supplement
for MIPS, error correction and system-design questions.

- **Lectures** teach the course with diagrams, worked traces, 36 checkpoints with hidden worked
  answers, and past-paper questions grouped by topic. The core Chapter 7 module starts at multibus.
- **Question bank** contains 92 questions from the available paper pages, with separately
  revealable hints and solutions and links back to the relevant lectures.
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

## Documentation

Detailed docs live in [`docs/`](docs/README.md):

- [architecture.md](docs/architecture.md) — data model, block types, diagrams, routing, theming
- [content.md](docs/content.md) — content provenance and the assumptions register
- [exam-guide.md](docs/exam-guide.md) — the distilled study plan: priority tiers, paper formats, answer templates
- [maintenance.md](docs/maintenance.md) — how to add papers, sections and diagrams; test/deploy
