// Supplemental material for the 2022 Patterson & Hennessy papers.
export default {
  id: 'older-papers',
  chapter: 'Supplement · 2022 papers',
  title: 'Older papers: MIPS, error correction and system design',
  blurb: 'Learn the extra methods behind the 2022 papers after working through the current lecture modules.',
  tags: ['MIPS', 'Hamming', 'RAID', 'QPI'],
  sections: [
    {
      heading: 'MIPS instructions, loops and machine encoding',
      blocks: [
        { type: 'p', text: 'In MIPS, add rd,rs,rt puts rs+rt into rd. Loads and stores use a byte displacement from a register: lw rt,d(rs) reads memory at rs+d into rt. To load A[i] for four-byte integers, shift i left twice, add the base address, then load at displacement 0. To translate a while loop, put its test at the top, branch out when false, and jump back after updating its variables. Follow the paper’s assumptions about delay slots.' },
        { type: 'table', head: ['Format', 'Fields from left to right', 'Examples'], rows: [
          ['R', 'op(6) | rs(5) | rt(5) | rd(5) | shamt(5) | funct(6)', 'op=0; add funct=32, sub=34, slt=42, sll=0'],
          ['I', 'op(6) | rs(5) | rt(5) | imm(16)', 'addi op=8, lw=35, sw=43, beq=4'],
          ['J', 'op(6) | index(26)', 'j op=2'],
        ] },
        { type: 'p', text: 'Register numbers: $zero=0, $a0…$a3=4…7, $t0…$t7=8…15, $s0…$s7=16…23. For BEQ, compute signed imm = (target − (PC+4))/4. For J, encode address bits 27…2; the top four target bits come from PC+4, and the bottom two bits are 0. If the question specifies a custom branch rule, use its units and base address.' },
        { type: 'practice', prompt: 'Encode BEQ $t0,$zero,LOOP at 0x100C when LOOP is at 0x1000. Show the immediate and the instruction in hex.', blocks: [
          { type: 'answer', text: 'PC+4 = 0x1010, so the offset is −16/4 = −4 words, or 0xFFFC in 16-bit two’s complement. op=4, rs=8, rt=0 → 0x1100FFFC.' },
        ] },
      ],
    },
    {
      heading: 'MIPS datapath and adding an instruction',
      blocks: [
        { type: 'pre', text: 'PC → instruction memory → decode and register-file read\n                                       ↓\n         immediate/register selection → ALU → data memory (load/store)\n                                         ↘ ALU result or loaded word → register write\nPC + 4 and branch/jump logic → next PC' },
        { type: 'p', text: 'For each instruction, identify its register reads, ALU inputs and operation, memory address and access, destination register, result source, and next PC. Translate each choice into the mux and enable settings on the supplied figure. In the classic 5-stage pipeline these operations are divided into IF, ID, EX, MEM and WB. An ALU result is ready after EX; a loaded value is ready after MEM. An immediately following ALU consumer needs a one-cycle load-use stall with the usual forwarding paths.' },
        { type: 'p', text: 'For a custom instruction, compare its required data with what the given datapath makes available in one cycle. An add3 needs three register reads and two additions; an operation on a loaded memory operand needs an ALU operation after the data memory read. Show extra read ports, selectors or ALUs if the design must remain single-cycle, or schedule more steps with temporary storage if multicycle execution is allowed. ALUOp encodes instruction classes; the ALU-control decoder combines it with any function field. Use the paper’s encoding table when deriving the Boolean logic.' },
        { type: 'note', text: 'Signed SLT returns 1 when rs < rt, otherwise 0. A subtract-based ALU uses the sign of rs−rt corrected for signed overflow: sign XOR overflow. For unsigned comparison use the borrow result (or the inverse of carry-out in a subtractor that uses addition with the complemented operand).' },
        { type: 'practice', prompt: 'Trace LW $t0,12($s0) when $s0 = 100 and the word at address 112 is 37. Which value reaches the ALU, the memory address input and the register write port?', blocks: [
          { type: 'answer', text: 'The ALU gets 100 and sign-extended 12 and adds them. Data memory reads address 112. The write-back selector chooses memory output 37, so register $t0 is written with 37.' },
        ] },
      ],
    },
    {
      heading: 'Hamming single-error correction',
      blocks: [
        { type: 'p', text: 'Choose r check bits so 2ʳ ≥ data bits + r + 1, allowing one syndrome for each bit location plus zero for no detected error. Number positions starting from 1 and state your direction. Put parity bits at 1, 2, 4, 8, … and data in the other positions. Under even parity, check bit p covers all positions whose binary index contains the p bit, including p itself.' },
        { type: 'example', title: 'Hamming(7,4), even parity, positions written left to right', blocks: [
          { type: 'p', text: 'Place data 1011 at positions 3, 5, 6, 7. P1 checks 1,3,5,7 → 0; P2 checks 2,3,6,7 → 1; P4 checks 4,5,6,7 → 0. The codeword is 0110011. If position 6 flips, checks 2 and 4 fail, so the syndrome is 2+4=6. Flip position 6 back and extract positions 3,5,6,7 to recover 1011.' },
        ] },
        { type: 'note', text: 'The syndrome requires the received check bits. If the question provides the original and received payloads only, state the assumption that the parity bits generated from the original payload arrived unchanged. A plain SEC code assumes at most one error. Adding overall parity enables single-error correction and double-error detection.' },
        { type: 'practice', prompt: 'Decode received 0110111 using the same left-to-right Hamming(7,4) convention. Which checks fail and what is the recovered payload?', blocks: [
          { type: 'answer', text: 'Checks 1 and 4 fail, giving syndrome 5. Flip position 5, giving 0110011. The data in positions 3,5,6,7 is 1011.' },
        ] },
      ],
    },
    {
      heading: 'Storage, interconnects and system trade-offs',
      blocks: [
        { type: 'list', items: [
          '**RAID 1** mirrors each block; a logical write updates both copies, potentially in parallel. **RAID 5** distributes parity across drives; a small read-modify-write commonly reads old data and parity, computes new parity, then writes new data and parity. A full-stripe write computes parity directly from the new data. State the access pattern before comparing performance.',
          '**QPI** carries high-speed signals over differential pairs. The receiver responds to the difference between the two wires, so noise picked up equally on both largely cancels. Explain the mechanism with V₊−V₋ rather than treating the two wires as independent bits.',
          '**Flash and RRAM** both retain data without power. Flash stores charge and erases in blocks; RRAM stores a resistance state. For a firmware choice, compare erase/program granularity, retention, endurance, hardware support and cost for the device under discussion.',
          '**ISA vs microarchitecture**: the ISA specifies software-visible behavior. A microarchitecture chooses datapath, control, caches and pipeline to implement it. The same ISA can run on implementations with different cycle times and CPI.',
          '**Processor–memory performance gap**: locality gives repeated or nearby accesses a fast path through caches. Larger transfers amortize startup latency, and prefetching or overlapping independent work can hide latency. Explain which mechanism reduces traffic, raises bandwidth or hides stalls.',
        ] },
        { type: 'practice', prompt: 'An array receives single-block overwrites. Trace how a two-copy mirror and a RAID 5 read-modify-write handle one overwrite.', blocks: [
          { type: 'answer', text: 'A mirror writes the new block to both copies. RAID 5 reads the old data and old parity, forms new parity = old parity XOR old data XOR new data, then writes the new data and new parity. This counts disk operations; actual elapsed time also depends on concurrency and controller buffering.' },
        ] },
      ],
    },
  ],
}
