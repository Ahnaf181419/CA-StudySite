// Prerequisites and recurring questions from the Hamacher-track papers.
export default {
  id: 'foundations',
  chapter: 'Prerequisites · Past-paper topics',
  title: 'Foundations: bits, instructions and assembly',
  blurb: 'Read an instruction, calculate its effective address, trace a single-bus datapath, and write array loops and stack programs.',
  tags: ['binary', 'addressing', 'register gating', 'assembly', 'stack'],
  sections: [
    {
      heading: 'Bits, signed values and address units',
      blocks: [
        { type: 'p', text: 'From the binary point, positions to the left have weights 1, 2, 4, 8, … and positions to the right have weights 1/2, 1/4, 1/8, …. Thus 1011.01₂ = 8 + 2 + 1 + 1/4 = 11.25. Group binary digits into fours for hex: 1011 1100₂ = BC₁₆. Preserve leading zeroes when a field has a fixed width.' },
        { type: 'p', text: 'An n-bit pattern has 2ⁿ possible values. For unsigned integers the range is 0 to 2ⁿ−1. For two’s complement the top bit has weight −2ⁿ⁻¹, so the range is −2ⁿ⁻¹ through 2ⁿ⁻¹−1. You can also decode a negative value by reading it unsigned and subtracting 2ⁿ. To encode a representable negative number, write its magnitude in n bits, invert the bits and add 1.' },
        { type: 'p', text: 'A byte is 8 bits. The word size is given by the machine or question. A 16-bit **byte** address names 65,536 bytes; a 16-bit **word** address names 65,536 words. If a word is four bytes, moving to the next word adds 4 on a byte-addressed machine and 1 on a word-addressed machine. These units control the PC increment, array stride and cache offset.' },
        { type: 'practice', prompt: 'Decode 1110 1001₂ as an 8-bit unsigned integer and as two’s complement. What is its hex representation?', blocks: [
          { type: 'answer', text: '0xE9. Unsigned: 14×16 + 9 = 233. Signed: top bit is 1, so 233 − 256 = −23.' },
        ] },
      ],
    },
    {
      heading: 'Registers, operands and effective addresses',
      blocks: [
        { type: 'p', text: 'The **ISA** defines the instructions, registers and addressing behavior visible to software. The **datapath** implements their data movement and arithmetic. PC holds an instruction address, IR holds the instruction being decoded, MAR holds the memory address for a transfer, and MDR holds the data crossing the memory interface. General-purpose registers hold operands, addresses and results.' },
        { type: 'p', text: 'In the Hamacher examples, two-operand arithmetic uses **source, destination** order. For example, SUB R1,R2 means R2 ← R2 − R1. The Fall 2024 three-operand example uses **source, source, destination**. Read the question’s convention first; the 2022 MIPS examples put the destination first.' },
        { type: 'table', head: ['Operand', 'What it means'], rows: [
          ['R2', 'Register direct: use R2 itself.'],
          ['#20', 'Immediate: use the constant 20.'],
          ['X', 'Absolute/direct memory: use the location at label X.'],
          ['(R2)', 'Register indirect: effective address is the old contents of R2.'],
          ['20(R1,R2)', 'Base + index + displacement: effective address = R1 + R2 + 20.'],
          ['(R2)+', 'Autoincrement: use the address in R2, then add the operand size to R2.'],
          ['−(R2)', 'Autodecrement: subtract the operand size first, then use the new address. If a question uses (R2)− and defines post-decrement, use the old address first.'],
        ] },
        { type: 'practice', prompt: 'With R1 = 100 and R2 = 24 on a byte-addressed machine, classify the operands of ADD 8(R1,R2), R3. Which address is read? What changes if the source becomes (R1)+ and the word size is four bytes?', blocks: [
          { type: 'answer', text: 'The first source is indexed with displacement and reads memory at 132; the destination is register direct. With (R1)+ the source comes from address 100 and R1 becomes 104 after the access. The sum goes to R3 in both cases.' },
        ] },
      ],
    },
    {
      heading: 'Single-bus datapath and register gating',
      blocks: [
        { type: 'p', text: 'This material prepares you for questions that supply a single-bus figure. The main Chapter 7 module starts at the three-bus design. On one bus, only one output may drive the wires at a time. Multiple inputs can latch the same bus value. Y holds one ALU input while the other uses the bus, and Z latches the result so it can drive the bus in a later cycle.' },
        { type: 'diagram', id: 'singleBus', caption: 'Follow the data path from a source register to the bus, through the ALU to Z, then from Z back onto the bus.' },
        { type: 'diagram', id: 'registerGating', caption: 'Register-level gating. Riin controls loading from the bus and Riout controls driving it. Y and Z use their own enables.' },
        { type: 'p', text: 'Rin enables the register to latch the bus at the clock edge. Rout enables its tri-state output drivers. With Rout low the drivers are high-impedance, leaving the bus available to another register. During memory reads, MAR supplies the address, Read initiates the transfer and WMFC holds the control step until MDR receives the data. Use MDR on the internal bus in a later step.' },
        { type: 'diagram', id: 'registerBit', caption: 'Expand a register into one slice per bit. Each slice has an input selector, a D flip-flop and an output buffer. Every slice shares Riin, Riout and Clock.' },
        { type: 'example', title: 'Trace SUB R1,R2 after instruction fetch', blocks: [
          { type: 'table', head: ['Step', 'Signals', 'Value at end of step'], rows: [
            ['1', 'R2out, Yin', 'Y ← R2'],
            ['2', 'R1out, SelectY, Sub, Zin', 'Z ← Y − R1 (check ALU operand order on the figure)'],
            ['3', 'Zout, R2in, End', 'R2 ← Z'],
          ] },
        ] },
        { type: 'practice', prompt: 'Write the execute steps for ADD (R1),R2 on the one-bus figure. Include the wait and identify the register holding the ALU result.', blocks: [
          { type: 'steps', items: ['R1out, MARin, Read.', 'MDRinE, WMFC.', 'R2out, Yin.', 'MDRout, SelectY, Add, Zin.', 'Zout, R2in, End.'] },
          { type: 'answer', text: 'R2 receives old R2 + M[old R1]. Z holds the result between the last two steps.' },
        ] },
      ],
    },
    {
      heading: 'Array loops and passing parameters in registers',
      blocks: [
        { type: 'p', text: 'Before writing code, assign registers for the pointer, the number of elements left, the accumulator and the current value. The loop invariant for a sum is: after k iterations, the accumulator equals the sum of the first k elements, the pointer is base + k×stride, and the counter is n−k. Save n separately if you need it after the loop.' },
        { type: 'example', title: 'Sum n positive-count, 4-byte elements by register-indirect addressing', blocks: [
          { type: 'pre', text: 'Input: R1 = base, R2 = n > 0; output: R0 = sum\n        CLEAR R0\nLOOP:   ADD (R1)+, R0\n        DEC R2\n        BNE LOOP\n        RETURN', caption: 'DEC sets the flags for BNE. If n may be zero, test it before entering the loop. Callers put base and count in the agreed registers before CALL and read the return value in R0.' },
          { type: 'list', items: ['Mean: save the original count, sum, then divide by that saved value. State integer division if used.', 'Product: initialize the accumulator to 1, then multiply by each element.', 'Dot product: advance two pointers, multiply the two current elements, and add that product to an accumulator initialized to 0.'] },
        ] },
        { type: 'practice', prompt: 'Trace a dot product for arrays [2, 3] and [4, 5]. Give the accumulator and count after each pass and state how far each pointer advanced.', blocks: [
          { type: 'answer', text: 'Start with sum = 0 and count = 2. After pass 1: sum = 8, count = 1, each pointer +4 bytes. After pass 2: sum = 23, count = 0, each pointer +8 bytes from its original base.' },
        ] },
      ],
    },
    {
      heading: 'Expression evaluation and ISA performance',
      blocks: [
        { type: 'p', text: 'For a two-address machine, one operand also holds the result. A one-address machine uses an implicit accumulator (AC). A zero-address stack ALU pops its right operand first and its left operand second, computes left OP right, then pushes the result. PUSH and POP still name the memory locations they move.' },
        { type: 'table', head: ['Format', 'Compute Z = (A − B) × C', 'Count'], rows: [
          ['Two-address', 'MOV A,R1 → SUB B,R1 → MUL C,R1 → MOV R1,Z', '4'],
          ['One-address', 'LOAD A → SUB B → MUL C → STORE Z', '4'],
          ['Zero-address', 'PUSH A → PUSH B → SUB → PUSH C → MUL → POP Z', '6'],
        ] },
        { type: 'p', text: 'Instruction count alone cannot rank designs. CPU time = dynamic instructions × average cycles per instruction ÷ clock rate. RISC designs often use regular instructions and explicit loads/stores. CISC designs can express more work in a single instruction, sometimes with more cycles or more complicated decoding. Compare actual values of all three factors for the same workload.' },
        { type: 'practice', prompt: 'Write stack code for Z = A − (B − C). Then compare two CPUs: X executes 120 million instructions at CPI 1.5 and 2 GHz; Y executes 90 million at CPI 2 and 3 GHz.', blocks: [
          { type: 'answer', text: 'PUSH A → PUSH B → PUSH C → SUB → SUB → POP Z. The inner subtraction must leave B−C on top of A. X takes 0.09 s; Y takes 0.06 s and is 1.5× as fast on this workload.' },
        ] },
      ],
    },
  ],
}
