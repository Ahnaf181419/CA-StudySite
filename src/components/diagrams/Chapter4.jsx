import { Svg, Box, T, W, Bus } from './base.jsx'

// Slide 2 — accessing I/O devices over a bus.

export function IoBus() {
  return (
    <Svg vb="0 0 640 245">
      <Box x={105} y={22} w={150} h={54} label="Processor" />
      <Box x={385} y={22} w={150} h={54} label="Memory" />
      <W d="M180,76 V126 M460,76 V126" arrow={false} />
      <Bus x1={46} y1={126} x2={594} y2={126} w={5} />
      <T x={320} y={114} anchor="middle">Address · data · control</T>
      <W d="M140,126 V174 M500,126 V174" arrow={false} />
      <Box x={62} y={174} w={156} h={50} label="I/O device 1" />
      <T x={320} y={204} anchor="middle">…</T>
      <Box x={422} y={174} w={156} h={50} label="I/O device n" />
    </Svg>
  )
}

// Slide 3 — I/O interface circuit.

export function IoInterface() {
  return (
    <Svg vb="0 0 640 315">
      <Bus x1={28} y1={32} x2={480} y2={32} w={2} />
      <Bus x1={28} y1={61} x2={480} y2={61} w={2} />
      <Bus x1={28} y1={90} x2={480} y2={90} w={2} />
      <T x={492} y={37}>Address lines</T>
      <T x={492} y={66}>Data lines</T>
      <T x={492} y={95}>Control lines</T>
      <Box x={28} y={127} w={584} h={93} fill="none" dashed />
      <T x={496} y={146}>I/O interface</T>
      <Box x={46} y={156} w={148} h={49} label="Address decoder" />
      <Box x={246} y={156} w={148} h={49} label="Control circuits" />
      <Box x={446} y={156} w={148} h={49} label="Data and status" sub="registers" />
      <W d="M120,32 V156" />
      <W d="M320,90 V156" both />
      <W d="M471,61 V156" both />
      <W d="M194,181 H246" />
      <W d="M394,181 H446" />
      <Box x={246} y={263} w={348} h={38} label="Input device" />
      <W d="M320,263 V205" both />
      <W d="M520,263 V205" />
    </Svg>
  )
}

// Slide 9 — interrupt and the interrupt-service routine.

export function IsrFlow() {
  return (
    <Svg vb="0 0 650 275">
      <T x={108} y={26} bold anchor="middle">Interrupted program</T>
      <T x={540} y={26} bold anchor="middle">Interrupt-service routine</T>
      <Box x={27} y={49} w={162} h={42} label="Instruction i" />
      <Box x={27} y={186} w={162} h={42} label="Next instruction" sub="saved PC" />
      <Box x={459} y={49} w={162} h={42} label="ISR entry" />
      <Box x={459} y={186} w={162} h={42} label="Return from interrupt" fs={11} />
      <W d="M189,70 H459" />
      <T x={324} y={57} anchor="middle">Save PC and status</T>
      <W d="M540,91 V186" />
      <T x={550} y={139} fs={11}>Service device</T>
      <W d="M459,207 H189" />
      <T x={324} y={194} anchor="middle">Restore PC and status</T>
    </Svg>
  )
}

// Slide 24 — priority-structured interrupts.

export function PriorityStructure() {
  return (
    <Svg vb="0 0 640 300">
      <Box x={48} y={24} w={544} h={62} label="Processor" sub="priority arbitration circuit" />
      {[0, 1, 2].map(i => {
        const x = 48 + i * 183
        return (
          <g key={i}>
            <Box x={x} y={189} w={150} h={58} label={`Device ${i + 1}`} sub={`priority ${3 - i}`} />
            <W d={`M${x + 47},189 V86`} />
            <W d={`M${x + 104},86 V189`} />
            <T x={x + 39} y={140} fs={10} anchor="end">IRQ</T>
            <T x={x + 112} y={140} fs={10}>INTA</T>
          </g>
        )
      })}
      <T x={320} y={279} anchor="middle">Each device has its own request and acknowledge pair.</T>
    </Svg>
  )
}

