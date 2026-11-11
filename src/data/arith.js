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
    'Two’s complement for the subtract step of division (Rem − Div is computed as Rem + (−Div)).',
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
        { type: 'p', text: 'Register widths for 32 × 32 → 64-bit product (from the notes): multiplier 32 bits (2^32 values); multiplicand 64 bits, because left shifts must have room to return bits; product 64 bits (2^32 × 2^32 = 2^64).' },
        { type: 'diagram', id: 'seqMultiplier', caption: 'Sequential multiplication hardware: multiplicand (shift left), ALU, product (shift right), multiplier (shift right), control tests the multiplier LSB.' },
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
        { type: 'p', text: 'At the end the Quotient register holds the quotient and the Remainder register the remainder. (The refined version saves the restore step and shifts remainder+quotient together, but the papers ask for the first version.)' },
        { type: 'think', text: [
          'Why left-align the divisor? Because subtracting “the divisor times 2^n” is the first thing long division tries — the hardware mirrors the paper method: try the biggest shifted divisor first; if it does not fit (negative remainder), undo and try half. Each iteration therefore decides exactly one quotient bit, MSB first.',
          'Why n+1 iterations and not n? The extra pass re-tests after the last shift — keep the count the paper expects: 4-bit dividend → 5 iterations.',
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
      ],
    },
    {
      heading: 'IEEE single-precision floating point',
      blocks: [
        { type: 'p', text: 'A 32-bit word splits into **1 sign bit S**, an **8-bit exponent E** (bias **127**), and a **23-bit fraction F**. Normalized value:' },
        { type: 'pre', text: 'value = (−1)^S × 1.F × 2^(E − 127)' },
        { type: 'list', items: [
          'The leading “1.” is **hidden** — not stored, because a normalized binary mantissa always starts with 1.',
          'If E = 0 (all zeros) and F ≠ 0, the number is **denormalized**: `value = (−1)^S × 0.F × 2^(−126)` — no hidden bit, used to soften the gap around zero.',
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
          'True exponent = E − 127; mantissa = 1 + Σ Fᵢ·2^(−i) (or 0.F for denormalized).',
          'Assemble: value = (−1)^S × mantissa × 2^(true exponent).',
        ] },
        { type: 'note', title: 'Denormalized extremes (asked in Fall 2022)', text: [
          'Highest positive denormalized: S=0, F = all 1s → 0.111…1 × 2^(−126) = (1 − 2^(−23)) × 2^(−126).',
          'Lowest positive denormalized: F = 000…1 → 2^(−23) × 2^(−126) = 2^(−149), the smallest representable positive number.',
          'Highest negative (closest to zero from below): −2^(−149); lowest negative (largest magnitude): −(1 − 2^(−23)) × 2^(−126).',
        ] },
        { type: 'think', text: [
          'The one mistake that costs the whole question: applying the hidden bit to a denormalized number (E = 0). Check E first — all zeros → 0.F form, bias still effectively −126; otherwise → 1.F form with E − 127.',
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
          'Watch for exponent overflow/underflow (→ ±∞ or denormalized).',
        ] },
        { type: 'p', text: 'The matching **block diagram** boxes: exponent comparator → aligner (right-shifter) → mantissa adder/subtractor → normalizer (left/right shifter) → rounding logic → exponent adjust, all wrapped around the same control loop as the flowchart.' },
        { type: 'think', text: [
          'Why align before adding? Two numbers like 2^5 × 1.1 and 2^3 × 1.01 must have the same exponent before their fraction digits line up — exactly like aligning decimal points. The smaller exponent always shifts right, never the larger, so no precision is spent on the bigger number’s leading bits.',
        ] },
        { type: 'note', title: 'Guard, round, sticky (P&H §3.5 precision bits)', text: [
          'When the aligner shifts a mantissa right, bits would be lost. The hardware keeps **guard** (first extra bit), **round** (second extra bit) and **sticky** (OR of everything shifted out beyond that) so rounding is correct. They are only extra precision during the operation — the stored result stays 23 bits. Fall 2022 Q5(b)(ii) asks for exactly this explanation.',
        ] },
      ],
    },
  ],
}
