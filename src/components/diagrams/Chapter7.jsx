import { Svg, Box, T, W, Bus, ALUshape, Muxshape } from './base.jsx'

// Figure 7.1, Chapter 7 slide 8.
export function SingleBus() {
  const registers = [
    ['PC', 44, true],
    ['MAR', 139, false],
    ['MDR', 234, true],
    ['IR', 329, false],
    ['R0', 424, true],
    ['R(n−1)', 519, true],
    ['TEMP', 614, true],
  ]

  return (
    <Svg vb="0 0 780 565">
      <Bus x1={22} y1={70} x2={754} y2={70} />
      <T x={25} y={52}>Internal processor bus</T>

      {registers.map(([name, x, bidirectional]) => (
        <g key={name}>
          <W d={`M${x + 41},70 V125`} both={bidirectional} />
          <Box x={x} y={125} w={82} h={36} label={name} />
        </g>
      ))}

      <W d="M180,161 V220" />
      <T x={180} y={239} anchor="middle" fs={11}>Memory address</T>
      <W d="M275,161 V220" both />
      <T x={275} y={239} anchor="middle" fs={11}>Memory data</T>

      <W d="M370,161 V200" />
      <Box x={345} y={200} w={210} h={52} label="Instruction decoder" sub="and control logic" />
      <W d="M450,252 V265 H567 V398 H515" dash />
      <T x={575} y={394} fs={11}>ALU control</T>

      <W d="M22,70 V290 H102" />
      <Box x={102} y={272} w={90} h={36} label="Y" />
      <Box x={102} y={324} w={90} h={36} label="Constant 4" fs={11.5} />
      <W d="M192,290 H236" />
      <W d="M192,342 H236" />
      <Muxshape x={236} y={271} w={68} h={91} />
      <W d="M270,249 V275" dash />
      <T x={275} y={258} fs={11}>Select</T>
      <W d="M304,316 H387 V372" />
      <W d="M730,70 V338 H485 V372" />
      <T x={387} y={366} anchor="middle" fs={11}>A</T>
      <T x={485} y={366} anchor="middle" fs={11}>B</T>
      <ALUshape x={368} y={372} w={150} h={77} />
      <W d="M445,449 V483" />
      <Box x={410} y={483} w={70} h={36} label="Z" />
      <W d="M480,501 H754 V70" />
      <T x={627} y={493} fs={11}>Zout → bus</T>

      <T x={25} y={550} fs={11}>Only one source drives the internal bus in a control step. Several registers may load it.</T>
    </Svg>
  )
}

// Figure 7.2, Chapter 7 slide 14.
export function RegisterGating() {
  return (
    <Svg vb="0 0 670 446">
      <Bus x1={575} y1={55} x2={575} y2={400} />
      <T x={575} y={36} anchor="middle">Internal processor bus</T>

      <Box x={155} y={69} w={105} h={42} label="Ri" />
      <Box x={380} y={76} w={74} h={28} label="Riin" fs={11.5} />
      <W d="M575,90 H454" />
      <W d="M380,90 H260" />
      <Box x={380} y={121} w={74} h={28} label="Riout" fs={11.5} />
      <W d="M207,111 V135 H380" />
      <W d="M454,135 H575" />

      <Box x={155} y={159} w={105} h={42} label="Y" />
      <Box x={380} y={166} w={74} h={28} label="Yin" fs={11.5} />
      <W d="M575,180 H454" />
      <W d="M380,180 H260" />

      <Box x={34} y={202} w={91} h={32} label="Constant 4" fs={11.5} />
      <Muxshape x={151} y={218} w={66} h={54} />
      <W d="M125,218 H128 M136,218 H139 V231 H151" />
      <W d="M207,201 V208 H132 V258 H151" />
      <T x={238} y={226} fs={11}>Select</T>
      <W d="M246,233 H217" dash />
      <W d="M217,250 H259 V282" />
      <W d="M575,250 H346 V282" />
      <T x={259} y={276} anchor="middle" fs={11}>A</T>
      <T x={346} y={276} anchor="middle" fs={11}>B</T>
      <ALUshape x={239} y={282} w={128} h={57} />

      <Box x={267} y={351} w={72} h={26} label="Zin" fs={11.5} />
      <W d="M303,339 V351" />
      <W d="M303,377 V385" />
      <Box x={267} y={385} w={72} h={30} label="Z" />
      <Box x={380} y={386} w={74} h={28} label="Zout" fs={11.5} />
      <W d="M339,400 H380" />
      <W d="M454,400 H575" />
      <T x={32} y={438} fs={11}>Riin loads Ri at the clock edge. Riout enables Ri to drive the bus.</T>
    </Svg>
  )
}

