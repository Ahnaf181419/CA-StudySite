import { Svg, Box, T, W, Bus, ALUshape, Muxshape } from './base.jsx'

// Hamacher Fig 7.1 — single-bus organization of the datapath inside a processor.
export function SingleBus() {
  return (
    <Svg vb="0 0 780 560">
      {/* internal processor bus */}
      <Bus x1={60} y1={60} x2={730} y2={60} />
      <T x={62} y={50} fs={11}>Internal processor bus</T>

      {/* registers hanging from the bus */}
      <W d="M140,60 V95" /><Box x={100} y={95} w={80} h={36} label="PC" />
      <W d="M280,60 V95" /><Box x={240} y={95} w={80} h={36} label="MAR" />
      <W d="M320,60 V175" /><Box x={240} y={175} w={80} h={36} label="MDR" sub="2-in, 2-out" fs={12} />
      <W d="M665,60 V95" /><Box x={620} y={95} w={90} h={36} label="IR" />
      <W d="M635,60 V175" /><Box x={620} y={175} w={90} h={36} label="R0" />
      <W d="M635,215 V255" /><Box x={620} y={255} w={90} h={36} label="R(n-1)" fs={12} />
      <W d="M635,295 V335" /><Box x={620} y={335} w={90} h={36} label="TEMP" />

      {/* memory bus side */}
      <W d="M240,113 H75" />
      <T x={75} y={105} fs={11}>Address lines</T>
      <W d="M240,193 H75" arrow={false} />
      <W d="M75,193 H240" open />
      <T x={75} y={186} fs={11}>Data lines</T>
      <T x={30} y={300} fs={12}>M e m o r y</T>
      <T x={30} y={318} fs={12}>b u s</T>

      {/* Y — loaded FROM the bus, output to MUX */}
      <W d="M190,60 V240" />
      <Box x={140} y={240} w={70} h={32} label="Y" />
      <W d="M175,272 V290" />

      {/* constant 4 + MUX feed ALU input A */}
      <Box x={55} y={292} w={82} h={30} label="Constant 4" fs={11.5} />
      <W d="M137,307 H185" />
      <Muxshape x={185} y={268} w={46} h={40} />
      <T x={150} y={262} fs={11}>Select</T>
      <W d="M150,278 H185" />
      <W d="M231,288 H315 V292" />

      {/* ALU: A from MUX, B from the bus (line dropped at x=400) */}
      <ALUshape x={300} y={292} w={120} h={64} />
      <T x={296} y={286} fs={11}>A</T><T x={345} y={286} fs={11}>B</T>
      <W d="M400,60 V310 H345 V312" />
      <T x={405} y={70} fs={11}>from bus</T>

      {/* ALU control */}
      <T x={212} y={366} fs={11}>ALU control (Add, Sub, XOR…)</T>
      <W d="M212,360 H262" arrow={false} /><W d="M212,360 H258" open />

      {/* Z: fed by ALU, output back up to the bus */}
      <W d="M330,356 V430" />
      <Box x={295} y={430} w={70} h={32} label="Z" />
      <W d="M365,446 H430 V60" />
      <T x={436} y={300} fs={11}>Z → bus</T>

      {/* control unit */}
      <Box x={55} y={470} w={330} h={50} label="Instruction decoder and control logic" mono={false} fs={12} />
      <T x={55} y={548} fs={11}>Control signals go to every register (Riin/Riout), Select, the ALU, Read/Write and WMFC.</T>
      <W d="M110,470 V360" dash />
      <W d="M220,470 V465" dash arrow={false} />
      <W d="M300,470 V468" dash arrow={false} />
      <W d="M385,470 V468 H420 V466" dash arrow={false} />
      <W d="M430,462 V340" dash />
    </Svg>
  )
}