// Slide 27 — daisy chain.
export function DaisyChain() {
  return (
    <Svg vb="0 0 760 300">
      <Box x={40} y={100} w={110} h={80} label="Processor" fs={12} />
      <Bus x1={150} y1={110} x2={680} y2={110} w={4} />
      <W d="M166,110 H150" />
      <T x={560} y={102} fs={11} bold>INTR (shared)</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={210 + i * 160} y={160} w={130} h={60} label={`Device ${i + 1}`} fs={11.5} />
          <W d={`M${275 + i * 160},160 V110`} />
        </g>
      ))}
      <W d="M150,178 H210" />
      <W d="M340,178 H370" />
      <W d="M500,178 H530" />
      <T x={160} y={192} fs={11} bold>INTA</T>
      <T x={40} y={270} fs={11}>Devices share the INTR line; INTA propagates from the electrically closest device onwards. The closest</T>
      <T x={40} y={288} fs={11}>device that needs service keeps the acknowledge and is serviced first — priority = electronic proximity.</T>
    </Svg>
  )
}

// Slide 28 — prioritized daisy chain.

export function PrioritizedDaisyChain() {
  return (
    <Svg vb="0 0 660 325">
      <Box x={24} y={43} w={164} h={226} label="Processor" sub="priority arbitration" />
      {[0, 1].map(i => {
        const y = 59 + i * 141
        return (
          <g key={i}>
            <W d={`M626,${y} H188`} />
            <T x={205} y={y - 10}>INTR{i + 1} (priority {i + 1})</T>
            <Box x={297} y={y + 36} w={132} h={49} label={`Device ${i * 2 + 1}`} />
            <Box x={494} y={y + 36} w={132} h={49} label={`Device ${i * 2 + 2}`} />
            <W d={`M363,${y + 36} V${y} M560,${y + 36} V${y}`} arrow={false} />
            <W d={`M188,${y + 61} H297`} />
            <W d={`M429,${y + 61} H494`} />
            <T x={208} y={y + 50}>INTA{i + 1}</T>
          </g>
        )
      })}
      <T x={330} y={311} anchor="middle">Compare priorities across groups, then follow the selected acknowledge chain.</T>
    </Svg>
  )
}

// Slide 34 — DMA in a computer system.

export function DmaSystem() {
  return (
    <Svg vb="0 0 660 316">
      <Box x={116} y={20} w={155} h={49} label="Processor" />
      <Box x={389} y={20} w={155} h={49} label="Main memory" />
      <W d="M193,69 V118 M466,69 V118" arrow={false} />
      <Bus x1={26} y1={118} x2={634} y2={118} />
      <T x={330} y={107} anchor="middle">System bus</T>
      <W d="M130,118 V167 M330,118 V167 M514,118 V167" arrow={false} />
      <Box x={42} y={167} w={176} h={50} label="Disk DMA controller" sub="two independent channels" />
      <Box x={252} y={167} w={156} h={50} label="Network DMA" />
      <Box x={447} y={167} w={134} h={50} label="Keyboard I/O" />
      <W d="M76,217 V257 M178,217 V257 M330,217 V257" arrow={false} />
      <Box x={31} y={257} w={90} h={40} label="Disk 1" />
      <Box x={133} y={257} w={90} h={40} label="Disk 2" />
      <Box x={252} y={257} w={156} h={40} label="Network interface" />
    </Svg>
  )
}

// DMA channel register layout in the course's example interface.
export function DmaRegisters() {
  return (
    <Svg vb="0 0 640 230">
      <T x={24} y={71}>Status / control</T>
      <Box x={160} y={46} w={75} h={41} label="IRQ" />
      <Box x={235} y={46} w={75} h={41} label="IE" />
      <Box x={310} y={46} w={146} h={41} label="…" />
      <Box x={456} y={46} w={75} h={41} label="R/W̄" />
      <Box x={531} y={46} w={75} h={41} label="Done" />
      {[['31', 198], ['30', 273], ['1', 494], ['0', 569]].map(([bit, x]) => (
        <T key={bit} x={x} y={35} anchor="middle">bit {bit}</T>
      ))}
      <T x={24} y={134}>Start address</T>
      <Box x={160} y={110} w={446} h={41} label="Memory address for transfer" />
      <T x={24} y={198}>Word count</T>
      <Box x={160} y={174} w={446} h={41} label="Number of words to transfer" />
    </Svg>
  )
}

