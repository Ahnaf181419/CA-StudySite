import { Svg, Box, T, W, Bus } from './base.jsx'

// Slide 3 — processor/memory interface via MAR and MDR.
export function MemInterface() {
  return (
    <Svg vb="0 0 720 260">
      <Box x={40} y={40} w={180} h={180} fill="none" dashed />
      <T x={60} y={64} fs={12} bold>Processor</T>
      <Box x={70} y={80} w={120} h={36} label="MAR" sub="k bits" fs={11.5} />
      <Box x={70} y={150} w={120} h={36} label="MDR" sub="n bits" fs={11.5} />
      <Box x={500} y={90} w={160} h={100} label="Memory" sub="2^k locations × n bits" fs={11.5} />
      <W d="M190,98 H500" />
      <T x={300} y={90} fs={11}>k-bit address bus</T>
      <W d="M500,140 H400" arrow={false} /><W d="M400,140 H190" open />
      <T x={300} y={132} fs={11}>n-bit data bus</T>
      <W d="M500,168 H400" arrow={false} /><W d="M400,168 H230" open />
      <T x={290} y={190} fs={11}>Control lines (R/W̄, MFC)</T>
      <T x={40} y={245} fs={11}>k address bits → 2^k addressable locations. Word length n = bits moved in one memory operation.</T>
    </Svg>
  )
}

// Slide 6 — internal organization of a 16-word × 8-bit RAM chip.
export function RamChip() {
  return (
    <Svg vb="0 0 780 400">
      <T x={40} y={40} fs={11}>A0</T><W d="M62,44 H120" />
      <T x={40} y={66} fs={11}>A1</T><W d="M62,70 H120" />
      <T x={40} y={92} fs={11}>A2</T><W d="M62,96 H120" />
      <T x={40} y={118} fs={11}>A3</T><W d="M62,122 H120" />
      <Box x={120} y={30} w={120} h={100} label="Address" sub="decoder (4 → 16)" fs={11.5} />
      <T x={40} y={150} fs={11}>4-bit address</T>

      {/* 16 word lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <W d={`M240,${48 + i * 24} H330`} arrow={false} />
          <T x={248} y={44 + i * 24} fs={9}>W{i}</T>
        </g>
      ))}
      <T x={238} y={258} fs={10}>⋮  (16 word lines, W0…W15)</T>

      {/* cell array */}
      <Box x={330} y={30} w={240} h={240} fill="#fbfbfa" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <line x1={330} y1={48 + i * 24} x2={570} y2={48 + i * 24} stroke="#17171a" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, j) => (
            <rect key={j} x={344 + j * 27} y={36 + i * 24} width={20} height={14} fill="none" stroke="#c4c4c0" strokeWidth="1" />
          ))}
        </g>
      ))}
      <T x={450} y={288} fs={11} anchor="middle">Memory cells — 16 words × 8 bits = 128 bits</T>
      <T x={578} y={56} fs={10}>1 row = 1 word</T>
      <T x={578} y={70} fs={10}>(8 cells share a word line)</T>

      {/* sense/write circuits */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <W d={`M570,${52 + i * 40} H620`} arrow={false} /><W d={`M570,${52 + i * 40} H616`} open />
        </g>
      ))}
      <Box x={620} y={30} w={120} h={170} label="Sense / Write" sub="circuits ×8" fs={11.5} />
      <T x={752} y={115} fs={11} anchor="end">b7 … b0</T>
      <W d="M740,60 H760" arrow={false} /><W d="M740,100 H760" arrow={false} />
      <W d="M740,130 H760" arrow={false} /><W d="M740,170 H760" arrow={false} />
      <T x={600} y={225} fs={11}>Data input/output lines</T>
      <T x={620} y={250} fs={11}>R/W̄</T><T x={620} y={270} fs={11}>CS</T>

      <T x={40} y={340} fs={11}>One row = one 8-bit word, selected by driving its word line. Every column is one bit position, read/written</T>
      <T x={40} y={358} fs={11}>through its sense/write circuit. Chip select (CS) enables the chip; R/W̄ chooses read (1) or write (0).</T>
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
    ['Magnetic disk (secondary storage)', 460],
  ]
  return (
    <Svg vb="0 0 780 380">
      {rows.map(([label, w], i) => (
        <g key={i}>
          <Box x={390 - w / 2} y={30 + i * 62} w={w} h={46} label={label} fs={11.5} />
        </g>
      ))}
      <T x={140} y={50} fs={11}>Increasing speed, increasing cost per bit</T>
      <W d="M130,320 V60" open />
      <T x={612} y={330} fs={11}>Increasing size</T>
      <W d="M600,64 V320" open />
      <T x={612} y={50} fs={11}>Faster access</T>
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
      <T x={40} y={186} fs={11}>On a read, a block of words moves memory → cache one word at a time;</T>
      <T x={40} y={200} fs={11}>later references to that block hit in the cache.</T>
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
      <T x={80} y={y - 12} fs={11}>16-bit memory address:</T>
    </g>
  )
}

