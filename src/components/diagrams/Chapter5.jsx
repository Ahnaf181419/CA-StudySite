import { Svg, Box, T, W } from './base.jsx'

// Slide 3 — processor/memory interface via MAR and MDR.
export function MemInterface() {
  return (
    <Svg vb="0 0 720 260">
      <Box x={40} y={40} w={180} h={180} fill="none" dashed />
      <T x={60} y={64} fs={12} bold>Processor</T>
      <Box x={70} y={80} w={120} h={36} label="MAR" sub="k bits" fs={11.5} />
      <Box x={70} y={150} w={120} h={36} label="MDR" sub="n bits" fs={11.5} />
      <Box x={500} y={90} w={160} h={115} label="Memory" sub="2^k locations × n bits" fs={11.5} />
      <W d="M190,98 H500" />
      <T x={300} y={90} fs={11}>k-bit address bus</T>
      <W d="M190,158 H500" both />
      <T x={300} y={149} fs={11}>n-bit data bus</T>
      <W d="M220,180 H500" />
      <T x={288} y={174} fs={11}>Read / write (R/W̄)</T>
      <W d="M500,190 H220" />
      <T x={288} y={208} fs={11}>Memory function completed (MFC)</T>
      <T x={40} y={245} fs={11}>k address bits → 2^k addressable locations. Word length n = bits moved in one memory operation.</T>
    </Svg>
  )
}

// Slide 6 — internal organization of a 16-word × 8-bit RAM chip.
export function RamChip() {
  const wordLines = [['W0', 80], ['W1', 125], ['W15', 205]]
  return (
    <Svg vb="0 0 780 388">
      <Box x={90} y={60} w={132} h={167} label="Address" sub="decoder (4 → 16)" fs={12} />
      {[0, 1, 2, 3].map((bit) => (
        <g key={bit}>
          <T x={32} y={89 + bit * 31} fs={11}>A{bit}</T>
          <W d={`M54,${85 + bit * 31} H90`} />
        </g>
      ))}
      <T x={294} y={26} fs={12}>Cell array · 16 words × 8 bits</T>
      {wordLines.map(([word, y]) => (
        <g key={word}>
          <W d={`M222,${y} H678`} arrow={false} />
          <T x={235} y={y - 8} fs={11}>{word}</T>
        </g>
      ))}
      <T x={245} y={169} fs={14}>⋮</T>
      <Box x={280} y={246} w={398} h={63} fill="none" dashed />
      {Array.from({ length: 8 }, (_, i) => {
        const x = 305 + i * 49
        return (
          <g key={i}>
            <T x={x} y={49} fs={10} anchor="middle">bit {7 - i}</T>
            <W d={`M${x},55 V264`} arrow={false} />
            {wordLines.map(([word, y]) => (
              <Box key={word} x={x - 12} y={y - 11} w={24} h={22} label="cell" fs={8} />
            ))}
            <T x={x + 14} y={169} fs={12}>⋮</T>
            <Box x={x - 18} y={264} w={36} h={33} label="S/W" fs={10} />
            <W d={`M${x},297 V326`} both />
            <T x={x} y={343} fs={11} anchor="middle">b{7 - i}</T>
          </g>
        )
      })}
      <W d="M742,264 H678" />
      <T x={692} y={257} fs={11}>R/W̄</T>
      <W d="M742,293 H678" />
      <T x={692} y={286} fs={11}>CS</T>
      <T x={32} y={364} fs={11}>Horizontal: word lines select one row. Vertical: bit lines connect each column to its sense/write circuit.</T>
      <T x={32} y={380} fs={11}>Rows W2–W14 are omitted. Each vertical line represents one bit-line connection (often a pair in SRAM).</T>
    </Svg>
  )
}

