// Chapter 8 part 2 — branch handling and performance. From slides 7_chapter8__Pipeline_pt_2
// and class notes pp. 23–31.
export default {
  id: 'ch8b',
  chapter: 'Chapter 8 · Slides 7',
  title: 'Pipelining — branches and performance',
  blurb: 'Branch penalty in two- and four-stage pipes, delayed branch, branch prediction, and the TI / throughput arithmetic that the numeric exam questions are built on.',
  tags: ['branch penalty', 'delayed branch', 'branch prediction', 'throughput', 'miss penalty'],
  prereq: [
    'The 4-stage pipeline table and the three hazards (previous module).',
    'Cache hit rate h, miss penalty M, and the difference between an extra miss penalty and a total miss-path time. Chapter 5 explains both.',
    'The laundry lesson: the deeper the pipe, the more instructions are in flight — and the more that must be thrown away when a branch changes the flow.',
  ],
  sections: [
    {
      heading: 'Unconditional branching in a two-stage pipeline',
      blocks: [
        { type: 'p', text: 'I1, I2, I3 sit at successive addresses; I2 branches to Ik. In clock cycle 3, I2 is being decoded (branch target computed) **while I3 is being fetched**. In cycle 4, I3 must be **discarded** — it was incorrectly fetched — and Ik fetched instead; the execute hardware must be told to do nothing during that cycle. The pipeline is stalled for one clock cycle.' },
        { type: 'timing', columns: 6, rows: [
          { label: 'I1', cells: ['F1', 'E1', '', '', '', ''] },
          { label: 'I2  Branch', cells: ['', 'F2', 'E2', '', '', ''] },
          { label: 'I3', cells: ['', '', { t: 'F3', dim: true }, '', '', ''] },
          { label: 'Ik', cells: ['', '', '', 'Fk', 'Ek', ''] },
        ], caption: 'Two-stage: the wrong instruction (I3) occupies one slot. Branch penalty = 1 clock cycle.' },
        { type: 'note', title: 'Definition', text: ['The time lost as a result of a branch instruction is the **branch penalty**. The penalty depends on how many useful issue slots are lost before redirecting fetch.'] },
      ],
    },
    {
      heading: 'Four-stage pipeline: where the branch target is computed decides the penalty',
      blocks: [
        { type: 'p', text: '**Case 1 — branch address computed in step E (the default 4-stage pipe).** I3 and I4 are both incorrectly fetched and discarded; Ik is correctly fetched in cycle 5:' },
        { type: 'timing', columns: 8, rows: [
          { label: 'I1', cells: ['F1', 'D1', 'E1', 'W1', '', '', '', ''] },
          { label: 'I2  Branch', cells: ['', 'F2', 'D2', 'E2', '', '', '', ''] },
          { label: 'I3', cells: ['', '', { t: 'F3', dim: true }, { t: 'D3', dim: true }, '', '', '', ''] },
          { label: 'I4', cells: ['', '', '', { t: 'F4', dim: true }, '', '', '', ''] },
          { label: 'Ik', cells: ['', '', '', '', 'Fk', 'Dk', 'Ek', 'Wk'] },
        ], caption: 'Branch penalty = 2 clock cycles (cycles 4 and 5 produce nothing useful).' },
        { type: 'p', text: '**Case 2 — dedicated hardware identifies the branch and computes the target in step D.** Only I3 was wrongly fetched:' },
        { type: 'timing', columns: 7, rows: [
          { label: 'I1', cells: ['F1', 'D1', 'E1', 'W1', '', '', ''] },
          { label: 'I2  Branch', cells: ['', 'F2', 'D2', 'E2', 'W2', '', ''] },
          { label: 'I3', cells: ['', '', { t: 'F3', dim: true }, '', '', '', ''] },
          { label: 'Ik', cells: ['', '', '', 'Fk', 'Dk', 'Ek', 'Wk'] },
        ], caption: 'Branch penalty = 1 clock cycle. Reducing the penalty means computing the branch address earlier in the pipeline — typically in the instruction-fetch unit itself.' },
        { type: 'think', text: [
          'Rule of thumb: **In these charts**, with sequential fetch, one fetch per cycle, and redirect in the cycle after resolution, penalty = resolution stage number − 1. Resolve in stage 2 of a 4-stage pipe → 1 wasted slot; resolve in stage 3 → 2. A deeper pipeline can increase the penalty if branch resolution moves later.',
          'An ordinary branch has no register result to write. A blank W entry alone does not change the redirect cycle.',
        ] },
        { type: 'practice', prompt: 'A branch is fetched in cycle 4 and resolves at the end of E in F/D/E/W. Sequential fetch continued until resolution. When is the target first fetched? Which fetches are squashed?', blocks: [
          { type: 'answer', text: 'E is in cycle 6. Target F is cycle 7. Wrong-path fetches in cycles 5 and 6 are squashed, costing two slots. If the branch resolved in D instead, the target would be fetched in cycle 6.' },
        ] },
      ],
    },
    {
      heading: 'Conditional branching',
      blocks: [
        { type: 'p', text: 'A conditional branch adds a second problem: the decision to branch **depends on a condition value, often set by an earlier instruction**, so it cannot be made until that instruction finishes executing.' },
        { type: 'pre', text: 'Loop   Shift_left  R1\n       Dec  R2\n       Branch ≠ 0  Loop\nNext   Add  R1, R3' },
        { type: 'list', items: [
          'Branch instructions are about **20% of the dynamic instruction count** of most programs.',
          'If the penalty of conditional branches is not reduced, the performance improvement from pipelining is **vastly reduced**.',
          'Class note: with an n-iteration bottom-tested loop and predict-not-taken, the branch runs n times and redirects fetch n−1 times. Predict-taken with an available target reverses which outcome loses time.',
        ] },
        { type: 'think', text: [
          'Unconditional = we know *where*, the only cost is *when* the pipe learns it. Conditional = we do not even know *whether*. Every trick below (delayed branch, prediction) is about hiding the *when* or guessing the *whether* early.',
        ] },
      ],
    },
    {
      heading: 'Delayed branch',
      blocks: [
        { type: 'list', items: [
          'The location following a branch instruction — where the penalty would occur — is the **branch delay slot**.',
          'Instructions in the delay slot are **always fetched and executed**, whether or not the branch is taken.',
          'Idea: fill the slot with a **useful instruction**; if none is available, fill it with **NOP**.',
          'The compiler reorders instructions so that the moved instruction does not change the program’s logic.',
        ] }
        ,
        { type: 'p', text: 'The Shift instruction is independent of the loop counter, so it can safely occupy the slot after the branch:' },
        { type: 'table', head: ['Original', 'Reordered (1 delay slot)'], rows: [
          ['`Loop  Shift_left R1`', '`Loop  Dec  R2`'],
          ['`      Dec  R2`', '`      Branch ≠ 0  Loop`'],
          ['`      Branch ≠ 0  Loop`', '`      Shift_left R1`  ← delay slot'],
          ['`Next  Add  R1, R3`', '`Next  Add  R1, R3`'],
        ], boldFirst: false },
        { type: 'p', text: 'During the last two passes of the loop, the pipeline runs with **no interruption and no idle cycles**: the shift is fetched while the branch executes; after evaluating the branch condition the processor fetches from LOOP (taken) or NEXT (not taken) — in both cases the shift instruction is executed. Logically the program behaves as if the branch were placed *after* the shift instruction; branching takes place one instruction later than where it appears in memory — hence **delayed** branch.' },
        { type: 'timing', columns: 5, rows: [
          { label: 'Dec (branch pass)', cells: ['F', 'E', '', '', ''] },
          { label: 'Branch', cells: ['', 'F', 'E', '', ''] },
          { label: 'Shift (slot)', cells: ['', '', 'F', 'E', ''] },
          { label: 'Next fetch (taken or not)', cells: ['', '', '', 'F', 'E'] },
        ], caption: 'The slot after the branch is always doing useful work, so the taken branch costs nothing.' },
        { type: 'list', items: [
          'Effectiveness depends on how often instructions **can** be reordered without causing a logical error.',
          'Experimental data: **one** delay slot can be filled with sophisticated compilation in about **85%** of cases.',
          'For **two or more** slots it is much harder — the compiler must find 2 movable instructions before the branch, and the chance of finding them is much lower.',
          'So if increasing the number of pipeline stages increases the number of delay slots, the potential gain may **not be fully realized**.',
        ] },
        { type: 'think', text: [
          'When rearranging, the safety check is: the instruction moved into the slot must (a) not depend on the branch decision, (b) not write anything the branch target reads before it should, and (c) not use a register the loop still needs intact if the branch is *not* taken. Keep a counter decrement before a branch that tests its flags. Move an independent shift only if it is safe on both paths and its changed flag timing has no effect.',
        ] },
        { type: 'exam', text: ['**Fall 2024 Q2(a)** asks this end-to-end on a 4-instruction loop: penalty in a 2-stage pipe, in a 4-stage pipe with E-stage resolution, the delayed-branch rearrangement (last two iterations drawn), and which branch prediction suits the loop. Fully solved in the question bank.'] },
      ],
    },
    {
      heading: 'Branch prediction',
      blocks: [
        { type: 'list', items: [
          'Another technique for reducing the branch penalty of **conditional** branches: predict whether the branch will be taken.',
          '**Simplest form**: assume the branch will **not** be taken and keep fetching sequentially.',
          '**Speculative execution**: instructions are executed before the processor is certain they are in the correct sequence. Until the branch condition is evaluated, execution along the predicted path must be speculative.',
          'Care: speculative results must not commit to architectural registers or memory until the path is confirmed. If the prediction was wrong, the instructions and their data in the execution units must be **purged**, and the correct instructions fetched.',
        ] },
        { type: 'timing', columns: 6, rows: [
          { label: 'I1', cells: ['F1', 'D1', 'E1', 'W1', '', ''] },
          { label: 'I2  Branch', cells: ['', 'F2', { t: 'D2 (P2: not taken)', box: true }, 'E2', '', ''] },
          { label: 'I3 (predicted path)', cells: ['', '', { t: 'F3', dim: true }, { t: 'D3', dim: true }, '', ''] },
          { label: 'I4 (predicted path)', cells: ['', '', '', { t: 'F4', dim: true }, '', ''] },
          { label: 'Ik (actual target)', cells: ['', '', '', '', 'Fk', 'Dk'] },
        ], caption: 'Wrong prediction: in cycle 3, while decoding I2, it was predicted (P2) the branch would not be taken, so I3 and I4 were fetched in cycles 3 and 4. At the end of cycle 4, after I2 executes, the prediction turns out wrong — all changes are rolled back and Ik is fetched in cycle 5.' },
        { type: 'h', text: 'Predicting smarter than a coin flip' },
        { type: 'list', items: [
          'If branch outcomes were random, half would be taken — assuming “not taken” would save the penalty **50% of the time**.',
          'Better: predict per instruction from expected program behaviour. A branch at the **end of a loop** is taken every pass except the last → predict **taken** and start fetching at the target. A branch at the **beginning** of a loop is better predicted **not taken**.',
          'The decision can be made **in hardware** by comparing the target address with the branch instruction’s address (backward = loop = taken).',
          'More flexible: the **compiler** decides, and the instruction encodes it — some processors (e.g. SPARC) include a **branch prediction bit** set to 0/1 by the compiler; the fetch unit checks it.',
        ] },
        { type: 'list', items: [
          '**Static branch prediction**: the decision is the same every time a given instruction executes.',
        ] },
        { type: 'list', skip: true, items: [
          '**Dynamic branch prediction**: the decision may change depending on execution history (self-study). Never asked in any paper 2022–2025 — every prediction question so far uses the static direction rule above.',
        ] },
        { type: 'think', text: [
          'For a “which prediction for this loop?” question, look only at where the branch sits: branch at the **bottom** of a loop (the common case) → taken (n−1 of n times). For other loops, trace which direction actually stays in the loop and count outcomes. Say it in those counts and the justification writes itself.',
        ] },
        { type: 'p', skip: true, text: 'A simple dynamic predictor stores the last outcome for each tracked branch (one bit). A two-bit saturating counter starts in one of four states: strongly not taken, weakly not taken, weakly taken, strongly taken. Predict from the state before updating. Taken moves one step toward strongly taken; not taken moves one step toward strongly not taken. One loop exit does not flip a strongly taken prediction.' },
        { type: 'practice', prompt: 'A bottom-tested loop has five iterations. The taken target is ready at prediction time, and a wrong prediction loses two cycles. Find extra cycles for always taken and always not taken.', blocks: [
          { type: 'answer', text: 'Outcomes T,T,T,T,N. Always taken misses once, losing 2 cycles. Always not taken misses four times, losing 8 cycles.' },
        ] },
      ],
    },
    {
      heading: 'Performance considerations: the TI arithmetic',
      blocks: [
        { type: 'note', title: 'Variables (memorize)', text: [
          '`T` = execution time · `N` = dynamic instruction count · `S` = average clock cycles per instruction · `R` = clock rate · `Ps` = throughput.',
          'Instruction throughput `Ps = R / S`. For a pipelined processor with no hazards, `TI = 1` cycle per instruction, so `Pp = R`.',
        ] }
        ,
        { type: 'h', text: 'Step 1 — the ideal pipelined rate' },
        { type: 'p', text: 'The clock rate is set by the **longest pipeline step**; let that be the ALU delay. ALU delay 2 ns → clock 500 MHz. On-chip instruction and data caches are also designed for 2 ns access. Ideal pipelined throughput: `Pp = R = 500 MIPS`. A cache miss stalls the pipeline by the miss penalty, increasing TI for the instruction that missed.' },
        { type: 'h', text: 'Step 2 — average increase of TI from cache misses (single cache)' },
        { type: 'p', text: 'Let `d` = fraction of instructions that reference data in memory, `hi`/`hd` = instruction/data hit rates, `Mp` = miss penalty. Every instruction is fetched (so instruction misses count for all of them) and a fraction `d` also risks a data miss:' },
        { type: 'pre', text: 'increase = [ (1 − hi) + d (1 − hd) ] × Mp' },
        { type: 'p', text: 'Slides’ numbers: `d = 30%`, `hi = 95%`, `hd = 90%`, `Mp = 17` cycles → increase = (0.05 + 0.3 × 0.1) × 17 = 0.08 × 17 = **1.36 cycles**, so `TI = 2.36`.' },
        { type: 'h', text: 'Step 3 — compare with sequential execution' },
        { type: 'p', text: 'With the same clock rate and cache-miss cost, the sequential processor needs `S = 4 + 1.36 = 5.36` cycles per instruction, so `Ps = 500 / 5.36 ≈ 93.3 MIPS`. The pipeline gives `Pp = 500 / 2.36 ≈ 211.9 MIPS`. The speedup is `5.36 / 2.36 ≈ 2.27×`, below the ideal 4×.' },
        { type: 'h', text: 'Step 4 — add a secondary (L2) cache' },
        { type: 'p', text: 'Put a secondary cache between the on-chip cache and memory. If transferring an 8-word block from it takes 10 ns, a primary-cache miss found in the secondary cache costs only `Ms = 5` cycles; only secondary misses pay the full `Mp = 17`. With `hs = 94%`:' },
        { type: 'pre', text: 'increase = [ (1 − hi) + d (1 − hd) ] × [ hs·Ms + (1 − hs)·Mp ]\n        = 0.08 × (0.94 × 5 + 0.06 × 17)\n        = 0.08 × 5.72 = 0.46  →  TI = 1.46' },
        { type: 'p', text: 'The slides note 1.36 and 0.46 are **somewhat pessimistic**: they assume every data miss delays the very next instruction. An optimizing compiler puts distance between dependent instructions, and an instruction queue lets the processor dispatch while waiting — so real misses hurt less.' },
        { type: 'h', text: 'Step 5 — include the branch penalty' },
        { type: 'p', text: 'Multiply the fraction of executed instructions that are branches by the fraction of those branches that mispredict, then by the lost cycles per misprediction. For 20% branches, 10% mispredicted, and a two-cycle penalty, the branch contribution is `0.20 × 0.10 × 2 = 0.04` cycles per instruction. If cache misses already add 1.36 cycles per instruction and the delays do not overlap, the total is `1 + 1.36 + 0.04 = 2.40` cycles per instruction.' },
        { type: 'think', text: [
          'For a throughput question, compute a per-instruction cycle count, then divide the clock rate by it. In the cache formula, the L2 hit ratio is conditional on an L1 miss. For a branch term, the misprediction rate is conditional on executing a branch. If a penalty is already averaged per instruction, use it directly.',
        ] },
        { type: 'exam', text: ['**Fall 2023 Q3(d)**: two-level cache, compare with/without secondary cache by throughput. **Spring 2023 Q3(d)**: same formula but compare against a non-pipelined processor. Both are solved in the question bank. Q3(e) in each 2023 paper instead asks for average memory-access time; use the Chapter 5 model and state what each quoted time includes.'] },
        { type: 'practice', prompt: 'The clock period is 4 ns and base CPI is 1. Instruction and data miss rates are 5% and 10%; 20% of instructions access data. An L1 miss incurs 8 extra cycles on an L2 hit (75% of L1 misses), or 32 extra cycles on an L2 miss. Find CPI and throughput.', blocks: [
          { type: 'answer', text: 'Misses per instruction = 0.05 + 0.20×0.10 = 0.07. Average extra cost per miss = 0.75×8 + 0.25×32 = 14. CPI = 1 + 0.07×14 = 1.98. Clock = 250 MHz, so throughput ≈ 126.3 MIPS.' },
        ] },
      ],
    },
    {
      heading: 'How many pipeline stages?',
      blocks: [
        { type: 'list', items: [
          'An n-stage pipeline may raise throughput ×n, which suggests using many stages.',
          'But more stages → more instructions in flight concurrently → **higher probability of stalling** (dependencies between instructions further apart still stall), and **branch penalties become more significant**.',
          'The gain from increasing n **diminishes**, and the cost is no longer justified.',
          'Another limit: the **inherent delay of basic operations**, above all the **ALU delay**. Most processors choose the cycle time so one ALU operation completes in one cycle and divide other operations into steps of about the same length.',
          'A **pipelined ALU** is also possible.',
        ] },
        { type: 'think', text: [
          'This is the “what is a good value of n?” essay question: argue both directions — ×n potential vs fill/drain + hazards + branch penalty + hardware cost — and land on “n until the marginal gain covers the cost”, with the ALU delay as the floor for cycle time.',
        ] },
      ],
    },
  ],
}