// DMA modes — cycle stealing vs burst.
export function DmaModes() {
  return (
    <Svg vb="0 0 760 240">
      <T x={40} y={30} fs={12} bold>Cycle stealing</T>
      {['CPU', 'DMA', 'CPU', 'DMA', 'CPU', 'CPU', 'DMA'].map((s, i) => (
        <Box key={i} x={40 + i * 98} y={42} w={90} h={34} label={s} fill={s === 'DMA' ? 'var(--dg-panel2)' : 'var(--dg-panel)'} fs={11} />
      ))}
      <T x={40} y={98} fs={11}>Example bus ownership. A DMA cycle may interrupt CPU access.</T>

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
    <Svg vb="0 0 690 299">
      <Box x={27} y={150} w={165} h={66} label="Processor" sub="central bus arbiter" />
      <Box x={270} y={150} w={160} h={66} label="DMA controller 1" />
      <Box x={510} y={150} w={160} h={66} label="DMA controller 2" />
      <Bus x1={62} y1={47} x2={638} y2={47} w={3} />
      <Bus x1={125} y1={92} x2={598} y2={92} w={3} />
      <T x={345} y={36} anchor="middle">BBSY (active low)</T>
      <T x={345} y={80} anchor="middle">BR (shared requests)</T>
      <W d="M62,150 V47 M303,150 V47 M551,150 V47" arrow={false} />
      <W d="M125,92 V150" />
      <W d="M383,150 V92" />
      <W d="M598,150 V92" />
      <W d="M192,183 H270" />
      <W d="M430,183 H510" />
      <T x={231} y={174} anchor="middle">BG1</T>
      <T x={470} y={174} anchor="middle">BG2</T>
      <T x={345} y={252} anchor="middle">Controller 1 passes BG2 only when it does not request the bus.</T>
      <T x={345} y={276} anchor="middle">A requesting controller waits until BBSY is deasserted.</T>
    </Svg>
  )
}

// Slides 39-42 — distributed bus arbitration.

export function DistributedArb() {
  return (
    <Svg vb="0 0 660 280">
      <Box x={62} y={116} w={190} h={71} label="Device A" sub="drive and compare ID 0101" />
      <Box x={408} y={116} w={190} h={71} label="Device B" sub="drive and compare ID 0110" />
      <Bus x1={41} y1={40} x2={619} y2={40} w={4} />
      <Bus x1={41} y1={81} x2={619} y2={81} w={2} />
      <T x={330} y={29} anchor="middle">Arbitration bits [3:0] · wired OR</T>
      <T x={330} y={71} anchor="middle">Start-Arbitration</T>
      <W d="M98,81 V116 M444,81 V116" arrow={false} />
      <W d="M212,40 V116" both />
      <W d="M558,40 V116" both />
      <T x={330} y={220} anchor="middle">First: 0101 OR 0110 = 0111</T>
      <T x={330} y={242} anchor="middle">A loses at bit 1 (zero-based) and drops bits 1 and 0.</T>
      <T x={330} y={264} anchor="middle">After: 0100 OR 0110 = 0110. Device B wins.</T>
    </Svg>
  )
}

