import { Svg, Box, T, W, ALUshape } from './base.jsx'

// Sequential multiplication hardware (P&H Fig 3.10 style, as drawn in class for n-bit words).
export function SeqMultiplier() {
  return (
    <Svg vb="0 0 740 440">
      <Box x={220} y={30} w={200} h={50} label="Multiplicand" sub="shift left each step" fs={11.5} />
      <W d="M320,80 V140" />
      <ALUshape x={240} y={140} w={160} h={70} label="ALU" />
      <T x={236} y={134} fs={10}>product + multiplicand</T>
      <W d="M320,210 V270" />
      <Box x={220} y={270} w={200} h={50} label="Product" sub="shift right each step" fs={11.5} />
      <W d="M420,295 H620 V105" />
      <W d="M620,105 H420 V100" arrow={false} />
      <W d="M620,105 H424" open />
      <T x={500} y={92} fs={10.5}>old product (feedback)</T>
      <Box x={620} y={120} w={100} h={44} label="Multiplier" sub="shift right" fs={10.5} />
      <W d="M620,142 H540" arrow={false} />
      <g>
        <ellipse cx={510} cy={142} rx={34} ry={24} style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
        <T x={510} y={147} fs={10} anchor="middle">control</T>
      </g>
      <W d="M476,142 H420 V295" arrow={false} /><W d="M476,142 H424 V295" open />
      <T x={404} y={340} fs={10.5}>LSB = 1 → add · LSB = 0 → skip</T>
      <T x={404} y={358} fs={10.5}>loop n times (n = multiplier bits)</T>
      <W d="M320,320 V390" />
      <T x={330} y={395} fs={11} bold>Product (2n bits)</T>
      <T x={40} y={418} fs={10.5}>32 × 32: multiplicand and product registers are 64 bits, the multiplier register is 32 bits,</T>
      <T x={40} y={432} fs={10.5}>and the product ends up 64 bits.</T>
    </Svg>
  )
}

// First-version division hardware (P&H Fig 3.8 style), register widths as in the Spring 2024 question.
export function DivHardware() {
  return (
    <Svg vb="0 0 740 400">
      <Box x={230} y={20} w={240} h={46} label="Remainder" sub="8 bits (holds the 4-bit dividend 0111)" fs={10.5} />
      <W d="M350,66 V120" />
      <ALUshape x={250} y={120} w={200} h={64} label="ALU  ·  subtract" />
      <W d="M350,184 V240" />
      <Box x={230} y={240} w={240} h={46} label="Remainder" sub="write back, shift left" fs={10.5} />
      <W d="M470,263 H600 V240" arrow={false} />
      <W d="M470,263 H600 V43" />
      <Box x={600} y={20} w={110} h={46} label="Divisor" sub="8 bits" fs={11} />
      <W d="M600,60 H470 V152" />
      <T x={498} y={146} fs={10.5}>divisor into ALU</T>
      <Box x={230} y={330} w={240} h={46} label="Quotient" sub="4 bits, shift left" fs={11} />
      <W d="M350,286 V330" />
      <T x={350} y={398} fs={10.5} anchor="middle">Each step: subtract, set quotient bit (1 if remainder ≥ 0, else 0 and restore), shift.</T>
      <T x={40} y={30} fs={10.5}>Divide 7 by 2: remainder starts 00000111, divisor 00000010.</T>
    </Svg>
  )
}
