import { Svg, Box, T, W, ALUshape } from './base.jsx'

export function SeqMultiplier() {
  return (
    <Svg vb="0 0 620 328">
      <Box x={28} y={24} w={214} h={52} label="Multiplicand (2n bits)" sub="zero-extend, then shift left" />
      <Box x={382} y={24} w={210} h={52} label="Multiplier (n bits)" sub="shift right after each test" />
      <W d="M135,76 V102 H109 V128" />
      <ALUshape x={73} y={128} w={168} h={54} label="ALU: add" />
      <W d="M158,182 V224" />
      <Box x={28} y={224} w={214} h={52} label="Product (2n bits)" sub="initialize to zero; accumulate" />
      <W d="M28,250 H12 V111 H202 V128" />
      <T x={84} y={302}>Final product stays in this register</T>
      <W d="M487,76 V128" />
      <T x={498} y={105}>LSB</T>
      <Box x={382} y={128} w={210} h={54} label="Control" sub="LSB=1: load sum; 0: hold" />
      <W d="M382,147 H257 V64 H242" dash />
      <W d="M592,147 H609 V60 H592" dash />
      <W d="M382,167 H289 V249 H242" dash />
      <T x={382} y={215}>Shift operands every round</T>
      <T x={382} y={234}>Stop when the multiplier is 0</T>
    </Svg>
  )
}

export function DivHardware() {
  return (
    <Svg vb="0 0 620 330">
      <Box x={30} y={28} w={230} h={52} label="Divisor (8 bits)" sub="start: 00100000; shift right" />
      <W d="M145,80 V111 H109 V132" />
      <ALUshape x={76} y={132} w={170} h={56} label="ALU: sub / add" />
      <W d="M161,188 V232" />
      <Box x={30} y={232} w={230} h={52} label="Remainder (8 bits)" sub="start: 00000111; no shift" />
      <W d="M30,258 H13 V108 H202 V132" />
      <W d="M246,157 H353" />
      <T x={267} y={146}>borrow</T>
      <Box x={353} y={130} w={239} h={54} label="Control" sub="borrow → restore and append 0" />
      <W d="M440,130 V49 H260" dash />
      <W d="M378,184 V210 H218 V181" dash />
      <T x={230} y={225} fs={10}>select subtract or restore</T>
      <W d="M472,184 V232" />
      <T x={482} y={214}>new bit</T>
      <Box x={353} y={232} w={239} h={52} label="Quotient (4 bits)" sub="start: 0000; shift left" />
      <T x={310} y={313} anchor="middle">A successful trial keeps the reduced remainder and appends 1.</T>
    </Svg>
  )
}

export function FpAdder() {
  return (
    <Svg vb="0 0 640 425">
      <Box x={166} y={18} w={296} h={47} label="Unpack two operands" sub="signs, effective exponents, significands" />
      <Box x={27} y={98} w={216} h={54} label="Compare exponents" sub="produce Emax and |ΔE|" />
      <W d="M200,65 V81 H135 V98" />
      <Box x={318} y={98} w={235} h={54} label="Select and align" sub="right-shift the smaller operand" fs={12} />
      <W d="M435,65 V98" />
      <W d="M243,125 H318" />
      <T x={280} y={114} fs={10} anchor="middle">|ΔE|</T>
      <Box x={318} y={195} w={235} h={47} label="Significand add / subtract" sub="signs control the operation" fs={12} />
      <W d="M378,152 V195" />
      <W d="M487,152 V195" />
      <Box x={318} y={281} w={235} h={47} label="Normalize and round" sub="adjust significand and exponent" />
      <W d="M435,242 V281" />
      <W d="M135,152 V304 H318" />
      <T x={153} y={293}>Emax</T>
      <Box x={318} y={364} w={235} h={41} label="Pack result S, E, F" />
      <W d="M435,328 V364" />
    </Svg>
  )
}

export function FpAddFlow() {
  return (
    <Svg vb="0 0 640 455">
      <Box x={44} y={19} w={290} h={45} label="Align to the larger exponent" />
      <Box x={44} y={91} w={290} h={45} label="Add or subtract significands" />
      <Box x={44} y={164} w={290} h={51} label="Normalize and check range" sub="handle zero, subnormals and overflow" />
      <Box x={44} y={242} w={290} h={45} label="Round to target precision" />
      <W d="M189,64 V91" />
      <W d="M189,136 V164" />
      <W d="M189,215 V242" />
      <W d="M189,287 V305" />
      <polygon points="189,305 298,344 189,383 80,344" style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} />
      <T x={189} y={348} anchor="middle">Rounding carry?</T>
      <W d="M189,383 V407" />
      <T x={200} y={399} fs={11}>No</T>
      <Box x={44} y={407} w={290} h={36} label="Pack the result" />
      <W d="M298,344 H368" />
      <T x={331} y={333} fs={11} anchor="middle">Yes</T>
      <Box x={368} y={315} w={250} h={58} label="Shift right, increment E" sub="check exponent again" />
      <W d="M493,373 V425 H334" />
      <T x={369} y={391} fs={10}>If rounding makes a subnormal</T>
      <T x={369} y={407} fs={10}>normal, update its exponent field.</T>
    </Svg>
  )
}
