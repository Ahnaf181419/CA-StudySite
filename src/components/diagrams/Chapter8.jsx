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
      <T x={310} y={48} fs={11}>instruction</T>
      <T x={445} y={48} fs={11}>I1</T>
      <T x={60} y={160} fs={11}>B1 lets the fetch unit fetch I2 while the execution unit still executes I1 —</T>
      <T x={60} y={176} fs={11}>the two stages never overwrite one register.</T>
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
              <rect x={185 + i * 190} y={78} width={38} height={54} fill="#f3f3f1" stroke="#17171a" strokeWidth="1.4" />
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

// Slide 36 — operand forwarding datapath (SRC1/SRC2/RSLT + forwarding MUXes).
export function Forwarding() {
  return (
    <Svg vb="0 0 800 430">
      <T x={70} y={32} fs={12} bold>Source 1</T>
      <W d="M70,40 H360" />
      <T x={70} y={92} fs={12} bold>Source 2</T>
      <W d="M70,100 H360" />

      <W d="M130,40 V150" />
      <W d="M200,100 V150" />
      <Box x={80} y={150} w={150} h={90} label="Register file" fs={12} />

      <W d="M335,40 V58" />
      <Box x={280} y={58} w={110} h={34} label="SRC1" />
      <W d="M335,100 V118" />
      <Box x={280} y={118} w={110} h={34} label="SRC2" />

      {/* normal operand paths into the two MUXes (inputs on the left edge) */}
      <W d="M390,75 H470" />
      <W d="M230,175 H445 V95 H470" />
      <Muxshape x={470} y={50} w={48} h={54} />
      <Muxshape x={470} y={130} w={48} h={54} />
      <W d="M390,135 H470" />
      <W d="M230,195 H435 V150 H470" />

      {/* forwarding paths from the destination bus into the two MUXes (right edge) */}
      <W d="M530,380 V88 H518" dash />
      <W d="M560,380 V140 H518" dash />
      <T x={575} y={250} fs={11} bold>forwarding</T>

      {/* ALU + RSLT (outputs leave the right edge) */}
      <W d="M518,64 H580 V110 H600" />
      <W d="M518,157 H600" />
      <ALUshape x={600} y={88} w={115} h={76} />
      <W d="M657,164 V200" />
      <Box x={612} y={200} w={90} h={36} label="RSLT" />
      <W d="M657,236 V380" />

      {/* destination bus + writeback */}
      <Bus x1={160} y1={380} x2={700} y2={380} />
      <T x={620} y={372} fs={12} bold>Destination</T>
      <W d="M155,380 V240" />

      <T x={60} y={415} fs={11}>SRC1, SRC2 = interstage buffers of stage D (part of B2); RSLT = part of B3. The dashed paths forward the ALU</T>
      <T x={60} y={433} fs={11}>result straight back into the ALU inputs, so I2 does not wait for the Write stage of I1.</T>
    </Svg>
  )
}

// Slide 41 — superscalar organization with two execution units.
export function Superscalar() {
  return (
    <Svg vb="0 0 800 352">
      <Box x={40} y={110} w={150} h={80} label="F" sub="instruction fetch unit" fs={11.5} />
      <Box x={250} y={120} w={150} h={60} label="Instruction queue" fs={11.5} />
      <Box x={460} y={110} w={140} h={80} label="Dispatch unit" fs={11.5} />
      <Box x={660} y={40} w={120} h={70} label="Integer" sub="unit" fs={11.5} />
      <Box x={660} y={180} w={120} h={70} label="Floating-" sub="point unit" fs={11.5} />
      <W d="M190,150 H250" />
      <W d="M400,150 H460" />
      <W d="M600,130 H630 V75 H660" />
      <W d="M600,170 H630 V215 H660" />
      <W d="M720,40 V20" arrow={false} /><T x={732} y={24} fs={11}>W</T>
      <W d="M720,250 V275" arrow={false} /><T x={732} y={278} fs={11}>W</T>
      <T x={40} y={300} fs={11}>Fetch unit reads two instructions at a time into the queue; the dispatch unit issues</T>
      <T x={40} y={315} fs={11}>up to two instructions per cycle — one integer + one floating-point — so throughput</T>
      <T x={40} y={330} fs={11}>can exceed one instruction per clock cycle.</T>
    </Svg>
  )
}
