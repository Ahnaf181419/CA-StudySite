# Exam guide — what repeats, what to over-prepare

Generated from the same data the site renders (six papers, every sub-question tagged by topic).
Use it as the attack order; the site's Patterns tab keeps the live version of this table.

## The syllabus split

The two **2022 papers** follow the MIPS / Patterson–Hennessy track (machine encoding,
single-cycle datapath, Hamming, floating point, RAID). The **2023–2024 papers** follow the
current Hamacher track (the slide set in this folder). The 2022 shared topics — cache mapping,
pipeline hazards, DMA, bus arbitration, performance arithmetic — carried over unchanged, which
is why they dominate the repeat counts.

Chapter 7 lectures start at multibus (slide 30) per the course scope; the single-bus control
sequences that Fall/Spring 2023 still asked are solved in the question bank but are not
re-taught.

## Priority tiers

### Tier 1 — asked in 4–5 of 6 papers (expect a full question)

| Topic | Papers | How it's asked |
|---|---|---|
| **Cache mapping** (direct / associative / set-associative) | F22, S22, F23, S24, F24 (5) | always numeric: given block size, cache size, an address — split tag/index/set/word and name the exact cache position; sometimes also draw the mapping and explain the hit check |
| **Pipeline hazards** (data / structural / instruction) | F22, S22, F23, S23, S24, F24 (all 6 in some form) | draw the stage chart, identify the hazard, then the fix: forwarding (hardware) or NOP/reorder (software) |
| **Branch penalty / delayed branch / prediction** | F22, S23, F24 + notes | timing chart for 2-stage and 4-stage (E-resolution), reorder a loop into the delay slot, pick predict-taken for a loop-bottom branch |
| **Control sequences** (three-bus steps + signals) | F23, S23, S24 (3) | "generate the control sequence for instruction X in this architecture" — the 3-step fetch is always the same; the execute step is one line; memory operands cost a MARin+Read / WMFC+MDRinE pair each |
| **Sequential multiplication / division** | F23, S23, S24 + notes | register-by-register table (add / shift-multiplicand / shift-multiplier), or the restoring-division trace with the quotient-bit column |

### Tier 2 — asked 2–3 times or singled out in class

| Topic | Papers | Notes signal |
|---|---|---|
| Performance arithmetic (TI, tave, throughput) | F22, F23, S23, S24 | the notes derive `Pp = R` and both miss-increase formulas by hand — learn the two formulas, not the numbers |
| Operand forwarding | S23 (+ every hazards question) | forwarding datapath (SRC1/SRC2/RSLT) drawn in the notes |
| Interrupt handling (repeated-IRQ, priorities, daisy chains) | F24, S23, S24 | all three repeated-interrupt approaches + the three simultaneous-request schemes are in the notes |
| RAM chip internal organization | F22, S22, S23, F24 | **explicit exam pointer in the notes**: "draw the internal organization, explain read and write" |
| Bus arbitration (centralized / distributed) | F22, S24, F24 | the notes work two distributed examples; be ready to simulate IDs bit by bit |
| DMA | F22, S22 (+ Q4a compare) | initiation info (address, count, direction) + cycle stealing vs burst timelines |
| Program-controlled I/O | F24, S24 | write the polling loop with side notes, name the busy-waiting disadvantage, fix = interrupts |
| Virtual memory (small RAM, big program) | F23, S23 | yes-issue → technique → draw the MMU organization → locality |
| SCSI scattered-sector reads | F23, S24 | initiator/target roles, logical→physical translation, per-sector reads |
| Sync vs async bus timing | F24, S23 | draw both; "clock set for the slowest device" is the limitation sentence |
| Read/write hit & miss policies | F24 | the 6-row table (through vs back, load-through) |

### Tier 3 — single appearances or pre-scope material

Addressing modes (F23, S23), one/zero-address evaluation (F23, S23, S24), assembly programs
(average/dot-product/product — F23, S23), RISC/CISC and T (S24), three-bus drawing (S23, S24),
register gating (S24), stack CPU (S24), n-stage justification derivation (S24), replacement
algorithms, locality of reference (F23), locality/classification, Flash vs RRAM, microarch vs
ISA, QPI, RAID — plus the 2022 MIPS-only items (encoding, datapath modification, Hamming,
floating-point bit patterns).

## Paper formats

| Paper | Structure | Marks |
|---|---|---|
| Fall 2024 | Q1 any 3 of 4 × 6 · **Q2 both** × 10 · Q3 any 3 of 4 × 4 | 50, 2h30 |
| Spring 2024 | Q1 any 4 of 6 × 6.5 · Q2 any 2 of 3 × 10 · Q3 any 3 of 4 × 8 | 70, 3h |
| Spring 2023 | Q1 any 5 of 7 × 6 · Q2 any 2 of 3 × 5 · Q3 any 5 of 7 × 6 | 70, 3h |
| Fall 2023 | Q1 any 5 of 6 × 6 · Q2 any 2 of 3 × 8 · Q3 any 5 of 6 × 6 | 70, 3h |
| Spring 2022 (partial) | seven 14-mark questions, long multi-part | 70, 3h |
| Fall 2022 | Q1 compulsory · any 2 of Q2–Q4 and 2 of Q5–Q7 | 70, 3h |

Reading the formats: the **Q2 slot in the recent papers is the guaranteed long question**
(F24: branch penalty + cache mapping; S24: mapping / control sequence + gates / derivation;
F23–S23: control sequence + performance). Those three topics decide the paper — the short
questions are wide but forgiving (answer 5–7 of 6–7).

## The five templates that answer most of the paper

1. **Mapping split** — word bits = log2(block words); index/set bits = log2(lines or sets);
   tag = the rest; place by converting the index/set field to decimal; cross-check
   `block mod lines/sets`.
2. **Hazard chart** — copy the ideal table, stretch the stalled stage, repeat the stalled
   letter (D2A…), let bubbles drift downstream; count the extra cycles.
3. **Three-bus sequence** — fixed fetch (3 steps) → per memory operand (MARin+Read, then
   WMFC+MDRinE) → one execute step (A out, B out, SelectA, op, dst in) → auto-increment via
   Select4 → End; merge only across different buses.
4. **Performance ratio** — compute Δ (miss increase), TI = 1 + Δ pipelined vs S = n + Δ
   sequential, throughput = R/TI; or tave per access type × the 100-fetch + 25-data bookkeeping.
5. **Mult/div table** — one row per loop: test LSB / trial-subtract, add-or-restore, shift both
   registers; end with the `dividend = divisor × quotient + remainder` check.

Each template is demonstrated in full inside the relevant question-bank solution.