// Figure 7.3, Chapter 7 slide 15.
export function RegisterBit() {
  return (
    <Svg vb="0 0 670 299">
      <Bus x1={55} y1={45} x2={622} y2={45} />
      <T x={55} y={28}>Internal bus (one bit)</T>

      <Muxshape x={210} y={113} w={70} h={78} label="2-to-1" />
      <T x={202} y={124} anchor="end" fs={11}>0</T>
      <T x={202} y={171} anchor="end" fs={11}>1</T>
      <W d="M130,45 V175 H210" />
      <W d="M280,152 H350" />
      <Box x={350} y={128} w={105} h={48} label="D flip-flop" />
      <T x={354} y={143} fs={10}>D</T>
      <T x={446} y={143} fs={10}>Q</T>

      <W d="M455,152 H516" arrow={false} />
      <W d="M481,152 V82 H179 V128 H210" />
      <circle cx={481} cy={152} r={2.8} style={{ fill: 'var(--dg-ink)' }} />
      <T x={263} y={73} fs={11}>Feedback (hold current bit)</T>
      <path d="M516,136 L516,168 L560,152 Z" style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
      <W d="M560,152 H622 V45" />
      <T x={512} y={120} fs={11}>Tri-state buffer</T>

      <W d="M245,225 V187" dash />
      <T x={245} y={243} anchor="middle" fs={11}>Riin (MUX select)</T>
      <W d="M403,225 V176" />
      <T x={403} y={243} anchor="middle" fs={11}>Clock</T>
      <W d="M540,225 V159" dash />
      <T x={540} y={243} anchor="middle" fs={11}>Riout (enable)</T>
      <T x={55} y={277} fs={11}>Riin=1 loads the bus bit at the next edge. Riout=0 leaves the bus undriven by Ri.</T>
    </Svg>
  )
}

// Figure 7.8, Chapter 7 slide 34.
export function ThreeBus() {
  return (
    <Svg vb="0 0 780 560">
      <Bus x1={110} y1={70} x2={110} y2={495} />
      <Bus x1={210} y1={70} x2={210} y2={495} />
      <Bus x1={520} y1={70} x2={520} y2={495} />
      <T x={110} y={60} anchor="middle" bold>Bus A</T>
      <T x={210} y={60} anchor="middle" bold>Bus B</T>
      <T x={520} y={60} anchor="middle" bold>Bus C</T>

      <Box x={330} y={16} w={120} h={32} label="Incrementer" fs={12} />
      <Box x={330} y={72} w={120} h={36} label="PC" />
      <W d="M359,72 V48" />
      <W d="M422,48 V72" />
      <W d="M330,90 H210" />
      <W d="M520,90 H450" />

      <Box x={330} y={140} w={120} h={72} label="Register file" sub="R0 … R(n−1)" fs={12} />
      <W d="M330,158 H217 M203,158 H110" />
      <W d="M330,186 H210" />
      <W d="M520,200 H450" />

      <Box x={12} y={245} w={84} h={28} label="Constant 4" fs={11.5} />
      <W d="M96,259 H103 M117,259 H203 M217,259 H243" />
      <W d="M110,292 H203 M217,292 H243" />
      <Muxshape x={243} y={245} w={50} h={60} />
      <T x={226} y={333} fs={11}>Select A / 4</T>
      <W d="M270,317 V301" dash />
      <W d="M293,275 H328 V300" />
      <ALUshape x={300} y={300} w={120} h={64} />
      <W d="M210,338 H312" />
      <T x={323} y={320} fs={11}>A</T>
      <T x={318} y={352} fs={11}>B</T>
      <W d="M420,332 H520" />
      <T x={440} y={325} fs={11}>R</T>
      <T x={310} y={388} fs={11}>R=A / R=B copies an input.</T>

      <Box x={600} y={160} w={160} h={46} label="Instruction decoder" fs={11.5} />
      <Box x={600} y={230} w={100} h={36} label="IR" />
      <W d="M650,230 V206" />
      <W d="M600,243 H527 M513,243 H217 M203,243 H110" />
      <W d="M520,259 H600" />

      <Box x={600} y={397} w={100} h={50} label="MDR" />
      <W d="M600,407 H527 M513,407 H217 M203,407 H110" />
      <W d="M600,421 H527 M513,421 H210" />
      <W d="M520,436 H600" />
      <W d="M650,447 V488" both />
      <T x={650} y={506} fs={11} anchor="middle">Memory data lines</T>

      <Box x={330} y={443} w={100} h={36} label="MAR" />
      <W d="M520,461 H430" />
      <W d="M380,479 V514" />
      <T x={380} y={532} fs={11} anchor="middle">Memory address lines</T>
    </Svg>
  )
}

