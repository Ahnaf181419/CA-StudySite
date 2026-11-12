# Content provenance and the assumptions register

## 2026-11-12 content review

The original provenance and assumptions are retained below. The site now teaches single-bus
control in Foundations while the core Chapter 7 module still starts at multibus. The Fall 2024
CA paper is complete: its two pages are pages 5–6 of the multi-course scan. Spring 2022 remains
partial.

- Fall 2024 Q2(a) can fill both delay slots by moving ADD and SHIFT LEFT together after the
  branch, preserving their order. The trace assumes the branch samples DEC's flags and the
  exit path does not need those flags preserved. The solution gives the one-slot case too.
- Fall 2024 Q3(b) follows the Chapter 8 slides' destination-last syntax. Spring 2024 Q2(b)
  specifies `R1in`, which identifies the destination for that question.
- The cache lesson and 2023 solutions now state whether times represent complete paths or
  successive lookup costs. Both interpretations are calculated where the wording permits them.
- The source scans and slides determine the course scope. The supplemental explanations use
  [the MIPS appendix](https://pages.cs.wisc.edu/~larus/HP_AppA.pdf),
  [Cornell's cache notes](https://www.cs.cornell.edu/courses/cs3410/2025fa/notes/caches.html),
  [OSTEP on paging](https://pages.cs.wisc.edu/~remzi/Classes/537/Fall2022/Book/vm-beyondphys-policy.pdf),
  [Oracle's IEEE-format guide](https://docs.oracle.com/cd/E60778_01/html/E60763/z4000ac019878.html),
  and the original [RAID paper](https://www.cs.cmu.edu/afs/cs/academic/class/15712-f08/www/readings/Patterson88.pdf).

## Original source review

Three source folders feed the site. This document records what was taken from each, how it was
processed, and every place where a judgment call was made. If an answer ever looks wrong, check
here first.

## Sources

| Folder | Contents | Used for |
|---|---|---|
| `Slides/` | 6 decks (Arithmetic pointer, Ch 7, Ch 8 pt 1+2, Ch 5, Ch 4 I/O), 216 pages | **the lecture content** — every topic, definition, figure and worked number |
| `Classnotes/CA Final Note.pdf` | 49 handwritten pages with Bengali margin notes | three-bus control sequences, exam pointers, priority signals, the multiplication worked table |
| `QuestionBank/` | Fall 22, Spring 22 (partial), Fall 23, Spring 23, Spring 24, Fall 24 (pp. 5–6) | every question, verbatim, plus marks and figures |

The folders themselves are gitignored (never commit the PDFs) — a fresh clone gets the site, not
the sources. This file is the map back to them.

## How each source was processed

**Slides** — text-extracted with `pdftotext -layout`. This captures all prose but **not**
equations and figures that were embedded as images; those were reconstructed from the
class-notes derivations and the textbook (Hamacher) they were taken from. The performance
formulas (`Δ = [(1−hi) + d(1−hd)]·Mp` and the two-level variant) were cross-checked against the
handwritten derivations in the notes — they match.

**Class notes** — pages were scanned to images. Pages 1–26 and 39–49 were transcribed in full
(the three-bus sequences `Add (R1),R2` / `Add R1,(R2)` / `Add R1,(R2)+,R3`, the merge rules, the
Zin gate network, the multiplication table, cache-mapping worked examples, the interrupt and DMA
pages). Pages 27–38 (branch prediction, pipeline performance, memory chapter) are only legible
at keyword level in the scan; their topics are fully covered by the slide decks, and **every
exam-priority marker used on the site comes from the cleanly transcribed pages.**

**Question banks** — scanned papers. Two independent passes (tesseract OCR + a second
transcription) were run over every page and cross-checked; disagreements were resolved against
each other. Both passes agreeing is why the question text is trusted. Figures inside papers are
described in the question text where they matter (e.g. Fig 3(b)-1 is a single-bus datapath,
Fig 3(c)-1 a pipeline chart).

## Syllabus scope decision

**Chapter 7 lectures start at "Multiple-bus organization" (deck slide 30/31).** Everything
before it — ISP intro, fundamental concepts, single-bus datapath, register gating, memory
read/store steps, the `Add (R3),R1` walkthrough, branch execution — is removed from the lecture
modules per the course scope, but the corresponding figures remain in the diagram registry
because Fall 2023 Q3(b), Spring 2023 Q3(b) and Spring 2024 Q1(e) print them and their solutions
need them. Those solutions are self-contained; nothing in the trimmed lectures is required to
follow them.

## Assumptions register

Every interpretation made where a scan was ambiguous or a question under-specified. Each is also
stated openly inside the solution itself.

| Where | Assumption | Why / impact |
|---|---|---|
| Fall 22 Q1(a) | Label address read as 80000 | The question is only meaningful if the offset (74992) exceeds the 16-bit field; if the paper really says 8000, the branch works — the solution notes this |
| Fall 22 Q1(b) | `lw $s1, 32($t0)`, `sll $0,$0,0` | Register glyphs degraded in the scan; encodings recomputed for this reading |
| Fall 22 Q2(a) | Table I values 8/6/9/12/6 ns | Recovered by the second transcription pass; Σt = 41, tmax = 12 |
| Fall 22 Q2(b), Q4(b), Q5(c), Q7(a/c), Spring 22 Q4(c), Q5(b/c), Q6(f) | Flagged "outside current slides" | MIPS-datapath / Hamming / RAID / QPI / ISA-essay material from the 2022 track, not in the current Hamacher slide set — solved with the standard textbook method |
| Fall 23 Q2(c) | Expression `A = M + (B×C×D) + (N+P+(Q−R))`, one-address **and two-address** | Recovered by the second pass (the first OCR misread it as zero-address with different terms) |
| Fall 23 Q3(c) | The data-hazard victim is **I6**, depending on **I4 and I5**; I5's fetch takes 3 cycles total | Subscripts degraded in the scan; reading matches the figure (rows I4–I7, cycles 4–10) and is the only assignment consistent with an in-order pipeline. The method shown works for any numbering |
| Fall 23 Q3(d) | Critical parameter 4 ns (R = 250 MHz) | The sibling paper (Spring 23) states 4 ns explicitly; only affects MIPS figures, not the winner |
| Fall 24 Q2(a)(III) | Delayed branch fills one slot with `SHIFT LEFT R2`, the second takes a NOP; `DEC R3` must stay before the branch (it sets the flags) | E-stage resolution gives two slots; only one instruction is safely movable → penalty 2 → 1 |
| Spring 22 | Pages 2–4 of 4 only | Page 1 (header, Q1, start of Q2) was not in the folder — the paper is labelled "partial" |
| Spring 23 Q3(c) | F5 spans 3 cycles total (not 3 extra) | Matches the wording "takes 3 clock cycles to fetch" |
| Spring 24 Q2(a) | Set-associative = 2 blocks/set (64 sets) | The paper doesn't state blocks/set; the slide/book standard example is 2-way. General k-way formula included in the solution |
| Ch 5 lectures | L2 tave formula `tave = h1C1 + (1−h1)h2C2 + (1−h1)(1−h2)M` | The slide equation is an image; this is the standard Hamacher form consistent with the worked numbers on the same slide |
| Patterns `notes` markers | Derived only from transcribed notes pages | Pages 27–38 never contribute priority claims |

## Verification already performed

- Every numeric solution re-derived by hand (cache splits cross-checked with
  `block mod lines/sets`, performance ratios recomputed, Hamming syndromes recomputed).
- Every diagram checked in a browser: geometry (all text inside its viewBox, no NaN paths),
  connection directions against the slide layouts, and dark-theme colors.
- Content tests (`npm test`) enforce: diagram ids resolve, questions complete, topics valid,
  counts consistent. The `ui-checker` pass additionally verified all routes render error-free.
