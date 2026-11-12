import { Svg, Box, T, W, Bus } from './base.jsx'

// Slide 2 — accessing I/O devices over a bus.
export function IoBus() {
  return (
    <Svg vb="0 0 720 315">
      <Box x={60} y={30} w={160} h={60} label="Processor" />
      <Box x={480} y={30} w={160} h={60} label="Memory" />
      <Box x={100} y={200} w={130} h={60} label="I/O device 1" fs={11.5} />
      <Box x={290} y={200} w={130} h={60} label="…" fill="var(--dg-panel)" />
      <Box x={480} y={200} w={140} h={60} label="I/O device n" fs={11.5} />
      <Bus x1={200} y1={60} x2={480} y2={60} w={6} />
      <W d="M140,90 V170" />
      <W d="M165,200 V170" arrow={false} />
      <W d="M350,200 V170" arrow={false} /><W d="M355,200 V170" arrow={false} />
      <W d="M550,200 V170" arrow={false} /><W d="M555,200 V170" arrow={false} />
      <W d="M480,60 V170" arrow={false} />
      <Bus x1={140} y1={170} x2={560} y2={170} w={6} />
      <T x={250} y={140} fs={11} bold>Bus</T>
      <T x={200} y={158} fs={10.5}>address · data · control lines</T>
      <T x={60} y={286} fs={11}>Each device has a unique address; the device that recognizes its address</T>
      <T x={60} y={300} fs={11}>responds to the control signals.</T>
    </Svg>
  )
}

// Slide 3 — I/O interface circuit.
export function IoInterface() {
  return (
    <Svg vb="0 0 720 330">
      <Box x={60} y={40} w={150} h={220} fill="none" dashed />
      <T x={75} y={62} fs={11.5} bold>I/O interface</T>
      <Box x={85} y={75} w={100} h={44} label="Address" sub="decoder" fs={10.5} />
      <Box x={85} y={140} w={100} h={44} label="Control" sub="circuits" fs={10.5} />
      <Box x={85} y={205} w={100} h={44} label="Data + status" sub="registers" fs={10.5} />
      <W d="M160,40 H300" arrow={false} /><T x={310} y={36} fs={11}>Address lines</T>
      <W d="M300,60 H185" arrow={false} /><W d="M185,60 H160" open /><T x={310} y={58} fs={11}>Data lines</T>
      <W d="M300,90 H185" arrow={false} /><W d="M185,90 H162" open /><T x={310} y={88} fs={11}>Control lines</T>
      <W d="M135,260 V300" arrow={false} /><T x={90} y={318} fs={11}>Input device</T>
      <T x={60} y={345} fs={11} hidden={false}></T>
    </Svg>
  )
}

// Slide 9 — interrupt and the interrupt-service routine.
export function IsrFlow() {
  return (
    <Svg vb="0 0 760 345">
      <T x={80} y={40} fs={12} bold>Program 1</T>
      {['1', '2', '⋮', 'i', 'i+1', '⋮', 'M'].map((s, i) => (
        <Box key={i} x={110} y={55 + i * 32} w={110} h={26} label={s} fill="var(--dg-panel)" fs={11} />
      ))}
      <T x={140} y={185} fs={11} anchor="middle">← interrupt occurs here</T>
      <W d="M140,175 V187" arrow={false} />
      <T x={480} y={40} fs={12} bold>Interrupt-service routine</T>
      {['1', '2', '⋮', 'return'].map((s, i) => (
        <Box key={i} x={510} y={55 + i * 32} w={130} h={26} label={s} fill="var(--dg-panel)" fs={11} />
      ))}
      <W d="M222,151 H510" />
      <T x={280} y={144} fs={11}>save PC (i+1) on the stack, branch to ISR</T>
      <W d="M575,177 V310 H165 V213" />
      <T x={300} y={330} fs={11}>return-from-interrupt restores PC → resume at i+1</T>
      <T x={80} y={296} fs={11}>The ISR is defined by the OS or the device manufacturer; it may share</T>
      <T x={80} y={310} fs={11}>nothing with the program it interrupts, so condition codes and registers</T>
      <T x={80} y={324} fs={11}>must also be saved, not just the PC.</T>
    </Svg>
  )
}