// Slide 18 — the memory hierarchy.
export function MemoryHierarchy() {
  const rows = [
    ['Registers', 210],
    ['Primary (L1) cache', 260],
    ['Secondary (L2) cache', 310],
    ['Main memory', 360],
    ['Disk / SSD (secondary storage)', 388],
  ]
  return (
    <Svg vb="0 0 780 380">
      {rows.map(([label, w], i) => (
        <g key={i}>
          <Box x={390 - w / 2} y={30 + i * 62} w={w} h={46} label={label} fs={11.5} />
        </g>
      ))}
      <W d="M45,322 V34" />
      <T x={58} y={52} fs={11}>Faster access</T>
      <T x={58} y={69} fs={11}>Higher cost per bit</T>
      <W d="M633,34 V322" />
      <T x={646} y={310} fs={11}>Larger capacity</T>
      <T x={40} y={365} fs={11}>Fastest access is to processor registers; each level down is larger, slower and cheaper per bit.</T>
    </Svg>
  )
}

// Slide 24 — processor / cache / main memory block diagram.
export function CacheBlock() {
  return (
    <Svg vb="0 0 720 220">
      <Box x={40} y={70} w={160} h={80} label="Processor" />
      <Box x={290} y={70} w={160} h={80} label="Cache" sub="(SRAM)" fs={12} />
      <Box x={540} y={70} w={150} h={80} label="Main memory" sub="(DRAM)" fs={12} />
      <W d="M200,95 H290" /><W d="M290,120 H200" open />
      <W d="M450,95 H540" /><W d="M540,120 H450" open />
      <T x={40} y={186} fs={11}>On a read miss, the lower level supplies the block that contains the requested word;</T>
      <T x={40} y={200} fs={11}>later references hit while the block remains valid in the cache.</T>
    </Svg>
  )
}

function AddrSplit({ parts, y = 30 }) {
  // parts: [['Tag', 5], ['Block', 7], ['Word', 4]] — proportional widths
  const total = parts.reduce((s, p) => s + p[1], 0)
  let x = 80
  const unit = 560 / total
  return (
    <g>
      {parts.map(([name, bits], i) => {
        const w = bits * unit
        const el = (
          <g key={i}>
            <Box x={x} y={y} w={w} h={52} label={name} fs={12} bold />
            <T x={x + w / 2} y={y + 70} fs={11} anchor="middle">{bits} {bits === 1 ? 'bit' : 'bits'}</T>
          </g>
        )
        x += w
        return el
      })}
      <T x={80} y={y - 12} fs={11}>{total}-bit word address:</T>
    </g>
  )
}

// Slide 28 — direct-mapped cache.
export function DirectMap() {
  return (
    <Svg vb="0 0 780 364">
      <AddrSplit parts={[['Tag', 5], ['Cache line', 7], ['Word', 4]]} />
      <T x={80} y={132} fs={11}>Cache line = memory block number mod 128</T>
      <T x={80} y={172} fs={12} bold>Main memory (4096 blocks)</T>
      <T x={504} y={172} fs={12} bold>Cache (128 lines)</T>
      {[['0, 128, 256, …', 'line 0'], ['1, 129, 257, …', 'line 1'], ['127, 255, …, 4095', 'line 127']].map(([blocks, line], i) => (
        <g key={line}>
          <Box x={80} y={188 + i * 47} w={202} h={34} label={blocks} fs={12} />
          <W d={`M282,${205 + i * 47} H504`} />
          <Box x={504} y={188 + i * 47} w={186} h={34} label={`tag | ${line}`} fs={12} />
        </g>
      ))}
      <T x={80} y={335} fs={11}>Each group competes for one fixed line. For line 0, block 0 stores tag 0 and block 128 stores tag 1.</T>
      <T x={80} y={353} fs={11}>Select the line with the index; hit only if its valid bit is set and its stored tag matches.</T>
    </Svg>
  )
}

