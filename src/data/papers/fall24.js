// Fall 2024 — pages 5-6 of the paper (pages 1-4 were not in the folder).
// Hamacher-track syllabus; the closest paper to the current slide set.
export default {
  id: 'fall24',
  name: 'Fall 2024',
  short: 'F24',
  date: '09/11/2025',
  marks: '50 · 2h30m',
  note: 'Closest to the current slide set — every question maps onto Chapters 4, 5, 7, 8 directly. Treat this as the model paper.',
  instruction: 'Q1 any 3 of 4 × 6 = 18 · Q2 both × 10 = 20 · Q3 any 3 of 4 × 4 = 12.',
  format: 'Three sections: concepts (Q1), long worked problems (Q2), short applications (Q3). The long questions in Q2 (branch penalty, cache mapping) are the ones to master first — they repeat across papers.',
  questions: [
    {
      id: 'Q1a', topic: 'interrupts', marks: '[6]', inNotes: true, repeats: 1,
      q: 'When a device asserts an interrupt request (IRQ) signal, it holds the signal active until the processor acknowledges it. If not properly controlled, this may generate repeated interrupts, causing the system to enter an infinite loop. Explain all the approaches available to prevent repeated interrupts from the same request, using proper examples.',
      think: [
        'The question gives you the fear — “the line stays high, so the processor re-enters the ISR forever”. Each approach is just a different place to break that loop: software ordering, a status bit, or the signal edge itself. Structure the answer as three numbered approaches, each with one concrete example sentence.',
      ],
      solution: [
        { type: 'p', text: 'The sequence being protected: device raises IRQ → processor interrupts the program → interrupts are disabled → the device learns its request was recognized and **drops IRQ** → ISR runs → interrupts re-enabled → interrupted program resumes. Three mechanisms exist for the “disable” step:' },
        { type: 'table', head: ['Approach', 'Mechanism', 'Example'], rows: [
          ['1 — Ignore IRQ until the first ISR instruction completes', 'Processor hardware ignores the request line until the first instruction of the ISR has executed. The programmer puts an **Interrupt-disable** instruction there, so nothing further interrupts until an **Interrupt-enable** runs as the last instruction before return-from-interrupt (whose execution must complete before any new interrupt).', 'ISR first instruction `ID`; last two instructions `IE`, `Return-from-interrupt`.'],
          ['2 — Interrupt-enable (IE) bit in the processor status register', 'A request is accepted only while IE = 1. On acceptance the processor saves **PC and PS** on the stack, **clears IE** (further requests ignored) and runs the ISR; `Return-from-interrupt` restores PS, setting IE back to 1.', 'PS = `…IE=1…` → interrupt accepted → PS pushed, IE ← 0 → ISR → return pops PS, IE = 1 again.'],
          ['3 — Edge-triggered request line', 'The interrupt circuit responds only to the **leading edge** of the signal, so however long the device holds IRQ high the processor sees exactly one request. No disabling needed for this line.', 'IRQ goes 0→1 once: one interrupt, even if the line stays high for milliseconds.'],
        ] },
        { type: 'answer', text: ['Any of the three prevents the infinite loop: approach 1 by instruction ordering, approach 2 by clearing/restoring the IE status bit, approach 3 by reacting to the transition instead of the level.'] },
      ],
    },
    {
      id: 'Q1b', topic: 'ram-chip', marks: '[6]', inNotes: true, repeats: 2,
      q: 'Consider a 1 kB RAM chip where each word consists of 16 bits. Illustrate the internal organization of this RAM memory chip showing how the memory cells are arranged into rows and columns. If the 8th word is to be read from this RAM, demonstrate step by step how the address decoder selects the word and how the data is made available at the output.',
      pattern: 'Same figure as Spring 2023 Q3(f)(i) with different numbers — draw it once, learn it twice.',
      think: [
        'Two numbers decide the whole figure: how many words, and how many bits per word. 1 kB with 16-bit (2-byte) words = **512 words** → 9 address bits; 16 columns of cells. Rows = words, columns = bit positions — never draw cells as a square “memory blob”; mark the word line and the sense/write column explicitly.',
      ],
      solution: [
        { type: 'p', text: '**Organization.** 1 kB = 1024 bytes = 8192 bits; with 16-bit words → **512 words × 16 bits**. Address lines: 2^9 = 512 → **A0–A8 (9 bits)**.' },
        { type: 'diagram', id: 'ramChip', caption: 'Redraw with 512 word lines (W0…W511), a 9-to-512 address decoder, a 512 × 16 cell array, and 16 sense/write circuits feeding D15…D0, plus R/W̄ and CS.' },
        { type: 'p', text: '**Step-by-step read of the 8th word** (assume R/W̄ = 1 and CS active):' },
        { type: 'steps', items: [
          'The processor puts the address of word 8 on the address lines: 8 = `000001000` (9 bits).',
          'The **address decoder** decodes A0–A8 and drives exactly one word line high: **W8**.',
          'All 16 cells of row 8 are connected to W8 → they place their stored bits on their bit lines (one per column).',
          'The **sense/write circuits** (one per column) detect/amplify the small cell signals.',
          'The 16 bits appear in parallel on the data input/output lines **D15…D0** — the word is now available to the processor/MDR.',
        ] },
        { type: 'answer', text: ['512 × 16 organization, 9-to-512 decoder, and for the 8th word: A0–A8 = 000001000 → decoder selects W8 → row-8 cells drive the 16 bit lines → sense circuits output the word on D15–D0.'] },
      ],
    },
    {
      id: 'Q1c', topic: 'bus-timing', marks: '[6]', repeats: 2,
      q: 'Explain the timing of an input data transfer in a synchronous bus (assuming that one data transfer takes one clock cycle) using necessary figures. Identify the limitations of this timing mechanism and explain how to overcome these limitations using necessary figures and mechanisms.',
      pattern: 'Paired with Spring 2023 Q3(g) — sync vs async timing is a stable two-paper topic.',
      think: [
        'Three parts, three marks each roughly: (1) the synchronous figure with t0/t1/t2 meaning address → data → cycle end; (2) the limitation in one crisp sentence — the common clock must be slowed to the slowest device; (3) the fix = asynchronous full handshake, drawn with Master-ready/Slave-ready and the four events in order.',
      ],
      solution: [
        { type: 'p', text: '**Synchronous timing.** All devices derive timing from a common **bus clock**; a bus cycle occupies a fixed number of clock cycles (here, one data transfer per clock cycle).' },
        { type: 'diagram', id: 'syncBus', caption: 'Input (read) transfer: the master places the address/command on the lines at t0; the addressed slave places its data on the data lines, valid before the end of the cycle (t1–t2); the master samples the data at the clock edge ending the cycle.' },
        { type: 'list', items: [
          '**Limitation 1** — the clock period must accommodate the **slowest device** on the bus: every transfer, even to a fast device, pays the worst-case time.',
          '**Limitation 2** — on a long bus, clock **skew** and different path lengths make a single tight clock unreliable; also, all devices must use the same clock frequency, so mixing slow and fast devices is inefficient.',
        ] },
        { type: 'p', text: '**Overcoming it — the asynchronous bus** (no common clock): timing is instead established by a **handshake** between master and slave.' },
        { type: 'diagram', id: 'asyncBus', caption: 'Full handshake: (t0) master asserts address/command + Master-ready → (t1) slave returns data and asserts Slave-ready → (t2) master sees Slave-ready, drops Master-ready → (t3) slave drops Slave-ready. Every transition is triggered by the previous one.' },
        { type: 'list', items: [
          'Devices of **any speed** can cooperate — the handshake adapts to each transfer’s actual duration.',
          'The cost: two extra control lines (Master-ready, Slave-ready) and the accumulated propagation delays of the successive handshakes.',
        ] },
        { type: 'answer', text: ['Synchronous: fixed clock cycle, simple but paced by the slowest device and vulnerable to skew. Asynchronous (full handshake on Master-ready/Slave-ready): speed-independent, at the cost of handshake lines and delay.'] },
      ],
    },
    {
      id: 'Q1d', topic: 'hardwired-cu', marks: '[6]', inNotes: true, repeats: 2,
      q: 'Illustrate the block diagram of a Hardwired control unit organization. Consider that the processor can handle 16 instructions in total. Currently the 4th instruction is being executed which has a total of 8 steps. Explain how this Hardwired control unit organization will generate different control signals based on different steps of the instruction.',
      think: [
        'The block diagram is fixed (Fig 7.13-style); the numbers just set the widths: 16 instructions → the instruction decoder emits INS1…INS16; an 8-step instruction → the step counter counts T1…T8. Then explain the encoder: each control signal = OR of AND terms (Ti · INSj). Give one concrete signal as an example — that is the “explain” part.',
      ],
      solution: [
        { type: 'diagram', id: 'hardwiredCU', caption: 'Block diagram: clock → control step counter → step decoder (T1…Tn); IR → instruction decoder (INS1…INSm); encoder combines T’s, INS’s, condition codes and external inputs into the control signals; End/Run feeds back to the counter.' },
        { type: 'p', text: '**With the given numbers:** the instruction decoder outputs 16 lines (INS1…INS16, one active for the instruction in IR); the step decoder outputs T1…T8 for the currently executing step of instruction 4. The control signals for step *k* of INS4 are the outputs of the encoder for the input pair (INS4, Tk).' },
        { type: 'p', text: 'Each signal is a sum-of-products of timing and instruction signals. Example — a signal that must be on during T1 for **every** instruction and during T5 **only** for instruction 4:' },
        { type: 'pre', text: 'X = T1 + T5 · INS4' },
        { type: 'diagram', id: 'controlSignalGates', caption: 'Gate realization: a buffer for the T1 term, an AND gate for T5·INS4, one OR gate — exactly the class-notes drawing for Zin = T1 + T6·ADD + T4·BRANCH.' },
        { type: 'steps', items: [
          'While INS4 executes, the step counter advances T1 → T2 → … → T8, one per clock cycle.',
          'At each Tk the encoder activates the (INS4, Tk) product terms → the control signals for that step (e.g. step 1: `PCout, R=B, MARin, Read, IncPC`; final step adds `End`).',
          'The `End` signal resets the counter to T1 and the control unit proceeds to the next instruction’s microroutine-equivalent wired sequence.',
          'Condition codes and external inputs (MFC) can modify signals within an instruction — e.g. WMFC-held steps only advance when MFC arrives.',
        ] },
        { type: 'answer', text: ['16-instruction × 8-step hardwired unit: INS lines from the IR decoder, T lines from the step counter, and every control signal generated as Zin-style sum-of-products of (step, instruction) pairs.'] },
      ],
    },
    {
      id: 'Q2a', topic: 'branch', marks: '[10: 2+2+4+2]', inNotes: true, repeats: 3,
      q: `Consider the following program.
LOOP   ADD R1, R2
       SHIFT LEFT R2
       DEC R3
       BRANCH > 0 LOOP
NEXT   SHIFT RIGHT R2
       INC R4
(I) Determine the branch penalty (using necessary figures) of this program in each iteration (except the last one) if a two-stage pipeline is used. [2]
(II) Determine the branch penalty if a four-stage pipeline is used, assuming that the branch address is computed in the execute stage. [2]
(III) Explain how the delayed branching technique can be applied to reduce the branch penalty (four-stage pipeline). Rearrange the program instructions as necessary and determine the branch penalty after applying delayed branching using necessary diagrams (only show the last two iterations). [4]
(IV) If branch prediction is used, discuss which prediction would be more beneficial for this program: predict branch taken or predict branch not taken. [2]`,
      pattern: 'The flagship repeated question: branch penalty on the same loop appears in Spring 2023 Q1(e) and the class notes. Master this one and both variants are free marks.',
      think: [
        'Anchor on the slides’ rule: **penalty = how many fetch slots are wasted before the target can be fetched**. Two-stage → the branch resolves during its Execute cycle, so one wrong fetch (NEXT’s first instruction) → 1. Four-stage with E-stage resolution → two wrong fetches → 2. For delayed branch, look at what may legally move into the slot(s): `DEC R3` must stay **before** the branch (it produces the flags BRANCH tests), but `SHIFT LEFT R2` is independent — it can fill one slot.',
      ],
      solution: [
        { type: 'h', text: 'I — Two-stage pipeline (F | E)' },
        { type: 'timing', columns: 7, rows: [
          { label: 'ADD R1,R2', cells: ['F1', 'E1', '', '', '', '', ''] },
          { label: 'SHIFT LEFT', cells: ['', 'F2', 'E2', '', '', '', ''] },
          { label: 'DEC R3', cells: ['', '', 'F3', 'E3', '', '', ''] },
          { label: 'BRANCH>0', cells: ['', '', '', 'F4', 'E4', '', ''] },
          { label: 'SHIFT RIGHT (wrong path)', cells: ['', '', '', '', { t: 'F5', dim: true }, '', ''] },
          { label: 'ADD R1,R2 (target)', cells: ['', '', '', '', '', 'F1′', 'E1′'] },
        ], caption: 'During E4 (resolving the branch) the fetch unit already fetched the instruction after the branch — it must be discarded and the target fetched in the next cycle.' },
        { type: 'answer', text: ['Branch penalty = 1 clock cycle per iteration (except the last).'] },
        { type: 'h', text: 'II — Four-stage pipeline, branch address computed in E' },
        { type: 'timing', columns: 9, rows: [
          { label: 'ADD R1,R2', cells: ['F1', 'D1', 'E1', 'W1', '', '', '', '', ''] },
          { label: 'SHIFT LEFT', cells: ['', 'F2', 'D2', 'E2', 'W2', '', '', '', ''] },
          { label: 'DEC R3', cells: ['', '', 'F3', 'D3', 'E3', 'W3', '', '', ''] },
          { label: 'BRANCH>0', cells: ['', '', '', 'F4', 'D4', 'E4', '', '', ''] },
          { label: 'SHIFT RIGHT (wrong)', cells: ['', '', '', '', { t: 'F5', dim: true }, { t: 'D5', dim: true }, '', '', ''] },
          { label: 'INC R4 (wrong)', cells: ['', '', '', '', '', { t: 'F6', dim: true }, '', '', ''] },
          { label: 'ADD R1,R2 (target)', cells: ['', '', '', '', '', '', 'F1′', 'D1′', 'E1′'] },
        ], caption: 'The branch resolves at the end of E4 (cycle 6). Instructions fetched in cycles 5 and 6 (SHIFT RIGHT, INC R4) are both on the wrong path and are discarded; the target is fetched in cycle 7.' },
        { type: 'answer', text: ['Branch penalty = 2 clock cycles per iteration (except the last).'] },
        { type: 'h', text: 'III — Delayed branching (four-stage)' },
        { type: 'p', text: 'With E-stage resolution there are **two delay slots** after the branch; instructions placed there are always executed, taken or not. `DEC R3` must stay before the branch (it sets the condition), and `SHIFT RIGHT R2`/`INC R4` belong to NEXT — moving them into the slots would run them every iteration and break the logic. But `SHIFT LEFT R2` is independent of the branch decision and of the loop-exit path, so it can move into the first slot; the second slot gets a NOP:' },
        { type: 'table', head: ['Original', 'Reordered'], rows: [
          ['`LOOP  ADD R1, R2`', '`LOOP  ADD R1, R2`'],
          ['`      SHIFT LEFT R2`', '`      DEC R3`'],
          ['`      DEC R3`', '`      BRANCH > 0 LOOP`'],
          ['`      BRANCH > 0 LOOP`', '`      SHIFT LEFT R2`  ← delay slot 1'],
          ['`NEXT  SHIFT RIGHT R2`', '`      NOP`  ← delay slot 2'],
          ['`      INC R4`', '`NEXT  SHIFT RIGHT R2`'],
          ['', '`      INC R4`'],
        ] },
        { type: 'timing', columns: 10, rows: [
          { label: '2nd-last iter: ADD', cells: ['F', 'D', 'E', 'W', '', '', '', '', '', ''] },
          { label: 'DEC R3', cells: ['', 'F', 'D', 'E', 'W', '', '', '', '', ''] },
          { label: 'BRANCH', cells: ['', '', 'F', 'D', 'E', 'W', '', '', '', ''] },
          { label: 'SHIFT LEFT (slot 1)', cells: ['', '', '', 'F', 'D', 'E', 'W', '', '', ''] },
          { label: 'NOP (slot 2)', cells: ['', '', '', '', 'F', 'D', 'E', 'W', '', ''] },
          { label: 'last iter: ADD', cells: ['', '', '', '', '', 'F', 'D', 'E', 'W', ''] },
          { label: 'DEC R3', cells: ['', '', '', '', '', '', 'F', 'D', 'E', 'W'] },
        ], caption: 'Last two iterations: the pipeline never stalls — every slot carries a real instruction except the single NOP. The branch target fetch begins right after the branch’s Execute, and the slot instructions cover exactly the cycles the penalty used to waste.' },
        { type: 'answer', text: ['After delayed branching the penalty drops from 2 cycles to 1 cycle per iteration (only the unfilled NOP slot is lost); the logic is unchanged because the slot instruction executes in every pass, as it did before the branch inside the loop body.'] },
        { type: 'h', text: 'IV — Which prediction?' },
        { type: 'p', text: 'The branch sits at the **bottom (end) of the loop** and is taken on every pass except the final one (R3 counts down to 0). So “predict **taken**” is correct (n−1) of n times: the fetch unit should start fetching at the branch target immediately, while “predict not taken” would fetch the wrong NEXT path (n−1) times.' },
        { type: 'answer', text: ['Predict **branch taken** — a loop-bottom branch is taken in every iteration except the last.'] },
      ],
    },
    {
      id: 'Q2b', topic: 'cache', marks: '[10]', repeats: 5,
      q: 'Consider a cache consisting of 128 blocks of 32 words each. The main memory is word addressable, addressable by an 18-bit address, and it has 8K blocks of 32 words each. A main memory location has the address 111111110000111100. Determine the cache position where this address maps using Direct, Associative and Set-Associative mapping (4 blocks per set). Illustrate how the 18-bit address divides into tag, block/set and word for each technique and identify the exact mapped location.',
      pattern: 'THE most repeated question in the bank — Fall 22, Spring 22, Fall 23, Spring 24 and here. Only the numbers change; the field-splitting method is identical every time.',
      think: [
        'Compute the three field widths once, then reuse: word = log2(32) = **5**; direct block field = log2(128) = **7**; set field = log2(128/4 = 32 sets) = **5**. Tag fills what is left (6, 13, 8). Then cut the binary address on those boundaries and convert each field to decimal. Finish with the arithmetic cross-check: memory block number mod (lines or sets) must equal your index field.',
      ],
      solution: [
        { type: 'p', text: '**Given:** cache 128 blocks × 32 words; memory 8K = 2^13 blocks of 32 words; 18-bit word address. Memory block number of the given address = top 13 bits = `1111111100001` = 8161.' },
        { type: 'h', text: 'Direct mapping — Tag (6) | Block (7) | Word (5)' },
        { type: 'diagram', id: 'directMap', caption: 'Direct-mapped organization with the field widths of this question.' },
        { type: 'pre', text: 'address  111111110000111100\n          ────── ─────── ─────\nsplit     111111 1100001  11100\n           tag=63  block=97 word=28' },
        { type: 'p', text: 'Check: memory block 8161 mod 128 = 97 ✓. The block is stored in **cache block 97** with tag 111111; the referenced word is **word 28** of that block. Hit test: compare the address tag with the 6 stored tag bits of block 97.' },
        { type: 'h', text: 'Associative mapping — Tag (13) | Word (5)' },
        { type: 'diagram', id: 'associativeMap', caption: 'Fully associative organization: any block anywhere, full block number as tag.' },
        { type: 'pre', text: 'address  111111110000111100\n          ───────────── ─────\nsplit     1111111100001  11100\n           tag = block 8161  word = 28' },
        { type: 'p', text: 'The block may occupy **any** of the 128 cache positions (chosen by the replacement algorithm); the 13-bit tag 1111111100001 is stored with it. Hit test: **all 128 tags compared in parallel** with 1111111100001. The referenced word is **word 28** of the block wherever it resides.' },
        { type: 'h', text: 'Set-associative mapping (4 blocks/set) — Tag (8) | Set (5) | Word (5)' },
        { type: 'diagram', id: 'setAssocMap', caption: 'Four-way set-associative: 128 blocks ÷ 4 = 32 sets.' },
        { type: 'pre', text: 'address  111111110000111100\n          ──────── ───── ─────\nsplit     11111111 00001 11100\n           tag=255  set=1  word=28' },
        { type: 'p', text: 'Check: 8161 mod 32 = 1 ✓. The block maps to **set 1** and may occupy **any of the 4 block positions** inside that set, with stored tag 11111111. Hit test: compare the 8-bit tag against the **4 tags of set 1 only**. Referenced word: **word 28**.' },
        { type: 'answer', text: [
          'Direct: tag 6 / block 7 / word 5 → cache block **97**, word **28**, stored tag 63.',
          'Associative: tag 13 / word 5 → any cache block, stored tag = block number **8161**, word **28**.',
          'Set-associative (4-way): tag 8 / set 5 / word 5 → **set 1**, any of its 4 blocks, word **28**, stored tag 255.',
        ] },
      ],
    },
    {
      id: 'Q3a', topic: 'bus-arb', marks: '[4]', inNotes: true, repeats: 3,
      q: 'Define bus arbitration. Let’s assume that three devices with IDs 5, 12 and 9 are connected to a bus and all of them are requesting the bus. If a distributed bus arbitration technique is used, determine which device will win and become the Bus Master by simulating each step of the process. Also draw the distributed arbitration scheme using these three devices.',
      pattern: 'Distributed arbitration was simulated twice in the class notes (D5/D6/D7 → D7 wins) — same drill, new IDs.',
      think: [
        'Write all three IDs as 4-bit binary first (5 = 0101, 12 = 1100, 9 = 1001), OR them onto the lines, then walk every device from the MSB: any device whose bit is 0 where the line shows 1 must drop that bit **and every lower bit** to 0. Re-OR after each round; when the pattern equals exactly one ID, that device wins. Highest ID always wins — use that as your sanity check.',
      ],
      solution: [
        { type: 'p', text: '**Definition.** The device allowed to initiate transfers on the bus at a given time is the **bus master**; the process that selects the next master and transfers mastership to it is **bus arbitration**. In **distributed** arbitration all devices share the arbitration work (no central arbiter — higher reliability).' },
        { type: 'diagram', id: 'distributedArb', caption: 'The scheme: each device has a 4-bit unique ID; devices are wired to 4 shared arbitration lines (logical OR) plus one Start-Arbitration line.' },
        { type: 'table', head: ['Device', 'ID (4-bit)'], rows: [
          ['D5', '0101'],
          ['D12', '1100'],
          ['D9', '1001'],
        ] },
        { type: 'steps', items: [
          'All three assert Start-Arbitration and place their IDs on the arbitration lines. Line pattern = **0101 OR 1100 OR 1001 = 1111**.',
          '**D5 (0101)** compares 0101 with 1111 from the MSB: bit 3 is 0 on the line and 1 → difference at the MSB → D5 transmits 0s at that and all lower positions: drops to **0000**.',
          '**D9 (1001)** compares 1001 with 1111: bit 3 matches (1), bit 2 differs (0 vs 1) → drops bit 2 and below: **1000**.',
          '**D12 (1100)** compares 1100 with 1111: bits 3, 2 match; bit 1 differs (0 vs 1) → drops bit 1 and bit 0 (already 0): stays **1100**.',
          'New line pattern = 0000 OR 1000 OR 1100 = **1100** — exactly D12’s ID. D9 (1000 ≠ 1100, differs at bit 2) and D5 (0000) have lost; only D12’s pattern equals the lines.',
        ] },
        { type: 'answer', text: ['**Device 12 wins** and becomes the bus master — as expected, the arbitration implements “highest ID wins”.' ] },
      ],
    },
    {
      id: 'Q3b', topic: 'hazards', marks: '[4]', repeats: 4,
      q: 'Identify if the following two instructions will cause a data hazard in a four-stage pipelining by drawing necessary figures.\nSUB R1, R3, R2\nMUL R2, R3, R4\nIf it causes a data hazard, explain how it can be handled in hardware. (The explanation must be related to the given instructions.)',
      pattern: 'Fall 2023 and the class notes use the Mul→Add pair (a real hazard); this variant tests whether you can prove the negative case too.',
      think: [
        'A data hazard exists when the **destination of one instruction is a source of the next** (RAW). SUB writes R1; MUL reads R3 and R4 — no overlap in that direction. MUL writes R2 which SUB *read*, but SUB reads first (in-order pipeline: its D happens cycles before MUL’s W) — a WAR situation an in-order 4-stage pipeline does not stall on. Draw the table to prove both statements.',
      ],
      solution: [
        { type: 'p', text: 'Hazard test: RAW hazard ⟺ destination(I1) ∈ sources(I2). Here destination(I1) = **R1**; sources(I2) = **R3, R4** → no overlap → **no data hazard**.' },
        { type: 'timing', columns: 8, rows: [
          { label: 'I1  SUB R1,R3,R2  (R1 ← R3−R2)', cells: ['F1', 'D1', 'E1', 'W1', '', '', '', ''] },
          { label: 'I2  MUL R2,R3,R4  (R2 ← R3×R4)', cells: ['', 'F2', 'D2', 'E2', 'W2', '', '', ''] },
        ], caption: 'D2 (cycle 3) needs R3 and R4 — both untouched by I1, which writes R1 only at W1 (cycle 4). No stall: I2 proceeds on schedule. The reverse overlap (I2 writes R2, which I1 read in D1, cycle 2) finishes reading before the write (cycle 5) — safe in an in-order pipeline.' },
        { type: 'p', text: '**Had there been a hazard** — e.g. if the second instruction were `MUL R1, R3, R4` (reading R1): I2’s D2 could not complete before W1, and the hardware fix is **operand forwarding**: the subtracted result is available at the ALU output at the end of E1, so it is routed directly from the ALU/RSLT latch into the ALU input for E2, and I2 proceeds without waiting for W1.' },
        { type: 'diagram', id: 'forwarding', caption: 'The forwarding hardware: SRC1/SRC2 buffers and the destination feedback MUXes at the ALU inputs.' },
        { type: 'answer', text: ['No data hazard: SUB’s destination R1 is not a source of MUL, and MUL’s destination R2 is read by SUB before it is overwritten. The timing figure proves it; forwarding is the hardware fix that would apply if the registers did overlap.'] },
      ],
    },
    {
      id: 'Q3c', topic: 'cache-rw', marks: '[4]', repeats: 1,
      q: 'Explain how the processor handles read hit, write hit and read miss, write miss in cache memory. Discuss all possible techniques.',
      think: 'Two axes: hit/miss × read/write. The read column is one line each; the write column is where the marks are — write-through vs write-back for hits, and the two different miss behaviours those protocols produce.',
      solution: [
        { type: 'table', head: ['Event', 'Handling'], rows: [
          ['Read hit', 'Data is obtained directly from the cache — fastest case.'],
          ['Read miss', 'The block containing the word is transferred from main memory into the cache (one word at a time), then the word is forwarded to the processor. Improvement: **load-through / early-restart** — forward the requested word as soon as it arrives, without waiting for the whole block.'],
          ['Write hit — write-through protocol', 'Cache **and** main memory are updated simultaneously; memory is always current, at the cost of a memory write on every write.'],
          ['Write hit — write-back (copy-back) protocol', 'Only the cache copy is updated; the block’s **dirty/modified bit** is set. Main memory is updated only when this block is replaced. Fewer memory writes; memory can be temporarily stale (coherence risk).'],
          ['Write miss — with write-through', 'Write main memory directly; the cache block may or may not be loaded.'],
          ['Write miss — with write-back', 'First **bring the block into the cache**, then overwrite the addressed word in the cache (and set the dirty bit) — the rest of the block must be present so later reads see correct neighbours.'],
        ] },
        { type: 'answer', text: ['Read hit: serve from cache. Read miss: fetch block (+ load-through). Write hit: write-through (update both) or write-back (update cache, set dirty bit). Write miss: write-through → update memory directly; write-back → fetch block, then overwrite in cache.'] },
      ],
    },
    {
      id: 'Q3d', topic: 'prog-io', marks: '[4]', repeats: 2,
      q: 'Explain the concept of program-controlled I/O method using proper examples. Also identify the disadvantage of this program-controlled I/O method and suggest a solution to this problem.',
      think: [
        'Definition + a tiny polling loop + the one disadvantage every text repeats: the processor is **busy-waiting**. The solution is the interrupt — the device announces readiness and the processor uses the wait time for useful work.',
      ],
      solution: [
        { type: 'p', text: '**Concept.** In program-controlled I/O the processor achieves synchronization with the slow device by **repeatedly testing its status flag** (polling) under program control, and transfers the data with ordinary instructions when the flag says “ready”.' },
        { type: 'pre', text: 'READWAIT  Test  SIN        ; keyboard status flag\n          Branch = 0  READWAIT\n          Load   DATAIN        ; character is ready\nWRITEWAIT Test  SOUT       ; display status flag\n          Branch = 0  WRITEWAIT\n          Store  DATAOUT       ; echo the character' },
        { type: 'p', text: 'Example: reading a line from a keyboard and echoing it — the program spins on SIN before every character and on SOUT before every display write. (Memory-mapped I/O makes DATAIN/DATAIN-status ordinary addresses, so `Load`/`Store`/`Test` work on them.)' },
        { type: 'p', text: '**Disadvantage:** the processor spends **all of its time polling** — it does no useful work while waiting, which is disastrous because I/O devices are orders of magnitude slower than the CPU.' },
        { type: 'p', text: '**Solution: interrupts.** The device sends an interrupt request when it becomes ready; the processor executes other programs in the meantime and services the device only when the IRQ arrives (via the interrupt-service routine).' },
        { type: 'answer', text: ['Program-controlled I/O = polling loop until the status flag is set. Disadvantage: processor wastes all its cycles busy-waiting. Solution: interrupt-driven I/O.' ] },
      ],
    },
  ],
}
