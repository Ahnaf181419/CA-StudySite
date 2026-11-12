import { useMemo, useState } from 'react'
import { buildIndex, search } from '../lib/search.js'

export default function SearchView() {
  const index = useMemo(() => buildIndex(), [])
  const [q, setQ] = useState('')
  const results = useMemo(() => search(index, q), [index, q])

  return (
    <div>
      <h1 className="text-[26px] font-semibold tracking-tight">Search</h1>
      <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
        Every lecture section and every past-paper question at once — a question result jumps
        straight to that question in the bank.
      </p>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. daisy chain, branch penalty, tave, SUB (R1)"
        aria-label="Search sections and questions"
        autoFocus
        className="press w-full mt-6 bg-panel border border-line2 rounded-none px-4 py-3 text-[16px] outline-none focus:border-ink placeholder:text-ash"
      />
      {!q ? (
        <div className="mt-6 text-ash text-[13.5px] leading-relaxed">
          Try the repeat-heavy ones: <span className="font-mono">set-associative</span>,{' '}
          <span className="font-mono">forwarding</span>, <span className="font-mono">delay slot</span>,{' '}
          <span className="font-mono">distributed arbitration</span>,{' '}
          <span className="font-mono">denormalized</span>.
        </div>
      ) : results.length === 0 ? (
        <div className="mt-6 text-ash text-[14px]">No matches. Terms must all appear — try fewer words.</div>
      ) : (
        <div className="mt-6 border-t border-line">
          <div className="text-[12px] text-ash pt-2 pb-1">{results.length} match{results.length === 1 ? '' : 'es'}</div>
          {results.map((r) => (
            <a key={r.href} href={r.href} className="press block border-b border-line py-3 hover:bg-panel px-2 -mx-2">
              <div className="flex items-baseline gap-2.5">
                <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-1.5 py-0.5 shrink-0 ${r.kind === 'question' ? 'bg-ink text-paper' : 'border border-line2 text-ash'}`}>
                  {r.kind === 'question' ? 'QB' : 'lecture'}
                </span>
                <span className="text-[14.5px] leading-snug">{r.title}</span>
                <span className="text-[12px] text-ash truncate">{r.sub}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
