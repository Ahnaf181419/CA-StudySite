import Blocks from './Blocks.jsx'
import { MODULES } from '../data/syllabus.js'
import { md } from '../lib/md.jsx'

function ModuleCard({ m, i }) {
  return (
    <a href={`#/lectures/${m.id}`} className="press block border border-line bg-paper hover:border-ink p-5 mb-4 group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{m.chapter}</div>
          <div className="font-semibold text-[17px] mt-1 tracking-tight group-hover:underline underline-offset-4 decoration-2">{m.title}</div>
          <div className="text-[13.5px] text-ash mt-1.5 leading-relaxed">{md(m.blurb)}</div>
        </div>
        <div className="font-mono text-[12px] text-ash pt-1 shrink-0">{String(i + 1).padStart(2, '0')}</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {m.tags.slice(0, 6).map((t) => (
          <span key={t} className="text-[11px] border border-line bg-panel px-2 py-0.5 text-ash">{t}</span>
        ))}
      </div>
    </a>
  )
}

export default function Lectures({ moduleId }) {
  if (!moduleId) {
    return (
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Lectures</h1>
        <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
          Every topic in the slide set, explained from the prerequisites up, in teaching order. Each section ends with the way you should
          think about that topic when a question asks it. The arithmetic module covers the self-study part the slides point to.
        </p>
        <div className="mt-7">
          {MODULES.map((m, i) => <ModuleCard key={m.id} m={m} i={i} />)}
        </div>
      </div>
    )
  }

  const m = MODULES.find((x) => x.id === moduleId)
  if (!m) return null

  return (
    <article>
      <a href="#/lectures" className="press text-[12.5px] text-ash">← All lectures</a>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{m.chapter}</div>
      <h1 className="text-[26px] font-semibold tracking-tight mt-1">{m.title}</h1>
      <div className="text-[14px] text-ash mt-2 leading-relaxed">{md(m.blurb)}</div>

      {m.prereq ? (
        <aside className="mt-6 border border-line2 bg-panel p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash mb-1.5">Prerequisites you need first</div>
          <ul className="space-y-1 text-[14px] leading-[1.7]">
            {m.prereq.map((p, i) => <li key={i} className="flex gap-2.5"><span className="text-ink/40">—</span><span>{md(p)}</span></li>)}
          </ul>
        </aside>
      ) : null}

      <nav className="mt-7 border border-line divide-y divide-line">
        <div className="bg-panel px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]">In this module</div>
        {m.sections.map((s, i) => (
          <a key={i} href={`#sec-${i}`} className="press block px-4 py-2.5 text-[14px] flex justify-between gap-4 hover:bg-panel">
            <span>{md(s.heading)}</span>
            <span className="font-mono text-[11px] text-ash pt-1">{String(i + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </nav>

      <div className="mt-4">
        {m.sections.map((s, i) => (
          <section key={i} id={`sec-${i}`} className="mt-10 scroll-mt-24">
            <h2 className="text-[20px] font-semibold tracking-tight border-b border-line pb-2">
              <span className="font-mono text-[13px] text-ash mr-2.5">{String(i + 1).padStart(2, '0')}</span>
              {md(s.heading)}
            </h2>
            <Blocks blocks={s.blocks} />
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-line flex justify-between text-[13.5px]">
        {(() => {
          const i = MODULES.findIndex((x) => x.id === moduleId)
          const prev = MODULES[i - 1], next = MODULES[i + 1]
          return (
            <>
              {prev ? <a className="press text-ash hover:text-ink" href={`#/lectures/${prev.id}`}>← {prev.title}</a> : <span />}
              {next ? <a className="press text-ash hover:text-ink" href={`#/lectures/${next.id}`}>{next.title} →</a> : <span />}
            </>
          )
        })()}
      </div>
    </article>
  )
}