// Chapter 7 slide 40.
export function HardwiredCU() {
  return (
    <Svg vb="0 0 780 435">
      <Box x={35} y={21} w={87} h={36} label="Clock" />
      <W d="M122,39 H229" />
      <Box x={229} y={15} w={195} h={53} label="Control step counter" />
      <W d="M326,68 V113" />
      <Box x={241} y={113} w={170} h={42} label="Step decoder" />
      <W d="M326,155 V233" />
      <T x={334} y={196} fs={11}>T1, T2, …, Tn</T>

      <Box x={35} y={246} w={58} h={36} label="IR" />
      <W d="M93,264 H115" />
      <Box x={115} y={243} w={135} h={42} label="Instruction" sub="decoder" fs={11.5} />
      <W d="M250,264 H294" />
      <T x={112} y={306} fs={11}>INS1, INS2, …, INSm →</T>

      <Box x={294} y={233} w={210} h={88} label="Encoder" bold />
      <Box x={567} y={234} w={159} h={33} label="External inputs" fs={11.5} />
      <W d="M567,250 H504" />
      <Box x={567} y={283} w={159} h={33} label="Condition codes" fs={11.5} />
      <W d="M567,300 H504" />

      <W d="M398,321 V372" />
      <T x={398} y={396} anchor="middle">Control signals</T>
      <W d="M341,321 V350 H12 V58 H229" dash />
      <T x={65} y={342} fs={11}>Run → counter enable</T>
      <W d="M463,321 V351 H752 V42 H424" dash />
      <T x={581} y={343} fs={11}>End → counter reset</T>
    </Svg>
  )
}

// Figure 7.16, Chapter 7 slide 50.
export function MicroCU() {
  return (
    <Svg vb="0 0 640 360">
      <Box x={47} y={24} w={105} h={50} label="IR" />
      <W d="M152,49 H217" />
      <Box x={217} y={24} w={245} h={50} label="Starting address generator" fs={11.5} />
      <W d="M340,74 V135" />
      <Box x={47} y={141} w={105} h={36} label="Clock" />
      <W d="M152,159 H261" />
      <Box x={261} y={135} w={158} h={48} label="µPC" bold />
      <W d="M340,183 V226" />
      <Box x={217} y={226} w={245} h={71} label="Control store" sub="holds the microroutines" />
      <W d="M462,261 H586" />
      <T x={516} y={251} fs={11}>CW</T>
      <T x={55} y={334} fs={11}>The µPC addresses the control store. Its output word drives the datapath.</T>
    </Svg>
  )
}

