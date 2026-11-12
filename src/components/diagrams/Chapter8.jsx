import { Svg, Box, T, W, Bus, ALUshape, Muxshape } from './base.jsx'

// Hamacher Fig 8.1(b) — two-stage pipeline hardware with interstage buffer B1.
export function Pipe2() {
  return (
    <Svg vb="0 0 780 200">
      <Box x={60} y={60} w={210} h={70} label="Instruction fetch" sub="unit (F)" fs={12} />
      <Box x={340} y={58} w={90} h={74} label="B1" sub="buffer" fs={12} dashed />
      <Box x={500} y={60} w={210} h={70} label="Execution" sub="unit (E)" fs={12} />
      <W d="M270,95 H340" />
      <W d="M430,95 H500" />
      <T x={305} y={80} anchor="middle" fs={11}>I2</T>
      <T x={465} y={80} anchor="middle" fs={11}>I1</T>
      <T x={60} y={160} fs={11}>B1 lets the fetch unit fetch I2 while the execution unit still executes I1 —</T>
      <T x={60} y={176} fs={11}>the buffer holds the instruction until Execute can use it.</T>
    </Svg>
  )
}

// Slide 12 — four-stage pipeline with three interstage buffers.
export function Pipe4Buffers() {
  const boxes = [
    ['F', 'Fetch instruction'],
    ['D', 'Decode + fetch operands'],
    ['E', 'Execute operation'],
    ['W', 'Write result'],
  ]
  return (
    <Svg vb="0 0 780 240">
      {boxes.map(([l, sub], i) => (
        <g key={i}>
          <Box x={50 + i * 190} y={70} w={130} h={70} label={l} sub={sub} fs={12} />
          {i < 3 && (
            <g>
              <rect x={185 + i * 190} y={78} width={38} height={54} style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
              <T x={204 + i * 190} y={109} fs={12} anchor="middle" bold>{`B${i + 1}`}</T>
              <W d={`M${180 + i * 190},105 H${185 + i * 190}`} arrow={false} />
              <W d={`M${223 + i * 190},105 H${240 + i * 190}`} />
            </g>
          )}
        </g>
      ))}
      <T x={50} y={182} fs={11}>Each buffer passes everything the next stage needs (decoded fields, operands,</T>
      <T x={50} y={196} fs={11}>destination) one clock cycle at a time.</T>
      <T x={50} y={212} fs={11}>Four units + three interstage buffers = a 4-stage pipeline; ideally one instruction</T>
      <T x={50} y={226} fs={11}>completes every clock cycle after filling.</T>
    </Svg>
  )
}

// Chapter 8 slides 36–37, operand forwarding.
export function Forwarding() {
  return (
    <Svg vb="0 0 780 490">
      <T x={133} y={28} fs={11}>Source 1</T>
      <T x={133} y={68} fs={11}>Source 2</T>
      <Bus x1={134} y1={40} x2={690} y2={40} w={3} />
      <Bus x1={134} y1={80} x2={690} y2={80} w={3} />

      <Box x={80} y={162} w={150} h={90} label="Register file" />
      <W d="M145,162 V86 M145,74 V40" />
      <W d="M195,162 V80" />
      <W d="M327,40 V74 M327,86 V111" />
      <W d="M557,80 V111" />
      <Box x={278} y={111} w={98} h={38} label="SRC1" />
      <Box x={508} y={111} w={98} h={38} label="SRC2" />

      <Muxshape x={293} y={176} w={68} h={52} />
      <Muxshape x={523} y={176} w={68} h={52} />
      <W d="M327,149 V180" />
      <W d="M557,149 V180" />

      <W d="M361,201 H395 V255" />
      <W d="M591,201 H620 V229 M620,241 H490 V255" />
      <ALUshape x={365} y={255} w={158} h={62} />
      <T x={395} y={249} anchor="middle" fs={11}>A</T>
      <T x={490} y={249} anchor="middle" fs={11}>B</T>

      <W d="M444,317 V344" />
      <Box x={395} y={344} w={98} h={38} label="RSLT" />
      <W d="M444,382 V425" />
      <Bus x1={134} y1={425} x2={690} y2={425} w={3} />
      <T x={660} y={415} anchor="end" fs={11}>Destination</T>
      <W d="M155,425 V252" />

      <W d="M250,425 V202 H293" dash />
      <W d="M655,425 V235 H503 V202 H523" dash />
      <T x={550} y={282} fs={11}>Bypass to either MUX</T>
      <T x={80} y={463} fs={11}>SRC1 and SRC2 are in B2. RSLT is in B3 and drives the destination bus.</T>
      <T x={80} y={479} fs={11}>A MUX can choose the prior ALU result instead of its latched source operand.</T>
    </Svg>
  )
}

// Chapter 8 slide 41, two-way issue with integer and floating-point execution.
export function Superscalar() {
  return (
    <Svg vb="0 0 780 360">
      <Box x={24} y={130} w={111} h={62} label="Fetch" sub="up to two" />
      <Box x={171} y={130} w={112} h={62} label="Instruction" sub="queue" />
      <Box x={324} y={130} w={105} h={62} label="Dispatch" sub="up to two" />
      <W d="M135,151 H171" />
      <W d="M135,171 H171" />
      <W d="M283,151 H324" />
      <W d="M283,171 H324" />

      <W d="M429,148 H447 V78 H477" />
      <W d="M429,174 H447 V247 H477" />
      <Box x={477} y={58} w={22} h={40} dashed />
      <Box x={477} y={227} w={22} h={40} dashed />
      <W d="M499,78 H521" />
      <W d="M499,247 H521" />
      <Box x={521} y={51} w={115} h={54} label="Integer" sub="execute" />
      <Box x={521} y={220} w={115} h={54} label="Floating-point" sub="execute" fs={11.5} />
      <W d="M636,78 H657" />
      <W d="M636,247 H657" />
      <Box x={657} y={58} w={22} h={40} dashed />
      <Box x={657} y={227} w={22} h={40} dashed />

      <W d="M679,78 H731 V131" />
      <W d="M679,247 H731 V194" />
      <Box x={692} y={131} w={78} h={63} label="Write" sub="results" />
      <T x={487} y={43} anchor="middle" fs={11}>Input</T>
      <T x={668} y={43} anchor="middle" fs={11}>Output</T>
      <T x={577} y={22} anchor="middle" fs={11}>Interstage buffers</T>

      <T x={24} y={318} fs={11}>A pair with one integer and one floating-point instruction can issue in one cycle</T>
      <T x={24} y={336} fs={11}>when dependencies and resource availability permit it.</T>
    </Svg>
  )
}