// Hamacher Fig 7.2/7.3 — input/output gating of one register (and one bit).
export function RegisterGating() {
  return (
    <Svg vb="0 0 780 380">
      <Bus x1={80} y1={70} x2={700} y2={70} />
      <T x={82} y={60} fs={11}>Internal processor bus</T>

      {/* Ri with Riin / Riout switches */}
      <W d="M230,70 V118" />
      <Box x={190} y={120} w={80} h={40} label="Ri" />
      <T x={285} y={98} fs={11}>Riout</T>
      <path d="M281,74 L295,80 L281,86 Z" fill="#17171a" />
      <T x={252} y={112} fs={11}>Riin</T>
      <path d="M256,118 L262,104 L268,118 Z" fill="#17171a" />

      {/* Y, MUX, ALU, Z below the bus */}
      <W d="M420,70 V140" />
      <Box x={385} y={142} w={70} h={34} label="Y" />
      <T x={300} y={132} fs={11}>Yin</T>
      <Box x={120} y={212} w={82} h={30} label="Constant 4" fs={11.5} />
      <W d="M202,227 H252" />
      <Muxshape x={252} y={188} w={46} h={40} />
      <T x={218} y={182} fs={11}>Select</T>
      <W d="M225,198 H252" />
      <W d="M420,176 V220 H275 V188" />
      <W d="M298,208 H345 V220" />
      <ALUshape x={345} y={220} w={115} h={60} />
      <T x={352} y={214} fs={11}>A</T><T x={398} y={214} fs={11}>B</T>
      <W d="M400,70 V220" />
      <T x={406} y={80} fs={11}>from bus</T>
      <W d="M402,280 V330" />
      <Box x={368} y={332} w={70} h={32} label="Z" />
      <T x={452} y={310} fs={11}>Zin</T>
      <W d="M438,348 H560 V70" />
      <T x={566} y={300} fs={11}>Zout → bus</T>

      <T x={80} y={375} fs={11}>Each register Ri has two control signals: Riin (load from bus on next clock) and Riout (drive the bus).</T>
    </Svg>
  )
}

// One register BIT (Hamacher Fig 7.3) — D flip-flop with input MUX and output buffer.
export function RegisterBit() {
  return (
    <Svg vb="0 0 640 358">
      <Bus x1={60} y1={60} x2={580} y2={60} />
      <T x={62} y={50} fs={11}>Bus (1 bit of it)</T>

      {/* tri-state output buffer: Q drives the bus only when Riout = 1 */}
      <W d="M268,230 V144" arrow={false} />
      <path d="M258,144 L278,144 L268,124 Z" fill="#f3f3f1" stroke="#17171a" strokeWidth="1.4" />
      <W d="M268,124 V60" />
      <T x={286} y={132} fs={11}>Riout (enable buffer)</T>

      {/* 2:1 input MUX: 1 = load from bus, 0 = hold (Q feedback) */}
      <W d="M150,60 V158 H277" />
      <T x={106} y={150} fs={11}>1 → load</T>
      <Muxshape x={277} y={150} w={46} h={44} label="2×1" />
      <T x={228} y={146} fs={11}>Riin</T>

      {/* MUX output into the flip-flop */}
      <W d="M299,194 V230" />

      {/* flip-flop */}
      <Box x={258} y={230} w={84} h={56} label="D  Q" sub="flip-flop" fs={12} />

      {/* Q feedback into the MUX's 0 input (hold) */}
      <W d="M342,262 H370 V210 H255 V172 H277" />
      <T x={440} y={224} fs={11}>feedback (hold)</T>

      {/* clock */}
      <W d="M258,272 H200" />
      <T x={192} y={268} fs={11} anchor="end">Clock</T>

      <T x={60} y={316} fs={11}>Riin = 0 → FF holds its bit (Q fed back).</T>
      <T x={60} y={332} fs={11}>Riin = 1 → FF loads the bus bit on the next clock pulse.</T>
      <T x={60} y={348} fs={11}>Riout = 1 → the bit drives the bus; only one register may assert Riout at a time.</T>
    </Svg>
  )
}