// Slide 29 — associative-mapped cache.
export function AssociativeMap() {
  return (
    <Svg vb="0 0 780 374">
      <AddrSplit parts={[['Tag', 12], ['Word', 4]]} />
      <T x={80} y={132} fs={11}>Any memory block may occupy any of the 128 cache lines.</T>
      <T x={80} y={172} fs={12} bold>Main memory (4096 blocks)</T>
      <T x={510} y={172} fs={12} bold>Cache (128 lines)</T>
      <Box x={80} y={220} w={202} h={48} label="Example: block 128" fs={12} />
      <W d="M282,244 H396 V205 H510" />
      <W d="M396,244 H510" />
      <W d="M396,244 V310 H510" />
      {[['line 0', 189], ['line 1', 228], ['line 127', 294]].map(([line, y]) => (
        <Box key={line} x={510} y={y} w={182} h={32} label={`tag | ${line}`} fs={12} />
      ))}
      <T x={600} y={281} fs={12} anchor="middle">⋮</T>
      <T x={80} y={349} fs={11}>These arrows are alternative locations for one copy. The tag is the entire memory block number.</T>
      <T x={80} y={367} fs={11}>A parallel lookup checks every valid tag; the matching line supplies the requested word.</T>
    </Svg>
  )
}

// Slide 30 — set-associative mapped cache (2-way here).
export function SetAssocMap() {
  return (
    <Svg vb="0 0 780 412">
      <AddrSplit parts={[['Tag', 6], ['Set', 6], ['Word', 4]]} />
      <T x={80} y={132} fs={11}>128 cache lines ÷ 2 ways per set = 64 sets · set number = memory block number mod 64</T>
      <T x={80} y={172} fs={12} bold>Main memory (4096 blocks)</T>
      <T x={452} y={172} fs={12} bold>Cache (64 sets × 2 ways)</T>
      {[['0, 64, 128, …', 'Set 0'], ['1, 65, 129, …', 'Set 1'], ['63, 127, …, 4095', 'Set 63']].map(([blocks, set], i) => {
        const y = 185 + i * 60
        return (
          <g key={set}>
            <Box x={80} y={y + 8} w={202} h={34} label={blocks} fs={12} />
            <W d={`M282,${y + 25} H452`} />
            <Box x={452} y={y} w={256} h={50} fill="none" />
            <T x={464} y={y + 29} fs={11}>{set}</T>
            <Box x={526} y={y + 8} w={80} h={34} label="Way 0" sub="tag | data" fs={11} />
            <Box x={614} y={y + 8} w={80} h={34} label="Way 1" sub="tag | data" fs={11} />
          </g>
        )
      })}
      <T x={80} y={372} fs={11}>Each block may occupy either way of its indexed set. Compare both valid tags in that set.</T>
      <T x={80} y={391} fs={11}>One way per set = direct mapping. One set containing every line = fully associative mapping.</T>
    </Svg>
  )
}

// Virtual memory — MMU translation (Fig 5.26 idea).
export function VirtualMemory() {
  return (
    <Svg vb="0 0 780 424">
      <Box x={52} y={29} w={270} h={48} label="Processor" />
      <Box x={425} y={112} w={172} h={45} label="MMU" sub="translate and check access" fs={12} />
      <Box x={52} y={181} w={270} h={48} label="Cache" />
      <Box x={52} y={273} w={270} h={48} label="Main memory (RAM)" />
      <Box x={52} y={365} w={270} h={48} label="Disk / SSD backing storage" />
      <W d="M112,77 V181" both />
      <T x={62} y={131} fs={11}>Data</T>
      <W d="M322,53 H511 V112" />
      <T x={349} y={43} fs={11}>Virtual address</T>
      <W d="M425,145 H258 V181" />
      <T x={265} y={136} fs={11}>Physical address</T>
      <W d="M112,229 V273" both />
      <T x={62} y={253} fs={11}>Data</T>
      <W d="M258,229 V273" />
      <T x={269} y={253} fs={11}>Physical address</T>
      <W d="M112,321 V365" both />
      <T x={128} y={347} fs={11}>Page transfer (e.g. DMA)</T>
      <W d="M511,157 V181" dash />
      <Box x={419} y={181} w={184} h={48} label="OS fault handler" fs={12} />
      <T x={525} y={173} fs={11}>Page fault</T>
      <T x={419} y={257} fs={11}>Valid page absent? The OS supplies</T>
      <T x={419} y={276} fs={11}>a RAM frame, updates the mapping,</T>
      <T x={419} y={295} fs={11}>and retries the instruction.</T>
      <T x={419} y={329} fs={11}>Invalid or forbidden access may fail.</T>
    </Svg>
  )
}
