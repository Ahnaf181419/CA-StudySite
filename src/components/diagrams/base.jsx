// Monochrome SVG diagram primitives shared by every figure.
const INK = '#17171a'
const LINE = '#c4c4c0'
const PANEL = '#f3f3f1'

export function Svg({ vb = '0 0 760 420', maxw = 760, children }) {
  return (
    <svg viewBox={vb} role="img" style={{ maxWidth: maxw + 'px', width: '100%', height: 'auto' }} className="select-none">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
        <marker id="ah-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10" fill="none" stroke={INK} strokeWidth="1.6" />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

export function Box({ x, y, w, h, label, sub, bold = false, fill = PANEL, dashed = false, mono = true, fs = 13 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={INK} strokeWidth={1.4} strokeDasharray={dashed ? '5 3' : undefined} />
      {sub !== undefined ? (
        <>
          <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fontSize={fs} fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'} fontWeight={bold ? 600 : 400} fill={INK}>{label}</text>
          <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={fs - 2.5} fontFamily="var(--font-mono)" fill={INK}>{sub}</text>
        </>
      ) : (
        <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontSize={fs} fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'} fontWeight={bold ? 600 : 400} fill={INK}>{label}</text>
      )}
    </g>
  )
}

export function T({ x, y, children, anchor = 'start', fs = 12, bold = false, mono = true, fill = INK }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={fs} fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'} fontWeight={bold ? 600 : 400} fill={fill}>
      {children}
    </text>
  )
}

export function W({ d, arrow = true, open = false, dash = false, w = 1.4 }) {
  return (
    <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeDasharray={dash ? '5 3' : undefined} markerEnd={arrow ? (open ? 'url(#ah-open)' : 'url(#ah)') : undefined} strokeLinejoin="round" />
  )
}

export function Bus({ x1, y1, x2, y2, w = 5, dash = false }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w} strokeDasharray={dash ? '6 4' : undefined} strokeLinecap="butt" />
}

export function Cross({ x, y }) {
  return <path d={`M${x - 5},${y - 5} L${x + 5},${y + 5} M${x + 5},${y - 5} L${x - 5},${y + 5}`} stroke={INK} strokeWidth="1.8" />
}

export function ALUshape({ x, y, w, h, label = 'ALU' }) {
  // Trapezoid: standard ALU symbol with notch on the left side
  const n = 12
  const d = `M${x},${y} L${x + w},${y} L${x + w - 8},${y + h} L${x + 8},${y + h} L${x + n},${y + h * 0.62} L${x + n},${y + h * 0.38} Z`
  return (
    <g>
      <path d={d} fill={PANEL} stroke={INK} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={INK}>{label}</text>
    </g>
  )
}

export function Muxshape({ x, y, w, h, label = 'MUX' }) {
  const d = `M${x},${y} L${x + w},${y + 8} L${x + w},${y + h - 8} L${x},${y + h} Z`
  return (
    <g>
      <path d={d} fill={PANEL} stroke={INK} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={11.5} fontFamily="var(--font-mono)" fill={INK}>{label}</text>
    </g>
  )
}