// Hamacher Fig 7.8 — three-bus organization of the datapath.
export function ThreeBus() {
  return (
    <Svg vb="0 0 780 540">
      <Bus x1={110} y1={70} x2={110} y2={500} />
      <Bus x1={210} y1={70} x2={210} y2={500} />
      <Bus x1={520} y1={70} x2={520} y2={500} />
      <T x={96} y={62} fs={12} bold>Bus A</T>
      <T x={196} y={62} fs={12} bold>Bus B</T>
      <T x={504} y={62} fs={12} bold>Bus C</T>

      {/* incrementer + PC */}
      <Box x={330} y={16} w={120} h={32} label="Incrementer" fs={12} />
      <Box x={330} y={70} w={120} h={36} label="PC" />
      <W d="M370,70 V48" arrow={false} /><W d="M362,52 V70" />
      <W d="M330,88 H210" />
      <W d="M520,108 H450" />

      {/* register file */}
      <Box x={330} y={140} w={120} h={72} label="Register file" sub="R0 … R(n-1)" fs={12} />
      <W d="M330,158 H110" />
      <W d="M330,186 H210" />
      <W d="M520,200 H450" />

      {/* constant 4 → MUX → ALU input A ; bus B → input B ; R → bus C */}
      <Box x={30} y={270} w={82} h={30} label="Constant 4" fs={11.5} />
      <W d="M112,285 H150" />
      <Muxshape x={150} y={262} w={46} h={44} />
      <T x={118} y={256} fs={11}>Select</T>
      <W d="M120,270 H150" />
      <W d="M196,284 H300 V300" />
      <ALUshape x={300} y={300} w={120} h={64} />
      <T x={296} y={294} fs={11}>A</T><T x={352} y={294} fs={11}>B</T>
      <W d="M210,345 H296" />
      <T x={330} y={390} fs={11}>R = A / R = B (pass-through)</T>
      <W d="M420,332 H520" />

      {/* instruction decoder + IR */}
      <Box x={600} y={160} w={160} h={46} label="Instruction" sub="decoder" fs={12} />
      <Box x={600} y={230} w={100} h={36} label="IR" />
      <W d="M650,230 V206" />
      <W d="M600,248 H110" />
      <W d="M520,262 H600" />

      {/* MDR and MAR */}
      <Box x={600} y={380} w={100} h={36} label="MDR" />
      <W d="M600,392 H110" />
      <W d="M600,406 H210" />
      <W d="M520,388 H600" />
      <W d="M650,416 V462" />
      <T x={560} y={478} fs={11} anchor="middle">Memory bus data lines</T>
      <Box x={330} y={440} w={100} h={36} label="MAR" />
      <W d="M520,458 H430" />
      <W d="M380,476 V505" />
      <T x={374} y={522} fs={11} anchor="middle">Address lines</T>

      <T x={30} y={522} fs={11}>GPR → buses A, B · GPR ← bus C · ALU ← (bus A or Constant 4) and bus B · ALU → bus C</T>
      <T x={30} y={536} fs={11}>PC → bus B only · IR → bus A only · MDR → buses A, B · IR, PC, MDR, MAR ← bus C</T>
    </Svg>
  )
}

