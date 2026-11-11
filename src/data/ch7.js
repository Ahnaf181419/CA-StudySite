// Chapter 7 — Basic Processing Unit. All content from the faculty slides
// (5_chapter7) plus the worked three-bus control sequences from the class notes.
export default {
  id: 'ch7',
  chapter: 'Chapter 7 · Slides 5',
  title: 'Basic Processing Unit',
  blurb: 'How the inside of a CPU is wired: the single-bus and three-bus datapaths, step-by-step execution of real instructions, and the two ways control signals can be generated.',
  tags: ['single bus', 'three bus', 'control sequence', 'hardwired', 'microprogrammed'],
  prereq: [
    'Registers — what PC, IR, MAR, MDR and general registers R0…R(n-1) each hold (Chapter 2 material the slides assume).',
    ' combinational vs sequential logic — the ALU has no memory; registers are clocked. That difference drives the whole datapath.',
    'The fetch–execute idea: fetch the instruction at [PC], increment PC, execute, repeat.',
    'Notation: [X] means “contents of X”, so IR ← [[PC]] loads the instruction whose address sits in the PC.',
  ],
  sections: [
    {
      heading: 'The Instruction Set Processor — what this chapter builds',
      blocks: [
        { type: 'p', text: 'The processing unit that executes machine instructions and coordinates the activities of the other units is called the **Instruction Set Processor (ISP)**, or simply the *processor*. A typical computing task is a series of steps specified by a sequence of machine instructions that constitute a program.' },
        { type: 'list', items: [
          'A **program** = a sequence of machine instructions.',
          'Each **instruction** = a sequence of microinstructions (very basic operations).',
          'Example from the slides: one instruction, `Add (R3), R1`, needs **seven microinstructions** (basic steps) and asserts around **25 control signals**.',
        ] },
        { type: 'p', text: 'So the chapter answers two questions: how do we organize the hardware (the *datapath*) so those small steps can happen, and how do we generate the control signals in the right order (the *control unit*)?' },
        { type: 'think', text: [
          'When you read any CPU-organization topic, keep one question in front of you: **“in one clock cycle, what one thing can move where?”** Every rule of this chapter (single bus → one transfer per cycle, three buses → several, Y/Z registers → parking spots for operands) exists because of that question.',
        ] },
      ],
    },
    {
      heading: 'Fundamental concepts: fetch, execute, PC and IR',
      blocks: [
        { type: 'list', items: [
          'The processor **fetches one instruction at a time** and performs the operation it specifies.',
          'Instructions are fetched from **successive memory locations** until a branch or jump is encountered.',
          'The **Program Counter (PC)** keeps track of the address of the memory location containing the next instruction to be executed.',
          'The **Instruction Register (IR)** holds the instruction currently being decoded and executed.',
          'The **Control Unit** generates the sequence of control signals corresponding to the instruction in the IR.',
        ] },
        { type: 'h', text: 'Executing an instruction — the three phases the slides give' },
        { type: 'steps', items: [
          '**Fetch**: read the memory location whose address is in the PC into the IR: `IR ← [[PC]]`.',
          'Increment the PC. Memory is byte-addressable and each instruction occupies exactly 4 bytes, so `PC ← [PC] + 4`. This is still part of the fetch phase.',
          '**Execute**: carry out the actions specified by the instruction in the IR — this requires generating a number of control signals in the appropriate order.',
        ] },
        { type: 'p', text: 'The building blocks the processor has: MAR, MDR, PC, IR, general-purpose registers R0–R(n-1), the ALU and the control unit. The whole chapter is about **how these units are organized and how they communicate**.' },
      ],
    },
    {
      heading: 'Single-bus organization of the datapath (Figure 7.1)',
      blocks: [
        { type: 'diagram', id: 'singleBus', caption: 'Figure 7.1 — single-bus organization of the datapath inside the processor. Compare every connection against this list: MDR has two inputs and two outputs; MAR takes input from the internal bus and drives the address lines; Y and Constant 4 feed the MUX; the ALU output parks in Z.' },
        { type: 'list', items: [
          'ALU, control unit and all registers are connected via a **single common bus**.',
          'This bus is **internal** to the processor — do not confuse it with the external bus that connects the processor to memory and I/O.',
          'The data lines of the external memory bus connect to the internal bus **via MDR** → MDR has **two inputs and two outputs** (internal side and memory side).',
          'The address lines of the external memory bus connect **via MAR** → MAR receives from the internal bus and drives the external address lines.',
          'The instruction decoder and control logic issues signals to control every unit inside the processor and its interaction with the memory bus. These signals depend on the **instruction in the IR**.',
        ] },
        { type: 'h', text: 'Outputs of the control logic go to' },
        { type: 'list', items: [
          'Control lines of the memory bus (Read, Write, WMFC).',
          'The ALU — which operation to perform.',
          'The Select input of MUX — choose between register Y and the constant 4.',
          'Control lines of the registers — which registers drive/load.',
        ] },
        { type: 'h', text: 'Why Y, Z and TEMP exist' },
        { type: 'list', items: [
          'Y, Z and TEMP are temporary registers **used by the processor during the execution of some instructions**.',
          'R0 to R(n-1) are different: they hold **data produced by one instruction for later use by another instruction** — values survive past the end of an instruction.',
          'The **MUX selects either Y or the constant 4** for the ALU’s A input. The constant 4 exists only to increment the PC.',
        ] },
        { type: 'think', text: [
          'Why is there a Y at all? Because the ALU is **combinational** — it has no internal storage. Both its operands must be valid *at the same time*, but a single bus can deliver only one value per cycle. So operand 1 waits in Y while operand 2 travels the bus; the result waits in Z because the bus is busy (or because the destination register is not free yet). Y and Z are not “extra registers”, they are the price of having one bus.',
        ] },
        { type: 'exam', text: [
          'Asked to “draw the single-bus datapath”: draw Figure 7.1 and say one sentence about each of MDR (2-in/2-out), MAR (address lines out), Y/Z/TEMP (temporary), MUX + Constant 4 (PC increment), and the control unit (signals depend on IR).',
        ] },
      ],
    },
    {
      heading: 'Registers and the bus: Riin / Riout gating',
      blocks: [
        { type: 'p', text: 'A bus is a collection of parallel wires. **Buses have no memory.** When data is on the bus, all registers can *see* it at their inputs; a register may place its contents onto the bus. At any one time **only one register may output** to the bus — which one is decided by the control logic, based on the instruction in IR. Many registers may *load* from the bus in the same cycle.' },
        { type: 'list', items: [
          'Each register Ri has two control signals, `Riin` and `Riout`, implemented as switches between the register and the bus.',
          '`Riin = 1` → data on the bus is loaded into the register at the next clock pulse. `Riin = 0` → the flip-flop feeds itself and **holds** its value.',
          '`Riout = 1` → the register drives the bus. The same Yin/Zout idea holds for Y and Z.',
          'Registers are **clocked (sequential)** entities; the ALU is purely combinational.',
        ] },
        { type: 'diagram', id: 'registerGating', caption: 'Figure 7.2 — input and output gating for the registers of Figure 7.1.' },
        { type: 'diagram', id: 'registerBit', caption: 'Figure 7.3 — gating for one register bit: a D flip-flop, a 2-to-1 input MUX (hold vs load) and a tri-state output buffer.' },
        { type: 'think', text: [
          'The asymmetry is the point: **many Riin can be 1 at once, but only one Riout**. Two registers driving one bus would short opposing voltages together. When you write or check a control sequence, first scan each time step for two `…out` signals on the same bus — that is the classic error.',
        ] },
      ],
    },
    {
      heading: 'Performing an arithmetic or logic operation: Add R1, R2, R3',
      blocks: [
        { type: 'p', text: 'The ALU is combinational and has no storage, so registers are needed around it. The two operands come from the MUX (Y) and the bus, and the result is temporarily stored in Z. To compute `R3 = R1 + R2` on the single-bus datapath takes **three clock cycles**:' },
        { type: 'table', head: ['Step', 'Action', 'Control signals'], rows: [
          ['1', 'Contents of R1 into Y', '`R1out, Yin`'],
          ['2', 'R2 onto the bus; both ALU inputs valid; select Y and assert F = A + B', '`R2out, SelectY, Add, Zin`'],
          ['3', 'Copy Z into R3', '`Zout, R3in`'],
        ], boldFirst: true },
        { type: 'think', text: [
          'Cycle 1 parks one operand in Y (it must survive while the bus delivers the other). Cycle 2 is the only cycle where the ALU actually computes. Cycle 3 moves the result out of Z, because the destination register cannot be loaded directly from the ALU on a single bus.',
          'General template for any ALU instruction on this datapath: **operand → Y, operand → bus + ALU op + Zin, Z → destination**. Three cycles, always.',
        ] },
      ],
    },
    {
      heading: 'Fetching a word from memory: MOVE (R1), R2',
      blocks: [
        { type: 'list', items: [
          'The processor must give memory the **address** (transferred to MAR, which drives the address lines) and request a **Read** on the control lines.',
          'The memory response time is **variable and usually longer than one clock cycle**, so the processor waits for the **Memory Function Completed (MFC)** signal — set to 1 by memory when the data is on the bus data lines.',
          'The word is received into **MDR**, then moved to any register over the internal bus.',
        ] },
        { type: 'diagram', id: 'singleBus', caption: 'Relevant detail: MDRoutE/MDRinE gate the external memory bus side; MDRout/MDRin gate the internal bus side.' },
        { type: 'p', text: 'The five conceptual steps collapse to **three** control steps, because some steps can be combined:' },
        { type: 'table', head: ['Step', 'Action', 'Control signals'], rows: [
          ['1', 'R1 onto the internal bus; load MAR; activate Read', '`R1out, MARin, Read`'],
          ['2', 'Wait for MFC while loading MDR from the external bus', '`MDRinE, WMFC`'],
          ['3', 'MDR onto the internal bus; load R2', '`MDRout, R2in`'],
        ], boldFirst: true },
        { type: 'think', text: [
          'Steps 1+2 of the conceptual list combine (address and Read can be asserted in the same cycle). Steps “wait” and “load MDR” combine because MDR can be enabled *while* waiting (`MDRinE` with `WMFC`). The lesson: a memory access costs 3 steps minimum, and only the middle one is unpredictable in length.',
        ] },
      ],
    },
    {
      heading: 'Storing a word into memory: MOVE R2, (R1)',
      blocks: [
        { type: 'table', head: ['Step', 'Action', 'Control signals'], rows: [
          ['1', 'R1 onto the internal bus; load MAR', '`R1out, MARin`'],
          ['2', 'R2 onto the internal bus; load MDR; activate Write', '`R2out, MDRin, Write`'],
          ['3', 'MDR onto the external bus; wait for MFC', '`MDRoutE, WMFC`'],
        ], boldFirst: true },
        { type: 'think', text: [
          'Compare with the read: in a **write**, the data must be in MDR *before* the memory can be told to store, so R2 goes to MDR in the same step as Write; the final step just pushes MDR out and waits. In a **read**, the wait happens in the middle because data arrives late. Keep this contrast — exam questions ask you to produce one of these cold.',
        ] },
      ],
    },
    {
      heading: 'A complete instruction: ADD (R3), R1 on the single bus',
      blocks: [
        { type: 'p', text: '“Add the contents of the memory location pointed to by R3 to register R1.” Four tasks: fetch the instruction, fetch the operand, add, store the result in R1. Seven steps:' },
        { type: 'table', head: ['Step', 'Action', 'Control signals'], rows: [
          ['1', 'PC → MAR, activate Read, increment PC by 4', '`PCout, MARin, Read, Select4, Add, Zin`'],
          ['2', 'Update PC; copy updated PC to Y (useful for branches); load MDR while waiting', '`Zout, PCin, Yin, MDRinE, WMFC`'],
          ['3', 'MDR → IR (fetch done)', '`MDRout, IRin`'],
          ['4', 'R3 → MAR, activate Read (operand address)', '`R3out, MARin, Read`'],
          ['5', 'R1 → Y; load MDR while waiting for the operand', '`R1out, Yin, MDRinE, WMFC`'],
          ['6', 'MDR → bus; select Y; add; result to Z', '`MDRout, SelectY, Add, Zin`'],
          ['7', 'Z → R1; done', '`Zout, R1in, End`'],
        ], boldFirst: true },
        { type: 'think', text: [
          'Notice how much is overlapped: PC update *and* MDR load *and* WMFC share step 2; operand fetch (step 4) starts while R1 is parked in Y (step 5). The pattern “start the memory access as early as possible, then do local work while waiting for MFC” is what makes these sequences short.',
          'Why is `Yin` in step 2? The updated PC is copied to Y so a later relative branch can add its offset to it — the branch sequences rely on this.',
        ] },
        { type: 'exam', text: ['Figure 7.6 (the control sequence chart) is exactly this table with timing — if the question says “show the control sequence”, this table **is** the answer, with the End signal on the last step.'] },
      ],
    },
    {
      heading: 'Branch instructions (self-study, 7.2.1)',
      blocks: [
        { type: 'p', text: 'A branch instruction replaces the contents of the PC with the **branch target address**, usually obtained by adding an **offset** given in the instruction to the PC. The offset is the difference between the branch target and the address of the *next* instruction — because by the time the branch executes, PC already holds PC+4. Conditional branches (Branch<0, =0, >0 …) depend on the processor’s **condition-code flags**.' },
        { type: 'table', head: ['Step', 'Action'], rows: [
          ['1', '`PCout, MARin, Read, Select4, Add, Zin`'],
          ['2', '`Zout, PCin, Yin, WMFC`'],
          ['3', '`MDRout, IRin`'],
          ['4', '`Offset-field-of-IR out, SelectY, Add, Zin`'],
          ['5', '`Zout, PCin, End`'],
        ], boldFirst: true, caption: 'Figure 7.7 — control sequence for an unconditional branch. Step 4 adds Y (which holds the current PC, thanks to the Yin in step 2) to the offset field of IR.' },
        { type: 'think', text: [
          'The trick to remember: **Y secretly saved the incremented PC during fetch** (the `Yin` in step 2). So the branch does not need to re-add 4. The ALU adds offset + Y and the result lands in the PC. If a question asks “why is Yin asserted during fetch of every instruction?” — this is why.',
        ] },
      ],
    },
    {
      heading: 'Multiple-bus organization (three-bus datapath, Figure 7.8)',
      blocks: [
        { type: 'p', text: 'The single-bus structure gives **long control sequences**, because only one data item can move per clock cycle. Commercial processors provide multiple internal paths so several transfers happen in parallel.' },
        { type: 'diagram', id: 'threeBus', caption: 'Figure 7.8 — three-bus organization. Check the direction table under the figure against every arrow in the drawing.' },
        { type: 'list', items: [
          'All general-purpose registers are combined into one block, the **register file**, with **three ports**: two output ports to buses A and B (two registers readable simultaneously) and one input port from bus C.',
          'Buses A and B carry the **source operands** to the ALU; the result goes to the destination over **bus C**.',
          'The ALU can pass an operand through unmodified — control signals `R = A` or `R = B` — which is how a register reaches a bus on the other side of the ALU.',
          'The **incrementer** unit increments the PC by 4 (the Constant-4 path at the MUX can also increment other addresses, e.g. in multiple load/store instructions).',
          'Three buses **remove the need for Y and Z** entirely.',
        ] },
        { type: 'table', head: ['Connection', 'Direction'], rows: [
          ['GPR ↔ buses', 'GPR → A, B (read); GPR ← C (write)'],
          ['ALU', '← (bus A or Constant 4) and bus B; → bus C'],
          ['PC', '→ bus B **only**; ← bus C'],
          ['IR', '→ bus A **only**; ← bus C'],
          ['MDR', '→ buses A and B; ← bus C'],
          ['MAR', '← bus C only'],
        ], caption: 'The direction summary table from the slides — memorize this; drawing and questions both depend on it.' },
        { type: 'think', text: [
          'Where do `R = A` / `R = B` come from? MAR is only reachable from bus C, but PC sits on bus B. To get the PC’s value into MAR you must pass it *through* the ALU: assert `R = B`, which copies bus B to bus C unchanged. Every fetch step therefore looks like `PCout, R = B, MARin`.',
        ] },
      ],
    },
    {
      heading: 'Control sequence in the three-bus architecture',
      blocks: [
        { type: 'p', text: 'Slides give `Add R4, R5, R6` in four steps:' },
        { type: 'table', head: ['Step', 'Action'], rows: [
          ['1', '`PCout, R=B, MARin, Read, IncPC`'],
          ['2', '`WMFC`'],
          ['3', '`MDRoutB, R=B, IRin`'],
          ['4', '`R4outA, R5outB, SelectA, Add, R6in, End`'],
        ], boldFirst: true, caption: 'Figure 7.9 — the same fetch (3 steps) plus a single-step execute: both operands and the destination move in one cycle.' },
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
        { type: 'p', text: '**2) Add R1, (R2)** — store the sum into memory at the address in R2 (17 steps in the notes; fetch as above, then):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['7', 'R2 → BusB → ALU → BusC → MAR', '`R2outB, R=B, MARin, Read`', 'T4'],
          ['8–10', 'WMFC, mem → MDR', '`WMFC, MDRinE`', 'T5'],
          ['11–13', 'MDR → BusB, R1 → BusA, add', '`MDRoutB, R1outA, SelectA, Add`', 'T6'],
          ['14–15', 'Result → BusC → MDR, write', '`MDRin, Write`', 'T7'],
          ['16–17', 'MDR → external bus, wait, end', '`MDRoutE, WMFC, End`', 'T8'],
        ], boldFirst: true },
        { type: 'p', text: '**3) Add R1, (R2)+, R3** — auto-increment addressing: after using R2 as the pointer, R2 is incremented (steps 12–15 below):' },
        { type: 'table', head: ['#', 'Operational step', 'Control signals', 'T'], rows: [
          ['1–6', 'Fetch; read operand at [R2] into R4', '`PCout…IRin`, then `R2outB, R=B, MARin, Read`, `WMFC, MDRinE`, `MDRoutB, R=B, R4in`', 'T1–T6'],
          ['12–15', 'R2 → BusB, select Constant 4, add → R2 (auto-increment)', '`R2outB, Select4, Add, R2in`', 'T7–T8'],
          ['16–18', 'R1 → BusA, R4 → BusB, add → R3', '`R1outA, R4outB, SelectA, Add, R3in`', 'T8'],
          ['19–20', 'End', '`End`', 'T9'],
        ], boldFirst: true },
        { type: 'note', title: 'Merging steps — the two rules from class', text: [
          'Two transfers may share one time step **only if they do not drive the same bus as output** (one `out` per bus) — e.g. `R1outA` and `R2outB` combine, two outs on bus B never do.',
          '`WMFC` and `Read`/`Write` may not sit in the same cycle as the data movement they guard — the wait must precede the use of the data.',
          'Same clock cycle, same bus, **different values** → forbidden. Same value on a bus read by several destinations → fine.',
        ] },
        { type: 'think', text: [
          'Recipe for writing any three-bus sequence: (1) write the standard 3-step fetch — it never changes. (2) Find every memory access the instruction needs and give each a `MARin + Read/Write` step followed by `WMFC + MDRinE/MDRoutE`. (3) The actual ALU work is one step: source A out, source B out, SelectA, the operation, destination in. (4) Auto-increment/decrement of a pointer register is a separate ALU step using `Select4`. (5) End. Then compress using the merge rules.',
        ] },
        { type: 'exam', text: ['This exact question type — “generate the control sequence for instruction X in this architecture” — appeared in **Fall 2023 (SUB (R1),(R2)), Spring 2023 (MUL (R1),(R2)) and Spring 2024 (MUL R1, 4(R2) + hardwired signal generation)**. It is the most repeated big question in the set.'] },
      ],
    },
    {
      heading: 'Generating control signals: two paradigms',
      blocks: [
        { type: 'list', items: [
          'Control signals needed in proper sequence: `PCout, PCin, Riout, Rjin, ADD, SUB, MUL, DIV, MARin, MDRout, SelectY, Zin, Zout, WMFC, End`, …',
          '**Hardwired control**: fast; little flexibility; design complexity grows with the size of the instruction set.',
          '**Microprogrammed control**: enormous flexibility, simpler design especially for large architectures, but much slower operation.',
        ] },
        { type: 'think', text: [
          'Frame it as a trade-off question: hardwired = logic gates wired for one ISA (speed, rigidity); microprogrammed = a small program that *is* the control unit (flexibility, slower). Every “compare the two” question is asking you to land on this trade-off.',
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
        { type: 'diagram', id: 'controlSignalGates', caption: 'The gate network the class notes drew for Zin: buffers for the always-on T1 term, AND gates for T6·ADD and T4·BRANCH, one OR gate.' },
        { type: 'list', items: [
          'The control hardware is a **state machine**: it changes state every clock cycle depending on IR, condition codes and external inputs; its outputs are the control signals.',
          'The sequence is determined by the **wiring of logic elements** — hence “hardwired”.',
          'Advantage: **speed**. Disadvantages: little flexibility, limited complexity of the instruction set it can implement.',
        ] },
        { type: 'think', text: [
          'To build any one signal, list the (step, instruction) pairs where it must be 1 — that table *is* the Boolean function. Buffer the pairs that apply to all instructions, AND-gate the pairs that need a specific instruction, OR everything together. The Fall 2024 paper asks exactly this for a 16-instruction processor on step 4 of instruction 4 — see the question bank.',
        ] },
        { type: 'exam', text: ['**Fall 2024 Q1(d)** asked for this block diagram with a 16-instruction, 8-step processor; **Spring 2024 Q2(b)** asked to sketch the gates for `PCin, R=B, MARin, MDRinE`.'] },
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
        { type: 'p', text: 'The slides’ worked microprogram for `Add (R3), R1` (single-bus) turns the 7 control steps into 7 rows of 1s and 0s — one column per signal (`PCout, PCin, MARin, Read, MDRout, IRin, Yin, SelectY, Select4, Add, Zin, Zout, R1out, R1in, R3out, WMFC, End`), with Select encoded as SelectY = 0, Select4 = 1. For example step 1 `PCout, MARin, Read, Select4, Add, Zin` becomes `1 0 1 1 0 0 0 0 1 1 1 0 0 0 0 0 0`.' },
        { type: 'diagram', id: 'microCU', caption: 'Figure 7.16 — basic organization: IR → starting-address generator → µPC; the clocked µPC steps through the control store, whose CW output drives the datapath.' },
        { type: 'list', items: [
          'The **microprogram counter (µPC)** reads CWs from the control store sequentially.',
          'When a new instruction is loaded into IR, the **starting-address generator** produces the microroutine’s first address and loads it into µPC.',
        ] },
        { type: 'diagram', id: 'microCUCond', caption: 'Figure 7.18 — adding conditional branching: a starting-and-branch-address generator checks the condition codes and external inputs and can load a new address into µPC.' },
        { type: 'p', text: 'The basic organization cannot do **conditional branching** or operations based on external inputs such as WMFC — the extended version adds a starting-and-branch address generator fed by condition codes and external inputs. If the CW is a conditional branch, the generator checks the condition codes and, if necessary, branches by loading a new address into µPC using the offset-address field.' },
        { type: 'think', text: [
          'Map the vocabulary one-to-one: instruction ↔ microroutine, program ↔ microprogram (contents of the control store), instruction step ↔ microinstruction (= control word), opcode lookup ↔ starting-address generator, PC ↔ µPC. Once you see “the control unit is a CPU inside the CPU”, every figure reads itself.',
          'Why is it slower? Every control-signal step costs a **control-store read** before the datapath can act, while hardwired logic is just gate delay.',
        ] },
        { type: 'exam', text: ['**Spring 2024 Q1(d)** asked for Figure 7.18 plus an explanation of Branch<0: N = 1 means negative; the branch microinstruction checks N, and if N = 0 execution continues at microinstruction 0 (the next CW) instead of jumping to L1.'] },
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
