// Spring 2025 — both CA paper pages (2-page scan, complete for this subject).
// Hamacher-track syllabus; every question reuses a pattern the older papers already ask.
export default {
  id: 'spring25',
  name: 'Spring 2025',
  short: 'S25',
  date: '12/05/2026',
  marks: '50 · 2h30m',
  note: 'The newest paper — and the strongest validation of the current syllabus: branch prediction, priority schemes, two-level cache arithmetic, the three mapping splits, hardwired widths, sync/async timing and locality are all questions this site already teaches. Only the half-precision addition is new.',
  instruction: 'Q1 any 3 of 4 × 6 = 18 · Q2 both × 10 = 20 · Q3 any 3 of 4 × 4 = 12.',
  format: 'Same shape as Fall 2024: concepts (Q1), two guaranteed long worked problems (Q2), short applications (Q3).',
  questions: [
    {
      id: 'Q1a', topic: 'branch', marks: '[6]', inNotes: true,
      q: `Consider the following program.
L1  DEC R2
    BRANCH>0 L2
    ADD R1, R3
    DEC R3
    BRANCH L1
L2  SUB R3, R5
    INC R4
If branch prediction is used to reduce the branch penalty associated with conditional branches, identify which prediction strategy (predicting the branch as taken or not taken) would be more effective for this program. Justify your answer using the statement: “Hardware may decide how to predict a branch by checking whether the branch target address is lower or higher than the address of the branch instruction.” Additionally, determine whether these instructions will face any hazard in pipelining. If it does, suggest how to solve the hazard in hardware.`,
      pattern: 'The direction heuristic (backward = taken, forward = not taken) is the same rule Fall 2024 Q2(a)(IV) asks about; the flag dependency DEC → BRANCH is the notes’ delayed-branch loop in reverse.',
      think: [
        'Two branches, two directions. `BRANCH L1` jumps **backward** (L1 is above it) — a loop-closing branch, taken on every pass. `BRANCH>0 L2` jumps **forward** — an exit branch, skipped on every pass except the last. The quoted hardware rule maps direction straight onto prediction, so the strategy is not one choice but one per direction.',
        'For the hazard: look for an instruction whose result the very next instruction consumes. `DEC R2` sets the flags that `BRANCH>0` tests one line later — that is a data hazard on the condition flags.',
      ],
      solution: [
        { type: 'p', text: '**Prediction per branch (the direction rule).** Hardware compares the branch target address with the branch instruction’s own address:' },
        { type: 'table', head: ['Branch', 'Target vs branch', 'Static prediction', 'Correct…'], rows: [
          ['`BRANCH L1`', 'L1 is at a **lower** address (backward)', '**predict taken**', 'every pass — it is the loop-closing branch and is taken each iteration'],
          ['`BRANCH>0 L2`', 'L2 is at a **higher** address (forward)', '**predict not taken**', 'every pass except the final one — the branch is skipped while the loop body runs and is taken only on exit'],
        ] },
        { type: 'p', text: 'So the more effective strategy for this program is the **direction-based static scheme**: backward branches predicted taken, forward branches predicted not taken. A single global choice is worse in both roles: always-not-taken wastes a fetch slot on every `BRANCH L1`, and always-taken wastes one on every in-loop `BRANCH>0`.' },
        { type: 'h', text: 'Hazard' },
        { type: 'p', text: '`DEC R2` is followed immediately by `BRANCH>0 L2`, which tests the flags DEC produces. In a pipeline the branch needs those flags in its decode/execute stage while DEC’s result is still in flight — a **data hazard on the condition flags** (the same dependency `DEC R3` would create if `BRANCH L1` tested flags instead of being unconditional).' },
        { type: 'diagram', id: 'forwarding', caption: 'Hardware fix — operand (and flag) forwarding: the ALU result/flags of DEC are routed from its execute stage straight into the branch’s execute stage, so the branch no longer waits for the writeback.' },
        { type: 'p', text: 'In hardware: **forwarding paths** (SRC1/SRC2/RSLT-style MUXes, extended to the condition flags) bypass the register file. The software alternative the course also accepts is reordering an independent instruction into the gap or inserting a NOP — but the question asks for the hardware solution.' },
        { type: 'answer', text: ['Predict `BRANCH L1` (backward) taken and `BRANCH>0 L2` (forward) not taken — the target-address direction rule. Hazard: DEC R2 → BRANCH>0 on the condition flags; solved in hardware by forwarding the ALU result/flags past the register file.'] },
      ],
    },
    {
      id: 'Q1b', topic: 'priority', marks: '[6]', inNotes: true,
      q: 'Assume that, out of the following five devices (D2, D0, D3, D1 and D4), all or many share the same IRQ line and may raise interrupts simultaneously. Now, discuss all the mechanisms (with necessary figures) that can handle simultaneous interrupt requests from the set of devices and determine which interrupt is serviced first. For illustration, you can organize the devices in any suitable way to justify your explanation (for example, by placing some devices nearer to the processor, or by grouping them according to different levels of priority).',
      pattern: 'Same question family as Spring 2024 Q3(b) (prioritized daisy chain) and Fall 2024 Q1(a)’s repeated-interrupt approaches — the notes draw all three schemes.',
      think: [
        '“All mechanisms” is the mark scheme: software **polling**, the **daisy chain**, and the **prioritized daisy chain / priority structure** — one figure each. Then answer “who is first” per mechanism, because the paper lets you choose the arrangement: in polling it is your poll order, in a daisy chain it is the device closest to the processor, in a grouped scheme it is the highest level first and proximity inside it.',
      ],
      solution: [
        { type: 'p', text: 'Five devices share interrupt-request lines and may raise requests at the same time. Three mechanisms resolve the simultaneity, each deciding “who is first” differently.' },
        { type: 'table', head: ['Mechanism', 'How it works', 'Who is serviced first'], rows: [
          ['1 — Software polling', 'All devices share one IRQ line. On interrupt the ISR **polls the status registers** in a fixed order and serves the first device whose request bit is set.', 'The device polled **first** — priority is a software decision (e.g. poll D2, then D0, D3, D1, D4 → D2 wins if it requested).'],
          ['2 — Daisy chain', 'The IRQ line is shared; the **INTA acknowledge is chained** through the devices. A device that requested keeps the acknowledge; one that did not passes it along.', 'The requesting device **electrically closest to the processor**. Arranged D2 → D0 → D3 → D1 → D4, D2 wins over all others; D4 wins only if nobody ahead of it requested.'],
          ['3 — Prioritized daisy chain (grouping)', 'Devices are **grouped onto several request lines** (INTR1…INTRp); a **priority arbitration circuit** picks the highest requesting level, and inside each group a daisy chain decides by proximity.', 'The highest-priority **level** first, then proximity inside it. Example: D2, D0 on level 2 (D2 closer), D3, D1, D4 on level 1 (D3 closest) → a simultaneous request from all five services **D2** first, then D0, then D3, D1, D4.'],
        ] },
        { type: 'diagram', id: 'daisyChain', caption: 'Mechanism 2: shared INTR, chained INTA — priority = electronic proximity to the processor.' },
        { type: 'diagram', id: 'prioritizedDaisyChain', caption: 'Mechanism 3: groups on separate INTR lines into a priority arbitration circuit, daisy chains inside each group.' },
        { type: 'p', text: 'With the illustration arrangement above (D2 and D0 on the higher level, D2 nearest; D3, D1, D4 on the lower level in that order), a simultaneous request from **all five** devices services **D2 first**: level 2 beats level 1, and inside level 2 D2 is nearer the processor than D0. If only D1, D4 and D3 request, level 1 is served in chain order: **D3, then D1, then D4**.' },
        { type: 'answer', text: ['Mechanisms: polling (priority = poll order), daisy chain (priority = proximity to the processor), prioritized daisy chain (priority = group level, then proximity). With D2/D0 grouped high (D2 nearer) and D3/D1/D4 grouped low (D3 nearest), all five requesting simultaneously → D2 is serviced first.'] },
      ],
    },
    {
      id: 'Q1c', topic: 'perf', marks: '[6]', inNotes: true,
      q: 'Suppose you have a computer system A with a primary cache that has a cache access time of 2 clock cycles and takes 11 clock cycles as the miss penalty — that is, the time to access information in the main memory. The hit rates for instruction and data are 90% and 85% respectively. You have a second computer system B that has two levels of cache memories (L1 and L2) with access times of 1 clock cycle and 5 clock cycles respectively, and a miss penalty of 16 clock cycles. The miss rates in the 1st cache for instructions and data are 5% and 8% respectively. The hit rates in the 2nd cache for instructions and data are 65% and 75% respectively. Assume that 30 percent of the instructions in a typical program perform a read or a write operation, which means that there are 130 memory accesses for every 100 instructions executed. Identify which of these 2 computer systems (A or B) performs better based on time.',
      pattern: 'The 130-references bookkeeping with instruction/data hit rates is the Chapter 8 slides’ worked example; Spring 2024 Q2(c) and Fall 2023 Q3(d) ask neighbouring versions.',
      think: [
        'Both systems answer the same question: **average cycles per memory access, weighted by how many of the 130 accesses per 100 instructions are instruction fetches (100) and data (30)**. For A: T = C + (1−h)·P per access class. For B: a miss in L1 costs the L2 lookup (5) plus, if L2 also misses, the main-memory penalty (16) — the L2 hit rates are the fractions of L1 misses that stop at L2.',
      ],
      solution: [
        { type: 'h', text: 'System A — single cache, C = 2, P = 11' },
        { type: 'pre', text: 'instruction:  T = 2 + (1 − 0.90) × 11 = 2 + 1.1  = 3.10 cycles\ndata:         T = 2 + (1 − 0.85) × 11 = 2 + 1.65 = 3.65 cycles\nper 100 instructions:\n  100 fetches × 3.10 = 310.0\n   30 accesses × 3.65 = 109.5\n  total              = 419.5 cycles' },
        { type: 'h', text: 'System B — L1 = 1, L2 = 5, memory penalty = 16' },
        { type: 'p', text: 'An L1 miss costs the L2 access; if L2 also misses, the main-memory penalty is added. The L2 hit rates are local — the fraction of references that reach L2 and are found there.' },
        { type: 'pre', text: 'instruction miss path: 5 + (1 − 0.65) × 16 = 5 + 5.6  = 10.6 cycles\ndata miss path:        5 + (1 − 0.75) × 16 = 5 + 4.0  = 9.0 cycles\ninstruction:  T = 1 + 0.05 × 10.6 = 1.53 cycles\ndata:         T = 1 + 0.08 ×  9.0 = 1.72 cycles\nper 100 instructions:\n  100 fetches × 1.53 = 153.0\n   30 accesses × 1.72 =  51.6\n  total              = 204.6 cycles' },
        { type: 'p', text: '**Check on the interpretation:** expanding the local form gives the same number as the global form — 1 + 0.05×5 + (0.05×0.35)×16 = 1 + 0.25 + 0.28 = 1.53 — so the reading of the L2 hit rates does not change the result.' },
        { type: 'answer', text: ['System B is better: 204.6 versus 419.5 cycles per 100 instructions — about 2.05× fewer stall cycles, because most of A’s misses in B never leave the small fast L2.'] },
      ],
    },
    {
      id: 'Q1d', topic: 'bus-arb', marks: '[6]', inNotes: true,
      q: 'Explain how the bus is granted to competing devices (or processes) under: → centralized bus arbitration, and → distributed bus arbitration (where the device numbers serve as their unique IDs). Support your explanation with appropriate diagrams for the arbitration processes.',
      pattern: 'Centralized is the Figure-4 daisy-chain/polling arrangement of Fall 2022 and Fall 2024 Q3(a); distributed with device IDs is the MSB-elimination drill the notes work twice.',
      think: [
        'Two halves. Centralized: one arbiter (usually inside the processor) receives **bus request (BR)** lines and returns **bus grant (BG)** — show the daisy-chained grant version and name BBSY. Distributed: **no arbiter** — every device watches the same lines and runs the same elimination algorithm on its own ID; the wired-OR of all requesting IDs decides, highest (or lowest, per convention) surviving ID wins.',
      ],
      solution: [
        { type: 'h', text: 'Centralized bus arbitration' },
        { type: 'diagram', id: 'busArbCentralized', caption: 'Centralized: BR (bus request) from all masters into a single arbiter, BG (bus grant) daisy-chained or returned per device, BBSY (bus busy) asserted by the current master.' },
        { type: 'steps', items: [
          'A device wanting the bus raises **BR** to the central arbiter (inside the processor).',
          'The arbiter applies its priority rule (fixed, or chain order when the grant is daisy-chained) and issues **BG**.',
          'The granted device asserts **BBSY**, performs its transfer, and releases BBSY — the arbiter then grants the next requester.',
        ] },
        { type: 'p', text: 'Simple and cheap for the devices, but the arbiter is a **single point of failure** and its polling/grant rate limits arbitration speed.' },
        { type: 'h', text: 'Distributed bus arbitration' },
        { type: 'diagram', id: 'distributedArb', caption: 'Distributed: open-collector Begin/End-arbitration lines shared by all devices; each device drives and senses the pattern of its own ID bits.' },
        { type: 'steps', items: [
          'A device raises **Begin-arbitration** and places its ID on the shared arbitration lines (wired-OR — any device driving a 1 makes the line 1).',
          'Starting from the **most significant bit**, every contender compares its bit with the line value: if it drove 0 but the line reads 1, some higher ID is present and the device **eliminates itself**.',
          'Eliminations continue bit by bit (End-arbitration); the only device never contradicted **wins** and asserts BBSY. All of this happens in a few bus cycles with no central arbiter.',
        ] },
        { type: 'p', text: 'Worked micro-example (the notes’ drill): IDs 5 (`0101`), 12 (`1100`), 9 (`1001`) request. Wired-OR pattern `1101`. Bit 3: device 5 sees its 0 against a 1 → out. Bit 2: device 9 sees 0 against 1 → out. Device **12** survives and wins.' },
        { type: 'answer', text: ['Centralized: a single arbiter grants the bus via BR/BG/BBSY — simple, but one arbiter decides and can fail. Distributed: devices arbitrate among themselves by driving and sensing the shared ID lines bit by bit (wired-OR, MSB first); the highest surviving ID takes the bus with no arbiter at all.'] },
      ],
    },
    {
      id: 'Q2a', topic: 'fp', marks: '[10]', inNotes: true,
      q: 'IEEE 754-2008 contains a half precision that is only 16 bits wide. The leftmost bit is still the sign bit, the exponent is 5 bits wide and has a bias of 15, and the mantissa is 10 bits long. A hidden 1 is assumed. Calculate the sum of 2.6125 × 10¹ and 4.150390625 × 10⁰ by hand, assuming A and B are stored in the 16-bit half precision. Assume 1 guard bit, 1 round bit, and 1 sticky bit, and round to the nearest even. Show all the steps.',
      pattern: 'First half-precision question in the bank — but it is the slides’ §3.5 addition flow (align → add → GRS round) with smaller fields; the same guard/round/sticky discipline as the 2022 floating-point questions.',
      think: [
        'Half precision just shrinks the fields: 1 sign, 5 exponent (bias 15), 10 mantissa. Everything else is the standard add: convert both, **round B on storage first**, align to the bigger exponent, add, then round the result with guard/round/sticky and round-to-nearest-even. Show both roundings — that is where the marks are.',
      ],
      solution: [
        { type: 'h', text: 'Step 1 — convert A = 2.6125 × 10¹ = 26.125' },
        { type: 'pre', text: '26.125 = 11010.001₂ = 1.1010001 × 2⁴\nsign 0,  E = 4 + 15 = 19 = 10011₂\nmantissa (10 bits): 1010001000   ← exact, no rounding' },
        { type: 'p', text: 'A = `0 10011 1010001000` (= 26.125 exactly).' },
        { type: 'h', text: 'Step 2 — convert B = 4.150390625 (and round it on storage)' },
        { type: 'pre', text: '4.150390625 = 100.001001101₂ = 1.00001001101 × 2²\nsign 0,  E = 2 + 15 = 17 = 10001₂\nmantissa field (10 of 11 bits): 0000100110 | next bit 1, nothing after\n  guard = 1, round = 0, sticky = 0 → exactly halfway → round to nearest even\n  field ends in 0 (even) → keep it:  0000100110' },
        { type: 'p', text: 'B = `0 10001 0000100110` = 1.0000100110₂ × 2² = **4.1484375** — storage already cost 0.001953125.' },
        { type: 'h', text: 'Step 3 — align and add' },
        { type: 'pre', text: `A:  1.101000100000 × 2⁴
B:  0.010000100110 × 2⁴   (B shifted right 2; exact — its mantissa is only 10 bits)
      ————————————————
sum: 1.111001000110 × 2⁴   (12 fraction bits; integer part still 1, no renormalization)` },
        { type: 'h', text: 'Step 4 — round the result (guard, round, sticky)' },
        { type: 'pre', text: `field (10 bits): 1110010001 | guard 1, round 0, sticky 0
again exactly halfway → round to nearest even
field ends in 1 (odd) → round up:   1110010010` },
        { type: 'p', text: 'Result = 1.1110010010₂ × 2⁴, exponent unchanged (19):' },
        { type: 'pre', text: '0 | 10011 | 1110010010  = 11110.010010₂ = 30.28125' },
        { type: 'answer', text: ['0 10011 1110010010 = 30.28125. Exact value 30.275390625; the two round-to-nearest-even steps (B on storage, then the sum) account for the difference: 30.2734375 + 0.0078125 = 30.28125.'] },
      ],
    },
    {
      id: 'Q2b', topic: 'cache', marks: '[10]', inNotes: true,
      q: 'Consider a cache consisting of 128 blocks of 64 words each. The main memory is word addressable, addressable by a 20-bit address, and it has 16K blocks of 64 words each. Consider that a main-memory location has the address 11110000111100101110. Identify the cache position where this memory address will be mapped using: (i) Direct Mapping, (ii) Associative Mapping, (iii) Set-Associative Mapping (assume 4 blocks per set in the cache). Your answer must illustrate how the 20-bit memory address will be divided into tag, block/set, and word for each mapping technique, and identify the exact location where this memory address will be mapped in the cache (which word, block, or set) for each mapping technique, and the main-memory block of this address. Additionally explain how cache hit or miss will be determined in each of these mapping techniques.',
      pattern: 'The guaranteed long mapping question, third time in a row (Fall 2024 Q2(b), Spring 2024 Q2(a)) — same three splits, new numbers. The notes drill the “block mod cache-size” shortcut.',
      think: [
        'Sanity-check the numbers first: 2²⁰ words ÷ 64-word blocks = 2¹⁴ = 16K blocks ✓, so the 20-bit address = block number (14 bits) + word (6 bits) in every scheme. Then the word offset is always 6 bits; what changes is how many of the remaining 14 bits index the cache: direct 7 (128 blocks), associative 0, set-associative 5 (32 sets). Cross-check every index with block-number division.',
      ],
      solution: [
        { type: 'p', text: '**Common groundwork.** Word offset = log₂ 64 = **6 bits**. Address W = `11110000111100101110` = 986926. Block number = W ÷ 64 = **15420** (binary `11110000111100`, 14 bits — exactly 20 − 6 ✓); word within block = 986926 − 15420×64 = **46** (`101110`).' },
        { type: 'h', text: '(i) Direct mapping — tag 7 | block 7 | word 6' },
        { type: 'pre', text: `1111000 | 0111100 | 101110
  tag      block     word
  =120     =60       =46` },
        { type: 'p', text: 'Check: 15420 mod 128 = 60 ✓ (and 15420 ÷ 128 = 120 = the tag). Main-memory block **15420** maps to **cache block 60, word 46** — the only position it may occupy.' },
        { type: 'diagram', id: 'directMap', caption: 'Direct: one candidate line per block — index 60 selects line 60; the stored tag must equal 120 for a hit.' },
        { type: 'h', text: '(ii) Associative mapping — tag 14 | word 6' },
        { type: 'pre', text: `11110000111100 | 101110
      tag         word
      (=15420)    =46` },
        { type: 'p', text: 'No index: block 15420 may sit in **any of the 128 cache blocks** (any way), word 46 within it. The full 14-bit tag `11110000111100` is stored beside the block.' },
        { type: 'diagram', id: 'associativeMap', caption: 'Associative: every line carries a full tag and all tags are compared in parallel with the incoming block number.' },
        { type: 'h', text: '(iii) Set-associative, 4 blocks per set — tag 9 | set 5 | word 6' },
        { type: 'pre', text: `128 blocks ÷ 4 = 32 sets → 5 set bits
111100001 | 11100 | 101110
   tag       set    word
   =481      =28     =46` },
        { type: 'p', text: 'Check: 15420 mod 32 = 28 ✓ (15420 ÷ 32 = 481 = the tag). Block 15420 maps to **set 28**, where it may occupy **any of the 4 ways**, word 46. Main-memory blocks competing for set 28: every block ≡ 28 (mod 32).' },
        { type: 'diagram', id: 'setAssocMap', caption: 'Set-associative: the set field selects one set; the tag is compared against the (here four) tags of that set only.' },
        { type: 'h', text: 'Hit or miss' },
        { type: 'table', head: ['Mapping', 'Hit test'], rows: [
          ['Direct', 'One comparison: the tag stored in the (single) line given by the index must **equal the address tag** and the valid bit be set.'],
          ['Associative', 'The 14-bit block number is compared **in parallel against all 128 stored tags**; a match in any line (valid bit set) is a hit.'],
          ['Set-associative', 'The set field picks the set; the tag is compared against **the 4 tags of that set in parallel**; a valid match in any way is a hit.'],
        ] },
        { type: 'answer', text: ['Word 46 of main-memory block 15420 → direct: cache block 60 (tag 120, split 7|7|6) · associative: any of the 128 blocks, full tag 11110000111100 (14|6) · set-associative (4/set): set 28, any way, tag 481 (9|5|6). Hit = tag match against one line, all lines, or the four lines of set 28 respectively.'] },
      ],
    },
    {
      id: 'Q3a', topic: 'single-bus', marks: '[4]',
      q: 'Explain the concepts of the following terminologies with necessary examples. I. Cache coherence problem. II. Input and output gating for one register bit in a single-bus CPU organization.',
      pattern: 'Part I is the write-policy material of Fall 2024 Q3(c); part II is the register-bit figure Spring 2024 Q1(e) asks to draw.',
      think: [
        'Two short definitions, each with one figure or example. Coherence: write-back makes the cached copy and memory differ — show who reads stale data. Gating: one register bit needs two AND gates — Rin controls what enters the latch, Rout controls what the latch drives onto the bus.',
      ],
      solution: [
        { type: 'h', text: 'I — Cache coherence problem' },
        { type: 'p', text: 'With the **write-back (copy-back)** policy a write updates only the cached copy (setting the dirty bit); main memory still holds the old value. The two copies are now **incoherent**. Any other master that reads that block straight from memory — another processor, or a DMA controller reading a RAM buffer — receives **stale data**. Example: the processor writes X=5 into its cache (dirty, memory still X=3); the disk then reads X from memory and transmits 3.' },
        { type: 'p', text: 'Fixes: **write through** (memory is updated with every write — coherent but heavy bus traffic), or **write back the dirty block before any other master reads it** (the non-coherent-DMA rule), or hardware **snooping/coherence protocols** in multiprocessors, where caches watch the bus and invalidate or update their copies.' },
        { type: 'h', text: 'II — Input and output gating of one register bit (single bus)' },
        { type: 'diagram', id: 'registerBit', caption: 'One bit of a register: the storage latch’s D input is driven by (bus bit AND Rin) — input gating; the latch’s output drives (Q AND Rout) onto the bus bit — output gating. The clock/write control comes with Rin.' },
        { type: 'p', text: 'The register bit is a storage latch on one column of the bit array. **Input gating**: `Rin` opens the path from the bus bit into the latch, so the bit latches the bus value on the clock edge — without `Rin` the latch ignores the bus. **Output gating**: `Rout` opens the path from the latch onto the bus bit — without `Rout` the latch is electrically disconnected, which is what lets many registers share one bus without fighting. Example: `R1out, R2in` in the same control step copies R1’s bit into R2’s latch through the bus, and no other register is disturbed.' },
        { type: 'answer', text: ['I. Coherence = cached and memory copies differ under write-back, so other readers of memory get stale data; fixed by write-through, writing back before foreign reads, or snooping protocols. II. Gating = Rin AND-gates the bus bit into the latch (input) and Rout AND-gates the latch onto the bus (output), letting many registers share one bus line peacefully.'] },
      ],
    },
    {
      id: 'Q3b', topic: 'bus-timing', marks: '[4]',
      q: 'Explain the timing of an input data transfer in a synchronous bus (assuming that one data transfer takes one clock cycle) using necessary figures. Identify the limitations of this timing mechanism and explain how to overcome these limitations using necessary figures and mechanisms.',
      pattern: 'Verbatim repeat of Fall 2024 Q1(c) — learn the pair of figures once.',
      think: [
        'Three beats: the synchronous read figure (address at t0, data before the cycle end, sampled at the clock edge), the limitation in one sentence (the clock is paced by the slowest device), and the asynchronous full handshake as the fix (Master-ready / Slave-ready).',
      ],
      solution: [
        { type: 'p', text: '**Synchronous timing.** All devices take their timing from a common **bus clock**; here one complete data transfer occupies one clock cycle.' },
        { type: 'diagram', id: 'syncBus', caption: 'Input (read) transfer: the master places the address/command at t0; the addressed slave returns data valid well before the end of the cycle; the master samples the data at the clock edge that closes the cycle (t1–t2).' },
        { type: 'list', items: [
          '**Limitation 1** — the clock period must be long enough for the **slowest device** on the bus, so every transfer pays worst-case time.',
          '**Limitation 2** — on a long bus, clock **skew** and unequal path lengths make one tight common clock unreliable; slow and fast devices cannot be mixed efficiently.',
        ] },
        { type: 'p', text: '**Overcoming it — the asynchronous bus**: no common clock; timing is established by a **full handshake**.' },
        { type: 'diagram', id: 'asyncBus', caption: 'Full handshake: (t0) master asserts address + Master-ready → (t1) slave returns data and asserts Slave-ready → (t2) master drops Master-ready → (t3) slave drops Slave-ready. Each transition triggers the next.' },
        { type: 'p', text: 'Devices of any speed now cooperate — the handshake stretches to the actual transfer time — at the cost of two control lines and the accumulated propagation delays of the four handshakes.' },
        { type: 'answer', text: ['Synchronous: one fixed clock cycle per transfer — simple, but paced by the slowest device and vulnerable to skew. Asynchronous full handshake on Master-ready/Slave-ready: speed-independent at the cost of handshake lines and delay.'] },
      ],
    },
    {
      id: 'Q3c', topic: 'hardwired-cu', marks: '[4]', inNotes: true,
      q: 'Illustrate the block diagram of a Hardwired control unit organization. Consider that the processor can handle 8 instructions in total. Currently, the 4th instruction is being executed which has a total of 16 steps. Explain how this Hardwired control unit organization will generate different control signals based on different steps of the instruction.',
      pattern: 'Same figure and reasoning as Fall 2024 Q1(d) with the widths swapped (8 instructions × 16 steps instead of 16 × 8).',
      think: [
        'The block diagram is fixed; the numbers only set decoder widths: 8 instructions → 3-to-8 instruction decoder (INS1…INS8); 16 steps → 4-bit counter and 4-to-16 step decoder (T1…T16). Then the encoder: every control signal is a sum of products of (step, instruction) — give one worked signal.',
      ],
      solution: [
        { type: 'diagram', id: 'hardwiredCU', caption: 'Clock → control step counter → step decoder (T1…T16); IR → instruction decoder (INS1…INS8); encoder combines the T lines, INS lines, condition codes and external inputs into the control signals; End/Run feeds back to the counter.' },
        { type: 'p', text: 'With the given numbers: the **instruction decoder** is a 3-to-8 decoder producing INS1…INS8 (one active for the instruction in IR); the **step counter** is 4 bits and its decoder produces T1…T16. While instruction 4 executes, the counter walks T1 → T16, one step per clock, and the encoder activates the (INS4, Tk) product terms for the current k.' },
        { type: 'p', text: 'Each control signal is a sum of products. Example — a signal needed in T1 for every instruction, in T5 for instruction 4 only, and in T16 (the End step) for instruction 4 when MFC has arrived:' },
        { type: 'pre', text: 'X = T1 + T5·INS4 + T16·INS4·MFC' },
        { type: 'diagram', id: 'controlSignalGates', caption: 'The gate pattern: AND terms (Tk · INSj · condition) feeding one OR gate per control signal.' },
        { type: 'steps', items: [
          'Step counter advances each clock cycle: T1, T2, …, T16 while INS4 is active.',
          'At each Tk the encoder turns on the control signals scheduled for step k of instruction 4 (e.g. T1: `PCout, R=B, MARin, Read, IncPC`).',
          'At T16 the `End` signal resets the counter to T1 and the unit proceeds to the next instruction’s wired sequence.',
          'Condition inputs (N, Z, V, C, MFC) can hold or modify a step — WMFC-style steps only advance when MFC is asserted.',
        ] },
        { type: 'answer', text: ['3-to-8 instruction decoder + 4-bit step counter with a 4-to-16 decoder; each control signal is generated by an AND-OR encoder as a sum of (step · instruction · condition) products, e.g. X = T1 + T5·INS4 + T16·INS4·MFC; End at T16 restarts the counter.'] },
      ],
    },
    {
      id: 'Q3d', topic: 'cache', marks: '[4]', inNotes: true,
      q: 'Explain the concept of Locality of Reference and its classifications using relevant examples.',
      pattern: 'Verbatim repeat of Fall 2023 Q1(f).',
      think: [
        'Definition, then the two classes each with a code-shaped example (loop = temporal, sequential/array walk = spatial), then the one-line consequence: this is why a small cache works.',
      ],
      solution: [
        { type: 'p', text: 'Analysis of programs shows that many instructions in **localized areas** of a program are executed repeatedly during some period, while others are accessed rarely — the **locality of reference** property. It is why a small fast cache holding only the active parts of the program can serve most references.' },
        { type: 'table', head: ['Class', 'Statement', 'Example'], rows: [
          ['Temporal locality', 'a recently executed instruction / used datum is likely to be needed again very soon', 'the body of a loop: `for(i=1;i≤10;i++){X; Y; Z;}` — X, Y, Z are re-executed 10 times, so after the first pass they are already in the cache'],
          ['Spatial locality', 'items whose addresses are close to a recently accessed one are likely to be accessed soon', 'instructions are stored and fetched from consecutive addresses; walking 1008, 1012, 1016 hits the same block fetched around 1008'],
        ] },
        { type: 'list', items: [
          'Temporal locality ⇒ bring an item into the cache on first use; it will be re-used from there.',
          'Spatial locality ⇒ fetch a whole **block** of contiguous addresses, not just the requested word — the neighbours come for free.',
        ] },
        { type: 'answer', text: ['Locality of reference = non-uniform, clustered access patterns, classified as temporal (re-use in time) and spatial (neighbouring addresses); it is the working principle of cache memory.'] },
      ],
    },
  ],
}