// Slide 24 — priority-structured interrupts.
export function PriorityStructure() {
  return (
    <Svg vb="0 0 720 320">
      <Box x={250} y={30} w={220} h={90} label="Processor" sub="+ priority arbitration circuit" fs={11} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={230 + i * 90} y={180} w={70} h={60} label={`Device ${i}`} fs={11} />
          <W d={`M${265 + i * 90},180 V120`} />
          <T x={225 + i * 90} y={172} fs={10}>IRQ</T>
          <W d={`M${305 + i * 90},120 V180`} dash />
          <T x={312 + i * 90} y={172} fs={10}>INTA</T>
        </g>
      ))}
      <T x={230} y={108} fs={10.5}>priority level 2</T>
      <T x={410} y={108} fs={10.5}>priority level 0</T>
      <T x={60} y={286} fs={11}>Each device has its own IRQ and INTA lines with a different priority;</T>
      <T x={60} y={300} fs={11}>a request is accepted only if its priority is higher than the processor's</T>
      <T x={60} y={314} fs={11}>current priority (raised to the device's level while servicing it).</T>
    </Svg>
  )
}

// Slide 27 — daisy chain.
export function DaisyChain() {
  return (
    <Svg vb="0 0 760 300">
      <Box x={40} y={100} w={110} h={80} label="Processor" fs={12} />
      <Bus x1={150} y1={110} x2={680} y2={110} w={4} />
      <T x={560} y={102} fs={11} bold>INTR (shared)</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={210 + i * 160} y={160} w={130} h={60} label={`Device ${i + 1}`} fs={11.5} />
          <W d={`M${275 + i * 160},160 V110`} />
        </g>
      ))}
      <W d="M150,170 H210" />
      <W d="M340,178 H370" />
      <W d="M500,178 H530" />
      <T x={160} y={192} fs={11} bold>INTA</T>
      <T x={360} y={156} fs={10.5}>INTA passed along the chain</T>
      <T x={40} y={270} fs={11}>Devices share the INTR line; INTA propagates from the electrically closest device onwards. The closest</T>
      <T x={40} y={288} fs={11}>device that needs service keeps the acknowledge and is serviced first — priority = electronic proximity.</T>
    </Svg>
  )
}

// Slide 28 — prioritized daisy chain.
export function PrioritizedDaisyChain() {
  return (
    <Svg vb="0 0 760 380">
      <Box x={40} y={120} w={110} h={110} label="Processor" fs={12} />
      <Box x={220} y={90} w={200} h={54} label="Priority arbitration" sub="circuit" fs={11} />
      <W d="M150,140 H220" />
      <Bus x1={420} y1={100} x2={690} y2={100} w={4} />
      <T x={580} y={92} fs={10.5} bold>INTR1 (level 1)</T>
      <Bus x1={420} y1={260} x2={690} y2={260} w={4} />
      <T x={580} y={252} fs={10.5} bold>INTR2 (level 2)</T>
      {[0, 1].map((i) => (
        <g key={i}>
          <Box x={460 + i * 130} y={130} w={110} h={60} label={`Device ${i + 1}`} fs={11} />
          <W d={`M${515 + i * 130},130 V100`} />
        </g>
      ))}
      {[2, 3].map((i) => (
        <g key={i}>
          <Box x={460 + (i - 2) * 130} y={290} w={110} h={60} label={`Device ${i + 1}`} fs={11} />
          <W d={`M${515 + (i - 2) * 130},290 V260`} />
        </g>
      ))}
      <W d="M570,160 H590" />
      <W d="M570,320 H590" />
      <T x={30} y={375} fs={10.5}>Groups get different priority levels; inside a group, daisy-chain proximity decides.</T>
    </Svg>
  )
}

// Slide 34 — DMA in a computer system.
export function DmaSystem() {
  return (
    <Svg vb="0 0 760 380">
      <Box x={70} y={30} w={150} h={60} label="Processor" />
      <Box x={520} y={30} w={150} h={60} label="Main memory" />
      <Bus x1={220} y1={60} x2={520} y2={60} w={6} />
      <T x={300} y={52} fs={11} bold>System bus</T>
      <Box x={170} y={150} w={150} h={60} label="Disk DMA" sub="controller" fs={11} />
      <Box x={380} y={150} w={150} h={60} label="DMA controller" sub="(network)" fs={11} />
      <W d="M245,150 V66" /><W d="M455,150 V66" />
      <Box x={40} y={270} w={100} h={50} label="Disk 1" fs={11} />
      <Box x={160} y={270} w={100} h={50} label="Disk 2" fs={11} />
      <Box x={390} y={270} w={120} h={50} label="Network" sub="interface" fs={11} />
      <Box x={560} y={270} w={110} h={50} label="Keyboard" fs={11} />
      <W d="M90,270 V225" arrow={false} /><W d="M90,270 V220 H225" />
      <W d="M210,270 V210" />
      <W d="M450,270 V210" />
      <W d="M615,270 V180 H530" />
      <T x={40} y={345} fs={11}>The DMA controller supplies the memory address and control signals for every word, increments the address</T>
      <T x={40} y={363} fs={11}>and counts words — the processor only starts the transfer and gets an interrupt when the block is done.</T>
    </Svg>
  )
}

