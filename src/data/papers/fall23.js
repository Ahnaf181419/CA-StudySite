// Fall 2023 — full paper, Hamacher track.
import { scsiReadSteps } from '../ch4io.js'

export default {
  id: 'fall23',
  name: 'Fall 2023',
  short: 'F23',
  date: '12/2023',
  marks: '70 · 3h',
  note: 'Broad coverage of the whole syllabus in short questions: control units, arithmetic, SCSI, addressing modes, assembly, virtual memory, control sequences, hazards, performance and mapping.',
  instruction: 'Q1 any 5 of 6 × 6 = 30 · Q2 any 2 of 3 × 8 = 16 · Q3 any 5 of 6 × 6 = 30.',
  format: 'Three sections of short questions. The choices are generous — the repeated core (control sequences, hazards, cache performance, mapping, VM) is enough to answer the required number twice over.',
  questions: [
    {
      id: 'Q1a', topic: 'hardwired-cu', marks: '[6]', inNotes: true,
      q: 'What are the different types of control units? Write down short notes on each and draw the figures of their basic organization.',
      think: [
        'Two types: hardwired and microprogrammed. For each: what generates the signals, one organization figure, and the speed/flexibility trade-off sentence — that is the whole marking scheme.',
      ],
      solution: [
        { type: 'h', text: '1 — Hardwired control unit' },
        { type: 'p', text: 'Control signals are produced by **fixed logic**: a step counter/decoder (T1…Tn) and an instruction decoder (INS1…INSm) feed an encoder that outputs the signals as sum-of-products of (step, instruction) terms, e.g. `Zin = T1 + T6·ADD + T4·BRANCH`. Inputs also include condition codes and external inputs like MFC. The unit is a state machine changing state every clock.' },
        { type: 'diagram', id: 'hardwiredCU', caption: 'Basic organization of the hardwired control unit.' },
        { type: 'list', items: [
          'Advantage: **high speed** — signals appear after gate delay only.',
          'Disadvantages: little flexibility; design complexity grows fast with the size of the instruction set (wiring must change to change anything).',
        ] },
        { type: 'h', text: '2 — Microprogrammed control unit' },
        { type: 'p', text: 'Control signals come from a **program**: each step’s signals form a **control word (CW)**; a CW sequence (**microroutine**) is stored per instruction in the **control store**; a **µPC** reads them sequentially, and a **starting-address generator** loads the routine’s first address when a new instruction enters IR.' },
        { type: 'diagram', id: 'microCU', caption: 'Basic organization of the microprogrammed control unit (Figure 7.16).' },
        { type: 'list', items: [
          'Advantage: **enormous flexibility** and simpler, more regular design — changing behaviour means changing the microprogram, not the wiring; suits large instruction sets.',
          'Disadvantage: **much slower** — every step first costs a control-store read.',
        ] },
        { type: 'answer', text: ['Two types — hardwired (fast, inflexible, complex for large ISAs) and microprogrammed (flexible and simple, slower); organizations as drawn.'] },
      ],
    },
    {
      id: 'Q1b', topic: 'multdiv', marks: '[6]', inNotes: true,
      q: 'Multiply (60)₁₀ by (15)₁₀ using the Sequential Multiplication Algorithm, with 6-bit numbers.',
      pattern: 'The arithmetic hardware staple — also Spring 2023 Q1(b) (31 × 13, 5-bit) and the class-notes 4 × 3 worked table.',
      think: [
        'Write both numbers in 6-bit binary (60 = 111100, 15 = 001111), widen the multiplicand register to 12 bits, then loop the (test LSB → add → shift multiplicand left → shift multiplier right) triple. Stop when the multiplier register is 0 — here after 4 loops.',
      ],
      solution: [
        { type: 'diagram', id: 'seqMultiplier', caption: 'Sequential multiplication hardware: multiplicand (shift left), ALU, product (accumulates, no shift), multiplier (shift right), control tests the LSB.' },
        { type: 'p', text: 'Setup: Multiplicand = `111100` (60), zero-extended into a 12-bit register as `0000 0011 1100`; Multiplier = `001111` (15); Product = `0000 0000 0000`.' },
        { type: 'table', head: ['Loop', 'Multiplier LSB', 'Action', 'Multiplicand added (12-bit)', 'Multiplier after ≫1 (6-bit)', 'Product (12-bit)'], rows: [
          ['1', '1', 'Product += Multiplicand', '0000 0011 1100 (60)', '000111 (7)', '0000 0011 1100 (60)'],
          ['2', '1', 'Product += Multiplicand', '0000 0111 1000 (120)', '000011 (3)', '0000 1011 0100 (180)'],
          ['3', '1', 'Product += Multiplicand', '0000 1111 0000 (240)', '000001 (1)', '0001 1010 0100 (420)'],
          ['4', '1', 'Product += Multiplicand', '0001 1110 0000 (480)', '000000 (0) → stop', '0011 1000 0100 (900)'],
        ], caption: 'After each add, the multiplicand shifts left (the next row shows the doubled value) and the multiplier shifts right. Product = 900 ✓' },
        { type: 'p', text: 'Full binary detail of the product column (12 bits): after loop 1 `0000 0011 1100` (60); after loop 2 `0000 1011 0100` (180); after loop 3 `0001 1010 0100` (420); after loop 4 `0011 1000 0100` (900).' },
        { type: 'answer', text: ['After 4 loops the multiplier register is 0 → stop. Product = 0011 1000 0100₂ = 900₁₀ = 60 × 15 ✓'] },
      ],
    },
    {
      id: 'Q1c', topic: 'scsi', marks: '[6]',
      q: 'Explain how a processor can read a block of data from a disk drive where data are stored in non-contiguous disk sectors, using SCSI controllers.',
      pattern: 'Asked again in Spring 2024 Q3(a) with arbitration added.',

      think: 'Two controllers talk over the SCSI bus: the processor’s SCSI controller is the **initiator**, the disk controller is the **target**. The marks are in the order of events: one command, then a **disconnect → seek → reconnect → transfer** cycle for **each** of the two sectors, then DMA into memory and an interrupt.',
      solution: [
        { type: 'diagram', id: 'scsiRead', caption: 'The processor’s SCSI controller (initiator) and the disk controller (target) on the SCSI bus; the initiator moves the data into main memory by DMA.' },
        { type: 'steps', items: scsiReadSteps },
        { type: 'answer', text: 'One read command; the target disconnects while seeking, reconnects (after winning arbitration) to send sector 1, disconnects again for the second seek, reconnects to send sector 2, then ends the connection. The initiator stores the data in memory by DMA and interrupts the processor when done.' },
      ],
    },
    {
      id: 'Q1d', topic: 'addressing', marks: '[6]',
      q: 'Determine the addressing modes of each operand of the following instructions:\ni) MOV Z, R2  ii) SUB (R1)−, R2  iii) ADD #120, R1  iv) CLEAR Y  v) ADD R2, 50(R3, R4)  vi) MUL R3, R4',
      pattern: 'The same drill in Spring 2023 Q2(b) — mode names are the marks; one line of justification each.',
      think: [
        'Checklist of mode names to consider: register, register-indirect, auto-increment (R)+, auto-decrement (R)−, immediate #, direct/absolute (plain label), indexed X(R) / double-indexed X(Ri,Rj). Match each operand to a name and say what the effective address is.',
      ],
      solution: [
        { type: 'table', head: ['Instruction', 'Operand', 'Mode', 'Effective address / value'], rows: [
          ['i) MOV Z, R2', 'Z (source)', 'direct (absolute)', 'operand is at memory location Z itself'],
          ['', 'R2 (destination)', 'register', 'receives the value from Z'],
          ['ii) SUB (R1)−, R2', '(R1)− (source)', 'auto-decrement register-indirect', 'The minus marks auto-decrement. For pre-decrement, written −(R1) in the usual course notation, subtract the operand size before using R1. In a post-decrement notation, use the old R1 first.'],
          ['', 'R2 (destination)', 'register', 'subtract the memory operand from R2 and store the result in R2'],
          ['iii) ADD #120, R1', '#120 (source)', 'immediate', 'the constant 120 is the operand, in the instruction'],
          ['', 'R1 (destination)', 'register', ''],
          ['iv) CLEAR Y', 'Y', 'direct (single-operand)', 'the content of memory location Y is cleared'],
          ['v) ADD R2, 50(R3, R4)', 'R2 (source)', 'register', ''],
          ['', '50(R3, R4) (destination)', 'indexed with displacement (double indexing)', 'EA = 50 + [R3] + [R4]'],
          ['vi) MUL R3, R4', 'R3', 'register', ''],
          ['', 'R4', 'register', ''],
        ] },
        { type: 'answer', text: ['i) direct + register · ii) auto-decrement indirect + register · iii) immediate + register · iv) direct · v) register + indexed-with-displacement · vi) register + register.'] },
      ],
    },
    {
      id: 'Q1e', topic: 'hazards', marks: '[6]',
      q: 'Demonstrate how data dependency can be handled in hardware vs. in software with relevant examples.',
      pattern: 'The most repeated short question in the bank — Spring 2023 Q1(a), Spring 2024 Q1(b), Fall 2024 Q3(b) all rotate on this.',
      think: 'Definition + example pair (`Mul R2,R3,R4` → `Add R5,R4,R6`), then hardware = forwarding (figure + 2-step walkthrough), software = NOPs/reordering (code block). End with one contrast line.',
      solution: [
        { type: 'p', text: 'A **data dependency** exists when the destination of one instruction is used as a source by a later instruction: `Mul R2, R3, R4` (writes R4) then `Add R5, R4, R6` (reads R4). Decoded too early, the Add would read a stale R4 — the pipeline must handle it.' },
        { type: 'h', text: 'Hardware handling — operand forwarding' },
        { type: 'p', text: 'The product is available at the **ALU output at the end of E1**, before the Write stage stores it. Forwarding hardware routes it directly back into the ALU inputs for E2 via two MUXes, so the Add proceeds without stalling. Registers SRC1/SRC2 (part of buffer B2) and RSLT (part of B3) support the path.' },
        { type: 'diagram', id: 'forwarding', caption: 'Forwarding datapath — the two dashed feedback paths into the ALU input MUXes.' },
        { type: 'h', text: 'Software handling — NOP insertion / reordering' },
        { type: 'pre', text: 'I1: Mul R2, R3, R4\n    NOP          ; one cycle of delay each\n    NOP\nI2: Add R5, R4, R6' },
        { type: 'p', text: 'The compiler detects the dependency while generating code and inserts NOPs to fill the dangerous cycles, or moves **independent** instructions from below into the gap. No special hardware is needed; the cost is wasted instruction slots and code size.' },
        { type: 'answer', text: ['Hardware: forward the ALU result of E1 straight into E2 (needs MUXes + forwarding paths). Software: let the compiler insert NOPs or reorder independent instructions. Same cure, different payer — circuits vs code size.'] },
      ],
    },
    {
      id: 'Q1f', topic: 'cache', marks: '[6]',
      q: 'Explain the concept of Locality of Reference and its classifications using relevant examples.',
      think: 'Definition, then the two classes each with a code-shaped example (loop = temporal; array walk / sequential addresses = spatial), then the one-line consequence: put the active parts in a fast cache and fetch whole blocks.',
      solution: [
        { type: 'p', text: 'Analysis of programs shows that many instructions in **localized areas** of a program are executed repeatedly during some period, while others are accessed rarely — the **locality of reference** property. It is why a small fast cache holding only the active parts of the program can serve most references.' },
        { type: 'table', head: ['Class', 'Statement', 'Example'], rows: [
          ['Temporal locality', 'a recently executed instruction / used datum is likely to be needed again very soon', 'the body of a loop: `for(i=1;i≤10;i++){X; Y; Z;}` — X, Y, Z are re-executed 10 times, so after the first pass they are already in the cache'],
          ['Spatial locality', 'items with addresses close to a recently accessed one are likely to be accessed soon', 'instructions are stored and fetched from consecutive addresses; a second loop over 1008, 1012, 1016 hits the same block fetched around 1008'],
        ] },
        { type: 'list', items: [
          'Temporal locality ⇒ bring an item into the cache on first use; it will be re-used from there.',
          'Spatial locality ⇒ fetch a whole **block** of contiguous addresses, not just the requested word — the neighbours come for free.',
        ] },
        { type: 'answer', text: ['Locality of reference = non-uniform, clustered access patterns; classified as temporal (re-use in time) and spatial (neighbouring addresses); it is the working principle of cache memory.'] },
      ],
    },
    {
      id: 'Q2a', topic: 'asm', marks: '[8]', flagged: true,
      q: 'Write an assembly language program to show how indirect addressing can be used to compute the average of the elements of an array.',
      pattern: 'Chapter-2 material kept in every paper’s Q2 — the average/product/dot-product trio rotates (Spring 2023 Q2(a)/(c), Fall 2023 Q2(b)).',
      think: [
        'Indirect addressing = the operand is reached through a pointer register: `Add (R0), R2` adds the element [R0] points at. Structure: initialize pointer + counter + sum; loop { add (ptr), sum; increment ptr; decrement counter }; finish with a divide by N.',
      ],
      solution: [
        { type: 'pre', text: '        Move   #LIST, R0     ; R0 ← address of first element (pointer)\n        Move   #N, R1         ; R1 ← element counter\n        Clear  R2             ; R2 ← running sum\nLOOP    Add    (R0), R2       ; R2 ← R2 + element pointed to by R0  (indirect)\n        Add    #4, R0         ; advance pointer to next element\n        Dec    R1             ; one element fewer to go\n        Branch > 0 LOOP       ; repeat until the counter is 0\n        Move   R2, R3         ; copy the sum\n        Move   #N, R4         ; divisor = number of elements\n        Divide R4, R3         ; R3 ← average = sum ÷ N' },
        { type: 'list', items: [
          '`Add (R0), R2` is the indirect-addressing heart: the operand is **not** R0 — it is the memory word whose address is in R0.',
          'Advancing R0 by one element size (`Add #4, R0`) walks the array without ever indexing it directly.',
          '`Branch > 0` uses the flags set by `Dec R1` — the standard countdown loop.',
        ] },
        { type: 'answer', text: ['Pointer (R0) + counter (R1) + accumulator (R2); loop adds `(R0)` indirectly and advances the pointer; final Divide by N yields the average.'] },
      ],
    },
    {
      id: 'Q2b', topic: 'asm', marks: '[8]', flagged: true,
      q: 'Write an assembly language program to show how indirect addressing can be used to compute the dot product of two vectors.',
      think: 'Same skeleton, two pointers and a Multiply in the loop: sum ← sum + A[i]·B[i]. Two pointer registers advance together.',
      solution: [
        { type: 'pre', text: '        Move   #AVEC, R0     ; R0 → first element of A\n        Move   #BVEC, R1     ; R1 → first element of B\n        Move   #N, R2        ; element counter\n        Clear  R3            ; R3 ← dot product accumulator\nLOOP    Move   (R0), R4     ; R4 ← A[i]        (indirect)\n        Move   (R1), R5     ; R5 ← B[i]        (indirect)\n        Mul    R4, R5       ; R5 ← A[i] × B[i]\n        Add    R5, R3       ; accumulate the product\n        Add    #4, R0        ; advance A pointer\n        Add    #4, R1        ; advance B pointer\n        Dec    R2\n        Branch > 0 LOOP\n        ; R3 holds the dot product Σ A[i]·B[i]' },
        { type: 'list', items: [
          'Both vectors are traversed purely through their pointers — no indexed addressing needed.',
          'The two `Move (Rx), Ry` instructions are the indirect accesses; the rest is ordinary register arithmetic.',
        ] },
        { type: 'answer', text: ['Loop: load A[i] and B[i] indirectly through R0/R1, multiply, accumulate in R3, advance both pointers, count down N times.'] },
      ],
    },
    {
      id: 'Q2c', topic: 'stack', marks: '[8]', flagged: true,
      q: 'Evaluate the given expression in one-address and two-address instruction notations. Make sure to write statements in assembly language notations. Compare how the number of steps varies depending on the instruction set architecture.\nA = M + (B×C×D) + (N+P+(Q−R))',
      think: [
        'One-address machine = single accumulator (LOAD/STORE/OP with one operand name); two-address machine = `OP src, dst` with general registers. Since + is associative and commutative, rewrite A = (Q − R) + N + P + M + B×C×D: then the whole sum can run in one chain and only the product needs a temporary. Count instructions at the end — that comparison is the last mark.',
      ],
      solution: [
        { type: 'p', text: 'Reorder the additions so each machine evaluates one long chain: A = (Q − R) + N + P + M + (B × C × D). Only the product has to be computed separately.' },
        { type: 'h', text: 'One-address machine (accumulator AC)' },
        { type: 'table', head: ['Instruction', 'Side note'], rows: [
          ['`LOAD B`', 'AC ← B'],
          ['`MUL C`', 'AC ← B×C'],
          ['`MUL D`', 'AC ← B×C×D'],
          ['`STORE T`', 'save the product in a memory temporary'],
          ['`LOAD Q`', 'AC ← Q'],
          ['`SUB R`', 'AC ← Q−R'],
          ['`ADD N`', 'AC ← Q−R+N'],
          ['`ADD P`', 'AC ← Q−R+N+P'],
          ['`ADD M`', 'AC ← M + (N+P+(Q−R))'],
          ['`ADD T`', 'AC ← M + B×C×D + (N+P+(Q−R))'],
          ['`STORE A`', 'A ← result'],
        ], boldFirst: true },
        { type: 'h', text: 'Two-address machine (OP src, dst)' },
        { type: 'table', head: ['Instruction', 'Side note'], rows: [
          ['`MOVE B, R1`', 'R1 ← B'],
          ['`MUL C, R1`', 'R1 ← B×C'],
          ['`MUL D, R1`', 'R1 ← B×C×D — product stays in a register'],
          ['`MOVE Q, R2`', 'R2 ← Q'],
          ['`SUB R, R2`', 'R2 ← Q−R'],
          ['`ADD N, R2`', 'R2 ← Q−R+N'],
          ['`ADD P, R2`', 'R2 ← Q−R+N+P'],
          ['`ADD M, R2`', 'R2 ← M + (N+P+(Q−R))'],
          ['`ADD R1, R2`', 'R2 ← M + B×C×D + (N+P+(Q−R))'],
          ['`MOVE R2, A`', 'A ← result'],
        ], boldFirst: true },
        { type: 'p', text: '**Comparison:** 11 one-address instructions versus 10 two-address instructions. With only an accumulator, the product must go out to a memory temporary T and come back (`STORE T` … `ADD T`), and every instruction touches memory. The two-address machine keeps the product in R1 while R2 builds the sum, so it needs one instruction fewer and fewer memory accesses. The price is longer instructions (two address fields each).' },
        { type: 'answer', text: ['One-address: 11 instructions (accumulator + one memory temporary). Two-address: 10 instructions (both partial results in registers). More address fields → fewer instructions and less memory traffic, but longer instructions.'] },
      ],
    },
    {
      id: 'Q3a', topic: 'vmem', marks: '[6]',
      q: 'Suppose you are constructing a computer. You have a 64-bit processor and a 2 GB main memory. Now consider that you have to run a game of size 5 GB on this computer. Will your processor face any issues while running the game? What technique would you use to solve this potential issue? Show what the memory organization might look like in such a scenario.',
      pattern: 'Same question as Spring 2023 Q3(a) with different sizes — a free 6 marks once.',
      think: [
        'Four moves: (1) yes, there is an issue — 5 GB cannot fit in 2 GB of RAM at once; (2) the fix is virtual memory; (3) draw processor → MMU → main memory ↔ disk; (4) explain why it works with locality.',
      ],
      solution: [
        { type: 'p', text: '**Issue:** yes. The 64-bit processor can address far more than 5 GB, but only 2 GB of physical main memory exists, so the whole 5 GB game cannot be loaded at once.' },
        { type: 'p', text: '**Technique: virtual memory (paging).** The game’s address space is split into pages kept on the disk. Only the pages currently in use are brought into frames of main memory. When the game touches a page that is not in memory, a **page fault** makes the OS load it from disk (replacing an old page if memory is full), and the instruction is retried.' },
        { type: 'diagram', id: 'virtualMemory', caption: 'Organization: the processor issues virtual addresses; the MMU translates them to physical addresses in the 2 GB main memory; pages not in memory are brought in from the disk on a page fault.' },
        { type: 'list', items: [
          'Virtual address space = as large as the processor’s addressing capability; only the **active portion** is mapped onto physical memory.',
          'This works because of **locality of reference**: at any moment the game runs on a small active set of code/data.',
          'The MMU (hardware) + OS (software) translate every virtual address to a physical one; a reference to a non-resident block triggers the load from disk.',
        ] },
        { type: 'answer', text: ['Issue: the 5 GB game exceeds the 2 GB main memory. Solution: virtual memory — the MMU translates virtual to physical addresses and only the pages in use are kept in RAM, the rest on disk. Locality makes this work.'] },
      ],
    },
    {
      id: 'Q3b', topic: 'single-bus', marks: '[6]', inNotes: true,
      q: 'Consider the CPU Architecture given in Fig 3(b)-1 (single-bus CPU organization). Generate the control sequence required for the execution of the following complete instruction in the context of this architecture: SUB (R1), (R2)',
      pattern: 'The flagship repeated question: Fall 2023 SUB, Spring 2023 MUL, Spring 2024 MUL R1,4(R2) — one table format, different opcodes.',
      think: [
        'Semantics: M[[R2]] ← M[[R2]] − M[[R1]] — both operands come from memory and the result returns to the second operand’s address (Hamacher source, destination convention). On the single bus that is: fetch (3 steps), read the destination and park it in Y, read the source and compute Y − MDR into Z, then restore the destination address and write Z back through MDR. Watch the rule: one bus output per step.',
      ],
      solution: [
        { type: 'diagram', id: 'singleBus', caption: 'The architecture of the figure — single internal bus with PC, MAR, MDR, IR, R0…R(n−1), TEMP, Y, MUX (Y / Constant 4), ALU and Z.' },
        { type: 'table', head: ['Step', 'Action', 'Control signals'], rows: [
          ['1', 'Fetch: PC → MAR, Read, PC+4 → Z', '`PCout, MARin, Read, Select4, Add, Zin`'],
          ['2', 'Z → PC; load MDR while waiting', '`Zout, PCin, MDRinE, WMFC`'],
          ['3', 'MDR → IR (instruction decoded)', '`MDRout, IRin`'],
          ['4', 'R2 → MAR, Read (destination operand)', '`R2out, MARin, Read`'],
          ['5', 'Load MDR while waiting for destination operand', '`MDRinE, WMFC`'],
          ['6', 'Destination operand → Y (park it)', '`MDRout, Yin`'],
          ['7', 'R1 → MAR, Read (source operand)', '`R1out, MARin, Read`'],
          ['8', 'Load MDR while waiting for source operand', '`MDRinE, WMFC`'],
          ['9', 'MDR (source operand) → bus; select Y; subtract source from destination; result → Z', '`MDRout, SelectY, Sub, Zin`'],
          ['10', 'R2 → MAR again (destination address)', '`R2out, MARin`'],
          ['11', 'Z → MDR; prepare to write', '`Zout, MDRin`'],
          ['12', 'MDR → external bus; start Write and wait', '`MDRoutE, Write, WMFC, End`'],
        ], boldFirst: true },
        { type: 'note', title: 'Checking your own answer', text: [
          'Every step drives the bus exactly once (or not at all — the WMFC steps). The instruction needs **three** memory operations: 2 reads + 1 write, each read costing a (MARin+Read) step and a (MDRinE+WMFC) step. Y holds destination operand across steps 7–9 because the bus is busy fetching source operand.',
        ] },
        { type: 'answer', text: ['12 steps: 3-step fetch, two read cycles (parking destination operand in Y), one subtract into Z, then re-address [R2] and write Z back via MDR.'] },
      ],
    },
    {
      id: 'Q3c', topic: 'hazards', marks: '[6]',
      q: 'Consider the instructions being executed in a pipeline in the given Fig 3(c)-1 (instructions I4–I7 in clock cycles 4–10). Suppose an instruction hazard occurs due to a cache miss while fetching I5, and it takes 3 clock cycles to fetch I5 from memory. Subsequently, a data hazard occurs for I6 as it depends on data from both I4 and I5 — I6 can only continue once both finish storing their results. Compare how the execution is affected due to the hazards vs. the ideal hazard-free scenario shown in the figure. Show which stages occur during each clock cycle in the two scenarios.',
      pattern: 'The combined-hazard chart; Spring 2023 Q3(c) asks the instruction-hazard half alone.',
      think: [
        'Copy the given ideal table first (cycles 4–10, rows I4–I7). Then two edits: stretch F5 across three cycles (5–7), and hold I6 in Decode until **both** W4 and W5 have completed. The rest of the chart follows mechanically — nothing overtakes anything in an in-order pipeline. Finish with the cycle count of each and the difference.',
      ],
      solution: [
        { type: 'timing', start: 4, columns: 7, rows: [
          { label: 'I4', cells: ['F4', 'D4', 'E4', 'W4', '', '', ''] },
          { label: 'I5', cells: ['', 'F5', 'D5', 'E5', 'W5', '', ''] },
          { label: 'I6', cells: ['', '', 'F6', 'D6', 'E6', 'W6', ''] },
          { label: 'I7', cells: ['', '', '', 'F7', 'D7', 'E7', 'W7'] },
        ], caption: 'Ideal (exactly the given figure): cycles 4–10 — 7 cycles for 4 instructions.' },
        { type: 'h', text: 'With the instruction hazard (I5 cache miss, 3-cycle fetch) + data hazard (I6 needs I4 and I5)' },
        { type: 'timing', start: 4, columns: 11, rows: [
          { label: 'I4', cells: ['F4', 'D4', 'E4', 'W4', '', '', '', '', '', '', ''] },
          { label: 'I5', cells: ['', 'F5', { t: 'F5' }, { t: 'F5' }, 'D5', 'E5', 'W5', '', '', '', ''] },
          { label: 'I6', cells: ['', '', '', '', 'F6', { t: 'D6', box: true }, { t: 'D6', box: true }, 'D6', 'E6', 'W6', ''] },
          { label: 'I7', cells: ['', '', '', '', '', 'F7', 'hold', 'hold', 'D7', 'E7', 'W7'] },
        ], caption: 'Cycles 4–14. F5 occupies cycles 5–7 (the 3-cycle memory fetch); the fetch unit cannot start I6 until cycle 8. I6 starts Decode in cycle 9 but needs a full Decode cycle after W5 completes (cycle 10) — W4 finished in cycle 7 — so its E lands in cycle 12. I7, fetched in cycle 9, holds in the fetch buffer (cycles 10–11) until the Decode stage frees up.' },
        { type: 'p', text: '**Comparison:** cycles 4–14 versus the ideal 4–10 — **4 cycles lost**: 2 to the stretched fetch of I5 (3 cycles instead of 1) and 2 to the data dependency (the repeated Decode of I6). The bubbles propagate downstream through the E and W stages exactly as the stage-view chart in the lectures shows.' },
        { type: 'answer', text: ['Affected execution: cycles 4–14 (11 cycles) vs the ideal 7 — 4 cycles lost to the two hazards; every stage in every cycle is shown above.'] },
      ],
    },
    {
      id: 'Q3d', topic: 'perf', marks: '[6]',
      q: 'Suppose you have a processor that uses a secondary cache memory. The cache miss penalty for the primary and secondary cache are 12 and 16 clock cycles respectively. The miss ratios for instructions, data, and the secondary cache are 15%, 20% and 25%. Suppose that 32% of instructions access memory. Compare the performance of this processor with the performance of a processor consisting of the same configuration but without a secondary cache, and mention which performs better based on throughput.',
      pattern: 'The two-level-cache formula question — Spring 2023 Q3(d) is its sibling. Same formula, different numbers.',
      think: [
        'Interpret 12 and 16 as total additional L1-miss path costs for an L2 hit and for reaching memory. Miss increase = [(1−hi) + d(1−hd)] × [hs·Ms + (1−hs)·Mp] with the L2, and the same with Mp alone without the L2. If 12 and 16 are successive costs instead, the L2 miss pays both. Then TI = 1 + Δ and throughput = R/TI (the clock is common to both machines, so the Δ comparison alone already decides it).',
      ],
      solution: [
        { type: 'p', text: 'Read the numbers into the slide formula: hi = 0.85 (instruction miss ratio 15%), hd = 0.80 (data miss 20%), secondary hit hs = 0.75 (secondary miss 25%), Ms = 12 (primary miss found in the secondary), Mp = 16 (miss that reaches memory), d = 32%.' },
        { type: 'h', text: 'With the secondary cache' },
        { type: 'pre', text: 'Δ = [ (1 − 0.85) + 0.32 × (1 − 0.80) ] × [ 0.75 × 12 + 0.25 × 16 ]\n  = [ 0.15 + 0.064 ] × [ 9 + 4 ]\n  = 0.214 × 13 = 2.782 cycles\n\nTI = 1 + 2.782 = 3.782 cycles/instruction' },
        { type: 'h', text: 'Without the secondary cache' },
        { type: 'pre', text: 'every primary miss goes straight to memory (penalty 16):\nΔ′ = 0.214 × 16 = 3.424 cycles\n\nTI′ = 1 + 3.424 = 4.424 cycles/instruction' },
        { type: 'p', text: 'Throughput = R / TI with the same clock R for both configurations (the critical parameter is unchanged), so the comparison is decided by TI: 3.782 < 4.424. Throughput is 4.424/3.782 ≈ 1.17× higher with L2. If 12 and 16 are successive costs instead, L2 adds 12 + 0.25×16 = 16 cycles per L1 miss, which ties the no-L2 path under the same model.' },
        { type: 'answer', text: ['Under the total-path interpretation, the processor **with** the secondary cache performs better: average 3.782 cycles per instruction versus 4.424 — 75% of L1 misses take the 12-cycle L2-hit path; the remaining 25% take the 16-cycle memory path.'] },
      ],
    },
    {
      id: 'Q3e', topic: 'perf', marks: '[6]',
      q: 'Suppose you have a computer with a primary cache that takes 11 clock cycles per memory access and a cache access time of 2 clock cycles; the hit rates for instructions and data are 90% and 85%. You have a second computer with 2 cache memories with access times of 1 and 5 clock cycles and a memory access time of 16 clock cycles. The miss rates in the 1st cache for instructions and data are 5% and 9%; the hit rates in the 2nd cache are 65% and 78%. Assume 25% of the instructions require memory access. Compare the performances of the 2 computers based on time and state which one performs better.',
      pattern: 'The tave comparison — Spring 2023 Q3(e) is the same question with a cache-less first computer; this is the Chapter 5 “measuring cache performance” example in disguise.',
      think: [
        'Treat the quoted times as complete path times under the course’s weighted-path convention. Computer 1 is a **one-level** cache: tave = h·C + (1−h)·M per access type. Computer 2 is **two-level**: tave = h₁C₁ + (1−h₁)h₂C₂ + (1−h₁)(1−h₂)M. Then do the per-100-instruction bookkeeping: 100 instruction fetches + 25 data accesses.',
      ],
      solution: [
        { type: 'h', text: 'Computer 1 — one cache level (C = 2, M = 11)' },
        { type: 'pre', text: 'instructions:  tave,I = 0.90×2 + 0.10×11 = 1.80 + 1.10 = 2.90 cycles\ndata:          tave,D = 0.85×2 + 0.15×11 = 1.70 + 1.65 = 3.35 cycles\nper 100 instructions: 100×2.90 + 25×3.35 = 290 + 83.75 ≈ 373.75 cycles' },
        { type: 'h', text: 'Computer 2 — two cache levels (C₁ = 1, C₂ = 5, M = 16)' },
        { type: 'pre', text: 'instructions:  tave,I = 0.95×1 + 0.05×(0.65×5 + 0.35×16) = 0.95 + 0.4425 = 1.3925 cycles\ndata:          tave,D = 0.91×1 + 0.09×(0.78×5 + 0.22×16) = 0.91 + 0.6678 = 1.5778 cycles\nper 100 instructions: 100×1.3925 + 25×1.5778 = 139.25 + 39.45 ≈ 178.7 cycles' },
        { type: 'p', text: '**Comparison:** 178.7 vs 373.75 cycles for the same 100 instructions — the two-level machine is about **2.1× faster**, because its tiny L1 (1 cycle) absorbs ~95% of all accesses and its L2 catches most of the remainder before the slow 16-cycle memory is touched.' },
        { type: 'note', text: 'If the access times are successive costs, computer 1 uses 100×(2+0.10×11)+25×(2+0.15×11) = 401.25 memory cycles, and computer 2 uses 197.17 by the same additive model as Spring 2023 Q3(e).' },
        { type: 'answer', text: ['Using the weighted-path convention and a common clock, computer 2 has lower memory-access time: ≈178.7 vs ≈373.75 cycles per 100 instructions (≈2.1×), from the separate tave calculations above.'] },
      ],
    },
    {
      id: 'Q3f', topic: 'cache', marks: '[6]',
      q: 'Demonstrate, with relevant figures and explanation, the Set-Associative Mapping function for placing memory blocks in the cache, considering that the memory address length is 32 bits, each block consists of 32 memory locations and each set consists of 64 blocks.',
      pattern: 'The mapping family again — this variant asks for the drawing and the address division rather than a numeric placement.',
      think: [
        'Word field = log2(32) = 5 bits — fixed by the block size. The number of sets is not given, so carry it as S: set field = log2 S, tag = 32 − 5 − log2 S, and cache size = 64 × S blocks. Draw the slide’s set-associative figure and state one concrete instance (e.g. S = 64) so the numbers are visible.',
      ],
      solution: [
        { type: 'diagram', id: 'setAssocMap', caption: 'Chapter 5 template: the figure shows a 16-bit address and two ways per set. For this paper, redraw each set with 64 ways and label the 32-bit address Tag (27−log₂ S) | Set (log₂ S) | Word (5).' },
        { type: 'p', text: 'Set-associative mapping is the **combination** of direct and associative mapping: blocks of the cache are grouped into sets, and the mapping allows a memory block to reside in **any block of a specific set** — here each set has **64 block positions**, so each memory block has 64 candidate homes.' },
        { type: 'h', text: 'Address division (32-bit address)' },
        { type: 'list', items: [
          '**Word field**: 32 locations per block → log2(32) = **5 bits**.',
          '**Set field**: for S sets → **log2 S bits**. (The paper fixes blocks-per-set, not the set count; with, for example, S = 64 sets the cache holds 64 × 64 = 4096 blocks and the set field is 6 bits.)',
          '**Tag field**: 32 − 5 − log2 S bits (with S = 64: **21 bits**), compared against the tags of all 64 blocks of the selected set.',
        ] },
        { type: 'p', text: '**Placement rule:** the set number = memory block number mod S. With S = 64: blocks 0, 64, 128, … all map to set 0 and may occupy **any** of its 64 positions. **Hit test:** the set field selects the set; the tag is compared (in parallel) with the 64 stored tags of that set; match + valid bit = 1 → hit. **On a miss** the block is fetched into that set, evicting whichever position the replacement algorithm (typically LRU) picks.' },
        { type: 'list', items: [
          'One extreme — all cache blocks in a single set (no set bits): **fully associative** mapping.',
          'Other extreme — one block per set: **direct** mapping.',
          'So set-associative trades comparator cost against placement freedom, and the blocks-per-set is the design parameter.',
        ] },
        { type: 'answer', text: ['32-bit address = tag (27 − log2 S bits) | set (log2 S) | word (5); set = block number mod S; within the set any of 64 positions; hit = parallel tag compare inside the set. Example S = 64 → tag 21 / set 6 / word 5.'] },
      ],
    },
  ],
}
