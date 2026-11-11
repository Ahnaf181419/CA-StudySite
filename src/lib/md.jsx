// Tiny inline formatter: **bold**, *em*, `code`, ^{sup}, _{sub}
// Kept dependency-free on purpose — the content needs no real math typesetting.
const RULE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\^\{[^}]+\}|_\{[^}]+\})/g

export function md(text) {
  if (text == null) return null
  const parts = String(text).split(RULE).filter(Boolean)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code key={i} className="font-mono text-[0.86em] bg-panel border border-line rounded px-1 py-px">
          {part.slice(1, -1)}
        </code>
      )
    if (part.startsWith('^{') && part.endsWith('}')) return <sup key={i}>{part.slice(2, -1)}</sup>
    if (part.startsWith('_{') && part.endsWith('}')) return <sub key={i}>{part.slice(2, -1)}</sub>
    return <span key={i}>{part}</span>
  })
}
