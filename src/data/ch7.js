// Chapter 7 — Basic Processing Unit. Exam scope per the course: from
// "Multiple-bus organization" (slide 30 of the deck) onward. The single-bus
// material earlier in the deck is not in the exam syllabus, so it is not
// taught here; the three worked three-bus control sequences come from the
// class notes.
export const branchLessThanTrace = {
  type: 'table',
  head: ['µAddress', 'Microinstruction', 'Effect'],
  rows: [
    ['0', '`PCout, MARin, Read, Select4, Add, Zin`', 'Start instruction fetch and compute PC + 4 into Z.'],
    ['1', '`Zout, PCin, Yin, WMFC`', 'Save PC + 4 in PC and Y, and wait for the instruction word.'],
    ['2', '`MDRout, IRin`', 'Load the instruction into IR.'],
    ['3', 'Dispatch using the opcode in IR', 'For Branch < 0, load µPC with 25.'],
    ['25', 'If N = 0, set µPC to 0', 'If the tested value is nonnegative, fetch the next instruction. If N = 1, continue to µ26.'],
    ['26', '`Offset-field-of-IRout, SelectY, Add, Zin`', 'Compute the machine-instruction target as Y + branch displacement.'],
    ['27', '`Zout, PCin, End`', 'Load the target into the machine PC, then start the next fetch at µ0.'],
  ],
  caption: 'Chapter 7, Figure 7.17 (slide 52). The µaddresses select control words. The displacement in IR contributes to the machine PC target.',
}

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
        { type: 'p', text: 'A single internal bus allows only **one source to drive the bus per clock cycle**, which forces long control sequences. Commercial processors therefore provide multiple internal paths so several transfers happen in parallel — the **multiple-bus organization**.' },
        { type: 'diagram', id: 'threeBus', caption: 'Figure 7.8 — three-bus organization of the datapath. Check every arrow against the direction table below before you move on.' },
        { type: 'list', items: [
          'All general-purpose registers are combined into one block, the **register file**, with **three ports**: two output ports driving buses A and B (two registers readable simultaneously) and one input port loading a register from bus C.',
          'Buses A and B carry the **source operands** to the ALU; the result travels to the destination over **bus C**.',
          'The ALU can pass an operand through unmodified — control signals `R = A` or `R = B` — which is how a register reaches a bus on the other side of the ALU.',
          'The **incrementer** unit increments the PC by 4 on its own path (the Constant-4 path at the ALU multiplexer can also increment other addresses, e.g. in multiple load/store instructions).',
          'Bus C carries a combinational ALU result. Assert the destination’s input enable during the same step, while the source outputs and ALU control are active. Three buses **remove the need for the temporary registers Y and Z** that a single-bus datapath needs — both operands and the destination move in one cycle.',
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
          'When checking the figure: MDR connects to the external data lines; MAR drives the external address lines; the instruction decoder consumes the IR. Anything else drawn crossing the memory bus is wrong.',
        ] },
        { type: 'exam', text: ['“Illustrate the Three Bus CPU Datapath organization and explain each component’s purpose” — Spring 2023 Q1(c), and the first half of Spring 2024 Q2(b). Draw Figure 7.8 with the direction table beside it.'] },
        { type: 'practice', prompt: 'Why does PC → MAR use R=B? Could you copy IR → MAR with the same ALU select?', blocks: [
          { type: 'answer', text: 'PC drives B, MAR reads C, so R=B passes the PC value across the ALU. IR drives A, so IR → MAR needs SelectA and R=A instead.' },
        ] },
      ],
    },
    {
      heading: 'Control sequence in the three-bus architecture',
      blocks: [
        { type: 'p', text: 'The slides’ worked example, `Add R4, R5, R6`, in four steps:' },
        { type: 'table', head: ['Step', 'Action'], rows: [
          ['1', '`PCout, R=B, MARin, Read, IncPC`'],
          ['2', '`MDRinE, WMFC`'],
          ['3', '`MDRoutB, R=B, IRin`'],
          ['4', '`R4outA, R5outB, SelectA, Add, R6in, End`'],
        ], boldFirst: true, caption: 'Figure 7.9 — the standard 3-step fetch, then a single-step execute: both operands and the destination move in one cycle.' },
        { type: 'h', text: 'From the class notes: three worked three-bus sequences' },
        { type: 'p', text: '**1) Add (R1), R2** — load from the address in R1 and add R2 (result to R2):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['1', 'PC → BusB → ALU → BusC → MAR', '`PCout, R=B, MARin, Read, IncPC`', 'T1'],
          ['2', 'Memory → MDR; wait for MFC', '`MDRinE, WMFC`', 'T2'],
          ['3', 'MDR → BusB → ALU → BusC → IR', '`MDRoutB, R=B, IRin`', 'T3'],
          ['4', 'R1 → BusB → ALU → BusC → MAR', '`R1outB, R=B, MARin, Read`', 'T4'],
          ['5', 'Memory → MDR; wait for MFC', '`MDRinE, WMFC`', 'T5'],
          ['6', 'ALU adds R2 and MDR; latch bus C in R2', '`MDRoutB, R2outA, SelectA, Add, R2in, End`', 'T6'],
        ], boldFirst: true },
        { type: 'p', text: '**2) Add R1, (R2)** — store the sum into memory at the address in R2 (fetch as above, then):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['4', 'R2 → BusB → ALU → BusC → MAR', '`R2outB, R=B, MARin, Read`', 'T4'],
          ['5', 'Memory → MDR; wait for MFC', '`MDRinE, WMFC`', 'T5'],
          ['6', 'ALU adds R1 and MDR; latch bus C in MDR', '`MDRoutB, R1outA, SelectA, Add, MDRin`', 'T6'],
          ['7', 'Drive the new MDR value; start write at the unchanged MAR address', '`MDRoutE, Write`', 'T7'],
          ['8', 'Keep write data available until completion', '`MDRoutE, WMFC, End`', 'T8'],
        ], boldFirst: true },
        { type: 'p', text: '**3) Add R1, (R2)+, R3** — auto-increment addressing: after using R2 as the pointer, R2 is incremented:' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['1–3', 'Fetch instruction', 'Standard fetch shown above', 'T1–T3'],
          ['4', 'Read at the old R2 address', '`R2outB, R=B, MARin, Read`', 'T4'],
          ['5', 'Memory → MDR; wait for MFC', '`MDRinE, WMFC`', 'T5'],
          ['6', 'Increment R2 by one 4-byte word; MDR keeps the operand', '`R2outB, Select4, Add, R2in`', 'T6'],
          ['7', 'ALU adds R1 and the saved operand; latch bus C in R3', '`R1outA, MDRoutB, SelectA, Add, R3in, End`', 'T7'],
        ], boldFirst: true },
        { type: 'note', title: 'Merging steps — the two rules from class', text: [
          'Two transfers may share one time step **only if they do not drive the same bus as output** (one `out` per bus) — e.g. `R1outA` and `R2outB` combine; two outs on bus B never do.',
          '`WMFC` and the use of the data it guards may not sit in the same cycle — the wait must precede the use.',
          'Same clock cycle, same bus, **different values** → forbidden. Same value on a bus read by several destinations → fine.',
        ] },
        { type: 'think', text: [
          'Recipe for writing any three-bus sequence: (1) write the standard 3-step fetch — it never changes. (2) For a read, latch the address and start Read, then wait with MDRinE. For a write, have the address in MAR and the data in MDR before driving the external data bus and starting Write; wait for MFC. Follow the given memory-interface convention. (3) The actual ALU work is one step: source A out, source B out, SelectA, the operation, destination in. (4) Auto-increment/decrement of a pointer register is a separate ALU step using `Select4`. (5) End. Then compress using the merge rules.',
        ] },
        { type: 'exam', text: ['The most repeated big question in the bank: **Fall 2023 SUB (R1),(R2) · Spring 2023 MUL (R1),(R2) · Spring 2024 MUL R1, 4(R2) + hardwired signal generation**. Note: the 2023 papers print a single-bus figure for this question — their solutions are in the question bank; the method above is the three-bus version the current syllabus teaches.'] },
        { type: 'practice', prompt: 'After the standard fetch, write the execute steps for Move (R3),R5. R3 = 100 and M[100] = 42. Name what each step latches.', blocks: [
          { type: 'p', text: 'MAR holds 100, then MDR holds 42 when memory completes. The pass-through must remain active while R5 latches bus C.' },
          { type: 'answer', text: 'R5 finishes with 42; R3 is unchanged. T4: R3outB, R=B, MARin, Read. T5: MDRinE, WMFC. T6: MDRoutB, R=B, R5in, End.' },
        ] },
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
        { type: 'exam', text: ['**Fall 2024 Q1(d)**: this block diagram with a 16-instruction processor, 4th instruction, 8 steps. **Spring 2024 Q2(b)** (second half): sketch the gates for `PCin, R=B, MARin, MDRinE`. **Fall 2023 Q1(a)**: both control-unit types with figures.'] },
        { type: 'practice', prompt: 'A 16-opcode CPU has up to eight control steps. A signal X is required in T2 for every instruction, T4 for ADD, and T6 for STORE only when MFC is true. Give the two decoder widths and draw or write X.', blocks: [
          { type: 'answer', text: 'A 4-to-16 opcode decoder and a 3-to-8 step decoder (assuming eight encoded counter states). X = T2 OR (T4 AND ADD) OR (T6 AND STORE AND MFC).' },
        ] },
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
        { type: 'p', text: 'To encode a control step, fix a column order, place a 1 for every asserted signal and a 0 for every other signal. The example shows six columns from the single-bus instruction fetch in slides 46–47.' },
        { type: 'table', head: ['Step', 'PCin', 'PCout', 'MARin', 'Read', 'WMFC', 'IRin', 'Six-bit slice'], rows: [
          ['1', '0', '1', '1', '1', '0', '0', '011100'],
          ['2', '1', '0', '0', '0', '1', '0', '100010'],
          ['3', '0', '0', '0', '0', '0', '1', '000001'],
        ], caption: 'The full control word also includes the signals omitted from these six columns.' },
        { type: 'diagram', id: 'microCU', caption: 'Figure 7.16 — basic organization: IR → starting-address generator → µPC; the clocked µPC steps through the control store, whose CW output drives the datapath.' },
        { type: 'list', items: [
          'The **microprogram counter (µPC)** reads CWs from the control store sequentially.',
          'When a new instruction is loaded into IR, the **starting-address generator** produces the microroutine’s first address and loads it into µPC.',
        ] },
        { type: 'diagram', id: 'microCUCond', caption: 'Figure 7.18 — adding conditional branching: a starting-and-branch address generator fed by the condition codes and external inputs can load a new address into µPC.' },
        { type: 'p', text: 'The extended sequencer chooses the next control-store address from the current microinstruction, condition codes and external inputs such as MFC. In the single-bus Branch < 0 example below, the N test selects either the common fetch microaddress or the next step that computes the machine-instruction target.' },
        branchLessThanTrace,
        { type: 'think', text: [
          'Map the vocabulary one-to-one: instruction ↔ microroutine, program ↔ microprogram (contents of the control store), instruction step ↔ microinstruction (= control word), opcode lookup ↔ starting-address generator, PC ↔ µPC. Once you see “the control unit is a CPU inside the CPU”, every figure reads itself.',
          'Why is it slower? Every control-signal step costs a **control-store read** before the datapath can act, while hardwired logic is just gate delay.',
        ] },
        { type: 'exam', text: ['**Spring 2024 Q1(d)** asks for Figure 7.18 and this trace. Label both decisions: N controls µPC at µ25, and the datapath updates PC at µ27 on the taken path.'] },
        { type: 'practice', prompt: 'A control word at µPC = 11 tests N. Its next-address field selects µaddress 40 if N=1; otherwise the sequencer increments. Give the next µPC for each N and explain what happens to the instruction PC.', blocks: [
          { type: 'answer', text: 'N=1 gives 40; N=0 gives 12. The sequencer changes the microinstruction address. The instruction PC changes only if a control word explicitly causes a datapath transfer into it.' },
        ] },
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