// Synchronous bus timing (book 4.5.1), one transfer per clock period.
export function SyncBus({ write = false }) {
  const dataStart = write ? 180 : 355
  const dataEnd = write ? 355 : 560
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
      <W d={`M145,152 H${dataStart} L${dataStart + 13},140 H${dataEnd - 12} L${dataEnd},152 H602`} arrow={false} />
      <W d={`M${dataStart},152 L${dataStart + 13},164 H${dataEnd - 12} L${dataEnd},152`} arrow={false} />
      <T x={write ? 267 : 445} y={156} anchor="middle">valid before sample</T>
      <T x={180} y={191} anchor="middle">t0 · launch</T>
      <T x={355} y={191} anchor="middle">{write ? 't1 · sample' : 't1 · data available'}</T>
      <T x={530} y={191} anchor="middle">{write ? 't2 · end' : 't2 · sample'}</T>
      <W d="M180,210 H530" both />
      <T x={355} y={230} anchor="middle">one bus clock period</T>
    </Svg>
  )
}

// The write variant follows the six event labels printed in Spring 2023 Q3(g).
export function AsyncBus({ write = false }) {
  const ticks = write ? [175, 248, 321, 394, 467, 550] : [205, 338, 460, 565]
  const addressStart = write ? ticks[0] : 188
  const addressEnd = write ? ticks[4] : ticks[2]
  const dataStart = write ? ticks[0] : 320
  const dataEnd = ticks[write ? 4 : 3]
  const [masterOn, masterOff] = write ? [ticks[1], ticks[3]] : [ticks[0], ticks[2]]
  const [slaveOn, slaveOff] = write ? [ticks[2], ticks[5]] : [ticks[1], ticks[3]]

  return (
    <Svg vb="0 0 640 258">
      {ticks.map((x, i) => (
        <g key={x}>
          <line x1={x} y1={16} x2={x} y2={217} style={{ stroke: 'var(--dg-line)' }} strokeDasharray="4 3" />
          <T x={x} y={236} anchor="middle">t{i}</T>
        </g>
      ))}
      <T x={16} y={46}>Address / command</T>
      <W d={`M145,46 H${addressStart} L${addressStart + 12},34 H${addressEnd - 12} L${addressEnd},46 H615`} arrow={false} />
      <W d={`M${addressStart},46 L${addressStart + 12},58 H${addressEnd - 12} L${addressEnd},46`} arrow={false} />
      <T x={16} y={94}>{write ? 'Write data' : 'Read data'}</T>
      <W d={`M145,94 H${dataStart} L${dataStart + 12},82 H${dataEnd - 12} L${dataEnd},94 H615`} arrow={false} />
      <W d={`M${dataStart},94 L${dataStart + 12},106 H${dataEnd - 12} L${dataEnd},94`} arrow={false} />
      <T x={16} y={148}>Master-ready</T>
      <W d={`M145,152 H${masterOn} V130 H${masterOff} V152 H615`} arrow={false} />
      <T x={16} y={198}>Slave-ready</T>
      <W d={`M145,202 H${slaveOn} V180 H${slaveOff} V202 H615`} arrow={false} />
    </Svg>
  )
}

// SCSI read of non-contiguous sectors (Fall 2023 / Spring 2024 question).

export function ScsiRead() {
  return (
    <Svg vb="0 0 710 286">
      <Box x={18} y={21} w={171} h={54} label="CPU / OS" sub="programs the host adapter" />
      <Box x={18} y={112} w={171} h={58} label="Host adapter" sub="SCSI initiator" />
      <Box x={311} y={112} w={156} h={58} label="Disk controller" sub="SCSI target" />
      <Box x={550} y={112} w={142} h={58} label="Disk media" />
      <W d="M103,75 V112" />
      <W d="M189,131 H311" />
      <W d="M311,153 H189" />
      <T x={250} y={120} anchor="middle" fs={11}>READ request</T>
      <T x={250} y={177} anchor="middle" fs={11}>data + status</T>
      <W d="M467,141 H550" both />
      <Box x={18} y={213} w={171} h={49} label="RAM buffer" />
      <W d="M103,170 V213" />
      <T x={113} y={198} fs={11}>DMA</T>
      <T x={240} y={229}>The target locates the requested logical blocks.</T>
      <T x={240} y={251}>The host adapter places the returned data in RAM.</T>
    </Svg>
  )
}
