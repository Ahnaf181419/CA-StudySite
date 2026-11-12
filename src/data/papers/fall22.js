// Fall 2022 — full paper. NOTE: this paper follows the MIPS / Patterson-Hennessy track
// (machine encoding, single-cycle datapath, Hamming, RAID, QPI) which is NOT in the
// current Hamacher slide set. Solutions use the standard textbook method and are flagged.
export default {
  id: 'fall22',
  name: 'Fall 2022',
  short: 'F22',
  date: '19/09/2023',
  marks: '70 · 3h',
  note: 'Different faculty, different track: MIPS encoding, single-cycle datapath, Hamming codes and floating point dominate. Still worth solving — the cache-mapping, DMA, bus-arbitration and pipeline-hazard questions carried over into the later papers.',
  instruction: 'Q1 compulsory [14] · attempt 2 of Q2–Q4 and 2 of Q5–Q7 [4×14].',
  format: 'Seven questions of 14 marks; Q1 compulsory, then two from each half. Sub-questions are long and multi-part (design + numeric).',
  questions: [
    {
      id: 'Q1a', topic: 'mips', marks: '[4]', flagged: true,
      q: 'Consider a branch-if-equal instruction that is 32 bits long: [Opcode | RS | RT | Offset]. The offset is 16 bits (not in 2’s complement form, a constant). The instruction syntax is BEQ $t3, $t2, X, where X is the offset. If $t3 == $t2, the PC is set to PC + X instead of PC + 4. Answer whether the following code snippet will function properly or not, and explain your reasoning.\nAddress [Instruction]\n5000 [ … ]\n5004 BEQ $t3, $t2, Label\n5008 ADD $t4, $t3, $t2\n80000 Label: SUB $t5, $t4, $t2',

      think: [
        'Use the custom unscaled byte offset in the prompt. After calculating the required offset, compare it to 65535, the largest unsigned 16-bit value.',
      ],
      solution: [
        { type: 'p', text: 'Taking PC as the address of the branch, required X = 80000 − 5004 = 74996 bytes. If the implementation has already advanced PC to 5008, required X = 74992 bytes. Both exceed 65535, so the branch in the question cannot encode the destination.' },
        { type: 'note', text: 'Standard MIPS BEQ instead uses a signed word displacement from PC+4. Under that rule, (80000 − 5008)/4 = 18748 words fits in 16 bits. Use the custom rule for this question and the MIPS rule when asked for the standard encoding.' },
        { type: 'answer', text: 'No. The unscaled displacement exceeds the 16-bit field under either interpretation of the PC base.' },
      ],
    },
    {
      id: 'Q1b', topic: 'mips', marks: '[6]', flagged: true,
      q: 'Write the machine code for the following MIPS assembler code assembled at the starting address 0x00800024 (decimal or binary encodings).\n0x00800024 main: lw $s1, 32($t0)\n0x00800028 addi $t1, $s1, −2\n0x0080002C slt $t2, $t1, $a1\n0x00800030 beq $t2, $zero, exit\n0x00800034 j main\n0x00800038 sll $0, $0, 0\n0x0080003C exit: …',
      think: [
        'Three encodings to remember: I-type = opcode(6) rs(5) rt(5) immediate(16); R-type = opcode(6) rs(5) rt(5) rd(5) shamt(5) funct(6); J-type = opcode(6) target(26). Register numbers: $s0–$s7 = 16–23, $t0–$t7 = 8–15, $a0–$a3 = 4–7, $zero = 0. Key detail: the BEQ offset counts **words** from PC+4, and the J target is the address ÷ 4.',
      ],
      solution: [
        { type: 'table', head: ['Instruction', 'Fields', '32-bit binary'], rows: [
          ['`lw $s1, 32($t0)`', 'op 35 · rs $t0=8 · rt $s1=17 · imm 32', '`1000 1101 0001 0001 0000 0000 0010 0000`'],
          ['`addi $t1, $s1, −2`', 'op 8 · rs 17 · rt 9 · imm −2 = 0xFFFE', '`0010 0010 0010 1001 1111 1111 1111 1110`'],
          ['`slt $t2, $t1, $a1`', 'op 0 · rs 9 · rt 5 · rd 10 · shamt 0 · funct 42 (0x2A)', '`0000 0001 0010 0101 0101 0000 0010 1010`'],
          ['`beq $t2, $zero, exit`', 'op 4 · rs 10 · rt 0 · offset: (0x3C − 0x34)/4 = 2', '`0001 0001 0100 0000 0000 0000 0000 0010`'],
          ['`j main`', 'op 2 · target index = 0x00800024 ÷ 4 = 0x00200009', '`0000 1000 0010 0000 0000 0000 0000 1001`'],
          ['`sll $0, $0, 0`', 'op 0 · rs 0 · rt 0 · rd 0 · shamt 0 · funct 0 — the canonical NOP', '`0000 0000 0000 0000 0000 0000 0000 0000`'],
        ] },
        { type: 'list', items: [
          'lw opcode 35 (100011₂), addi 8, beq 4, j 2; R-type op 0 with funct 42 for slt, 0 for sll.',
          'BEQ: base = branch address + 4 = 0x34; target 0x3C → offset = (0x3C − 0x34)/4 = 2 words.',
          'J: the 26-bit field holds target bits 27 through 2. The processor supplies the top four bits from PC+4 and appends two zero bits.',
          '(-2 in 16 bits: invert 0000 0000 0000 0010 → 1111 1111 1111 1101, +1 → 1111 1111 1111 1110 = FFFE.)',
        ] },
        { type: 'answer', text: 'Write the binary encodings above. Their hex equivalents, in order, are 0x8D110020, 0x2229FFFE, 0x0125502A, 0x11400002, 0x08200009, and 0x00000000.' },
      ],
    },
    {
      id: 'Q1c', topic: 'mips', marks: '[4]', flagged: true,
      q: 'Given the C code: while (A[i] == k) { i = i + 1; } — translate to MIPS code. Assume i is in $s3, k in $s5, and the base address of the integer array A is in $s6.',
      think: 'Loop: compute &A[i] = $s6 + 4i (shift + add), load, compare with $s5, exit when different, else increment i and jump back.',
      solution: [
        { type: 'pre', text: 'Loop: sll  $t1, $s3, 2      # $t1 = 4 × i (byte offset)\n      add  $t1, $t1, $s6   # $t1 = address of A[i]\n      lw   $t0, 0($t1)     # $t0 = A[i]\n      bne  $t0, $s5, Exit  # leave the loop if A[i] != k\n      addi $s3, $s3, 1     # i = i + 1\n      j    Loop            # test again\nExit: …' },
        { type: 'list', items: [
          'Integers are 4 bytes, so the index scales by 4 with `sll … 2`.',
          'The C `while` is tested **before** the body: branch out on the failure condition (`bne`), fall through into the body.',
          'This is the standard P&H translation, which ignores branch delay slots.',
        ] },
        { type: 'answer', text: 'Six instructions: compute &A[i] (sll, add), load A[i], `bne` to Exit when A[i] ≠ k, otherwise increment i and `j Loop`.' },
      ],
    },
    {
      id: 'Q2a', topic: 'perf', marks: '[4]',
      q: 'The pipelined datapath has generally been broken down into five stages. Assume that each stage takes the time specified in Table 1 (Fetch 8 ns, Decode 6 ns, Execute 9 ns, Memory 12 ns, Write-back 6 ns). Assuming that N instructions are executed and all N instructions are load (lw) instructions, evaluate the speedup of a pipeline implementation (assuming no hazards/stalls) when compared to a single-cycle implementation.',
      pattern: 'The speedup derivation that Spring 2022 Q5(a) asks with equal stage times — the formula family every performance question leans on.',
      think: [
        'Single-cycle: every instruction pays the **sum** of all stage delays (41 ns). Pipelined: the clock is set by the **longest** stage (Memory = 12 ns); every stage gets a full clock cycle, including the first instruction through the pipeline.',
      ],
      solution: [
        { type: 'p', text: 'Σt = 8 + 6 + 9 + 12 + 6 = **41 ns**; the pipeline clock is set by the slowest stage: tmax = **12 ns** (Memory).' },
        { type: 'pre', text: 'Single-cycle:  T_single = N × 41 ns\n\nPipelined:     T_pipe  = (N + 4) × 12 ns\n               (five cycles for the first load, one cycle per additional load)\n\nSpeedup = 41N / [12(N + 4)]' },
        { type: 'p', text: 'At N=1 the pipeline takes 60 ns because each stage gets a 12 ns cycle, so it is slower for one load. As N grows, speedup approaches 41/12 ≈ 3.42. Shorter stages have unused time in each cycle. This calculation neglects pipeline-register overhead as the question supplies none.' },
        { type: 'answer', text: ['Speedup = 41N/[12(N + 4)], approaching 41/12 ≈ **3.42×** for large N (ideal 5× lost to unbalanced stage times).'] },
      ],
    },
    {
      id: 'Q2b', topic: 'misc', marks: '[6]', flagged: true,
      q: 'A computer consists of three basic types of components or modules (CPU, I/O, and memory) and they use different paths and signals to communicate. Investigate the modules (in light of their structural and functional aspect, interconnection structure, and incorporating strategies) to formulate a computer system.',
      think: 'Essay question — structure it: (1) each module’s function + structure; (2) the interconnection structure = the bus (address/data/control); (3) incorporating strategies (single bus, multiple/hierarchical buses, caches close to CPU). Draw the classic modules-over-a-bus figure.',
      solution: [
        { type: 'diagram', id: 'ioBus', caption: 'The computer as modules over a common bus — the Fig. 1 of the paper.' },
        { type: 'table', head: ['Module', 'Function', 'Structural aspect'], rows: [
          ['CPU', 'executes instructions: data processing and control', 'ALU + control unit + registers (PC, IR, MAR, MDR, GPRs); issues addresses, synchronizes transfers'],
          ['Memory', 'stores programs and data', 'array of cells addressed through MAR/MDR; N words × n bits'],
          ['I/O modules', 'interface external devices to the system', 'interface circuits: address decoder, control logic, data/status registers; buffering and speed matching'],
        ] },
        { type: 'h', text: 'Interconnection structure' },
        { type: 'list', items: [
          'Modules communicate over a **bus**: address lines (who), data lines (what), control lines (when/how — Read, Write, MFC/IRQ).',
          'The bus is shared: exactly one **bus master** drives the address lines per cycle (arbitration decides when several want it).',
        ] },
        { type: 'h', text: 'Incorporating strategies' },
        { type: 'list', items: [
          '**Single common bus** — simplest; the processor initiates everything (programmed I/O); bottleneck at speed.',
          '**Interrupt lines + DMA controllers** added to the structure so devices can signal and move blocks themselves.',
          '**Hierarchical / multiple buses** and cache memories near the CPU to close the processor–memory speed gap.',
        ] },
        { type: 'answer', text: ['CPU + memory + I/O modules joined by address/data/control buses; single-bus, then interrupt/DMA-augmented, then hierarchical structures as performance demands.'] },
      ],
    },
    {
      id: 'Q2c', topic: 'hazards', marks: '[4]',
      q: 'Describe why the load-use data hazards in the pipeline cannot be resolved by the forwarding unit alone. In order to resolve the dependency, the pipeline must stall for one clock cycle after the load (lw) instruction in addition to the forwarding unit. Examine the hazard detection unit and describe the steps to create a pipeline stall of one clock cycle to solve the load-use data hazards.',
      think: [
        'The one-sentence core: forwarding feeds the **ALU output** forward, but a Load’s value only appears after the **memory** stage — one cycle later than an ALU result, so one bubble is unavoidable. Then the mechanics of stalling: freeze PC + IF/ID, inject NOP into ID/EX.',
      ],
      solution: [
        { type: 'timing', columns: 8, rows: [
          { label: 'lw  $t0, 0($s0)', cells: ['F', 'D', 'E', 'M', 'W', '', '', ''] },
          { label: 'add $t1, $t0, $t2', cells: ['', 'F', 'D', { t: 'stall', box: true }, 'E (forwarded from M/W)', 'M', 'W', ''] },
        ], caption: 'The Add needs $t0 at the start of its E; the Load’s data is only read during its M. Forwarding can pass M→E but not E→E here, because the value does not exist yet.' },
        { type: 'list', items: [
          '**Detection** (hazard detection unit, in the D stage): if the instruction in E is a `lw` **and** its destination register (rt) matches a source register (rs/rt) of the instruction in D → load-use hazard.',
          '**Step 1** — de-assert the PC write and the IF/ID write: the fetch and decode stages **freeze** for one cycle (the same instruction stays in D).',
          '**Step 2** — insert a **bubble** (NOP) into ID/EX: the EX stage receives an instruction that asserts no control signals, so nothing wrong is computed during the wait.',
          '**Step 3** — on the next cycle the load has completed M; the **forwarding unit** routes the loaded value from M/W into the ALU inputs, and execution resumes.',
        ] },
        { type: 'answer', text: ['A load’s operand is produced one stage later than an ALU result, so forwarding alone cannot bridge the gap: detect (lw in E + register match with D), stall one cycle by freezing PC/IF-ID and injecting a NOP, then forward from M/W.'] },
      ],
    },
    {
      id: 'Q3a', topic: 'perf', marks: '[4]',
      q: 'Examine the following MIPS instructions for a 5-stage pipelined processor with fixed 2 ns cycle time. Calculate the total clock cycles and the overall CPI. Consider forwarding and hazard detection methods to reduce the stalls and beq has TRUE condition.\nlw $t0, 0($s5)\naddi $s5, $s5, 4\nadd $t0, $s3, $t0\nsw $t0, 0($s5)\nxor $t3, $t2, $s5\nbeq $t3, $t4, Label\nadd $t2, $t3, $t2\nLabel: add $t5, $t6, $t7',
      think: [
        'Schedule instruction by instruction and count only real stalls. Key observations: the addi **between** lw and add absorbs the load-use hazard (no stall); every ALU dependency is forwarded; assume branch resolution at the end of EX with sequential fetch and forwarding to EX. Two younger fetch slots are discarded; the target may have been fetched speculatively and is fetched again after redirect.',
      ],
      solution: [
        { type: 'timing', columns: 13, rows: [
          { label: '1  lw $t0,0($s5)', cells: ['F', 'D', 'E', 'M', 'W', '', '', '', '', '', '', '', ''] },
          { label: '2  addi $s5,$s5,4', cells: ['', 'F', 'D', 'E', 'M', 'W', '', '', '', '', '', '', ''] },
          { label: '3  add $t0,$s3,$t0', cells: ['', '', 'F', 'D', 'E', 'M', 'W', '', '', '', '', '', ''] },
          { label: '4  sw $t0,0($s5)', cells: ['', '', '', 'F', 'D', 'E', 'M', 'W', '', '', '', '', ''] },
          { label: '5  xor $t3,$t2,$s5', cells: ['', '', '', '', 'F', 'D', 'E', 'M', 'W', '', '', '', ''] },
          { label: '6  beq $t3,$t4 (taken)', cells: ['', '', '', '', '', 'F', 'D', 'E', 'M', 'W', '', '', ''] },
          { label: '7  add $t2,$t3,$t2', cells: ['', '', '', '', '', '', { t: 'F', dim: true }, { t: 'D', dim: true }, '', '', '', '', ''] },
          { label: 'L: speculative fetch', cells: ['', '', '', '', '', '', '', { t: 'F', dim: true }, '', '', '', '', ''] },
          { label: 'L: add $t5,$t6,$t7', cells: ['', '', '', '', '', '', '', '', 'F', 'D', 'E', 'M', 'W'] },
        ], caption: 'Stall analysis: (3) needs $t0 from (1), but (2) sits between them, so the load-use hazard is absorbed — the load completes MEM in cycle 4 and forwards to EX in cycle 5. (4) reads $s5 (E6, forwarded from W6 of (2)) and $t0 (forwarded). (6) reads $t3 produced by (5) in E7 → EX→EX forward into E8. The taken branch resolves at the end of EX in cycle 8. In this model it flushes both younger slots, then fetch restarts at the target in cycle 9.' },
        { type: 'p', text: 'Cycle count: the last instruction (L:) writes back in cycle 13 → **13 cycles**. Instructions that complete: 7 (the squashed add does not count).' },
        { type: 'answer', text: ['Total = 13 clock cycles for 7 completed instructions → CPI = 13/7 ≈ **1.86**. That is 7 completed instructions + 4 fill/drain cycles + 2 lost fetch slots. With a different branch-resolution stage or target-retention policy, recalculate the branch cost.'] },
      ],
    },
    {
      id: 'Q3b', topic: 'cache', marks: '[6]',
      q: 'Consider a 1 MByte main memory, block size of 16 bytes and cache size 64 KByte. For the main memory addresses F0010₁₆ and 01234₁₆ determine the tag, index and byte offset bits for direct-mapped and four-way set-associative cache topologies.',
      pattern: 'The mapping staple with hex addresses — same field arithmetic as every other year.',
      think: [
        '1 MB → 20-bit address; 16 B blocks → 4 offset bits (fixed for both). Direct: 64 KB/16 B = 4096 lines → 12 index bits, tag = 4. Four-way: 4096/4 = 1024 sets → 10 set bits, tag = 6. Convert each hex address to 20-bit binary, cut on the boundaries.',
      ],
      solution: [
        { type: 'p', text: '1 MB = 2^20 → 20-bit address. Block 16 B → **offset = 4 bits**. Cache 64 KB = 4096 lines.' },
        { type: 'h', text: 'Direct-mapped — Tag (4) | Index (12) | Offset (4)' },
        { type: 'table', head: ['Address (20-bit binary)', 'Tag', 'Index', 'Offset'], rows: [
          ['F0010 → 1111 0000 0000 0001 0000', '1111', '000000000001 = **1**', '0000'],
          ['01234 → 0000 0001 0010 0011 0100', '0000', '000100100011 = **291**', '0100 (4)'],
        ], caption: 'Check: block number = address ÷ 16 → 0xF001 = 61441 and 0x123 = 291; 61441 mod 4096 = 1 ✓, 291 mod 4096 = 291 ✓.' },
        { type: 'h', text: 'Four-way set-associative — Tag (6) | Set (10) | Offset (4): 4096 lines ÷ 4 = 1024 sets' },
        { type: 'table', head: ['Address', 'Tag', 'Set', 'Offset'], rows: [
          ['F0010', '111100', '0000000001 = **1**', '0000'],
          ['01234', '000000', '0100100011 = **291**', '0100'],
        ], caption: 'Check: 61441 mod 1024 = 1 ✓, 291 mod 1024 = 291 ✓ — any of the 4 ways inside the set may hold it.' },
        { type: 'answer', text: [
          'Direct: tag 4 / index 12 / offset 4 → F0010 → line 1, offset 0; 01234 → line 291, offset 4.',
          '4-way: tag 6 / set 10 / offset 4 → F0010 → set 1, offset 0; 01234 → set 291, offset 4 (any of the 4 blocks of the set).',
        ] },
      ],
    },
    {
      id: 'Q3c', topic: 'branch', marks: '[4]',
      q: 'Branch decision is confirmed in the MEM stage of branch instructions. Thus, to make the decision for the next instruction that should be inserted in the pipeline following the branch instruction, the pipeline needs to stall for three (3) clock cycles. This is a very inefficient procedure and significantly slows the pipeline execution. Investigate the hardware-based units in Fig. 2 (the 5-stage datapath with the hazard detection unit) and determine the appropriate solution to reduce the branch delay. Be precise in your answer.',
      pattern: 'The MIPS-side twin of the Hamacher branch-penalty reduction question (Fall 2024 Q2(a), Spring 2023 Q1(e)) — same idea: resolve the branch earlier in the pipeline.',
      think: [
        'Penalty 3 means three wrong-path instructions are in flight when the branch decides in MEM. The fix the figure’s hardware suggests: **decide the branch in the Decode stage** — a dedicated comparator and branch-target adder in ID, plus the hazard unit’s IF.Flush to kill the single wrong instruction. Penalty drops to 1.',
      ],
      solution: [
        { type: 'timing', columns: 9, rows: [
          { label: 'beq (decision in MEM)', cells: ['F', 'D', 'E', 'M', 'W', '', '', '', ''] },
          { label: 'wrong path 1', cells: ['', { t: 'F', dim: true }, { t: 'D', dim: true }, { t: 'E', dim: true }, '', '', '', '', ''] },
          { label: 'wrong path 2', cells: ['', '', { t: 'F', dim: true }, { t: 'D', dim: true }, '', '', '', '', ''] },
          { label: 'wrong path 3', cells: ['', '', '', { t: 'F', dim: true }, '', '', '', '', ''] },
          { label: 'target', cells: ['', '', '', '', 'F', 'D', 'E', 'M', 'W'] },
        ], caption: 'A taken branch resolves at the end of MEM in cycle 4. Fetches in cycles 2–4 are discarded. Target fetch starts in cycle 5, three cycles later than the ideal cycle 2.' },
        { type: 'p', text: '**Solution — move the branch decision into the Decode (ID) stage**, with dedicated hardware that does not touch the main pipeline path:' },
        { type: 'steps', items: [
          'Add a **comparator in ID** that tests register equality directly on the register-file read outputs (for beq) — no ALU pass needed.',
          'Add a **dedicated branch-target adder in ID** computing PC + 4 + (offset ≪ 2) in parallel with the comparison.',
          'If the branch is taken, the **hazard detection unit asserts IF.Flush** (the signal shown in Fig. 2), turning the one wrongly fetched instruction into a bubble and redirecting the PC to the target.',
        ] },
        { type: 'timing', columns: 7, rows: [
          { label: 'beq (decision in ID)', cells: ['F', 'D', 'E', 'M', 'W', '', ''] },
          { label: 'wrong path 1', cells: ['', { t: 'F', dim: true }, '', '', '', '', ''] },
          { label: 'target', cells: ['', '', 'F', 'D', 'E', 'M', 'W'] },
        ], caption: 'With the decision in ID, only one wrong instruction is in flight → branch penalty 1 cycle.' },
        { type: 'answer', text: ['Add an ID-stage equality comparator + branch-target adder and flush one instruction via IF.Flush: the penalty falls from 3 clock cycles to 1 assuming the branch operands are ready in ID. With early prediction and an available correct target, fetch need not wait for the decision.'] },
      ],
    },
    {
      id: 'Q4a', topic: 'dma', marks: '[4]',
      q: 'As a CPU designer designing a high-performance CPU, you must choose the technique applied at the interface between the CPU and I/O devices. Three approaches are conceivable: Direct Memory Access (DMA), Interrupt Driven I/O, and Programmed I/O. Make your decision after considering the advantages and disadvantages of each strategy.',
      think: 'Ladder of processor involvement: programmed (poll everything) → interrupt (device announces) → DMA (controller moves blocks). For a **high-performance** CPU the answer is DMA for block devices, interrupts for slow ones — justify by counting processor cycles per byte.',
      solution: [
        { type: 'table', head: ['Technique', 'How it works', 'Advantage', 'Disadvantage'], rows: [
          ['Programmed I/O', 'processor polls the status flag and moves every word itself', 'simplest hardware and software', 'processor 100% busy-waiting — worst for a fast CPU'],
          ['Interrupt-driven I/O', 'device interrupts when ready; ISR moves the word', 'processor free between events; good for slow, unpredictable devices', 'still one interrupt + ISR execution **per word**; overhead dominates at high data rates'],
          ['DMA', 'DMA controller moves whole blocks memory ↔ device; processor only initiates and gets one interrupt at the end', 'processor involvement per **block**, not per word — highest performance', 'extra controller hardware; bus arbitration with the processor (cycle stealing or burst)'],
        ] },
        { type: 'p', text: '**Decision:** for a high-performance CPU, use **DMA** for block-transfer devices (disk, network, display) — the per-word interrupt overhead of the other two would starve the processor. Keep **interrupt-driven I/O** for slow sporadic devices (keyboard), and avoid program-controlled I/O except for trivial one-shot transfers. A real system uses all three, matched to device speed.' },
        { type: 'answer', text: ['DMA for high-speed block devices (processor freed from per-word transfers), interrupts for slow devices, programmed I/O only where simplicity beats performance.'] },
      ],
    },
    {
      id: 'Q4b', topic: 'mips', marks: '[6]', flagged: true,
      q: 'You are asked to design a new instruction in MIPS that performs arithmetic and logic operations between the content of a register and a memory location, and then stores the result back to the same register. For example, ORm $t0, 1000($s2) would fetch the content of memory location 1000+($s2) and logical OR it to the content of $t0. Each such instruction can potentially eliminate the need for one load instruction. Examine Fig. 3 (single-cycle datapath) and identify the required changes.',
      think: [
        'Trace the datapath stages a load already uses (register read → ALU address → memory read → writeback) and see what’s missing: the **second operand** ($t0) and the **operation** on the memory data. That means: read two registers, add a second ALU after memory (or reuse the main ALU in a second pass), and widen the writeback MUX.',
      ],
      solution: [
        { type: 'steps', items: [
          '**Instruction format:** keep the I-type layout of `lw` (opcode, rs = $s2, rt = $t0, offset 1000) — rs supplies the base, rt the register operand; a new opcode selects the operation (ORm/ADDm/…).',
          '**Register read:** unchanged — rs and rt are already both read.',
          '**Address path:** unchanged — ALU computes 1000 + [rs] as for a load.',
          '**Memory:** unchanged — data memory is read at that address.',
          '**NEW — operation stage:** add a second ALU (or function unit) after data memory that combines the memory output with the **rt value** read in step 2 (rt must now be carried down the pipeline/register to this point).',
          '**Writeback:** the result goes to the register whose number is rt (not rd) — route rt through the pipeline and use it at the register-file write port.',
          '**Control:** new opcode → control signals for the second ALU’s operation and the MUX selecting its output for writeback.',
        ] },
        { type: 'p', text: 'Net effect: one instruction does what previously needed `lw` + `or` — one less instruction per such operation (the point the question highlights), at the cost of the extra function unit and a slightly longer cycle if the second ALU is placed in the critical path.' },
        { type: 'answer', text: ['Changes: carry rt to a second ALU placed after data memory, OR the memory word with [rt], and write the result back to rt — new opcode + control signals; address path untouched.'] },
      ],
    },
    {
      id: 'Q4c', topic: 'hamming', marks: '[4]', flagged: true,
      q: 'A 00110011-bit stream is encoded and transmitted over a noisy channel. During Viterbi decoding at the receiver, the bitstream found is 00100011 with a single bit error. Apply the Hamming code algorithm to identify and correct the single-bit error. In addition, explain the procedure to detect double-bit errors in the bit message.',
      think: [
        'The two displayed words also form a valid SECDED(8,4) example if treated as already encoded. Under that convention, positions 1, 2 and 4 are Hamming checks and position 8 is overall parity. Recompute each check over its positions; the syndrome (s4s2s1) **is** the position of the error; the overall parity bit separates single from double errors.',
      ],
      solution: [
        { type: 'p', text: 'First interpret the strings as encoded SECDED(8,4) words. Received 00100011 has bits 0, 0, 1, 0, 0, 0, 1, 1, with even parity assumed.' },
        { type: 'table', head: ['Check bit', 'Covers positions', 'Received sum', 'Parity'], rows: [
          ['p1', '1, 3, 5, 7', '0 + 1 + 0 + 1 = 2', 'even → s1 = 0'],
          ['p2', '2, 3, 6, 7', '0 + 1 + 0 + 1 = 2', 'even → s2 = 0'],
          ['p4', '4, 5, 6, 7', '0 + 0 + 0 + 1 = 1', 'odd → s4 = 1'],
          ['p8 (overall)', 'all 8 bits', '0+0+1+0+0+0+1+1 = 3', 'odd → parity violation'],
        ], boldFirst: true },
        { type: 'steps', items: [
          'Syndrome = (s4, s2, s1) = **100₂ = 4** → the error is at bit position 4.',
          'Overall parity is violated (odd) → single error, so it is correctable.',
          'Flip bit 4 of 00100011 → **00110011** — the transmitted word ✓.',
        ] },
        { type: 'p', text: '**Double-error detection:** with the extra overall parity bit: if the syndrome is **non-zero but the overall parity is even**, two bits are wrong — detected but **not correctable** (the syndrome of two errors XORs into a third position that cannot be trusted). Syndrome zero + odd overall parity means only the parity bit itself flipped.' },
        { type: 'note', title: 'Which reading? Test the transmitted word first', text: [
          'Check whether the transmitted string already satisfies the Hamming checks. Here 00110011 does: p1, p2 and p4 are even and the overall parity is even. So it is a valid SECDED(8,4) **codeword**, and the received string can be checked directly, as above.',
          'In Spring 2022 Q3(a) the transmitted 10100110 fails the checks, so it must be the **payload**: you add four parity bits (12-bit codeword) first. Same algorithm, different starting point.',
        ] },
        { type: 'answer', text: ['In the SECDED(8,4) reading, syndrome 100 → error at bit 4 → corrected word 00110011. Double errors: syndrome ≠ 0 with even overall parity → detected, uncorrectable.'] },
      ],
    },
    {
      id: 'Q5a', topic: 'prog-io', marks: '[4]',
      q: 'Contrast a memory map system with an isolated I/O system.',
      think: 'Same table as the Chapter 4 lecture: compare the two on address space, instructions, software, address lines and why you would choose each. “Contrast” means every row needs both columns.',
      solution: [
        { type: 'table', head: ['', 'Memory-mapped I/O', 'Isolated (I/O-mapped) I/O'], rows: [
          ['Address space', 'I/O registers share the **memory** address space', 'separate I/O address space'],
          ['Instructions', 'any memory instruction transfers data (`MOVE DATAIN, R0`)', 'special `IN`/`OUT` instructions'],
          ['Software', 'simpler — one instruction set for both', 'slightly more complex'],
          ['Address lines', 'full address width used by devices', 'fewer lines may suffice; lines can be shared with memory using a control signal to say which space is addressed'],
          ['Rationale', 'uniform treatment of registers and memory', 'devices are slow and few — treating them specially is natural and saves decode hardware'],
        ] },
        { type: 'answer', text: ['Memory-mapped: one shared address space, ordinary instructions, simpler software. Isolated: separate space + special instructions, fewer address lines, at the cost of two instruction worlds.'] },
      ],
    },
    {
      id: 'Q5b', topic: 'fp', marks: '[6]', flagged: true,
      q: 'b) Answer the following:\ni) Given the 32-bit pattern 1100 1101 0010 1000 0000 0000 0011 1001, write the corresponding single precision floating-point number and the corresponding two’s complement integer.\nii) Explain the use of guard, round and sticky bits during floating point arithmetic.',
      think: [
        '(i) is two decodes of the same word — split S/E/F on the 1-8-23 boundary for IEEE, then invert+1 for the two’s complement magnitude. (ii) is the precision story: bits kept during alignment so rounding is correct.',
      ],
      solution: [
        { type: 'h', text: 'i) The two interpretations' },
        { type: 'steps', items: [
          'Split: S = 1; E = `10011010` = 154; F = `01010000000000000111001`.',
          'True exponent = 154 − 127 = **27**; mantissa = 1 + 2^-2 + 2^-4 + 2^-18 + 2^-19 + 2^-20 + 2^-23 = 1.3125067949….',
          'Value = −1.3125067949… × 2^27 = **−176,161,680**.',
          'Two’s complement: negative (MSB = 1). Magnitude = 2^32 − value = invert and add 1: `00110010110101111111111111000111` = 0x32D7FFC7 = 853,016,519.',
          'Integer value = **−853,016,519**.',
        ] },
        { type: 'h', text: 'ii) Guard, round and sticky bits' },
        { type: 'list', items: [
          'Floating-point ops first **align exponents**, which right-shifts the smaller mantissa — bits would fall off the end.',
          'The hardware keeps three extra bits below the stored fraction: **guard** (first bit shifted out), **round** (second), **sticky** (the OR of **everything** shifted out beyond them, so any lost 1 is remembered).',
          'At the **rounding** step these three decide round-up or not — e.g. with round-to-nearest-even: values above the halfway point (guard = 1, more set) round up; exactly halfway (guard = 1, round = sticky = 0) rounds to even.',
          'They exist only **during the operation**; the stored result is back to the 23-bit fraction — but the answer is as if the arithmetic had been done at full precision.',
        ] },
        { type: 'answer', text: ['i) FP = −176,161,680; two’s complement = −853,016,519. ii) Guard/round/sticky preserve the shifted-out information needed for correct rounding of the 23-bit result.'] },
      ],
    },
    {
      id: 'Q5c', topic: 'misc', marks: '[4]', flagged: true,
      q: 'Explain the necessity of differential signaling in the Quick Path Interconnection (QPI) bus system.',
      think: 'Start from what differential signaling is (a wire pair, the receiver reads the difference), then link each property to what QPI needs: noise rejection, small fast swings and low EMI on high-speed point-to-point links.',
      solution: [
        { type: 'list', items: [
          '**Differential signaling** transmits each bit as a **pair** of wires (D+ and D−) carrying opposite voltages; the receiver reads the **difference**.',
          '**Noise immunity:** interference couples onto both wires equally (common-mode) and cancels in the subtraction — critical at QPI’s multi-GHz data rates over motherboard traces.',
          '**Small swings:** the difference, not an absolute voltage, carries information, so voltage swings can be tiny → faster edge transitions, lower power, less EMI.',
          '**Necessity in QPI:** point-to-point links at high frequency (vs the older shared single-ended front-side bus) could not meet timing/noise budgets single-ended; differential pairs make the speed and reliability possible at the cost of double the wires.',
        ] },
        { type: 'answer', text: ['Differential pairs reject common-mode noise, allow small fast swings, and cut EMI — the properties QPI’s high-speed point-to-point links need.'] },
      ],
    },
    {
      id: 'Q6a', topic: 'fp', marks: '[4]', flagged: true,
      q: 'Explain how a denormalized number is represented. Provide the highest positive, lowest positive, highest negative, and lowest negative single precision denormalized numbers.',
      think: 'Exponent field 0 means no hidden 1 and a fixed exponent of −126. The four extremes come from F = all 1s (largest magnitude) and F = 0…01 (smallest), each with S = 0 and S = 1.',
      solution: [
        { type: 'p', text: 'When the exponent field is all zeros and the fraction is non-zero, the IEEE single-precision number is **denormalized**: there is **no hidden 1**, and the exponent is fixed at the minimum, −126:' },
        { type: 'pre', text: 'value = (−1)^S × 0.F × 2^(−126)' },
        { type: 'p', text: 'Denormals fill the gap between 0 and the smallest normalized number (2^−126), losing precision as they approach zero (leading fraction zeros).' },
        { type: 'table', head: ['Extreme', 'S / F', 'Value'], rows: [
          ['Highest positive', 'S = 0, F = all 1s', '(1 − 2^−23) × 2^−126 ≈ 1.1755 × 10^−38'],
          ['Lowest positive', 'S = 0, F = …0001', '2^−23 × 2^−126 = **2^−149** ≈ 1.4 × 10^−45'],
          ['Highest negative (closest to 0)', 'S = 1, F = …0001', '−2^−149'],
          ['Lowest negative (largest magnitude)', 'S = 1, F = all 1s', '−(1 − 2^−23) × 2^−126'],
        ] },
        { type: 'answer', text: ['Denormalized = exponent field 0, no hidden bit, value (−1)^S × 0.F × 2^−126; extremes ±(1 − 2^−23)·2^−126 and ±2^−149.'] },
      ],
    },
    {
      id: 'Q6b', topic: 'perf', marks: '[6]', flagged: true,
      q: 'You are the lead designer of a new processor. The design and compiler are complete, and now you must decide whether to produce the current design as it stands (μP clock rate 500 MHz) or spend additional time improving it (μP clock rate 600 MHz). Table II gives the instruction classes with their CPI values and frequencies. Choose your option and justify it according to the performance ratio of the options.\nTable II — Current: A CPI 2 (40%), B CPI 3 (25%), C CPI 3 (25%), D CPI 5 (10%). After improvement: A CPI 2 (40%), B CPI 2 (25%), C CPI 3 (25%), D CPI 4 (10%).',
      think: [
        'Compute the class-weighted CPI of each option (S = Σ CPIᵢ·fᵢ), then compare T = N·S/R. The 600 MHz design wins only if its S stays below 1.2× the old S — check: S₁ = 2.80, S₂ = 2.45 and 2.45/2.80 = 0.875 < 1.2, so it wins on both terms.',
      ],
      solution: [
        { type: 'h', text: 'Current design — 500 MHz' },
        { type: 'pre', text: 'S₁ = 2×0.40 + 3×0.25 + 3×0.25 + 5×0.10\n   = 0.80 + 0.75 + 0.75 + 0.50 = 2.80 cycles/instruction\nT₁ = N × 2.80 / 500 MHz' },
        { type: 'h', text: 'Improved design — 600 MHz' },
        { type: 'pre', text: 'S₂ = 2×0.40 + 2×0.25 + 3×0.25 + 4×0.10\n   = 0.80 + 0.50 + 0.75 + 0.40 = 2.45 cycles/instruction\nT₂ = N × 2.45 / 600 MHz' },
        { type: 'p', text: 'Performance ratio:' },
        { type: 'pre', text: 'T₂ / T₁ = (2.45 / 600) ÷ (2.80 / 500) = (2.45 × 500) / (2.80 × 600) = 1225 / 1680 ≈ 0.73' },
        { type: 'p', text: 'The improved design runs the same program in 0.73× the time — about **1.37× faster**. Both the higher clock and the lower CPI (classes B and D improved) push in the same direction.' },
        { type: 'answer', text: ['Choose the improved design: S drops 2.80 → 2.45 while R rises 500 → 600 MHz, so T₂/T₁ ≈ 0.73 — roughly 1.37× the performance.'] },
      ],
    },
    {
      id: 'Q6c', topic: 'bus-arb', marks: '[4]',
      q: 'Explain the necessity of bus arbitration in computer organization. Distinguish between centralized and distributed arbitration processes with proper examples.',
      think: 'Necessity first (many possible masters, one bus), then a two-column table. Give one worked example per side: the BR/BG/BBSY grant chain, and the 4-bit OR-ed ID elimination.',
      solution: [
        { type: 'p', text: '**Necessity:** more than one unit can initiate bus transfers — the processor and every DMA controller — but the bus (address/data/control lines) can serve only **one master at a time**; two drivers would corrupt every transfer. Arbitration selects the next master and hands over mastership.' },
        { type: 'table', head: ['', 'Centralized', 'Distributed'], rows: [
          ['Arbiter', 'a **single** bus arbiter (the processor or a separate unit) decides for all', '**all devices** share the arbitration logic — no central arbiter'],
          ['Mechanism', 'shared BR (bus request) and BBSY (busy) lines; the grant BG1 is **daisy-chained**, reaching farther controllers as BG2, BG3…', 'each device has a 4-bit unique ID on shared arbitration lines; the lines show the **logical OR** of all competing IDs; devices compare from the MSB and drop out bit by bit'],
          ['Priority', 'electronic proximity in the grant chain', 'highest competing ID wins (e.g. 0101 OR 0110 = 0111 → 0100 OR 0110 = 0110 → B wins)'],
          ['Reliability', 'arbiter is a single point of failure', 'higher — no central unit to fail'],
        ] },
        { type: 'diagram', id: 'busArbCentralized', caption: 'Centralized arbitration example.' },
        { type: 'diagram', id: 'distributedArb', caption: 'Distributed arbitration example.' },
        { type: 'answer', text: ['One master at a time forces arbitration; centralized = one arbiter + daisy-chained grant (proximity priority), distributed = OR-ed ID lines with MSB elimination (highest ID wins, no central point of failure).'] },
      ],
    },
    {
      id: 'Q7a', topic: 'misc', marks: '[4]', flagged: true,
      q: 'The most recent advancements in the ROM and RAM families are Flash memory and Resistive Random-Access Memory (RRAM). Assume you need to update the BIOS memory on your machine. Compare the efficiency of both memories as BIOS memory.',
      think: 'Define efficiency for a BIOS update: how fast, how fine-grained and how low-energy the rewrite is. Compare the two cells on exactly those points, then give one verdict.',
      solution: [
        { type: 'table', head: ['', 'Flash (NOR flash typically)', 'RRAM (ReRAM)'], rows: [
          ['Cell', 'floating-gate transistor', 'resistive element that switches between high/low resistance'],
          ['Write/erase', 'electrically erased, but a **whole block** at a time; byte/block granularity coarse', 'can be written **bit-wise**, electrically, at low voltage'],
          ['Speed', 'fast read (like ROM), comparatively slow write/erase', 'fast write, low-energy switching'],
          ['Endurance', '~10^5–10^6 program/erase cycles', 'higher endurance demonstrated in research devices'],
          ['Maturity', 'extremely mature, cheap, ubiquitous as firmware storage', 'emerging technology — cost and consistency still catching up'],
        ] },
        { type: 'p', text: 'For a BIOS update, efficiency means how fast and how cheaply (in energy and wear) the new image is written. Flash must erase whole blocks before rewriting them, which is slow and wears the cells. RRAM rewrites individual bits directly, quickly and at low energy. Flash’s advantage is maturity and cost, not efficiency.' },
        { type: 'answer', text: 'RRAM is the more efficient BIOS memory: bit-wise, fast, low-energy writes with no block erase, and higher endurance. Flash is slower to update (block erase, limited erase cycles); it is used today because it is mature and cheap, not because it is more efficient.' },
      ],
    },
    {
      id: 'Q7b', topic: 'ram-chip', marks: '[6]',
      q: 'Draw the block diagram of a SRAM chip of size 64×8 bits using D-flip-flops, address decoder and tri-state buffers.',
      think: '64 words → 6 address lines → 6-to-64 decoder → 64 word lines; 8 columns of D-FFs (one per bit); tri-state output buffers per bit line to the 8 data pins; R/W̄ + CS control.',
      solution: [
        { type: 'diagram', id: 'ramChip', caption: 'Template: redraw with A0–A5 into a 6-to-64 decoder, 64 word lines × 8 columns of D-FF cells, 8 sense/write (tri-state) buffers to D7–D0, plus R/W̄ and CS.' },
        { type: 'list', items: [
          '**Address decoder:** 6 lines A0–A5 decode to 64 word lines W0…W63; exactly one is driven per access (row select).',
          '**Cell array:** 64 × 8 D flip-flops — each row is one 8-bit word sharing a word line; each column is one bit position.',
          '**Read:** the selected row’s flip-flops drive the 8 bit lines through **tri-state buffers** (enabled by CS) onto D7–D0 with R/W̄ = 1.',
          '**Write:** with R/W̄ = 0 and CS active, the D inputs are written into the flip-flops of the selected row at the clock edge.',
          '**Tri-state buffers** let many columns/rows share the data pins without fighting — only the enabled chip drives the bus.',
        ] },
        { type: 'answer', text: '64×8 SRAM = 6-to-64 decoder + 64×8 D-FF array + 8 tri-state I/O buffers, with CS and R/W̄ control — as drawn.' },
      ],
    },
    {
      id: 'Q7c', topic: 'misc', marks: '[4]', flagged: true,
      q: 'Building a new computer architecture requires focusing on its Microarchitecture and Instruction Set Architecture (ISA). Explain their interrelationships and how they influence computer architecture design.',
      think: 'ISA = *what* the machine does (visible to software); microarchitecture = *how* the hardware does it. Then the two-way link: one ISA, many implementations; ISA choices constrain the implementation.',
      solution: [
        { type: 'list', items: [
          '**ISA** = the programmer-visible contract: the instruction set, registers, data types, addressing modes, interrupts behaviour — *what* the machine does.',
          '**Microarchitecture** = *how* the hardware implements that contract: datapath (single-bus/three-bus), pipelining, caches, hardwired vs microprogrammed control.',
          '**Relationship:** one ISA can be implemented by many microarchitectures (a family of compatible processors) — same programs, different speed/cost. Conversely, ISA choices constrain the microarchitecture: complex instructions (CISC) push toward microprogrammed control and longer pipelines; simple fixed-length instructions (RISC) enable deep, efficient pipelines and higher clock rates.',
          '**Design influence:** the ISA is fixed for compatibility across generations (software investment), so designers compete on microarchitecture — each new implementation of the same ISA aims for lower T = N·S/R.',
        ] },
        { type: 'answer', text: 'ISA = the visible interface, microarchitecture = one implementation of it; ISA choice constrains implementation options, and microarchitecture innovation delivers performance within a stable ISA.' },
      ],
    },
  ],
}
