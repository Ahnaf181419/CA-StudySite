// Chapter 7 — Basic Processing Unit. Exam scope per the course: from
// "Multiple-bus organization" (slide 30 of the deck) onward. The single-bus
// material earlier in the deck is not in the exam syllabus, so it is not
// taught here; the three worked three-bus control sequences come from the
// class notes.
export default {
  id: 'ch7',
  chapter: 'Chapter 7 · Slides 5',
  title: 'Basic Processing Unit — multibus onward',
  blurb: 'The exam syllabus for this chapter starts at slide 30: the three-bus datapath, its control sequences, and the two ways control signals are generated (hardwired vs microprogrammed).',
  tags: ['three bus', 'register file', 'control sequence', 'hardwired', 'microprogrammed', 'control word'],
  prereq: [
    'The fetch–execute idea: fetch the instruction at [PC], update the PC, execute — the control sequences below always begin with the same 3-step fetch.',
    'Registers: PC, IR, MAR, MDR and the general-purpose registers R0…R(n−1) from Chapter 2.',
    'Combinational vs sequential logic: the ALU is a gate network (no memory), registers are clocked — so results must be latched somewhere every cycle.',
    'Control signals name a transfer: `PCout` drives the bus from the PC, `MARin` loads the MAR from the bus, `Read` starts a memory read, `WMFC` waits for memory to finish.',
  ],
  sections: [
    {
      heading: 'Multiple-bus organization (three-bus datapath, Figure 7.8)',
      blocks: [
        { type: 'p', text: 'A single internal bus allows only **one data transfer per clock cycle**, which forces long control sequences. Commercial processors therefore provide multiple internal paths so several transfers happen in parallel — the **multiple-bus organization**.' },
        { type: 'diagram', id: 'threeBus', caption: 'Figure 7.8 — three-bus organization of the datapath. Check every arrow against the direction table below before you move on.' },
        { type: 'list', items: [
          'All general-purpose registers are combined into one block, the **register file**, with **three ports**: two output ports driving buses A and B (two registers readable simultaneously) and one input port loading a register from bus C.',
          'Buses A and B carry the **source operands** to the ALU; the result travels to the destination over **bus C**.',
          'The ALU can pass an operand through unmodified — control signals `R = A` or `R = B` — which is how a register reaches a bus on the other side of the ALU.',
          'The **incrementer** unit increments the PC by 4 on its own path (the Constant-4 path at the ALU multiplexer can also increment other addresses, e.g. in multiple load/store instructions).',
          'Three buses **remove the need for the temporary registers Y and Z** that a single-bus datapath needs — both operands and the destination move in one cycle.',
        ] },
        { type: 'table', head: ['Connection', 'Direction'], rows: [
          ['GPR ↔ buses', 'GPR → A, B (read); GPR ← C (write)'],
          ['ALU', '← (bus A or Constant 4) and bus B; → bus C'],
          ['PC', '→ bus B **only**; ← bus C'],
          ['IR', '→ bus A **only**; ← bus C'],
          ['MDR', '→ buses A and B; ← bus C'],
          ['MAR', '← bus C only'],
        ], caption: 'The direction summary table from the slides — memorize it; both the drawing and the control-sequence questions depend on it.' },
        { type: 'think', text: [
          'Where do `R = A` / `R = B` come from? MAR is only reachable from bus C, but PC sits on bus B. To move the PC’s value into MAR you must pass it **through** the ALU: assert `R = B`, which copies bus B to bus C unchanged. That is why every fetch step begins `PCout, R = B, MARin`.',
          'When checking the figure: MDR is the only block with **external** connections (memory data lines in/out); MAR only ever drives the external address lines; the instruction decoder consumes the IR. Anything else drawn crossing the memory bus is wrong.',
        ] },
        { type: 'exam', text: ['“Illustrate the Three Bus CPU Datapath organization and explain each component’s purpose” — Spring 2023 Q1(c), and the first half of Spring 2024 Q2(b). Draw Figure 7.8 with the direction table beside it.'] },
      ],
    },
    {
      heading: 'Control sequence in the three-bus architecture',
      blocks: [
        { type: 'p', text: 'The slides’ worked example, `Add R4, R5, R6`, in four steps:' },
        { type: 'table', head: ['Step', 'Action'], rows: [
          ['1', '`PCout, R=B, MARin, Read, IncPC`'],
          ['2', '`WMFC`'],
          ['3', '`MDRoutB, R=B, IRin`'],
          ['4', '`R4outA, R5outB, SelectA, Add, R6in, End`'],
        ], boldFirst: true, caption: 'Figure 7.9 — the standard 3-step fetch, then a single-step execute: both operands and the destination move in one cycle.' },
        { type: 'h', text: 'From the class notes: three worked three-bus sequences' },
        { type: 'p', text: '**1) Add (R1), R2** — load from the address in R1 and add R2 (result to R2):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['1', 'PC → BusB → ALU → BusC → MAR', '`PCout, R=B, MARin, Read, IncPC`', 'T1'],
          ['2', 'Wait for MFC', '`WMFC`', 'T2'],
          ['3', 'MDR → BusB → ALU → BusC → IR', '`MDRoutB, R=B, IRin`', 'T3'],
          ['4', 'R1 → BusB → ALU → BusC → MAR', '`R1outB, R=B, MARin, Read`', 'T4'],
          ['5', 'Wait for MFC', '`WMFC`', 'T5'],
          ['6', 'MDR → BusB and R2 → BusA into the ALU, add', '`MDRoutB, R2outA, SelectA, Add`', 'T6'],
          ['7', 'Result → BusC → R2', '`R2in, End`', 'T7'],
        ], boldFirst: true },
        { type: 'p', text: '**2) Add R1, (R2)** — store the sum into memory at the address in R2 (fetch as above, then):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['7', 'R2 → BusB → ALU → BusC → MAR', '`R2outB, R=B, MARin, Read`', 'T4'],
          ['8–10', 'WMFC, mem → MDR', '`WMFC, MDRinE`', 'T5'],
          ['11–13', 'MDR → BusB, R1 → BusA, add', '`MDRoutB, R1outA, SelectA, Add`', 'T6'],
          ['14–15', 'Result → BusC → MDR, write', '`MDRin, Write`', 'T7'],
          ['16–17', 'MDR → external bus, wait, end', '`MDRoutE, WMFC, End`', 'T8'],
        ], boldFirst: true },
        { type: 'p', text: '**3) Add R1, (R2)+, R3** — auto-increment addressing: after using R2 as the pointer, R2 is incremented:' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['1–6', 'Fetch; read operand at [R2] into R4', '`PCout…IRin`, then `R2outB, R=B, MARin, Read`, `WMFC, MDRinE`, `MDRoutB, R=B, R4in`', 'T1–T6'],
          ['12–15', 'R2 → BusB, select Constant 4, add → R2 (auto-increment)', '`R2outB, Select4, Add, R2in`', 'T7–T8'],
          ['16–18', 'R1 → BusA, R4 → BusB, add → R3', '`R1outA, R4outB, SelectA, Add, R3in`', 'T8'],
          ['19–20', 'End', '`End`', 'T9'],
        ], boldFirst: true },
        { type: 'note', title: 'Merging steps — the two rules from class', text: [
          'Two transfers may share one time step **only if they do not drive the same bus as output** (one `out` per bus) — e.g. `R1outA` and `R2outB` combine; two outs on bus B never do.',
          '`WMFC` and the use of the data it guards may not sit in the same cycle — the wait must precede the use.',
          'Same clock cycle, same bus, **different values** → forbidden. Same value on a bus read by several destinations → fine.',
        ] },
        { type: 'think', text: [
          'Recipe for writing any three-bus sequence: (1) write the standard 3-step fetch — it never changes. (2) Find every memory access the instruction needs and give each a `MARin + Read/Write` step followed by `WMFC + MDRinE/MDRoutE`. (3) The actual ALU work is one step: source A out, source B out, SelectA, the operation, destination in. (4) Auto-increment/decrement of a pointer register is a separate ALU step using `Select4`. (5) End. Then compress using the merge rules.',
        ] },
        { type: 'exam', text: ['The most repeated big question in the bank: **Fall 2023 SUB (R1),(R2) · Spring 2023 MUL (R1),(R2) · Spring 2024 MUL R1, 4(R2) + hardwired signal generation**. Note: the 2023 papers print a single-bus figure for this question — their solutions are in the question bank; the method above is the three-bus version the current syllabus teaches.'] },
      ],
    },
    {
      heading: 'Generating control signals: two paradigms',
      blocks: [
        { type: 'list', items: [
          'Executing instructions requires control signals in the proper sequence: `PCout, PCin, Riout, Riin, ADD, SUB, MUL, DIV, MARin, MDRout, SelectA, WMFC, End`, …',
          '**Hardwired control**: fast; little flexibility; design complexity grows with the size of the instruction set.',
          '**Microprogrammed control**: enormous flexibility, simpler design especially for large architectures, but much slower operation.',
        ] },
        { type: 'think', text: [
          'Frame it as a trade-off question: hardwired = logic gates wired for one ISA (speed, rigidity); microprogrammed = a small program that *is* the control unit (flexibility, slower). Every “compare the two” question wants you to land on this trade-off.',
        ] },
      ],
    },
    {
      heading: 'Hardwired control',
      blocks: [
        { type: 'p', text: 'The required control signals are determined by four inputs:' },
        { type: 'list', items: [
          'Contents of the **control step counter** — which step of the sequence we are in (T1, T2, …).',
          'Contents of the **IR** — which instruction it is (INS1 … INSm).',
          'The **condition-code flags** — needed e.g. by a conditional branch.',
          '**External inputs** such as MFC.',
        ] },
        { type: 'diagram', id: 'hardwiredCU', caption: 'Control unit organization: step counter + step decoder produce T1…Tn; IR + instruction decoder produce INS1…INSm; an encoder combines them (with condition codes and external inputs) into the control signals. End/Run feeds back to the counter.' },
        { type: 'p', text: 'Each signal is a **sum-of-products** of timing steps and instruction signals. Slide example — `Zin` is asserted during T1 for all instructions, during T6 for ADD and during T4 for an unconditional BRANCH:' },
        { type: 'pre', text: 'Zin = T1 + T6·ADD + T4·BRANCH + …' },
        { type: 'diagram', id: 'controlSignalGates', caption: 'The gate network the class notes drew for Zin: a buffer for the always-on T1 term, AND gates for T6·ADD and T4·BRANCH, one OR gate.' },
        { type: 'list', items: [
          'The control hardware is a **state machine**: it changes state every clock cycle depending on IR, condition codes and external inputs; its outputs are the control signals.',
          'The sequence is determined by the **wiring of logic elements** — hence “hardwired”.',
          'Advantage: **speed**. Disadvantages: little flexibility, limited complexity of the instruction set it can implement.',
        ] },
        { type: 'think', text: [
          'To build any one signal, list the (step, instruction) pairs where it must be 1 — that table *is* the Boolean function. Buffer the pairs that apply to all instructions, AND-gate the pairs that need a specific instruction, OR everything together.',
        ] },
        { type: 'exam', text: ['**Fall 2024 Q1(d)**: this block diagram with a 16-instruction processor, 4th instruction, 8 steps. **Spring 2024 Q2(b)** (second half): sketch the gates for `PCin, R1in, MARin, MDRinE`. **Fall 2023 Q1(a)**: both control-unit types with figures.'] },
      ],
    },
    {
      heading: 'Microprogrammed control',
      blocks: [
        { type: 'p', text: 'An alternative to hardwired control: control signals are generated by **a program**, similar to a machine-language program.' },
        { type: 'list', items: [
          'A **Control Word (CW)** is a word whose individual bits represent the various control signals. At every step some signals are 1 and all others are 0.',
          'Every instruction needs a sequence of CWs; that sequence is the **microroutine** for the instruction; each CW in it is a **microinstruction**.',
          'Microroutines for all instructions are stored in a special memory, the **control store**.',
          'The control unit generates the signals by **sequentially reading the CWs** of the corresponding microroutine from the control store.',
        ] },
        { type: 'diagram', id: 'microCU', caption: 'Figure 7.16 — basic organization: IR → starting-address generator → µPC; the clocked µPC steps through the control store, whose CW output drives the datapath.' },
        { type: 'list', items: [
          'The **microprogram counter (µPC)** reads CWs from the control store sequentially.',
          'When a new instruction is loaded into IR, the **starting-address generator** produces the microroutine’s first address and loads it into µPC.',
        ] },
        { type: 'diagram', id: 'microCUCond', caption: 'Figure 7.18 — adding conditional branching: a starting-and-branch address generator fed by the condition codes and external inputs can load a new address into µPC.' },
        { type: 'p', text: 'The basic organization cannot do **conditional branching** or operations based on external inputs such as WMFC — the extended version adds the starting-and-branch address generator. If the CW is a conditional branch, the generator checks the condition codes and, if necessary, branches by loading a new address into µPC using the offset-address field.' },
        { type: 'think', text: [
          'Map the vocabulary one-to-one: instruction ↔ microroutine, program ↔ microprogram (contents of the control store), instruction step ↔ microinstruction (= control word), opcode lookup ↔ starting-address generator, PC ↔ µPC. Once you see “the control unit is a CPU inside the CPU”, every figure reads itself.',
          'Why is it slower? Every control-signal step costs a **control-store read** before the datapath can act, while hardwired logic is just gate delay.',
        ] },
        { type: 'exam', text: ['**Spring 2024 Q1(d)**: Figure 7.18 plus the Branch<0 walkthrough — N = 1 means negative; the generator checks N, and if N = 0 execution continues at microinstruction 0 instead of jumping to L1.'] },
      ],
    },
    {
      heading: 'A complete processor (7.4.1)',
      blocks: [
        { type: 'diagram', id: 'completeProcessor', caption: 'Processor chip with two ALUs (integer and floating-point), each with its own control unit, and separate instruction and data caches, connected to memory and I/O over the system bus.' },
        { type: 'list', items: [
          'The system has **two ALUs** — the integer unit and the floating-point unit — that operate on integer and floating-point values respectively; each is a complete processing unit **with its own separate control unit**.',
          'Separate **instruction and data caches** improve performance by hiding the high latency of memory access.',
          'Note the **arrow directions**: the instruction cache only receives from the bus (instructions are read), while the data cache is read/write — the slides flag this explicitly.',
        ] },
        { type: 'think', text: [
          'This figure quietly previews two later chapters: the split caches answer the structural hazard from Chapter 8 (fetch and data access colliding in one cache), and cache behaviour is the whole of Chapter 5.',
        ] },
      ],
    },
  ],
}