// Slide 28 — direct-mapped cache.
export function DirectMap() {
  return (
    <Svg vb="0 0 780 470">
      <AddrSplit parts={[['Tag', 5], ['Cache block', 7], ['Word', 4]]} />
      <T x={80} y={130} fs={11}>cache block address = memory block address mod 128</T>

      <T x={90} y={190} fs={12} bold>Main memory (4096 blocks)</T>
      {['Block 0', 'Block 1', '⋮', 'Block 127', 'Block 128', 'Block 129', '⋮', 'Block 255', 'Block 256', '⋮', 'Block 4095'].map((b, i) => (
        <Box key={i} x={90} y={205 + i * 23} w={130} h={20} label={b} fill="#fbfbfa" fs={10.5} />
      ))}
      <T x={480} y={190} fs={12} bold>Cache (128 blocks)</T>
      {['tag | block 0', 'tag | block 1', '⋮', 'tag | block 127'].map((b, i) => (
        <Box key={i} x={470} y={205 + i * 23} w={170} h={20} label={b} fill="#f3f3f1" fs={10.5} />
      ))}
      <W d="M220,215 H470" />
      <W d="M220,274 H470" dash />
      <W d="M220,317 H470" />
      <W d="M220,435 H470" dash />
      <T x={300} y={268} fs={10.5}>blocks 0, 128, 256 …</T>
      <T x={300} y={284} fs={10.5}>→ block 0</T>
      <T x={660} y={215} fs={10.5}>5 tag bits</T>
      <T x={660} y={230} fs={10.5}>identify which</T>
      <T x={660} y={245} fs={10.5}>of the 32 blocks</T>
      <T x={660} y={260} fs={10.5}>mapped here is</T>
      <T x={660} y={275} fs={10.5}>resident now</T>
      <T x={80} y={455} fs={10.5}>Position is fixed: block 0, 128, 256, … all compete for cache block 0. Replacement is trivial.</T>
    </Svg>
  )
}

// Slide 29 — associative-mapped cache.
export function AssociativeMap() {
  return (
    <Svg vb="0 0 780 470">
      <AddrSplit parts={[['Tag', 12], ['Word', 4]]} />
      <T x={80} y={130} fs={11}>any memory block may be placed in any cache position</T>
      <T x={90} y={190} fs={12} bold>Main memory (4096 blocks)</T>
      {['Block 0', 'Block 1', '⋮', 'Block 127', 'Block 128', '⋮', 'Block 255', '⋮', 'Block 4095'].map((b, i) => (
        <Box key={i} x={90} y={205 + i * 23} w={130} h={20} label={b} fill="#fbfbfa" fs={10.5} />
      ))}
      <T x={480} y={190} fs={12} bold>Cache (128 blocks)</T>
      {['tag | block 0', 'tag | block 1', '⋮', 'tag | block 127'].map((b, i) => (
        <Box key={i} x={470} y={205 + i * 23} w={170} h={20} label={b} fill="#f3f3f1" fs={10.5} />
      ))}
      <W d="M220,215 H470" />
      <W d="M220,251 H470" dash />
      <W d="M220,297 H470" dash />
      <W d="M220,390 H470" dash />
      <T x={660} y={215} fs={10.5}>all 128 tags</T>
      <T x={660} y={230} fs={10.5}>compared in</T>
      <T x={660} y={245} fs={10.5}>parallel to</T>
      <T x={660} y={260} fs={10.5}>decide hit/miss</T>
      <T x={80} y={455} fs={10.5}>Flexible and uses cache space efficiently, but needs 128 comparators — costlier than direct mapping.</T>
    </Svg>
  )
}

