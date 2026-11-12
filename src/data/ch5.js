// Chapter 5 — The Memory System. From slides 8_chapter5 and class notes pp. 32–39.
export default {
  id: 'ch5',
  chapter: 'Chapter 5 · Slides 8',
  title: 'The memory system',
  blurb: 'From one memory cell to the cache hierarchy: RAM chip internals, SRAM vs DRAM, the ROM family, locality of reference, the three mapping functions, replacement and write policies, cache performance arithmetic, and virtual memory.',
  tags: ['SRAM', 'DRAM', 'ROM', 'hierarchy', 'locality', 'mapping', 'LRU', 'write-back', 'tavg', 'virtual memory'],
  prereq: [
    'Powers of two fluency: 2^10 = 1K, 2^16 = 64K, 2^20 = 1M — every mapping question is arithmetic on these.',
    'MAR/MDR from Chapter 7: address goes out through MAR, data comes back through MDR.',
    'Flip-flop = 1 stored bit; a decoder selects one of 2^n outputs from an n-bit input (used inside every chip).',
  ],
  sections: [
    {
      heading: 'Basic concepts: address space, word length, access and cycle time',
      blocks: [
        { type: 'list', items: [
          'Maximum memory size depends on the **addressing scheme**: a 16-bit computer generates 16-bit addresses → up to 2^16 = 65536 locations. The number of locations is the **address space**.',
          'Most modern computers are **byte-addressable**, but memory is designed to store and retrieve data in **word-length** quantities — the word length is the number of bits stored/retrieved in one memory operation.',
          'Data transfers between processor and memory always involve **MAR and MDR**; if the address bus is k bits, MAR is k bits; if the word length is n bits, MDR is n bits.',
          'Control lines include **R/W̄** (1 = read, 0 = write) and **MFC**.',
        ] },
        { type: 'diagram', id: 'memInterface', caption: 'Processor–memory interface: k-bit address bus (one-way out), n-bit data bus (both ways), control lines.' },
        { type: 'h', text: 'Two different speed measures — do not swap them' },
        { type: 'list', items: [
          '**Memory access time**: elapsed time between initiation and completion of one operation (e.g. Read to MFC).',
          '**Memory cycle time**: minimum time between the initiation of two successive operations. Cycle time is slightly **longer** than access time (the memory needs recovery).',
        ] },
        { type: 'p', text: 'The faster a memory system, the **costlier** and the **smaller** it is. The design problem: give the system as large and fast a memory as possible within a cost target. Two techniques: **cache memory** (raises effective speed) and **virtual memory** (raises effective size).' },
      ],
    },
    {
      heading: 'Semiconductor RAM: cells, chips, SRAM vs DRAM',
      blocks: [
        { type: 'list', items: [
          'RAM = any location addressed in a **fixed time independent of its address** (contrast with disks).',
          'Each memory cell holds **one bit**; in the simple word-organized diagram, **one row is one word**. DRAM chips can organize many words in a row and use a separate column selection.',
          'All cells of a row connect to a common **word line**, driven by the **address decoder**; **sense/write circuits** connect to the data input/output lines.',
        ] },
        { type: 'diagram', id: 'ramChip', caption: 'Slide example: a 128-bit chip organized as 16 words × 8 bits (16×8). A0–A3 select the word; W0…W15 are word lines; each column is one bit read/written through its sense/write circuit.' },
        { type: 'note', title: 'From the class notes (exam pointer)', text: [
          '“For exam: draw the internal organization of a RAM memory chip, and explain for read and for write with an example.” The read path: address on A0–A3 → decoder drives one word line → the 8 cells of that row put their bits on the bit lines → sense circuits amplify and output them on b7…b0. Write: same row selection, but sense/write circuits drive the bit lines with the input data while R/W̄ = 0. **CS** must be active for the chip to respond at all.',
          'Fall 2024 Q1(b) asks exactly this for a 1 KB chip with 16-bit words — solved in the question bank.',
        ] },
        { type: 'table', head: ['', 'SRAM', 'DRAM'], rows: [
          ['Cell', 'retains state as long as power is applied (6 transistors)', 'does not retain state indefinitely — must be periodically refreshed (1 transistor)'],
          ['Volatility', 'volatile (contents lost without power)', 'volatile, and leaks even with power on'],
          ['Speed / size / cost', 'access time a few nanoseconds; low capacity; high cost', 'longer access time; higher capacity; lower cost'],
          ['Refresh', 'not needed', 'needed; can be done while reading'],
          ['Used for', 'cache memories (speed is primary)', 'main memories (large and affordable)'],
        ] },
        { type: 'h', text: 'Latency and bandwidth' },
        { type: 'list', items: [
          '**Latency**: time to transfer a **single word**. For a block transfer, latency = time to transfer the **first** word (subsequent words are faster).',
          '**Bandwidth**: bits/bytes transferred per second — depends on the speed of access to the chip, how many bits are accessed **in parallel**, and the transfer capability (speed) of the bus linking processor and memory.',
        ] },
        { type: 'p', text: 'For a word-organized chip, divide total bits by bits per word to get rows; log₂(rows) gives address inputs for a power-of-two depth. For a DRAM question giving a square array, split the address evenly between row and column. A refresh counter walks row addresses, so its highest count is rows−1.' },
        { type: 'practice', prompt: 'Organize a 4 KiB word-addressed RAM chip with 32-bit words. Give the decoder size, word lines and data pins. Which word line selects the 16th word when the first is W0?', blocks: [
          { type: 'answer', text: '4 KiB ÷ 4 bytes = 1024 words. Use a 10-to-1024 decoder, W0…W1023, 32 bit columns, 32 sense/write circuits and 32 data pins. The 16th word is W15, address 0000001111₂.' },
        ] },
      ],
    },
    {
      heading: 'The ROM family and flash',
      blocks: [
        { type: 'table', head: ['Type', 'What it is'], rows: [
          ['ROM', 'data written at manufacture'],
          ['PROM', 'user-programmable once — irreversible'],
          ['EPROM', 'erasable (UV light) + reprogrammable'],
          ['EEPROM', 'erased **electrically**, no removal from circuit'],
          ['Flash', 'electrically erased in blocks; read and program granularity depend on the flash type (e.g. pages in NAND)'],
        ] },
        { type: 'list', items: [
          'SRAM/SDRAM are **volatile**; many applications need memory that keeps contents with power off — e.g. the instructions that load the OS from disk at power-on must live in **non-volatile** memory. Normal operation then only reads it → “read-only”.',
          'Flash has **greater density** (higher capacity, lower cost per bit) and **very low power**, good for battery devices; single chips are small, so bigger modules use flash cards and drives.',
        ] },
        { type: 'note', title: 'Acronym list from the slides', text: [
          'RAM — random access (constant access time). ROM — written once. PROM — bench-programmable ROM. EPROM — erasable PROM. EEPROM — electrically erasable. SRAM — static (loses contents at power-off). DRAM — dynamic (needs refresh). SDRAM — **synchronous** DRAM: memory operations synchronized with a clock signal.',
        ] },
      ],
    },
    {
      heading: 'The memory hierarchy',
      blocks: [
        { type: 'list', items: [
          'The design challenge: sufficiently large memory, reasonable speed, affordable cost.',
          '**SRAM**: very fast, expensive, complex cell → small units where speed is critical = **cache**.',
          '**DRAM**: simpler cell, cheaper, slower → large affordable = **main memory**.',
          '**Magnetic disks**: huge cheap storage, much slower than DRAM → secondary storage.',
        ] },
        { type: 'diagram', id: 'memoryHierarchy', caption: 'Fastest access is to processor registers (top). L1 cache is on the processor chip; L2 sits between L1 and main memory; then the magnetic disk. Going down: increasing size, decreasing speed, decreasing cost per bit.' },
        { type: 'think', text: [
          'The hierarchy works only because of locality (next section): if accesses were random, the hit rate at the small fast levels would collapse and the hierarchy would just add delays. Whenever asked “why does this work?”, the answer starts with locality of reference.',
        ] },
      ],
    },
    {
      heading: 'Cache memories and locality of reference',
      blocks: [
        { type: 'list', items: [
          'The processor is much faster than main memory and spends much of its time **waiting** for instructions and data — the major obstacle to good performance. Main-memory speed cannot be raised beyond a point.',
          'A cache is an **architectural arrangement that makes main memory appear faster** than it is, based on the **locality of reference** property of programs.',
        ] }
        ,
        { type: 'h', text: 'Locality — the two forms' },
        { type: 'list', items: [
          '**Temporal locality**: a recently executed instruction is likely to be executed again very soon (loops, nested loops, mutually calling procedures).',
          '**Spatial locality**: instructions with addresses **close to** a recently executed instruction are likely to be executed soon.',
          'Consequence for the cache: on first use, bring the item in (temporal); and instead of fetching one item, fetch the **whole block** of contiguous addresses around it (spatial). A **block** is a set of contiguous address locations of some size.',
        ] },
        { type: 'table', head: ['Time', 'Cache content', 'Actual memory location'], rows: [
          ['02:00:00', 'Instruction X', '1000'],
          ['02:00:01', 'Instruction Y', '2004'],
          ['02:00:02', 'Instruction Z', '3008'],
          ['02:05:00', 'Instruction A', '1008'],
          ['02:05:01', 'Instruction B', '1012'],
          ['02:05:02', 'Instruction C', '1016'],
        ], caption: 'The slides’ illustration: re-running a loop re-uses X, Y, Z (temporal — they are still in cache); the second loop walks 1008, 1012, 1016 (spatial — neighbours come along in the same block).' },
        { type: 'diagram', id: 'cacheBlock', caption: 'Processor ↔ cache (SRAM) ↔ main memory (DRAM). The processor issues ordinary Read/Write requests; the cache is transparent to it.' },
        { type: 'h', text: 'Hit/miss vocabulary (any two adjacent levels)' },
        { type: 'table', head: ['Term', 'Meaning'], rows: [
          ['block', 'minimum unit of data moved between levels (usually 1 word in the slides’ examples)'],
          ['hit / miss', 'requested data is / is not in the upper (closer) level'],
          ['hit rate, miss rate', 'fraction of accesses that hit; miss rate = 1 − hit rate'],
          ['hit time', 'time to confirm the hit + deliver the data from the upper level'],
          ['miss penalty', 'time to detect the miss + replace the upper-level block from the lower level + deliver it'],
        ] },
        { type: 'p', text: 'On a processor Read, a **block of words** is transferred from memory into the cache one word at a time; later references to that block hit. At any time only some memory blocks are held in the cache — **which** ones is decided by the *mapping function*; when the cache is full, **which block to evict** is decided by the *replacement algorithm*.' },
      ],
    },
    {
      heading: 'Write and read behaviour: hits, misses, dirty bits',
      blocks: [
        { type: 'table', head: ['Event', 'What happens'], rows: [
          ['Read hit', 'data obtained from the cache'],
          ['Write hit', '**write-through**: update cache and main memory simultaneously · **write-back (copy-back)**: update the cache only and set the **dirty/modified bit**; main memory is updated when this block is replaced'],
          ['Read miss', 'transfer the block containing the word from memory, then forward the word — possibly immediately (**load-through / early-restart**) without waiting for the whole block'],
          ['Write miss', '**Write-allocate**: fetch the block into cache, then apply the write policy. **No-write-allocate**: send the store to the next level and leave the line absent. Write-back commonly uses allocation; write-through commonly bypasses on a miss.'],
        ] },
        { type: 'list', items: [
          'A **valid bit** per block: 1 if the block holds valid data. All valid bits are 0 at power-on; set to 1 when a block is first loaded.',
          'A DMA transfer may bypass the CPU cache. With non-coherent DMA, software must arrange for stale CPU copies to be invalidated and dirty data written back when needed; coherent systems handle the relevant snoops in hardware.',
          '**Cache coherence problem**: with write-back, the cached copy and the memory copy differ (memory does not reflect cache changes). If a disk transfer reads that block from memory, it gets stale data. One option: **force a write-back before the disk is updated**.',
        ] },
        { type: 'think', text: [
          'Write-through trades bandwidth for consistency (every write costs a memory access, but memory is always current). Write-back trades consistency bookkeeping for speed (memory updated only on eviction, using the dirty bit to skip untouched blocks). Pick the one a question emphasizes: “memory always up to date” → through; “fewer memory writes” → back.',
        ] },
        { type: 'exam', text: ['In Fall 2024 Q3(c), describe all four read/write and hit/miss cases. Explain the two write policies and the allocation decision separately.'] },
        { type: 'practice', prompt: 'A write misses in a write-back, write-allocate cache. Every way in the set is valid and the chosen victim is dirty. Give the order of operations and the final dirty bit.', blocks: [
          { type: 'answer', text: 'Write back the dirty victim using its own stored tag and set index. Fetch the new block, fill its tag and valid state, overwrite the addressed bytes, and set dirty=1.' },
        ] },
      ],
    },
    {
      heading: 'Mapping functions: direct, associative, set-associative',
      blocks: [
        { type: 'p', text: 'The mapping function decides **where a memory block may live in the cache**. The running example (all three slides): 16-bit address, 4096 memory blocks of 16 words, cache of 128 blocks.' },
        { type: 'h', text: 'Direct mapping' },
        { type: 'diagram', id: 'directMap', caption: 'Direct mapping: cache block = memory block number mod 128. Address splits into Tag (5) | Cache block (7) | Word (4).' },
        { type: 'list', items: [
          'The low-order **4 bits select one of 16 words** in the block; the **7-bit cache block field** fixes the cache position; the **high-order 5 tag bits** say which of the 32 memory blocks that map onto this position is currently resident.',
          'On access, the high-order 5 address bits are compared with the stored tag in the indexed line. A hit requires **valid = 1 and matching tag**. A miss that allocates goes into that line.',
          'Placement is **fixed**, so the replacement strategy is **trivial**. Cost: two hot blocks that share a position keep evicting each other.',
        ] },
        { type: 'h', text: 'Associative mapping' },
        { type: 'diagram', id: 'associativeMap', caption: 'Associative mapping: a memory block may go into any cache position. Address splits into Tag (12) | Word (4).' },
        { type: 'list', items: [
          'With a 16-bit address: 2^16 = 65536 locations ÷ 16 per block → 4096 blocks; the **high-order 12 bits are the tag** identifying the block.',
          '**Flexible, uses cache space efficiently**; replacement algorithms choose the victim when full.',
          '**Cost is higher**: all 128 tag patterns must be searched (compared in parallel) to decide whether the block is present.',
        ] },
        { type: 'h', text: 'Set-associative mapping' },
        { type: 'diagram', id: 'setAssocMap', caption: 'Two-way set-associative: 128 cache blocks in 64 sets of 2. Address splits into Tag (6) | Set (6) | Word (4).' },
        { type: 'list', items: [
          'A **combination** of direct and associative: cache blocks are grouped into **sets**; a memory block may reside in **any block of one specific set**.',
          'Divide the 128-block cache into **64 sets of 2 blocks**: memory blocks 0, 64, 128, … map to set 0 and may occupy **either** position.',
          '16-bit address: low 4 bits = word; middle **6 bits = set number**; high **6 bits = tag**, compared against the tags of the two blocks in the set. Tag size = memory blocks ÷ sets = 4096/64 = 64 = 2^6.',
          'Blocks per set is a **design parameter**: all blocks in one set = fully associative; one block per set = direct mapped.',
        ] },
        { type: 'think', text: [
          'For any mapping problem, compute three numbers in this order: (1) **offset bits** = log2(addressable units per block). Use bytes for byte addresses and words for word addresses; (2) **index bits** = log2(cache lines, or sets) — direct uses lines, set-associative uses sets, associative has none; (3) **tag bits** = address bits − the rest. Then, to place a given address: write it in binary, cut it into fields, and convert the index/set field to decimal — that is the cache line/set. The class notes’ shortcut for direct mapping: `cache block = memory block number mod (number of cache blocks)`.',
          'To check hit or miss, use the index to select the line or set, compare its valid tags, then use the offset to select the requested data. Block number = floor(address ÷ block size in addressable units). Index = block number mod number of sets. Tag = floor(block number ÷ number of sets).',
        ] },
        { type: 'exam', text: ['This is **the** most repeated numeric question: Fall 2022 Q3(b) (1 MB, 16 B blocks, 64 KB cache, direct + 4-way), Spring 2022 Q3(b) (1 KB/8 B/direct, cache line for a given address), Fall 2023 Q3(f) (32-bit address, 32-word blocks, 64-block sets — draw the mapping), Spring 2024 Q2(a) (128×16-word cache, 16-bit address, direct vs set-associative + hit check), Fall 2024 Q2(b) (128×32-word cache, 18-bit address, all three mappings).'] },
        { type: 'practice', prompt: 'A 16-bit byte-addressed machine has a 2 KiB cache, 16-byte blocks and four ways. Split address 0xB2A7 into tag, set and offset. Which way must it occupy?', blocks: [
          { type: 'pre', text: '1011001 | 01010 | 0111\n tag 89   set 10   byte 7' },
          { type: 'answer', text: 'There are 128 lines and 32 sets. Fields are 7 tag / 5 set / 4 byte offset. Block 0xB2A divided by 32 gives tag 89 and set 10, with byte offset 7. It can occupy any way of set 10.' },
        ] },
      ],
    },
    {
      heading: 'Replacement algorithms',
      blocks: [
        { type: 'list', items: [
          'When the target set is full and a new block must come in, some resident block in that set must be replaced — decided by the **replacement algorithm**.',
          'Direct-mapped: position is fixed → replacement is trivial.',
          'Associative / set-associative: flexibility → a real choice. Locality suggests replacing the block that has gone **longest without being referenced** — the **Least Recently Used (LRU)** block. LRU is used extensively but performs poorly in some cases; adding a little randomness can improve it.',
          'Other algorithms remove the “oldest” block (FIFO-style) — they disregard locality and do not perform as well.',
        ] },
        { type: 'note', title: 'From the class notes', text: [
          'The notes compare **LRU, MRU** and a **fetch-time-based** rule on a concrete access sequence (blocks 100, 400, 200, 300, 400 with their fetch times). Conclusion written in the notes: LRU usually gives better efficiency, **but not always** — “it depends on the requirements”. MRU evicts the most recently used block. It can help on repeated scans where older entries will be needed before the newest one. Use the reference trace to compare policies.',
        ] },
        { type: 'think', text: [
          'Simulating LRU by hand: write the reference string, and after each access keep the list of resident blocks ordered by last use. On a hit, move the referenced block to the tail. On a miss, fill an invalid way first or evict the head if the set is full, then insert at the tail. Count hits at the end — the question almost always wants the hit count per algorithm compared.',
        ] },
        { type: 'practice', prompt: 'Trace A, B, A, C, A through an empty two-way set with LRU. List hits, the victim, and the final order from least to most recently used.', blocks: [
          { type: 'answer', text: 'Miss A → [A]; miss B → [A,B]; hit A → [B,A]; miss C evicts B → [A,C]; hit A → [C,A]. Two hits and three misses.' },
        ] },
      ],
    },
    {
      heading: 'Measuring cache performance',
      blocks: [
        { type: 'p', text: 'Ideally the whole hierarchy would look like one memory with **the access time of an on-chip cache and the size of a disk**. How close you get depends on the hit rates — high hit rates (well over 0.9) are essential. The extra time to bring desired information in is the **miss penalty**; it becomes processor stall time.' },
        { type: 'p', text: 'Start by asking what the question’s miss time includes. With hit rate h, cache hit time C and extra miss penalty P, the cache lookup is paid on every access, so a miss costs C+P. If the question gives the total miss-path time M instead, average the two complete paths.' },
        { type: 'pre', text: 'Extra penalty: tave = C + (1−h)·P\nTotal miss path: tave = h·C + (1−h)·M, where M = C + P' },
        { type: 'h', text: 'The slides’ worked estimate — cache vs no cache' },
        { type: 'list', items: [
          'No cache: each memory read takes **10 clock cycles**; loading a block into the cache takes **17 cycles**.',
          '30% of instructions perform a read or write → **130 memory accesses per 100 instructions** (100 instruction fetches + 30 data).',
          'Hit rates: **0.95 for instructions, 0.9 for data**; miss penalty assumed equal for reads and writes.',
          'Instruction access: 0.95×1 + 0.05×(1+17) = **1.9 cycles**; data access: 0.9×1 + 0.1×18 = **2.8 cycles**.',
          'Per 100 instructions: 100×1.9 + 30×2.8 = 190 + 84 = **274 cycles**. Without the cache: 130×10 = **1300 cycles** → the memory-access component is **4.74× faster** under this model. Total CPU speedup also depends on non-memory work and overlap.',
          'Against an ideal (100%-hit) cache — all references in 1 cycle → 130 cycles: 274/130 ≈ 2.1, i.e. the DRAM main memory *appears* only about **two times slower** than the cache circuits.',
        ] },
        { type: 'h', text: 'Two levels of cache' },
        { type: 'list', items: [
          'From the speed viewpoint the optimal cache location is **on the processor chip**, but chip space is limited → small L1.',
          'Separate **instruction and data caches** (68040, Pentium III/4) allow both to be accessed at once → parallelism, but more complex circuitry; a **combined cache** (ARM710T) has a somewhat better hit rate from flexible mapping.',
          'High-performance processors use **two levels**: L1 on-chip (must be very fast — it constrains the clock rate), L2 much larger (SRAM, off-chip), only affecting L1’s miss penalty.',
          'Access to a big cache is slower than to a register file — a practical speedup is accessing **several words at once** and letting the processor consume them one by one.',
          'Typical workstation: L1 of tens of KB, L2 of several MB; L2 further reduces the impact of memory speed.',
        ] },
        { type: 'p', text: 'L2 hit rate h2 is local: the fraction of L1 misses that hit in L2. The fraction of all references that reach memory is (1−h1)(1−h2). If C1, C2 and M are successive lookup costs, use the additive form. When a paper gives complete path times T1, T2 and TM instead, use the weighted path form.' },
        { type: 'pre', text: 'Successive costs: tave = C1 + (1−h1)·[C2 + (1−h2)·M]\nComplete paths:   tave = h1·T1 + (1−h1)h2·T2 + (1−h1)(1−h2)·TM' },
        { type: 'think', text: [
          'Every “compare these two computers” question is the same three moves: (1) write tave for each machine — one level, two levels, or none (tave = M); (2) compute cycles per instruction, remembering that **every** instruction is fetched while only a fraction `d` touches data; (3) divide — fewer cycles wins. The 130-accesses-per-100-instructions bookkeeping is where most marks are lost; show it explicitly.',
        ] },
        { type: 'practice', prompt: 'L1 takes 2 cycles and hits 90% of references. L2 takes 6 additional cycles and hits 80% of L1 misses. Main memory takes 40 more cycles. What fraction of all references reach memory, and what is average access time?', blocks: [
          { type: 'answer', text: '0.10×0.20 = 2% reach memory. Average = 2 + 0.10×6 + 0.02×40 = 3.4 cycles. Equivalent complete paths: 90% at 2 cycles, 8% at 8, 2% at 48.' },
        ] },
      ],
    },
    {
      heading: 'Virtual memory',
      blocks: [
        { type: 'list', items: [
          'In most modern systems, physical main memory is **smaller than the address space** the processor can issue (32-bit byte addresses span at most 4 GiB; installed RAM is a separate quantity).',
          'With demand paging, the virtual address space is divided into fixed-size **pages** and RAM into equal-size **frames**. Code and data need physical frames when accessed. A valid page may be backed by an executable file, swap or zero-filled memory before first use.',
          'The OS moves programs and data **automatically** between memory and disk, so the application programmer never manages these limits — these are **virtual-memory techniques**.',
          'Virtual memory **increases the apparent size of physical memory**: data is addressed in a **virtual address space** as large as the processor’s addressing capability, but only the active portion is mapped onto physical memory; the rest is mapped onto bulk storage (disk).',
          'The binary addresses the processor issues are **virtual (logical) addresses**, translated into **physical addresses** by a combination of hardware and software. If the referenced item is in memory it is accessed immediately; otherwise it is brought into a suitable location before use.',
        ] },
        { type: 'diagram', id: 'virtualMemory', caption: 'The MMU translates virtual to physical addresses. When a valid page is not resident, a page fault lets the OS bring it in before retrying the instruction.' },
        { type: 'note', title: 'From the class notes', text: [
          'Worked frame: a 20-bit address → 2^20 = 1 MB address space, but only 512 KB of real memory (plus the hard disk). The address space can name 1 MiB, while 512 KiB of RAM holds the currently resident pages. Unmapped and protected pages still cause faults. The exam version of this (Fall/Spring 2023 Q3a): “64-bit processor, 2 GB memory, 5 GB game — any issue? which technique? draw the organization.”',
        ] },
        { type: 'think', text: [
          'Answer shape for the “big game, small memory” question: (1) program or install size alone does not determine whether it will run; a process may use more virtual memory than installed RAM if the OS can back its pages; (2) the technique is virtual memory with paging/segmentation managed by the OS; (3) the drawing is processor → virtual address → MMU → physical memory (2 GB) ↔ disk holding the rest; (4) one line on why it works — only referenced pages need to be resident. A working set that persistently exceeds RAM may cause frequent faults and thrashing.',
        ] },
        { type: 'steps', items: ['Split a virtual address into page number and page offset. For 4 KiB pages, the offset is 12 bits.', 'The MMU checks a cached translation (TLB). On a TLB miss, consult the page table; a resident mapping can still exist.', 'For a valid resident page, substitute its physical frame number and preserve the offset. For a legal but absent page, the OS handles the page fault, allocates a frame or evicts a victim, installs the mapping, and retries. A protection or invalid-address fault may instead terminate the access.'] },
        { type: 'note', text: 'A physically tagged cache compares physical identities even if its set index is taken from unchanged page-offset bits. Page translation, cache lookup and fetching a nonresident page solve different problems.' },
        { type: 'practice', prompt: 'With 4 KiB pages, virtual address 0x3456 belongs to virtual page 3, mapped to frame 0xA. What is the physical address? If the TLB misses but the page is resident, must the OS read the page from disk?', blocks: [
          { type: 'answer', text: 'Offset is 0x456; physical address is 0xA456. A TLB miss alone requires finding the translation. A resident page already has a frame.' },
        ] },
      ],
    },
  ],
}
