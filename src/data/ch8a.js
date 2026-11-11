// Chapter 8 part 1 — Pipelining. From slides 6__chapter8__Pipelining and class notes pp. 14–22.
export default {
  id: 'ch8a',
  chapter: 'Chapter 8 · Slides 6',
  title: 'Pipelining — basics, stages and hazards',
  blurb: 'Why pipelining raises throughput but never shortens one instruction, how the stage table is read, and the three hazards that stall the pipe — with the timing charts the exam always asks you to draw.',
  tags: ['throughput', 'latency', 'interstage buffer', 'data hazard', 'structural hazard', 'instruction hazard', 'forwarding', 'superscalar'],
  prereq: [
    'The fetch–execute cycle and the F/D/E/W meaning (Fetch, Decode + fetch operands, Execute, Write result) from Chapter 7.',
    'Cache vs main memory access time — Chapter 5; pipelining only reaches its ideal rate if fetches hit the cache.',
    'Combinational vs clocked: each pipeline stage must finish inside one clock period, so the clock is set by the slowest stage.',
  ],
  sections: [
    {
      heading: 'Why pipeline at all',
      blocks: [
        { type: 'p', text: 'Speed of program execution can be improved in two ways:' },
        { type: 'list', items: [
          '**Faster circuit technology** for the processor and memory (faster clock rate = shorter clock cycle).',
          '**Arrange the hardware so several operations run simultaneously** — the number of operations performed per second increases even though the elapsed time of any *one* operation is unchanged. This is pipelining.',
        ] },
        { type: 'note', title: 'The two words you must never mix up', text: [
          '**Throughput** = number of instructions completed per unit time. Pipelining improves throughput — in the ideal, hazard-free case it approaches **1 instruction per clock cycle**.',
          '**Latency** = the elapsed time between the start and end of one instruction. Pipelining does **not** change it — every instruction still passes through every stage.',
          'Pipelined organization requires **sophisticated compilation techniques** (you will see why at delayed branch).',
        ] },
        { type: 'think', text: [
          'Whenever a question says “pipelining improves performance”, translate performance → **throughput** in your head, then prove it with a stage table. The stage table (instruction rows × clock-cycle columns) is the single most examined artifact of this chapter.',
        ] },
      ],
    },
    {
      heading: 'The laundry example — every property of a pipeline in one picture',
      blocks: [
        { type: 'p', text: 'Ann, Brian, Cathy and Dave each have one load: washer 30 min, dryer 40 min, folding 20 min.' },
        { type: 'list', items: [
          'Sequential laundry: 90 min per load × 4 loads = **6 hours**.',
          'Pipelined laundry: **3.5 hours** — when Ann moves her load washer → dryer, Brian starts washing; when Ann starts folding, Brian moves to the dryer (after a 10-minute wait) and Cathy starts washing.',
          'So pipelining = **concurrent operations** on different resources.',
        ] },
        { type: 'list', items: [
          'Pipelining doesn’t help the **latency of a single task**; it helps the **throughput of the whole workload**.',
          'The pipeline rate is limited by the **slowest stage** (the 40-minute dryer).',
          'Multiple tasks operate **simultaneously, each on a different resource**.',
          'Potential speedup = **number of pipeline stages**.',
          '**Unbalanced stage lengths reduce speedup**; the time to **fill** and **drain** the pipeline reduces it further.',
          'Stalls for **dependences** reduce it further still.',
        ] },
      ],
    },
    {
      heading: 'Two-stage pipeline and the interstage buffer',
      blocks: [
        { type: 'p', text: 'Sequential execution of F then E per instruction gives throughput 0.5 instruction/cycle. Now give the computer **two separate hardware units** — an instruction fetch unit and an execution unit — connected by an intermediate buffer B1:' },
        { type: 'diagram', id: 'pipe2', caption: 'Figure 8.1(b) — hardware organization of the two-stage pipeline.' },
        { type: 'timing', columns: 4, rows: [
          { label: 'I1', cells: ['F1', 'E1', '', ''] },
          { label: 'I2', cells: ['', 'F2', 'E2', ''] },
          { label: 'I3', cells: ['', '', 'F3', 'E3'] },
        ], caption: 'Figure 8.1(c) — pipelined execution. Clock cycle 1: fetch I1 into B1. Cycle 2: fetch I2 while executing I1. Cycle 3: fetch I3 while executing I2. Both units stay busy.' },
        { type: 'list', items: [
          'The buffer lets the **execution unit work on instruction k while the fetch unit fetches k+1** — without it, both units would overwrite the same PC/registers.',
          'Fetch + execute constitute a **two-stage pipeline**; each stage performs one step, and the **interstage storage buffer** holds what must pass from one stage to the next.',
          'New information is loaded into the buffer **every clock cycle**, so the completion rate becomes **twice** that of sequential operation.',
        ] },
        { type: 'think', text: [
          '**“Why do we need an interstage buffer?”** (asked in class) — because the two stages run on *different instructions at the same time*. The fetch stage has already moved on to I2; the information belonging to I1 (the instruction word, its decoded fields, operands) must be *parked* somewhere. The buffer is that parking place. No buffer → the faster stage destroys the slower stage’s inputs.',
        ] },
      ],
    },
    {
      heading: 'Four-stage pipeline: F, D, E, W',
      blocks: [
        { type: 'list', items: [
          '**F — Fetch**: read the instruction from memory (in practice from the instruction cache).',
          '**D — Decode**: decode the instruction and fetch the source operands.',
          '**E — Execute**: perform the operation (ALU: Add, Sub, Mul, Div, And, Or, Shift …).',
          '**W — Write**: store the result in the destination (register or memory).',
        ] },
        { type: 'diagram', id: 'pipe4Buffers', caption: 'Four distinct hardware units, three interstage buffers connecting them.' },
        { type: 'timing', columns: 7, rows: [
          { label: 'I1', cells: ['F1', 'D1', 'E1', 'W1', '', '', ''] },
          { label: 'I2', cells: ['', 'F2', 'D2', 'E2', 'W2', '', ''] },
          { label: 'I3', cells: ['', '', 'F3', 'D3', 'E3', 'W3', ''] },
          { label: 'I4', cells: ['', '', '', 'F4', 'D4', 'E4', 'W4'] },
        ], caption: 'Cycle 1: F1 · cycle 2: D1,F2 · cycle 3: E1,D2,F3 · cycle 4: W1,E2,D3,F4 · cycle 5: W2,E3,D4 · cycle 6: W3,E4 · cycle 7: W4. Throughput ≈ 1 instruction/cycle from the 4th cycle; latency = 4 cycles per instruction.' },
        { type: 'p', text: 'As an instruction moves down the pipeline, **everything the downstream stages need must be carried along in the buffers**. During cycle 4: B1 holds I3 (fetched in cycle 3, being decoded), B2 holds the source and destination operands of I2 plus the information its W stage needs, B3 holds the result and destination of I1.' },
      ],
    },
    {
      heading: 'Role of the cache in pipelining',
      blocks: [
        { type: 'list', items: [
          'Every stage is expected to finish in **one clock period**, and the clock period must cover the **longest** task — units that finish early sit idle.',
          'If instructions were fetched from **main memory**, the fetch stage would take up to **ten times longer** than the other stages.',
          'With an **on-chip cache**, fetch time is comparable to the other basic operations — this is why the slides/notes put “cache needed in pipelining” as an explicit question.',
        ] },
        { type: 'think', text: [
          'Connect it to the laundry lesson: the slowest stage sets the clock, so one fat memory fetch would stretch *every* cycle of the whole machine. The cache shrinks the fattest stage back to normal width.',
        ] },
      ],
    },
    {
      heading: 'Pipeline performance and the hazard idea',
      blocks: [
        { type: 'list', items: [
          'Potential performance gain is **proportional to the number of stages n**: n stages → n instructions can run simultaneously, and the clock pulse can ideally shrink to **1/n** of its previous length.',
          'Ideally throughput increases **n times** — but only if all stages take equal time and there is **no interruption**.',
          'If the pipeline cannot be sustained without interruption, it **stalls**; any condition that causes a stall is a **hazard**. Hazards degrade performance, so we identify them and minimize their impact.',
        ] },
        { type: 'think', text: [
          'The exam sentence to justify (it appears almost verbatim in Spring 2024): *“an n-stage pipeline has the potential for n× throughput, but the gain is not realized”*. Your argument: potential = n instructions in flight × 1/n clock; reality subtracts fill/drain cycles and adds stall cycles from hazards — data, instruction and structural. Then quantify with `TI` arithmetic (Part 2 of this chapter).',
        ] },
      ],
    },
    {
      heading: 'Data hazards',
      blocks: [
        { type: 'p', text: 'Results in a pipelined processor must be **identical to sequential execution**. A data hazard is any condition where the **source or destination operand of an instruction is not available at the time expected**, so an operation is delayed and the pipeline stalls.' },
        { type: 'table', head: ['Instruction pair', 'Why'], rows: [
          ['`A ← 3 + R1` then `B ← 4 × A`', 'hazard — B needs the A produced by the first instruction'],
          ['`A ← 5 × C` then `B ← 20 + C`', 'no hazard — C is not written by the first instruction'],
          ['`Mul R2, R3, R4` then `Add R5, R4, R6`', 'hazard — the Add decodes R4 before the Mul has written it'],
        ], boldFirst: true },
        { type: 'timing', columns: 9, rows: [
          { label: 'I1  Mul R2,R3,R4', cells: ['F1', 'D1', 'E1', 'W1', '', '', '', '', ''] },
          { label: 'I2  Add R5,R4,R6', cells: ['', 'F2', 'D2', { t: 'D2A', box: true }, 'E2', 'W2', '', '', ''] },
          { label: 'I3', cells: ['', '', 'F3', '', '', 'D3', 'E3', 'W3', ''] },
          { label: 'I4', cells: ['', '', '', '', '', 'F4', 'D4', 'E4', 'W4'] },
        ], caption: 'The Mul places its result in R4 at the end of cycle 4 (end of W1). The Add cannot leave D until then, so it is re-decoded in cycle 4 (D2A) and proceeds at E2 in cycle 5. The dependency arises because the destination of one instruction is the source of the next.' },
        { type: 'list', items: [
          'In cycles 5–6 the Write stage is **idle** — it has nothing to work with.',
          'The information in buffer B2 must be **retained** until the execution of I2 completes; therefore stage 2, and by extension stage 1, cannot accept new instructions (B1 cannot be overwritten).',
          'Most arithmetic/logic operations take one E cycle; **division takes longer** — the same kind of stall, longer.',
        ] },
        { type: 'think', text: [
          'To detect a data hazard by hand: underline every register **written** by instruction k and every register **read** by instruction k+1; if the sets intersect, the Decode of k+1 cannot finish in its slot. In the table, the stall shows up as a repeated letter (D2A) — that repeat *is* the bubble.',
          'Class-note phrasing: the stall then **propagates toward the last stage** — every later stage sees the gap one cycle later. Draw the stage-view table (rows = stages, one instruction label per row) when the question says “show which stages occur during each clock cycle”.',
        ] },
        { type: 'exam', text: ['Fall 2024 Q3(b) gives exactly this with `SUB R1,R3,R2` / `MUL R2,R3,R4` and asks whether a hazard occurs and how forwarding handles it — solved in the question bank.'] },
      ],
    },
    {
      heading: 'Instruction (control) hazards',
      blocks: [
        { type: 'list', items: [
          'The pipeline stalls because an **instruction is not available at the expected time** — classically a **cache miss** during fetch.',
          'Fetching from main memory takes much longer than from the cache; the fetch cannot complete in one cycle. The slides’ example: fetching I2 misses and **F2 takes 4 clock cycles instead of 1**.',
        ] },
        { type: 'timing', columns: 9, rows: [
          { label: 'F: Fetch', cells: ['F1', 'F2', { t: 'F2' }, { t: 'F2' }, { t: 'F2' }, 'F3', '', '', ''] },
          { label: 'D: Decode', cells: ['', 'D1', { t: 'idle', dim: true }, { t: 'idle', dim: true }, { t: 'idle', dim: true }, 'D2', 'D3', ''] },
          { label: 'E: Execute', cells: ['', '', 'E1', { t: 'idle', dim: true }, { t: 'idle', dim: true }, { t: 'idle', dim: true }, 'E2', 'E3'] },
          { label: 'W: Write', cells: ['', '', '', 'W1', { t: 'idle', dim: true }, { t: 'idle', dim: true }, { t: 'idle', dim: true }, 'W2'] },
        ], caption: 'Stage view of the same event: I2 is available in B1 at the end of cycle 5. Decode idles in cycles 3–5, Execute in 4–6, Write in 5–7. These idle periods are stalls, or bubbles; once created, a bubble moves downstream until it reaches the last stage.' },
        { type: 'think', text: [
          'Two shapes of the same event: the **instruction view** (long F2 cell) and the **stage view** (idle diagonal). Exams accept either, but the stage view is what “show which stages occur during each clock cycle” demands. Remember the one-way rule: a bubble only moves **downstream**; the fetch stage just stops until data arrives.',
        ] },
      ],
    },
    {
      heading: 'Structural hazards',
      blocks: [
        { type: 'list', items: [
          'Two instructions need the **same hardware resource at the same time**.',
          'Most common case: memory access — one instruction is being fetched while another needs memory in its Execute/Write stage; if instructions and data share one cache, only one can proceed.',
          'Remedy: **separate data and instruction caches**; in general, provide enough resources on the chip so the hazard cannot arise.',
        ] },
        { type: 'timing', columns: 7, rows: [
          { label: 'I1', cells: ['F1', 'D1', 'E1', 'W1', '', '', ''] },
          { label: 'I2  Load X(R1),R2', cells: ['', 'F2', 'D2', 'E2', 'M2', 'W2', ''] },
          { label: 'I3', cells: ['', '', 'F3', 'D3', 'E3', '', 'W3'] },
          { label: 'I4', cells: ['', '', '', 'F4', 'D4', '', 'E4'] },
          { label: 'I5', cells: ['', '', '', '', 'F5', '', 'D5'] },
        ], caption: 'I2 is a Load: E2 computes the address X+[R1] in cycle 4, M2 reads the operand from memory in cycle 5, and the operand is written into R2 in cycle 6. In cycle 6 both I2 (W2) and I3 (W3) want the register file — the register file cannot take two writes at once, so I3 stalls.' },
        { type: 'think', text: [
          'Recipe for spotting one: look for a resource (memory port, register-file write port, one ALU) and two instructions wanting it **in the same column** of the table. Then either delay the later instruction (what the table shows) or name the duplicate hardware that removes the conflict.',
        ] },
      ],
    },
    {
      heading: 'Handling data hazards in hardware: operand forwarding',
      blocks: [
        { type: 'p', text: 'The data hazard exists because I2 waits for the data to be **written into the register file at the end of W1**. But the result is already available **at the output of the ALU as soon as E1 completes**. Delay can be reduced or eliminated by routing that result straight back into the ALU input for E2 — **operand forwarding**.' },
        { type: 'diagram', id: 'forwarding', caption: 'Forwarding datapath (slides 36–37): similar to the three-bus organization, with SRC1, SRC2 and RSLT added as interstage buffers for pipelined operation — SRC1/SRC2 are part of B2, RSLT is part of B3. The two dashed paths into the ALU input MUXes are the forwarding connections.' },
        { type: 'steps', items: [
          '**Cycle 3** — I2 is decoded and the data dependency is detected; the operand *not* involved in the dependency (R5) is loaded into SRC1.',
          '**Cycle 4** — the product of I1 is in RSLT; the forwarding connection lets step E2 read it directly. I2 proceeds **without interruption**.',
        ] },
        { type: 'p', text: 'Two multiplexers at the ALU inputs select the destination-bus value instead of the SRC1/SRC2 register contents when forwarding is active.' },
        { type: 'think', text: [
          'Forwarding fixes ALU→ALU dependencies for free, but **not load-use**: if I1 is a Load, its result only appears after the memory stage (M), so even with forwarding the consumer must stall one cycle — the classic Fall 2022 question, and the reason hazard-detection units still exist. Say this explicitly when a question asks “can forwarding alone resolve it?”.',
        ] },
      ],
    },
    {
      heading: 'Handling data dependency in software',
      blocks: [
        { type: 'list', items: [
          'Hardware alternative: while decoding, the control hardware **delays reading a register** until its contents are available — the pipeline stalls for that many cycles.',
          'Software alternative: the **compiler detects the dependency** and inserts the right number of `NOP` instructions between the two instructions.',
        ] }
        ,
        { type: 'pre', text: 'I1: Mul R2, R3, R4\n     NOP\n     NOP\nI2: Add R5, R4, R6', caption: 'A two-cycle delay = two NOPs. The NOPs do nothing, but they give W1 time to finish before D2 reads R4.' },
        { type: 'p', text: 'Software can also simply **reorder** independent instructions into the gap — the same idea that delayed branch exploits later in Part 2.' },
        { type: 'think', text: [
          'Hardware (forwarding/stalling) costs circuits but works on any code; software (NOP/reorder) costs instruction slots but no circuits. Which one a question wants is usually stated — “in hardware” → forwarding figure, “in software” → NOP insertion.',
        ] },
        { type: 'exam', text: ['Asked directly in Fall 2023 Q1(e), Spring 2023 Q1(a)/(b), Spring 2024 Q1(b) — the most repeated short question in the bank.'] },
      ],
    },
    {
      heading: 'Superscalar operation',
      blocks: [
        { type: 'list', items: [
          'A pipelined processor issues instructions **in strict program order**; if nothing stalls, one instruction enters and one completes per cycle — that **1 instruction/cycle is the ceiling** for ordinary pipelining.',
          'Alternative: equip the processor with **multiple processing units**, so several instructions can start execution in the same clock cycle (**multiple issue**). Such processors are **superscalar** and can exceed one instruction per cycle.',
        ] },
        { type: 'diagram', id: 'superscalar', caption: 'The fetch unit reads two instructions at a time into a queue; the dispatch unit pulls up to two from the front; with one integer and one floating-point instruction and no hazards, both are dispatched in the same cycle.' },
        { type: 'timing', columns: 7, rows: [
          { label: 'I1 (Fadd)', cells: ['F1', 'D1', 'E1A', 'E1B', 'E1C', 'W1', ''] },
          { label: 'I2 (Add)', cells: ['F2', 'D2', 'E2', 'W2', '', '', ''] },
          { label: 'I3 (Fsub)', cells: ['', 'F3', 'D3', 'E3A', 'E3B', 'E3C', 'W3'] },
          { label: 'I4 (Sub)', cells: ['', 'F4', 'D4', 'E4', 'W4', '', ''] },
        ], caption: 'Floating-point ops take three execution cycles (the FP unit is itself a 3-stage pipeline); integer ops take one. Completion order here: I2, I4, I1, I3.' },
        { type: 'list', items: [
          'Hazards hurt a superscalar processor **even more** — every stall wastes two slots instead of one.',
          'The compiler reduces this by **interleaving floating-point and integer instructions**, so the dispatch unit can issue two in most cycles and keep both units busy.',
        ] },
        { type: 'think', text: [
          'Note from the timing chart: instructions can **finish out of order** (I2 before I1). That is allowed because the *architectural* result still matches sequential execution — the same invariant that defined data hazards.',
        ] },
      ],
    },
    {
      heading: 'The three hazards and their fixes — summary table',
      blocks: [
        { type: 'table', head: ['Hazard', 'Cause', 'Fix'], rows: [
          ['Data', 'source/destination operand not available in time (destination of one = source of next)', 'hardware: operand forwarding · software: NOP insertion / compiler reordering'],
          ['Instruction (control)', 'instruction not available at fetch time (cache miss); branch changes the flow', 'instruction + data caches, L1/L2 caches; branch penalty reduction (Part 2)'],
          ['Structural', 'two instructions need the same hardware resource simultaneously', 'duplicate the resource — separate instruction/data caches, more ports'],
        ], caption: 'The class notes end with exactly this summary — reproduce it as the opening or closing of any hazard answer.' },
      ],
    },
  ],
}