// Hardwired control unit organization (slide 40).
export function HardwiredCU() {
  return (
    <Svg vb="0 0 780 470">
      <T x={30} y={28} fs={12} bold>Clock</T>
      <W d="M80,34 H150" />
      <Box x={150} y={16} w={170} h={40} label="Clock / control step" sub="counter" fs={11.5} />
      <Box x={150} y={110} w={170} h={40} label="Step decoder" fs={12} />
      <W d="M235,56 V110" />

      <Box x={470} y={110} w={150} h={40} label="Instruction" sub="decoder" fs={11.5} />
      <Box x={470} y={16} w={150} h={40} label="IR" />
      <W d="M545,56 V110" />

      {/* T lines and INS lines into the encoder */}
      <T x={180} y={175} fs={11}>T1  T2  …  Tn</T>
      <T x={470} y={175} fs={11}>INS1  INS2  …  INSm</T>
      <W d="M190,160 V210" />
      <W d="M240,160 V210" />
      <W d="M300,160 V210" />
      <W d="M500,160 V210" />
      <W d="M555,160 V210" />
      <W d="M610,160 V210" />
      <Box x={180} y={210} w={430} h={70} label="Encoder" bold />
      <W d="M340,280 V310" />
      <Box x={140} y={310} w={510} h={44} label="Control signals  (PCout, MARin, Read, Add, Zin, WMFC, End, …)" fs={11.5} />

      {/* side inputs */}
      <T x={622} y={248} fs={11}>External inputs</T>
      <W d="M700,252 H612" />
      <T x={622} y={190} fs={11}>Condition codes</T>
      <W d="M700,194 H612" />

      {/* run / end feedback */}
      <W d="M660,332 H730 V80 H235 V60" dash />
      <T x={640} y={72} fs={11}>End / Run</T>
    </Svg>
  )
}

// Hamacher Fig 7.16 — basic microprogrammed control unit.
export function MicroCU() {
  return (
    <Svg vb="0 0 640 360">
      <Box x={60} y={20} w={110} h={40} label="IR" />
      <W d="M170,40 H300" />
      <Box x={300} y={20} w={200} h={40} label="Starting address generator" fs={11.5} />
      <W d="M400,60 V120" />
      <T x={30} y={110} fs={12} bold>Clock</T>
      <W d="M80,116 H240" />
      <Box x={240} y={120} w={160} h={44} label="µPC" bold />
      <W d="M400,142 H460" />
      <Box x={300} y={210} w={240} h={90} label="Control store" sub="microroutines" fs={12} />
      <W d="M400,164 V210" />
      <W d="M540,255 H610" />
      <T x={545} y={244} fs={12} bold>CW</T>
      <T x={60} y={330} fs={11}>µPC is clocked so successive microinstructions are read from the control store;</T>
      <T x={60} y={348} fs={11}>a new instruction in IR loads its microroutine's starting address into µPC.</T>
    </Svg>
  )
}

// Hamacher Fig 7.18 — microprogrammed control unit with conditional branching.
export function MicroCUCond() {
  return (
    <Svg vb="0 0 640 400">
      <Box x={60} y={20} w={110} h={40} label="IR" />
      <W d="M170,40 H290" />
      <Box x={290} y={20} w={230} h={46} label="Starting and branch" sub="address generator" fs={11.5} />
      <W d="M405,66 V120" />
      <T x={30} y={110} fs={12} bold>Clock</T>
      <W d="M80,116 H240" />
      <Box x={240} y={120} w={160} h={44} label="µPC" bold />
      <W d="M405,142 H460" arrow={false} /><W d="M405,142 H456" />
      <Box x={290} y={215} w={240} h={90} label="Control store" sub="microroutines" fs={12} />
      <W d="M405,164 V215" />
      <W d="M530,260 H610" />
      <T x={535} y={249} fs={12} bold>CW</T>
      <T x={530} y={60} fs={11}>Condition codes</T>
      <W d="M610,66 H520" />
      <T x={530} y={186} fs={11}>External inputs</T>
      <W d="M610,190 H520" />
      <T x={60} y={336} fs={11}>If the CW is a conditional branch, the generator checks the condition codes and,</T>
      <T x={60} y={354} fs={11}>if necessary, loads a new address into µPC from the offset field (how Branch &lt; 0 works).</T>
    </Svg>
  )
}