// Slide 30 — set-associative mapped cache (2-way here).
export function SetAssocMap() {
  return (
    <Svg vb="0 0 780 470">
      <AddrSplit parts={[['Tag', 6], ['Set', 6], ['Word', 4]]} />
      <T x={80} y={130} fs={11}>128 cache blocks ÷ 2 per set = 64 sets · tag = 4096 / 64 = 64 = 2^6</T>
      <T x={90} y={190} fs={12} bold>Main memory (4096 blocks)</T>
      {['Block 0', 'Block 1', '⋮', 'Block 63', 'Block 64', 'Block 65', '⋮', 'Block 127', 'Block 128', '⋮', 'Block 4095'].map((b, i) => (
        <Box key={i} x={90} y={205 + i * 23} w={130} h={20} label={b} fill="#fbfbfa" fs={10.5} />
      ))}
      <T x={480} y={190} fs={12} bold>Cache (64 sets × 2 blocks)</T>
      {['tag | block 0', 'tag | block 1', '⋮', 'tag | block 126', 'tag | block 127'].map((b, i) => (
        <Box key={i} x={470} y={205 + i * 23} w={180} h={20} label={b} fill="#f3f3f1" fs={10.5} />
      ))}
      <T x={460} y={272} fs={10.5} anchor="end">Set 0</T>
      <T x={460} y={432} fs={10.5} anchor="end">Set 63</T>
      <W d="M220,215 H470" />
      <W d="M220,320 H470" dash />
      <W d="M220,435 H470" dash />
      <T x={295} y={300} fs={10.5}>blocks 0, 64, 128 …</T>
      <T x={295} y={316} fs={10.5}>→ set 0, either</T>
      <T x={295} y={332} fs={10.5}>of its 2 slots</T>
      <T x={80} y={455} fs={10.5}>One extreme: all blocks in one set = fully associative. Other extreme: one block per set = direct-mapped.</T>
    </Svg>
  )
}

// Virtual memory — MMU translation (Fig 5.26 idea).
export function VirtualMemory() {
  return (
    <Svg vb="0 0 780 330">
      <Box x={40} y={100} w={140} h={70} label="Processor" />
      <W d="M180,125 H300" />
      <T x={192} y={118} fs={11}>virtual address</T>
      <Box x={300} y={100} w={140} h={70} label="MMU" fs={12} bold />
      <W d="M440,125 H560" />
      <T x={455} y={118} fs={11}>physical address</T>
      <Box x={560} y={100} w={150} h={70} label="Main memory" />
      <Box x={300} y={240} w={150} h={60} label="Disk" sub="(secondary)" fs={11.5} />
      <W d="M635,170 V270 H450" dash />
      <T x={470} y={295} fs={11}>not in memory → OS loads the block from disk</T>
      <W d="M370,240 V170" dash />
      <T x={40} y={315} fs={11}>Virtual addresses are translated by hardware + software; only the active portion of the address space is mapped</T>
      <T x={40} y={333} fs={11}>onto physical memory, the rest lives on disk — the programmer sees one large memory.</T>
    </Svg>
  )
}
