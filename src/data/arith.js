// Arithmetic — the self-study module the slides point to (Patterson & Hennessy §3.5:
// multiplication, division, floating-point). Class notes pp. 1–4 hold the worked
// multiplication example and the algorithm; the papers ask 6-bit, 5-bit and 4-bit versions.
export default {
  id: 'arith',
  chapter: 'Slides 4 · Self-study (P&H §3.5)',
  title: 'Arithmetic: multiplication, division, floating point',
  blurb: 'The self-study part of the course: sequential multiplication and division hardware traced register by register, IEEE single-precision representation and conversions, and the addition flowchart.',
  tags: ['multiplication', 'division', 'restore', 'IEEE 754', 'single precision', 'flowchart'],
  prereq: [
    'Binary ↔ decimal conversion, including fractions (0.101 = 1/2 + 0/4 + 1/8 = 0.625).',
    'Shifts: a left shift doubles a binary number, a right shift halves it — the whole multiplication algorithm is built on this.',
    'Two’s complement for subtraction. Review binary place values and signed ranges in Foundations if needed.',
  ],
  sections: [
    {
      heading: 'Unsigned multiplication — the paper method first',
      blocks: [
        { type: 'p', text: 'Binary multiplication only ever multiplies by 0 or 1, so each partial product is either the multiplicand shifted or zero:' },
        { type: 'pre', text: '      1011   multiplicand (11)\n      1001   multiplier  (9)\n      ----\n      1011   ← multiplier bit 0 = 1: add multiplicand\n     00000    ← bit 1 = 0: add nothing, still shift\n    000000    ← bit 2 = 0\n   1011000    ← bit 3 = 1: multiplicand shifted left 3\n   -------\n   1100011   product = 99 = 11 × 9 ✓' },
        { type: 'p', text: 'From the class notes, the four rules of the sequential algorithm:' },
        { type: 'steps', items: [
          'Multiplier **LSB = 1** → `Product = Product + Multiplicand`.',
          'Multiplier **LSB = 0** → no operation.',
          '**Left-shift the multiplicand** (it doubles, ready for the next bit).',
          '**Right-shift the multiplier** (bring the next bit to the LSB).',
        ] },
        { type: 'p', text: 'Loop until the multiplier becomes 0 — the loop runs at most **n times for an n-bit multiplier** (that is how many bits must be tested).' },
        { type: 'p', text: 'Register widths for 32 × 32 → 64-bit product (from the notes): multiplier 32 bits; multiplicand zero-extended to 64 bits before shifts; product 64 bits, because (2^32 − 1)² < 2^64.' },
        { type: 'diagram', id: 'seqMultiplier', caption: 'Sequential multiplication hardware: multiplicand (shift left), ALU, product (accumulates without shifting), multiplier (shift right), control tests the multiplier LSB.' },
      ],
    },
    {
      heading: 'Multiplication worked example: 4 × 3 in 4 bits (class notes)',
      blocks: [
        { type: 'p', text: 'Multiplicand 0100 (4), multiplier 0011 (3), product starts 0000 0000. Two loops (after two right-shifts the multiplier is 0):' },
        { type: 'table', head: ['Step', 'Multiplier', 'Multiplicand', 'Product'], rows: [
          ['initial', '0011', '0000 0100', '0000 0000'],
          ['L1: LSB = 1 → add', '0011', '0000 0100', '0000 0100'],
          ['L1: left-shift multiplicand', '0011', '0000 1000', '0000 0100'],
          ['L1: right-shift multiplier', '0001', '0000 1000', '0000 0100'],
          ['L2: LSB = 1 → add', '0001', '0000 1000', '0000 1100'],
          ['L2: left-shift multiplicand', '0001', '0001 0000', '0000 1100'],
          ['L2: right-shift multiplier', '0000', '0001 0000', '0000 1100'],
        ], caption: 'Multiplier is now 0000 → stop. Product = 0000 1100 = 12 = 4 × 3 ✓' },
        { type: 'think', text: [
          'Check yourself with columns, not prose: every row changes **at most one** register, and the add row is the only one that touches Product. In the exam, write exactly this table — the marker looks for the (add, shift-multiplicand, shift-multiplier) triple per loop. Scale the widths to whatever the paper gives (5-bit in Spring 2023: 31 × 13; 6-bit in Fall 2023: 60 × 15) — the table shape never changes.',
        ] },
        { type: 'practice', prompt: 'Multiply 9 × 6 as 4-bit unsigned operands. Write the add/skip decision and the 8-bit product after each iteration; include the skipped bit.', blocks: [
          { type: 'table', head: ['Round', 'Multiplier before shift', 'Multiplicand before shift', 'Product after test'], rows: [['1', '0110', '00001001', '00000000 (skip)'], ['2', '0011', '00010010', '00010010 (add)'], ['3', '0001', '00100100', '00110110 (add)']] },
          { type: 'answer', text: 'Final product 0011 0110 = 54. The multiplier reaches 0000 after three shifts; a fixed four-round implementation then has one extra skip.' },
        ] },
      ],
    },
    {
      heading: 'Division — first version hardware and the restoring algorithm',
      blocks: [
        { type: 'diagram', id: 'divHardware', caption: 'First version of the division hardware: Remainder (8 bits), Divisor (8 bits), ALU, Quotient (4 bits) — the widths the Spring 2024 paper uses.' },
        { type: 'p', text: 'Setup: put the dividend in the **right half** of the wide Remainder register and the divisor in the **left half** of the Divisor register. Then repeat **n + 1 times** (n = dividend width):' },
        { type: 'steps', items: [
          '**Trial subtract**: `Remainder = Remainder − Divisor`.',
          'If the new Remainder ≥ 0: shift Quotient left and set its new LSB to **1**.',
          'If it went negative: **restore** by adding the Divisor back, then shift Quotient left (LSB stays **0**).',
          'Shift the **Divisor right** one bit.',
        ] },
        { type: 'p', text: 'At the end the Quotient register holds the quotient and the Remainder register the remainder. The right-shifting-divisor version shown here is the one asked for in Spring 2024. A different restoring implementation keeps the divisor fixed and shifts the combined remainder/quotient register; follow the register motions specified in the question.' },
        { type: 'think', text: [
          'Why left-align the divisor? Because subtracting “the divisor times 2^n” is the first thing long division tries — the hardware mirrors the paper method: try the biggest shifted divisor first; if it does not fit (negative remainder), undo and try half. Each iteration therefore decides exactly one quotient bit, MSB first.',
          'Why n+1 iterations and not n? The first trial uses divisor × 2^n and emits a leading 0 for every nonzero divisor. The next n trials test shifts n−1 down to 0 and form the n-bit quotient. Reject division by zero before starting. If a wide unsigned trial can overflow the signed ALU range, use the subtraction borrow or an extra bit to detect failure.',
        ] },
      ],
    },
    {
      heading: 'Division worked example: 7 ÷ 2 (Spring 2024)',
      blocks: [
        { type: 'p', text: 'Dividend 7 = 0111 → Remainder = `0000 0111`; divisor 2 → Divisor = `0010 0000` (left half); Quotient = `0000`. Five iterations (4-bit dividend):' },
        { type: 'table', head: ['Iter', 'Trial subtract', 'Result ≥ 0?', 'Quotient', 'Divisor after shift right'], rows: [
          ['1', '0000 0111 − 0010 0000 = negative', 'no → restore', '0000', '0001 0000'],
          ['2', '0000 0111 − 0001 0000 = negative', 'no → restore', '0000', '0000 1000'],
          ['3', '0000 0111 − 0000 1000 = negative', 'no → restore', '0000', '0000 0100'],
          ['4', '0000 0111 − 0000 0100 = 0000 0011', 'yes → Q bit 1', '0001', '0000 0010'],
          ['5', '0000 0011 − 0000 0010 = 0000 0001', 'yes → Q bit 1', '0011', '0000 0001'],
        ], caption: 'Quotient = 0011 = 3, Remainder = 0000 0001 = 1 → 7 = 2 × 3 + 1 ✓' },
        { type: 'note', title: 'Reading the table in the exam', text: ['Show the trial-subtract result, the ≥ 0 test, and the restore step in separate columns — restoring is where the marks are. End with the boxed check “dividend = divisor × quotient + remainder”.'] },
        { type: 'practice', prompt: 'Trace 13 ÷ 3 in the same 8-bit remainder/divisor and 4-bit quotient hardware. For each trial give the aligned divisor, whether it fits, and the remaining value.', blocks: [
          { type: 'answer', text: 'Trials 48, 24, 12, 6, 3 yield bits 0, 0, 1, 0, 0. Remainders after restoration/acceptance: 13, 13, 1, 1, 1. Quotient 0100 = 4 and remainder 00000001 = 1. Check 13 = 3×4 + 1, with 1 < 3.' },
        ] },
      ],
    },
    {
      heading: 'IEEE single-precision floating point',
      blocks: [
        { type: 'p', text: 'A 32-bit word splits into **1 sign bit S**, an **8-bit exponent E** (bias **127**), and a **23-bit fraction F**. Normalized value:' },
        { type: 'pre', text: 'value = (−1)^S × 1.F × 2^(E − 127)' },
        { type: 'list', items: [
          'The leading “1.” is **hidden** — not stored, because a normalized binary mantissa always starts with 1.',
          'If E = 0 and F = 0, the value is signed zero. If E = 0 and F ≠ 0, the number is **denormalized**: `value = (−1)^S × 0.F × 2^(−126)` — no hidden bit, used to soften the gap around zero.',
          'E = 255 (all ones) is reserved for ±∞ (F = 0) and NaN (F ≠ 0).',
        ] },
        { type: 'h', text: 'Decimal → IEEE (e.g. −13.25)' },
        { type: 'steps', items: [
          'Integer and fraction in binary: 13.25 = 1101.01.',
          'Normalize: 1101.01 = 1.10101 × 2^3.',
          'S = 1 (negative). Exponent field = 3 + 127 = 130 = 1000 0010. Fraction = 1010 1000 …0 (23 bits).',
          'Word: `1 | 10000010 | 10101000000000000000000`.',
        ] },
        { type: 'h', text: 'IEEE → decimal (e.g. the bit pattern the papers give)' },
        { type: 'steps', items: [
          'Split S | E | F on the 1-8-23 boundaries; convert E to decimal.',
          'For a normal value, true exponent = E − 127 and significand = 1 + Σ Fᵢ·2^(−i). For a subnormal, true exponent = −126 and significand = 0.F. Handle zeros, infinities and NaNs from their fields first.',
          'Assemble: value = (−1)^S × mantissa × 2^(true exponent).',
        ] },
        { type: 'note', title: 'Denormalized extremes (asked in Fall 2022)', text: [
          'Highest positive denormalized: S=0, F = all 1s → 0.111…1 × 2^(−126) = (1 − 2^(−23)) × 2^(−126).',
          'Lowest positive denormalized: F = 000…1 → 2^(−23) × 2^(−126) = 2^(−149), the smallest representable positive number.',
          'Highest negative (closest to zero from below): −2^(−149); lowest negative (largest magnitude): −(1 − 2^(−23)) × 2^(−126).',
        ] },
        { type: 'think', text: [
          'The one mistake that costs the whole question: applying the hidden bit to a denormalized number (E = 0). Check E first: 0 uses 0.F × 2^(−126), 255 is special, and only 1 through 254 use 1.F × 2^(E−127).',
        ] },
        { type: 'practice', prompt: 'Decode 0x3FC00000 as IEEE single precision. Then change only the exponent field to all zeroes. How does the hidden bit change?', blocks: [
          { type: 'answer', text: 'The original is 1.1₂ × 2⁰ = 1.5 (E=127). The altered pattern 0x00400000 is subnormal, so it is 0.1₂ × 2^(−126) = 2^(−127).' },
        ] },
      ],
    },
    {
      heading: 'Floating-point addition: flowchart and block diagram',
      blocks: [
        { type: 'p', text: 'The slides ask for the **flowchart and block diagram** of floating-point addition. The flowchart in order:' },
        { type: 'steps', items: [
          'Compare exponents; find the difference d = |Ea − Eb|.',
          '**Align**: shift the mantissa of the smaller-exponent operand right by d (it becomes 0.F-form relative to the larger exponent).',
          'Add (or subtract, per the signs) the two mantissas — the ALU step.',
          'If the result mantissa is 0, finish with +0.',
          '**Normalize**: shift left while the leading 1 is not in the hidden position (each left shift decrements the exponent), or shift right one if the addition carried out (exponent +1).',
          '**Round** to 23 fraction bits; re-normalize if rounding carried out again.',
          'Under round-to-nearest, overflow goes to signed infinity. A tiny result can become subnormal or round to zero. Handle NaN, infinity and signed zero separately; the steps here trace finite operands under round-to-nearest.',
        ] },
        { type: 'p', text: 'The matching **block diagram** boxes: exponent comparator → aligner (right-shifter) → mantissa adder/subtractor → normalizer (left/right shifter) → rounding logic → exponent adjust, all wrapped around the same control loop as the flowchart.' },
        { type: 'think', text: [
          'Why align before adding? Two numbers like 2^5 × 1.1 and 2^3 × 1.01 must have the same exponent before their fraction digits line up — exactly like aligning decimal points. The smaller exponent always shifts right, never the larger, so no precision is spent on the bigger number’s leading bits.',
        ] },
        { type: 'note', title: 'Guard, round, sticky (P&H §3.5 precision bits)', text: [
          'When the aligner shifts a mantissa right, bits would be lost. The hardware keeps **guard** (first extra bit), **round** (second extra bit) and **sticky** (OR of everything shifted out beyond that) so rounding is correct. With round-to-nearest, ties-to-even, increment the retained significand when G = 1 and at least one of R, S, or the least significant retained bit is 1. They are only extra precision during the operation — the stored result stays 23 bits. Fall 2022 Q5(b)(ii) asks for exactly this explanation.',
        ] },
        { type: 'diagram', id: 'fpAdder', caption: 'Finite operands: compare exponents and align the smaller significand, then add or subtract, normalize, round, and pack. The selected exponent feeds normalization and packing.' },
        { type: 'example', title: 'Worked addition: 1.5 + 0.75', blocks: [
          { type: 'steps', items: ['Write 1.5 as 1.1₂×2⁰ and 0.75 as 1.1₂×2⁻¹.', 'Align to exponent 0: 0.75 becomes 0.11₂×2⁰.', 'Add: 1.10₂ + 0.11₂ = 10.01₂. Shift right and increment exponent: 1.001₂×2¹.', 'All discarded bits are zero. Pack S=0, E=128 (10000000₂), F=001 followed by twenty zeroes.'] },
          { type: 'answer', text: '0x40100000 = 2.25.' },
        ] },
        { type: 'practice', prompt: 'Add 1.25 + (−0.75) by alignment and normalization. Give the packed exponent and fraction.', blocks: [
          { type: 'answer', text: 'Align to exponent 0: 1.01₂ − 0.11₂ = 0.10₂. Normalize left to 1.0₂×2⁻¹. S=0, E=126, F=0; result 0.5 = 0x3F000000.' },
        ] },
      ],
    },
  ],
}