// Complete processor with internal + system bus (slide 43 / subsection 7.4.1).
export function CompleteProcessor() {
  return (
    <Svg vb="0 0 780 470">
      <Box x={90} y={30} w={600} h={300} fill="none" dashed />
      <T x={110} y={55} fs={12} bold>CPU</T>
      <Box x={130} y={80} w={170} h={54} label="Instruction" sub="cache" fs={12} />
      <Box x={480} y={80} w={170} h={54} label="Data" sub="cache" fs={12} />
      <Box x={130} y={200} w={180} h={70} label="Integer unit" sub="ALU + control" fs={12} />
      <Box x={470} y={200} w={180} h={70} label="Floating-point unit" sub="ALU + control" fs={11.5} />
      <Bus x1={200} y1={180} x2={560} y2={180} w={4} />
      <T x={398} y={172} fs={11}>CPU internal bus</T>
      <W d="M220,134 V200" /><W d="M210,200 V134" />
      <W d="M565,134 V200" arrow={false} /><W d="M555,200 V134" />
      <T x={398} y={178} fs={11}>CPU internal bus</T>

      {/* system bus */}
      <Bus x1={60} y1={380} x2={720} y2={380} w={6} />
      <T x={62} y={372} fs={11}>System bus (address, data, control)</T>
      <W d="M160,380 V332" />
      <W d="M215,330 V378" arrow={false} /><W d="M215,332 V378" />
      <W d="M300,380 V250" /><W d="M290,250 V380" />
      <T x={196} y={352} fs={10.5}>instr: in only</T>
      <T x={306} y={340} fs={10.5}>data: both ways</T>
      <Box x={560} y={400} w={150} h={44} label="Memory" />
      <Box x={90} y={400} w={150} h={44} label="I/O" />
      <W d="M165,400 V380" /><W d="M635,400 V380" />
      <T x={90} y={454} fs={11}>Two separate ALUs (integer and floating-point), each with its own control unit.</T>
      <T x={90} y={468} fs={11}>Separate instruction and data caches hide memory latency — note the arrow directions.</T>
    </Svg>
  )
}

// Gate network generating one control signal from step counter + instruction decoder (class notes).
export function ControlSignalGates() {
  const AndGate = ({ x, y }) => (
    <g>
      <path d={`M${x},${y} h18 a18,18 0 0 1 0,36 h-18 z`} fill="#f3f3f1" stroke="#17171a" strokeWidth="1.4" />
      <T x={x + 14} y={y + 23} fs={10}>AND</T>
    </g>
  )
  return (
    <Svg vb="0 0 720 330">
      <T x={40} y={30} fs={12}>Zin is asserted: T1 for every instruction, T6 for ADD, T4 for BRANCH →</T>
      <T x={40} y={50} fs={12} bold>Zin = T1 + T6·ADD + T4·BRANCH + …</T>

      {/* T1 term: always on → straight through a buffer into the OR gate */}
      <T x={40} y={120} fs={12}>T1</T>
      <W d="M70,116 H230" arrow={false} />
      <path d="M160,110 L172,116 L160,122 Z" fill="#f3f3f1" stroke="#17171a" strokeWidth="1.4" />

      {/* T6 · ADD */}
      <T x={40} y={105} fs={12}>T6</T><W d="M85,109 H150" />
      <AndGate x={150} y={100} />
      <T x={40} y={135} fs={12}>ADD</T><W d="M100,131 H150" />
      <W d="M186,118 H230" />

      {/* T4 · BRANCH */}
      <T x={40} y={215} fs={12}>T4</T><W d="M85,219 H150" />
      <AndGate x={150} y={210} />
      <T x={40} y={245} fs={12}>BRANCH</T><W d="M118,241 H150" />
      <W d="M186,228 H230 V166" />

      <g>
        <path d="M230,118 h14 a24,24 0 0 1 0,48 h-14 z" fill="#f3f3f1" stroke="#17171a" strokeWidth="1.4" />
        <T x={244} y={146} fs={10}>OR</T>
      </g>
      <W d="M268,142 H330" />
      <Box x={330} y={124} w={110} h={36} label="Zin" bold />
      <T x={40} y={302} fs={11}>" + " is an OR gate and " · " is an AND gate:</T>
      <T x={40} y={316} fs={11}>each control signal is a sum-of-products of timing steps and instruction signals.</T>
    </Svg>
  )
}