// DMA modes — cycle stealing vs burst.
export function DmaModes() {
  return (
    <Svg vb="0 0 760 240">
      <T x={40} y={30} fs={12} bold>Cycle stealing</T>
      {['CPU', 'DMA', 'CPU', 'DMA', 'CPU', 'DMA', 'CPU'].map((s, i) => (
        <Box key={i} x={40 + i * 98} y={42} w={90} h={34} label={s} fill={s === 'DMA' ? 'var(--dg-panel2)' : 'var(--dg-panel)'} fs={11} />
      ))}
      <T x={40} y={98} fs={11}>one bus cycle at a time is "stolen" between processor accesses</T>

      <T x={40} y={140} fs={12} bold>Block / burst</T>
      <Box x={40} y={152} w={110} h={34} label="CPU" fs={11} />
      <Box x={158} y={152} w={380} h={34} label="DMA  DMA  DMA  DMA" fill="var(--dg-panel2)" fs={11} />
      <Box x={546} y={152} w={110} h={34} label="CPU" fs={11} />
      <T x={40} y={208} fs={11}>Burst: the DMA controller is the bus master for the whole block, then hands the bus back.</T>
    </Svg>
  )
}

// Slide 37 — centralized bus arbitration.
export function BusArbCentralized() {
  return (
    <Svg vb="0 0 760 330">
      <Box x={280} y={20} w={160} h={70} label="Processor /" sub="bus arbiter" fs={11.5} />
      <Bus x1={200} y1={130} x2={600} y2={130} w={4} />
      <T x={610} y={134} fs={11} bold>BBSY</T>
      <Bus x1={200} y1={170} x2={600} y2={170} w={4} />
      <T x={610} y={174} fs={11} bold>BR</T>
      <W d="M360,90 V130" /><W d="M400,90 V170" />
      <Box x={190} y={230} w={170} h={60} label="DMA controller 1" fs={11.5} />
      <Box x={430} y={230} w={170} h={60} label="DMA controller 2" fs={11.5} />
      <W d="M360,170 V230" />
      <W d="M360,230 V190" arrow={false} /><W d="M360,190 V174" />
      <W d="M470,170 V230" />
      <W d="M470,230 V190" arrow={false} /><W d="M470,190 V174" />
      <W d="M360,260 H390" /><T x={398} y={264} fs={11} bold>BG1</T>
      <W d="M430,260 H460" />
      <W d="M470,270 H500" /><T x={505} y={298} fs={11} bold>BG2</T>
      <T x={40} y={320} fs={11}>BG1 is daisy-chained: it reaches DMA controller 2 as BG2 only if controller 1 does not need the bus.</T>
    </Svg>
  )
}

// Slides 39-42 — distributed bus arbitration.
export function DistributedArb() {
  return (
    <Svg vb="0 0 780 360">
      {[['A', '0101', 60], ['B', '0110', 330]].map(([n, id, x], i) => (
        <g key={i}>
          <Box x={x} y={40} w={180} h={80} label={`Device ${n}`} sub={`ID = ${id}`} fs={12} />
          <W d={`M${x + 90},120 V170`} />
        </g>
      ))}
      <g>
        <ellipse cx={390} cy={185} rx={60} ry={26} style={{ fill: 'var(--dg-panel)', stroke: 'var(--dg-ink)' }} strokeWidth="1.4" />
        <T x={390} y={190} fs={11} anchor="middle">logical OR</T>
      </g>
      <W d="M150,120 V185 H330" />
      <W d="M420,120 V185 H450" />
      <W d="M450,185 H510" />
      <T x={130} y={240} fs={11}>4 arbitration lines carry the OR of all competing IDs</T>
      <T x={130} y={258} fs={11}>+ 1 Start-Arbitration line (5 lines total)</T>

      <T x={130} y={300} fs={11} bold>Bit-by-bit, MSB first:</T>
      <T x={130} y={320} fs={11}>A sees 0111 ≠ 0101 at bit 2 → drops to 0100 → line becomes 0100 OR 0110 = 0110 = ID of B → B wins.</T>
    </Svg>
  )
}

