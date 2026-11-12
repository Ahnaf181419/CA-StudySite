// Spring 2022 — pages 2–4 of the paper only (page 1 was not in the folder; the paper
// opens mid-Q2). MIPS/P&H track like Fall 2022; flagged items are outside the current slides.
export default {
  id: 'spring22',
  name: 'Spring 2022 (partial)',
  short: 'S22',
  date: '2022',
  marks: '70 · 3h',
  note: 'Scan starts at page 2, so Q1 and the start of Q2 are missing. Same MIPS track as Fall 2022: datapath modification, Hamming, cache parameters, RAID and floating point.',
  instruction: 'Q3–Q5 are 14 marks each (7 questions total, similar rules to Fall 2022); exact text of Q1–Q2(a) unavailable.',
  format: 'Seven 14-mark questions with long multi-part sub-questions; the cache and pipeline parts overlap heavily with the later Hamacher-track papers.',
  questions: [
    {
      id: 'Q2b', topic: 'mips', marks: '[~4]', flagged: true,
      q: 'Explain the ALU logic(s) to take the decision for the following set-on-less-than instruction: slt $t0, $t3, $t4',
      think: 'slt computes rd = (rs < rt) — here $t0 = ($t3 < $t4) ? 1 : 0. The ALU performs a subtraction and decides from the **sign** of the result — with an overflow correction, because subtracting numbers with opposite signs can overflow and flip the sign.',
      solution: [
        { type: 'steps', items: [
          'The ALU performs `rs − rt` (here $t3 − $t4) with the SUB operation.',
          'If the result is **negative** (sign bit = 1) **and no overflow occurred**, then rs < rt → decision 1.',
          '**Overflow correction:** overflow in subtraction happens only when the operands have **different signs**; the corrected rule is: less-than = (sign of result) XOR (overflow). If the operands have the same sign, overflow cannot occur and the raw sign decides.',
          'The decision (1 or 0) is written to rd ($10): the ALU output mux selects the 1/0 line instead of the subtraction result.',
        ] },
        { type: 'answer', text: ['slt = SUB + sign test with overflow correction: Less = Sign(result) XOR Overflow; the 1-bit answer is written to $t0.'] },
      ],
    },
    {
      id: 'Q3a', topic: 'hamming', marks: '[4]', flagged: true,
      q: 'A 10100110-bit message is encoded and transmitted over a noisy channel. During Viterbi decoding at the receiver, the bit message found is 10110110. Apply the SEC code to detect and correct a single error in the bit message. In addition, explain the procedure to detect double bits error.',

      think: [
        'The displayed 8-bit strings are payloads. Eight payload bits need four Hamming check bits. State the assumption that the parity bits computed for the original payload were received unchanged.',
      ],
      solution: [
        { type: 'p', text: 'Use even parity and number codeword positions 1…12 from the left. Put the payload in positions 3, 5, 6, 7, 9, 10, 11, 12 and reserve 1, 2, 4, 8 for parity. Original payload 10100110 gives parity bits P1=0, P2=0, P4=1, P8=0 and codeword 001101000110.' },
        { type: 'p', text: 'With the received payload 10110110 and those parity bits, the received codeword is 001101100110. Checks 1, 2 and 4 fail; check 8 passes. The syndrome 0111₂ = 7 points to **codeword position 7**, which holds the fourth payload bit.' },
        { type: 'p', text: 'For SECDED, append one overall parity bit to the entire Hamming codeword. Nonzero syndrome with odd overall parity indicates a single error in the Hamming portion. Zero syndrome with odd parity points to the overall parity bit. Nonzero syndrome with even overall parity signals a double error: report it without flipping a bit.' },
        { type: 'answer', text: 'Flip codeword position 7 (payload bit 4) to recover 10100110. The syndrome needs the parity bits; here they were reconstructed from the given original payload.' },
      ],
    },
    {
      id: 'Q3b', topic: 'cache', marks: '[6]',
      q: 'Cache size 1 KB, block size 8 B, direct-mapped scheme. Determine the tag, index and byte offset bits from a 16-bit memory address. For the main memory address 1100 0011 0011 0100, give the corresponding cache line number.',
      think: '16-bit address, byte addressing: offset = log2(8) = 3; lines = 1 KB/8 B = 128 → index = 7; tag = 16 − 10 = 6. Cut the address, cross-check with block mod 128.',
      solution: [
        { type: 'pre', text: 'offset = log2(8)  = 3 bits\nindex  = log2(128) = 7 bits   (1 KB ÷ 8 B = 128 lines)\ntag    = 16 − 3 − 7 = 6 bits\n\naddress  1100 0011 0011 0100\nsplit    110000 | 1100110 | 100\ntag=48    index=102   offset=4' },
        { type: 'p', text: 'Check: block number = 0xC334 ÷ 8 = 0x1866 = 6246; 6246 mod 128 = 102 ✓.' },
        { type: 'answer', text: ['Tag 6 / index 7 / offset 3 bits; the address maps to **cache line 102** (byte 4 within its block), stored tag = 48 (110000).'] },
      ],
    },
    {
      id: 'Q3c', topic: 'vmem', marks: '[4]', flagged: true,
      q: 'Logical and physical memory addresses are used in the virtual memory scheme. Choose which one (logical/physical) is mapped as the cache address by direct-mapped or fully associative data caches. Express the reasons for your choice.',
      think: 'The eternal trade: virtual addressing = no translation before cache access (fast hit path) but suffers the **synonym/alias** problem (two virtual addresses → one physical location) and needs flushing on context switch. Physical = one canonical address, no aliases, no flush — at the cost of translating first.',
      solution: [
        { type: 'p', text: '**Choice: physical addresses** for the cache tags (the mainstream design).' },
        { type: 'list', items: [
          '**No aliasing:** a memory location has exactly one physical address, so it can live in only one cache place. With virtual tags, two programs mapping the same page at different virtual addresses could hold **two copies** (synonyms) that drift apart.',
          '**No flush on context switch:** virtual tags belong to a process; switching processes would require invalidating the cache. Physical tags survive any switch.',
          '**Protection:** the MMU translation doubles as the permission check — caching virtual addresses could bypass it.',
          'The cost: the address must be translated before (or in parallel with) the cache lookup — mitigated in practice by **virtually-indexed, physically-tagged** caches, which index with the low (translation-invariant) bits and compare physical tags.',
        ] },
        { type: 'answer', text: ['Cache physical addresses: one location = one cache entry (no synonyms), no context-switch flush, MMU checks protection; translation cost is hidden by virtually-indexed/physically-tagged designs.'] },
      ],
    },
    {
      id: 'Q4a', topic: 'hazards', marks: '[4]',
      q: 'Examine the following MIPS instructions for a 5-stage pipelined processor with fixed 3 ns cycle time:\nand $t3, $t2, $t1\nand $t5, $t3, $t4\nlw $t3, 8($t5)\nor $t6, $t6, $t3\n(i) Detect the location of data hazards. (ii) Remove the hazards using NOP operations and count the number of NOPs. (iii) Calculate the total execution time using full forwarding (without NOP operations).',
      think: [
        'Underline destinations and sources pair by pair: I2 reads $t3 (written I1), I3 reads $t5 (written I2), I4 reads $t3 (written I3 — a **load**). For NOPs on a 5-stage pipeline: 2 NOPs per ALU dependency, and the load-use pair also needs the values in time (2 NOPs here as well, since the decode then coincides with the load’s writeback cycle). For forwarding: ALU deps forward for free; only the load-use costs 1 stall.',
      ],
      solution: [
        { type: 'table', head: ['Pair', 'Register', 'Type'], rows: [
          ['I1 → I2', '$t3 (and → and)', 'RAW hazard'],
          ['I2 → I3', '$t5 (and → lw address)', 'RAW hazard'],
          ['I3 → I4', '$t3 (lw → or)', 'RAW hazard, **load-use**'],
        ] },
        { type: 'h', text: 'ii) NOP removal' },
        { type: 'pre', text: 'and $t3, $t2, $t1\nNOP\nNOP\nand $t5, $t3, $t4\nNOP\nNOP\nlw  $t3, 8($t5)\nNOP\nNOP\nor  $t6, $t6, $t3' },
        { type: 'p', text: 'Each dependent consumer sits **two** NOPs after its producer — the producer writes in cycle p+4 when it was fetched in cycle p, and the consumer fetched in p+3 reads in p+4. A first-half write and second-half read make that same-cycle transfer possible → hazards removed with **6 NOPs**.' },
        { type: 'h', text: 'iii) Execution time with full forwarding' },
        { type: 'timing', columns: 9, rows: [
          { label: 'I1  and $t3,$t2,$t1', cells: ['F', 'D', 'E', 'M', 'W', '', '', '', ''] },
          { label: 'I2  and $t5,$t3,$t4', cells: ['', 'F', 'D', 'E', 'M', 'W', '', '', ''] },
          { label: 'I3  lw $t3,8($t5)', cells: ['', '', 'F', 'D', 'E', 'M', 'W', '', ''] },
          { label: 'I4  or $t6,$t6,$t3', cells: ['', '', '', 'F', 'D', { t: 'stall', box: true }, 'E', 'M', 'W'] },
        ], caption: 'I1→I2 and I2→I3 are covered by EX→EX forwarding (no stall). I3→I4 is a load-use: one stall cycle (bubble in cycle 6), then the loaded value is forwarded from M/W into E (cycle 7).' },
        { type: 'pre', text: 'cycles = 4 instructions + 4 fill cycles + 1 load-use stall = 9\ntime  = 9 × 3 ns = 27 ns' },
        { type: 'answer', text: ['Hazards: $t3 (I1→I2), $t5 (I2→I3), $t3 (I3→I4, load-use). NOP version: 6 NOPs. Forwarded version: 9 cycles = **27 ns**.'] },
      ],
    },
    {
      id: 'Q4b', topic: 'cache', marks: '[6]',
      q: 'A fully associative cache has 64 B size, block size 4 B and RAM size 16 KB. It has comparators, an encoder and a multiplexer to choose the specific block data for the CPU. (i) Estimate the number of required comparators. (ii) Estimate the number of input and output channels of the encoder. (iii) Estimate the number of required selector bits for the multiplexer. (iv) Illustrate them in a diagram.',
      think: [
        'Blocks = 64/4 = 16 — that one number drives everything: 16 comparators (one per block, full tag compare in parallel), encoder 16-in → 4-out (winning block number), MUX 16-to-1 → 4 selector bits, plus 2 offset bits select the byte within the 4-byte block.',
      ],
      solution: [
        { type: 'steps', items: [
          'Blocks in cache = 64 B ÷ 4 B = **16 blocks**; RAM 16 KB with 4 B blocks → 4096 memory blocks → address = 14 bits = tag (12) + offset (2) — full associativity has **no index** field.',
          '**Comparators:** one per cache block, each comparing the 12-bit tag of its block with the address tag → **16 comparators** (12 bits wide), all in parallel.',
          '**Encoder:** the comparator outputs (one-hot, at most one hit) encode into the block number → **16 inputs, log2 16 = 4 outputs**.',
          '**Multiplexer:** selects the 32-bit data of the winning block from the 16 blocks → **4 selector bits** (from the encoder); the **2 offset bits** then select the byte within the 4-byte block on the data path (6 select bits in total if you count the byte MUX).',
        ] },
        { type: 'pre', text: 'Address tag[11:0] ─→ 16 parallel tag comparators\nStored tags[11:0] ─→ (one comparator per line)\n                          │ match AND valid, per line\n                          ▼\n                     16 match bits ─────────→ OR ─→ hit\n                          │\n                          ▼\n                      16:4 encoder\n                          │ 4-bit line select\n                          ▼\n16 stored 32-bit blocks → 16:1 block MUX\n                          │ selected 32-bit block\n                          ▼\nOffset[1:0] ────────────→ 4:1 byte MUX ─→ CPU (on hit)', caption: 'The encoder selects a line only when hit is asserted. The address has no cache index field.' },
        { type: 'answer', text: ['16 comparators (12-bit), a 16-input/4-output encoder, and 4 select bits for the 16-to-1 block MUX. Two separate offset bits select a byte within the winning block.'] },
      ],
    },
    {
      id: 'Q4c', topic: 'misc', marks: '[4]', flagged: true,
      q: 'Compare the performance of write operations achieved by a RAID level 5 organization with that achieved by a RAID level 1 organization.',
      solution: [
        { type: 'table', head: ['', 'RAID 1 (mirroring)', 'RAID 5 (distributed parity)'], rows: [
          ['Layout', 'every disk has a full mirror copy', 'parity blocks striped across all disks'],
          ['Single-block overwrite', '2 writes: new data and its mirror, possibly in parallel', 'Read-modify-write: read old data and old parity, then write new data and new parity (2 reads + 2 writes). Reconstruct-write can read the other data blocks in the stripe and then write the updated data and parity.'],
          ['Full-stripe write', '2 physical writes per logical block', 'With N drives, write N−1 new data blocks and one new parity block. No old data or parity needs to be read.'],
          ['Read performance', 'excellent (either copy)', 'excellent (N-disk striping)'],
          ['Capacity / fault tolerance', '50% capacity cost; 1 disk per mirror may fail', '~(N−1)/N usable; 1 disk may fail'],
        ] },
        { type: 'p', text: '**Write-performance comparison:** RAID 1 usually has lower overhead for small random overwrites. For full-stripe writes, RAID 5 adds 1/(N−1) parity blocks per logical data block on average, compared with one extra mirror block per logical block in RAID 1. Measured speed also depends on stripe coverage, drives and controller.' },
        { type: 'answer', text: ['RAID 1 writes two copies. RAID 5 pays extra reads on small read-modify-writes, but a full-stripe write computes parity from the new data and writes only one extra block per stripe.'] },
      ],
    },
    {
      id: 'Q5a', topic: 'perf', marks: '[4]',
      q: 'Assuming that N instructions are executed, and all N instructions are load (lw) instructions, each stage has fixed clock length (3 ns), evaluate the speedup of a pipelined implementation without any hazard when compared to a single-cycle implementation.',
      solution: [
        { type: 'pre', text: 'single-cycle:  T_single = N × 5 × 3 ns = 15N ns\npipelined:     T_pipe  = 5 × 3 + (N − 1) × 3 = (3N + 12) ns\n\nspeedup = 15N / (3N + 12) = 5N / (N + 2)·2 → simplify: = 5N/(N+4)' },
        { type: 'p', text: 'Careful arithmetic: T_pipe = 15 + 3(N−1) = 3N + 12 → speedup = 15N/(3N+12) = 5N/(N+4). For N → ∞ the speedup → **5** (the number of stages); e.g. N = 100 → 500/104 ≈ 4.8.' },
        { type: 'answer', text: ['Speedup = 5N/(N + 4), approaching 5× for large N; slightly less for small N because of the pipeline fill time.'] },
      ],
    },
    {
      id: 'Q5b', topic: 'mips', marks: '[6]', flagged: true,
      q: 'You are asked to design a new instruction in MIPS that performs arithmetic addition between the contents of three registers and stores the result back to the destination register. For example, add3 $t0, $t1, $t2, $t3 fetches $t1, $t2, $t3, adds them and writes the result to $t0. Each such instruction can potentially eliminate the need for two add instructions. Examine Figure 1 (single-cycle datapath with control signals) and identify the required changes, especially in the register file and the ALU.',
      solution: [
        { type: 'steps', items: [
          '**Register file:** needs a **third read port** — $t1, $t2, $t3 must be read simultaneously (currently two: rs and rt). The third source field comes from a widened instruction format.',
          '**Instruction format:** the R-type field set (op, rs, rt, rd, shamt, funct) has room for only two source registers; a 3-source instruction needs an extra 5-bit field (e.g. reuse shamt + extend to a new format, or use I-format space) — the decoder must route all three register numbers.',
          '**ALU:** becomes a **two-adder tree** (a 3-input adder): (a + b) + c with carry propagation across both stages, instead of the current 2-input ALU.',
          '**Writeback:** unchanged path — the sum is muxed into the register-file write port for rd.',
          '**Control:** new opcode → assert the three read enables and select the 3-input add path.',
          'Trade-off (say it): the cycle time may grow to fit the second adder in one cycle — which is why real ISAs leave add3 to compilers.',
        ] },
        { type: 'answer', text: ['Add a third register-file read port + third source field, replace the ALU with a 3-input (two-stage) adder, extend the control; datapath otherwise as the single-cycle figure.'] },
      ],
    },
    {
      id: 'Q5c', topic: 'mips', marks: '[4]', flagged: true,
      q: 'Examine the datapath and control signals in Figure 1, where the Main Control Unit creates a 2-bit ALUOp signal sent to the ALU Control Unit, which generates 3-bit ALU control signals. You are asked to build a new datapath that does not include the ALU Control Unit — the 3-bit ALU signals will be generated directly by the Main Control Unit. Write the contents of your analysis report evaluating the advantages and disadvantages of both models.',
      solution: [
        { type: 'table', head: ['', 'Two-level (current: Main CU → ALUOp → ALU CU)', 'Single-level (Main CU drives ALU control directly)'], rows: [
          ['Signals', 'Main CU outputs 2 bits; ALU CU expands them + funct field to 3 bits', 'Main CU must output the full 3-bit ALU control per instruction'],
          ['Hardware', 'small decoder duplicated close to the ALU; main CU stays small', 'main CU grows: the ALU truth table folds into its logic'],
          ['R-type funct handling', 'ALU CU reads the 6-bit funct field — main CU needs no funct decoding', 'main CU must also decode funct → wider inputs, more complex'],
          ['Critical path', 'two short stages (control → ALU CU → ALU)', 'one control unit output drives the ALU — potentially shorter, but the CU itself is bigger and slower'],
          ['Modularity / design', 'clean separation: ISA-level control vs ALU micro-control', 'one monolithic controller; changes to ALU ops ripple into the main CU'],
        ] },
        { type: 'p', text: '**Conclusion for the report:** keep the two-level scheme — the small extra delay of the ALU Control Unit buys modularity and a simpler Main Control Unit; going single-level saves one small block but enlarges and complicates the main controller, especially for R-type funct decoding.' },
        { type: 'answer', text: ['Two-level: modular, small main CU, funct handled locally. Single-level: one fewer block but a bigger, slower, less modular controller — the two-level design is the better engineering trade-off.'] },
      ],
    },
    {
      id: 'Q6a', topic: 'dma', marks: '[4]',
      q: 'The processor initiates the communication with the DMA. Explain what necessary information is required from the processor to start transferring data from memory to an I/O device.',
      solution: [
        { type: 'steps', items: [
          '**Starting address** of the memory block to transfer.',
          '**Number of words** in the block (word count).',
          '**Direction of transfer** — memory → I/O device or I/O device → memory (read/write for the DMA interface).',
        ] },
        { type: 'p', text: 'With these three, the DMA controller supplies each word’s address and control signals itself, increments the address, counts down the words, and interrupts the processor only when the block is complete — the initiating program is suspended (blocked) meanwhile.' },
        { type: 'answer', text: ['Starting address + word count + direction; afterwards the controller runs autonomously and interrupts on completion.'] },
      ],
    },
    {
      id: 'Q6b', topic: 'fp', marks: '[6]', flagged: true,
      q: 'Given the bit pattern 10101101 11110010 00000000 00000000, determine their representation assuming it is (a) a two’s complement integer, (b) an unsigned integer, (c) a single precision floating-point number.',
      solution: [
        { type: 'steps', items: [
          '**Two’s complement:** MSB = 1 → negative. Magnitude = invert + 1 = `01010010 00001110 00000000 00000000` = 0x520E0000 = 1,376,649,216 → value = **−1,376,649,216**.',
          '**Unsigned:** 0xADF20000 = 2,918,318,080 (check: 2^32 − 2,918,318,080 = 1,376,649,216 ✓ consistent with (a)).',
          '**IEEE single precision:** S = 1; E = `01011011` = 91 → exponent = 91 − 127 = −36; F = `1110010…0` → mantissa = 1 + 2^-1 + 2^-2 + 2^-3 + 2^-6 = 1.890625. Value = **−1.890625 × 2^−36 ≈ −2.751 × 10^−11**.',
        ] },
        { type: 'answer', text: ['(a) −1,376,649,216 · (b) 2,918,318,080 · (c) −1.890625 × 2^−36 ≈ −2.751 × 10^−11.'] },
      ],
    },
    {
      id: 'Q6c', topic: 'ram-chip', marks: '[4]',
      q: 'The size of a DRAM memory is 64K×1. Identify the total number of bits for the row number, the total number of bits for the column numbers, and the highest address that the refresh counter generates.',
      solution: [
        { type: 'steps', items: [
          '64K cells = 2^16, arranged as a square array: 256 × 256 (2^8 × 2^8).',
          'Row address = **8 bits**, column address = **8 bits** (multiplexed onto the same pins, RAS then CAS).',
          'Refresh proceeds **row by row** — the refresh counter must reach every row → highest address = 255 (i.e. it counts 0…255 through **8 bits**).',
        ] },
        { type: 'answer', text: ['8 row bits + 8 column bits (256×256 array); refresh counter counts 0–255 → highest address 255.'] },
      ],
    },
    {
      id: 'Q6d', topic: 'ram-chip', marks: '[4]',
      q: 'Identify the reasons why DRAM is an analog device and SRAM is a digital device.',
      solution: [
        { type: 'list', items: [
          '**SRAM cell = a flip-flop**: two cross-coupled inverters holding one of **two stable voltage states** — a genuinely digital storage element; readout is a logic level.',
          '**DRAM cell = one transistor + one capacitor**: the bit is a **packet of charge** on the capacitor — a continuously decaying analog quantity. Reading it perturbs the charge, and the tiny voltage change must be sensed against a reference and amplified by an analog **sense amplifier** before it becomes a 1 or 0.',
          'Because the charge leaks, DRAM must be **refreshed** periodically (recharged through the sense amplifiers) — behaviour of an analog level, not a stable digital state.',
        ] },
        { type: 'answer', text: ['SRAM stores a digital state (flip-flop); DRAM stores an analog charge level that leaks, needs analog sensing and periodic refresh — hence “analog device”.'] },
      ],
    },
    {
      id: 'Q6e', topic: 'perf', marks: '[6]', flagged: true,
      q: 'Consider an atomic motion modeling application that runs on machine M1. The application has three instruction classes — floating-point (F), integer arithmetic (I) and all others (N) — with the CPI values and frequencies of Table II. M1’s clock rate is 800 MHz. Calculate the execution time for the application on M1.\nTable II — Integer arithmetic (I): CPI 5.2, frequency 30%. Floating-point (F): CPI 2.0, 30%. All others (N): CPI 2.4, 40%.',
      think: [
        'Weight each class CPI by its frequency to get the average S, then T = N·S/R. The instruction count N is not given — carry it symbolically and also give the per-instruction figure so the answer is complete either way.',
      ],
      solution: [
        { type: 'steps', items: [
          'Average cycles per instruction: S = 5.2×0.30 + 2.0×0.30 + 2.4×0.40 = 1.56 + 0.60 + 0.96 = **3.12 cycles/instruction**.',
          'Clock rate 800 MHz → cycle time 1.25 ns → time per instruction = 3.12 × 1.25 ns = **3.9 ns**.',
          'Execution time for the whole application: T = N × 3.12 / (8×10⁸) = N × 3.9 ns.',
          'Worked scale: for N = 10⁹ instructions, T = 10⁹ × 3.9 ns = **3.9 s**.',
        ] },
        { type: 'answer', text: ['S = 3.12 cycles/instruction → T = N × 3.12 / 800 MHz = N × 3.9 ns (3.9 s if N = 10⁹).'] },
      ],
    },
    {
      id: 'Q6f', topic: 'misc', marks: '[4]', flagged: true,
      q: 'The rate of improvement in processor speed (55% per year) is much higher than the improvement in memory speed (7% per year). Express your opinion in the context of reducing the improvement gap between processor and memory speed.',
      solution: [
        { type: 'steps', items: [
          'Quantify the gap: after n years the processor/memory speed ratio grows by (1.55 / 1.07)^n ≈ **1.45^n** — the gap **compounds**, so memory becomes the bottleneck at an accelerating rate.',
          'Closing it architecturally (the standard answers): **cache hierarchies** (L1 on-chip, L2, L3) exploiting locality so most accesses never reach DRAM; wider/faster DRAM interfaces (SDRAM, DDR generations, channels); **prefetching** and out-of-order execution to hide latency; **integrated memory controllers** to cut access delay.',
          'The realistic goal is not matching DRAM to CPU speed but **hiding** the difference — which is why the memory-hierarchy chapter exists at all.',
        ] },
        { type: 'answer', text: ['The gap grows ~1.45× per year compounding; caches/hierarchy, faster SDRAM interfaces, prefetch and latency hiding keep the effective memory speed close to processor demand.'] },
      ],
    },
  ],
}