// Figure 7.18, Chapter 7 slide 51.
export function MicroCUCond() {
  return (
    <Svg vb="0 0 720 388">
      <Box x={35} y={67} w={100} h={42} label="IR" />
      <W d="M135,88 H211" />
      <Box x={211} y={40} w={247} h={118} label="Starting and branch" sub="address generator" />
      <Box x={550} y={27} w={142} h={42} label="External inputs" fs={11.5} />
      <W d="M550,48 H458" />
      <Box x={550} y={78} w={142} h={42} label="Condition codes" fs={11.5} />
      <W d="M550,99 H458" />

      <W d="M335,158 V198" />
      <Box x={35} y={200} w={100} h={42} label="Clock" />
      <W d="M135,221 H254" />
      <Box x={254} y={198} w={162} h={46} label="µPC" bold />
      <W d="M335,244 V281" />
      <Box x={211} y={281} w={247} h={54} label="Control store" />
      <W d="M458,308 H661" />
      <T x={624} y={297} fs={11}>CW</T>
      <W d="M531,308 V140 H458" />
      <circle cx={531} cy={308} r={2.8} style={{ fill: 'var(--dg-ink)' }} />
      <T x={543} y={159} fs={11}>CW feedback</T>
      <T x={38} y={369} fs={11}>The current CW and flags tell the sequencer whether to load a new microaddress.</T>
    </Svg>
  )
}

// Figure 7.14, Chapter 7 slide 43.
export function CompleteProcessor() {
  return (
    <Svg vb="0 0 780 485">
      <Box x={39} y={26} w={702} h={332} fill="none" dashed />
      <T x={55} y={46} bold>Processor</T>

      <Box x={83} y={75} w={158} h={49} label="Instruction unit" fs={12} />
      <Box x={312} y={75} w={155} h={49} label="Integer unit" sub="ALU + control" fs={12} />
      <Box x={538} y={75} w={163} h={49} label="Floating-point unit" sub="ALU + control" fs={11.5} />
      <W d="M162,75 V57 H619 V75" />
      <W d="M389,57 V75" />
      <circle cx={389} cy={57} r={2.8} style={{ fill: 'var(--dg-ink)' }} />

      <Box x={83} y={205} w={158} h={51} label="Instruction cache" fs={12} />
      <W d="M162,205 V124" />
      <Box x={420} y={205} w={171} h={51} label="Data cache" />
      <W d="M389,124 V160 H472 V205" both />
      <W d="M619,124 V160 H537 V205" both />

      <Box x={283} y={291} w={214} h={47} label="Bus interface" />
      <W d="M333,291 V274 H162 V256" />
      <W d="M449,291 V274 H505 V256" both />
      <W d="M390,338 V391" both />

      <Bus x1={39} y1={391} x2={741} y2={391} />
      <T x={55} y={382} fs={11}>System bus</T>
      <W d="M192,391 V426" both />
      <W d="M588,391 V426" both />
      <Box x={105} y={426} w={174} h={41} label="Main memory" />
      <Box x={501} y={426} w={174} h={41} label="Input / output" />
    </Svg>
  )
}

// The sum-of-products example shown on Chapter 7 slide 41.
export function ControlSignalGates() {
  const andGate = (y) => (
    <g>
      <path d={`M170,${y} h24 a24,24 0 0 1 0,48 h-24 z`} style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
      <T x={191} y={y + 28} anchor="middle" fs={11}>AND</T>
    </g>
  )

  return (
    <Svg vb="0 0 660 340">
      <T x={40} y={38} bold>Zin = T1 OR (T6 AND ADD) OR (T4 AND BRANCH)</T>

      <T x={41} y={94} fs={11}>T1</T>
      <W d="M66,90 H302 V130 H389" arrow={false} />
      <T x={41} y={154} fs={11}>T6</T>
      <T x={41} y={178} fs={11}>ADD</T>
      <W d="M75,150 H170" arrow={false} />
      <W d="M75,174 H170" arrow={false} />
      {andGate(138)}
      <W d="M218,162 H397" arrow={false} />

      <T x={41} y={244} fs={11}>T4</T>
      <T x={41} y={268} fs={11}>BRANCH</T>
      <W d="M96,240 H170" arrow={false} />
      <W d="M96,264 H170" arrow={false} />
      {andGate(228)}
      <W d="M218,252 H302 V194 H389" arrow={false} />

      <path d="M379,119 Q408,119 423,126 Q446,137 462,162 Q446,187 423,198 Q408,205 379,205 Q409,162 379,119 Z" style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
      <T x={427} y={166} anchor="middle" fs={11}>OR</T>
      <W d="M462,162 H534" />
      <Box x={534} y={144} w={77} h={36} label="Zin" bold />
      <T x={40} y={318} fs={11}>Each AND selects one instruction and step. The OR combines the three cases.</T>
    </Svg>
  )
}