// Synchronous bus timing (book 4.5.1), one transfer per clock period.
export function SyncBus({ write = false }) {
  const dataStart = write ? 200 : 355
  return (
    <Svg vb="0 0 640 236">
      {[180, 355, 530].map(x => (
        <line key={x} x1={x} y1={16} x2={x} y2={174} style={{ stroke: 'var(--dg-line)' }} strokeDasharray="4 3" />
      ))}
      <T x={16} y={53}>Bus clock</T>
      <W d="M145,57 H180 V34 H355 V57 H530 V34 H602" arrow={false} />
      <T x={16} y={101}>Address / command</T>
      <W d="M145,104 H180 L193,92 H518 L530,104 H602" arrow={false} />
      <W d="M180,104 L193,116 H518 L530,104" arrow={false} />
      <T x={355} y={109} anchor="middle">valid for transfer</T>
      <T x={16} y={149}>{write ? 'Write data' : 'Read data'}</T>
      <W d={`M145,152 H${dataStart} L${dataStart + 13},140 H548 L560,152 H602`} arrow={false} />
      <W d={`M${dataStart},152 L${dataStart + 13},164 H548 L560,152`} arrow={false} />
      <T x={445} y={156} anchor="middle">valid before sample</T>
      <T x={180} y={191} anchor="middle">t0 · launch</T>
      <T x={355} y={191} anchor="middle">{write ? 't1 · mid-cycle' : 't1 · data available'}</T>
      <T x={530} y={191} anchor="middle">t2 · sample</T>
      <W d="M180,210 H530" both />
      <T x={355} y={230} anchor="middle">one bus clock period</T>
    </Svg>
  )
}

// Asynchronous read timing, with each ready transition tied to its event.
export function AsyncBus({ write = false }) {
  const dataStart = write ? 187 : 320
  return (
    <Svg vb="0 0 640 258">
      {[205, 338, 460, 565].map(x => (
        <line key={x} x1={x} y1={16} x2={x} y2={217} style={{ stroke: 'var(--dg-line)' }} strokeDasharray="4 3" />
      ))}
      <T x={16} y={46}>Address / command</T>
      <W d="M145,46 H188 L200,34 H448 L460,46 H615" arrow={false} />
      <W d="M188,46 L200,58 H448 L460,46" arrow={false} />
      <T x={16} y={94}>{write ? 'Write data' : 'Read data'}</T>
      <W d={`M145,94 H${dataStart} L${dataStart + 12},82 H553 L565,94 H615`} arrow={false} />
      <W d={`M${dataStart},94 L${dataStart + 12},106 H553 L565,94`} arrow={false} />
      <T x={16} y={148}>Master-ready</T>
      <W d="M145,152 H205 V130 H460 V152 H615" arrow={false} />
      <T x={16} y={198}>Slave-ready</T>
      <W d="M145,202 H338 V180 H565 V202 H615" arrow={false} />
      <T x={205} y={236} anchor="middle">t0</T>
      <T x={338} y={236} anchor="middle">t1</T>
      <T x={460} y={236} anchor="middle">t2</T>
      <T x={565} y={236} anchor="middle">t3</T>
    </Svg>
  )
}

// SCSI read of non-contiguous sectors (Fall 2023 / Spring 2024 question).
export function ScsiRead() {
  return (
    <Svg vb="0 0 760 330">
      <Box x={40} y={60} w={170} h={70} label="Processor" sub="(initiator)" fs={11.5} />
      <Box x={300} y={60} w={180} h={70} label="SCSI controller" sub="(target)" fs={11.5} />
      <W d="M210,85 H300" /><W d="M300,110 H210" open />
      <T x={214} y={78} fs={10.5}>command</T>
      <T x={214} y={124} fs={10.5}>data + status</T>
      <Box x={560} y={40} w={150} h={130} fill="var(--dg-panel)" />
      <T x={635} y={62} fs={11} anchor="middle">Disk</T>
      {['sector 5', '', 'sector 9', '', 'sector 12'].map((s, i) => (
        s ? <Box key={i} x={585} y={70 + i * 20} w={100} h={18} label={s} fill="var(--dg-panel2)" fs={10} /> : <T key={i} x={635} y={84 + i * 20} fs={10} anchor="middle">·</T>
      ))}
      <W d="M480,95 H560" />
      <T x={40} y={206} fs={11}>The OS tells the SCSI controller which logical block it needs; the target</T>
      <T x={40} y={220} fs={11}>translates this to (cylinder, surface, sector) coordinates, seeks, and reads</T>
      <T x={40} y={234} fs={11}>each sector — even when the sectors are scattered across the disk. Each</T>
      <T x={40} y={248} fs={11}>sector read is transferred over the SCSI bus and then into memory.</T>
    </Svg>
  )
}
