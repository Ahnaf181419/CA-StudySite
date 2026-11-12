import { PAPERS, TOPICS } from '../data/papers/index.js'
import { MODULES } from '../data/syllabus.js'

export default function Patterns() {
  const topics = Object.keys(TOPICS)
    .map((id) => ({ id, ...TOPICS[id], papers: PAPERS.filter((p) => p.counts[id]) }))
    .sort((a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name))

  return (
    <div>
      <h1 className="text-[26px] font-semibold tracking-tight">Pattern analysis</h1>
      <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
        Each cell counts questions tagged with that topic in the available pages. The Papers column counts distinct papers with at least one such question.
      </p>

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold tracking-tight border-b border-line pb-2">Topic × paper matrix</h2>
        <div className="overflow-x-auto mt-4" tabIndex={0} role="region" aria-label="Topic by paper">
          <table className="border-collapse text-[12px] w-full">
            <thead>
              <tr>
                <th className="text-left font-semibold px-2 py-2 min-w-[240px]">Topic</th>
                {PAPERS.map((p) => (
                  <th key={p.id} className="px-1 py-2 font-mono font-semibold text-[10.5px] text-ash" title={p.name}>
                    {p.short}
                  </th>
                ))}
                <th className="px-2 py-2 font-semibold text-[11px]">Papers</th>
                <th className="px-2 py-2 font-semibold text-[11px] text-left">Lecture</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => {
                const n = t.papers.length
                return (
                  <tr key={t.id} className="border-t border-line">
                    <th scope="row" className="px-2 py-1.5 text-left font-normal">
                      <span className="flex items-center gap-2 flex-wrap">
                        <a href={MODULES.find((m) => m.id === t.module) ? `#/lectures/${t.module}` : '#/lectures'} className="press inline-flex min-h-11 items-center hover:underline underline-offset-2">
                          {t.name}
                        </a>
                        {n >= 3 ? <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] bg-ink text-paper px-1.5 py-0.5">repeat</span> : null}
                        {t.notes ? <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] border border-line2 bg-panel px-1.5 py-0.5">in notes</span> : null}
                      </span>
                    </th>
                    {PAPERS.map((p) => {
                      const count = p.counts[t.id] ?? 0
                      return (
                        <td key={p.id} className={`border border-line text-center font-mono ${count ? 'bg-panel2' : 'text-ash'}`}>{count}</td>
                      )
                    })}
                    <td className="px-2 py-1.5 text-center font-mono">{n}</td>
                    <td className="px-2 py-1.5 text-ash text-[11.5px]">{MODULES.find((m) => m.id === t.module)?.chapter || ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[18px] font-semibold tracking-tight border-b border-line pb-2">What repeats, and how it is asked</h2>
        <div className="mt-4 space-y-4">
          {topics.filter((t) => t.papers.length >= 2 || t.notes).map((t) => (
            <div key={t.id} className="border border-line p-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="font-semibold text-[15px]">{t.name}</div>
                <div className="text-[11.5px] text-ash font-mono">{t.papers.map((p) => p.short).join(' · ')}</div>
              </div>
              {t.trend ? <p className="text-[14px] mt-2 leading-[1.7]">{t.trend}</p> : null}
              {t.notes ? <p className="text-[13px] mt-2 leading-[1.7] text-ash border-l-2 border-line2 pl-3">{t.notes}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[18px] font-semibold tracking-tight border-b border-line pb-2">Paper formats</h2>
        <div className="mt-4 space-y-3">
          {PAPERS.map((p) => (
            <div key={p.id} className="border border-line p-4">
              <div className="flex items-baseline justify-between gap-3">
                <a href={`#/qb/${p.id}`} className="press inline-flex min-h-11 items-center font-semibold text-[15px] hover:underline underline-offset-2">{p.name}</a>
                <span className="text-[11.5px] text-ash font-mono">{p.date}</span>
              </div>
              <p className="text-[13.5px] text-ash mt-1.5 leading-[1.7]">{p.format}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
