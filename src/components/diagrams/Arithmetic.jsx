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
      <T x={382} y={234}>Repeat for n bits or until Q=0</T>
    </Svg>
  )
}

export function DivHardware() {
  return (
    <Svg vb="0 0 620 330">
      <Box x={30} y={28} w={230} h={52} label="Divisor (8 bits)" sub="start: 00100000; shift right" />
      <W d="M145,80 V111 H109 V132" />
      <ALUshape x={76} y={132} w={170} h={56} label="ALU: subtract / restore" />
      <W d="M161,188 V232" />
      <Box x={30} y={232} w={230} h={52} label="Remainder (8 bits)" sub="start: 00000111; no shift" />
      <W d="M30,258 H13 V108 H202 V132" />
      <W d="M246,157 H353" />
      <T x={267} y={146}>trial sign</T>
      <Box x={353} y={130} w={239} h={54} label="Control" sub="negative → restore and append 0" />
      <W d="M440,130 V49 H260" dash />
      <W d="M353,175 H307 V202 H260 V245" dash />
      <W d="M472,184 V232" />
      <T x={482} y={214}>new bit</T>
      <Box x={353} y={232} w={239} h={52} label="Quotient (4 bits)" sub="start: 0000; shift left" />
      <T x={310} y={313} anchor="middle">A successful trial keeps the reduced remainder and appends 1.</T>
    </Svg>
  )
}

export function FpAdder() {
  return (
    <Svg vb="0 0 530 400">
      <Box x={16} y={16} w={230} h={50} label="Unpack S, E, F" sub="recover both significands" />
      <W d="M131,66 V114" />
      <W d="M246,41 H283" />
      <Box x={283} y={16} w={229} h={50} label="Compare exponents" sub="choose Emax and compute ΔE" />
      <W d="M343,66 V91 H221 V114" />
      <W d="M459,66 V264 H246" />
      <Box x={16} y={114} w={230} h={48} label="Align significands" sub="shift smaller right by ΔE" />
      <W d="M131,162 V188" />
      <Box x={16} y={188} w={230} h={45} label="Add / subtract by signs" />
      <W d="M131,233 V242" />
      <Box x={16} y={242} w={230} h={46} label="Normalize" sub="shift and adjust E" />
      <W d="M131,288 V309" />
      <Box x={16} y={309} w={230} h={52} label="Round and pack S, E, F" sub="handle rounding carry" />
      <W d="M131,361 V383" />
      <T x={375} y={252}>Emax</T>
      <T x={274} y={325}>Zero sum → zero result</T>
      <T x={274} y={350}>Handle range limits</T>
      <T x={150} y={385}>IEEE single-precision result</T>
    </Svg>
  )
}
