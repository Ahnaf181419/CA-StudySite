import { useState } from 'react'
import Blocks from './Blocks.jsx'
import { PAPERS, TOPICS } from '../data/papers/index.js'
import { md } from '../lib/md.jsx'

function Badge({ kind }) {
  const map = {
    must: ['Repeated 3+', 'bg-ink text-paper'],
    high: ['Repeated 2×', 'border-2 border-ink'],
    notes: ['In class notes', 'border border-line2 bg-panel'],
    once: ['Asked once', 'border border-line text-ash'],
  }
  const [label, cls] = map[kind] || map.once
  return <span className={`text-[10.5px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 whitespace-nowrap ${cls}`}>{label}</span>
}

function Question({ q }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-line bg-paper">
      <button className="press w-full text-left p-4 md:p-5" onClick={() => setOpen(!open)}>
        <div className="flex items-start gap-3">
          <span className="font-mono text-[12.5px] text-ash pt-0.5 shrink-0">{q.id}</span>
          <div className="flex-1">
            <div className="text-[14.5px] leading-[1.7] whitespace-pre-line">{md(q.q)}</div>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[12px] text-ash">{q.marks}</span>
              {q.repeats && q.repeats >= 3 ? <Badge kind="must" /> : q.repeats === 2 ? <Badge kind="high" /> : <Badge kind="once" />}
              {q.inNotes ? <Badge kind="notes" /> : null}
              {q.topic ? <span className="text-[11.5px] border border-line bg-panel px-2 py-0.5 text-ash">{TOPICS[q.topic]?.name || q.topic}</span> : null}
              {q.flagged ? <span className="text-[10.5px] uppercase tracking-[0.08em] text-ash">outside current slides</span> : null}
            </div>
            {q.pattern ? <div className="text-[12.5px] text-ash mt-2 italic">{md(q.pattern)}</div> : null}
          </div>
          <span className="font-mono text-ash text-[13px] pt-1 shrink-0">{open ? '−' : '+'}</span>
        </div>
      </button>
      {open ? (
        <div className="border-t border-line2 px-4 md:px-5 py-2">
          {q.think ? (
            <aside className="my-4 border-2 border-ink">
              <div className="bg-ink text-paper text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-1.5">How to think about this question</div>
              <div className="p-4 text-[14.5px] leading-[1.75] space-y-2">
                {(Array.isArray(q.think) ? q.think : [q.think]).map((t, i) => <p key={i}>{md(t)}</p>)}
              </div>
            </aside>
          ) : null}
          <Blocks blocks={q.solution} />
        </div>
      ) : null}
    </div>
  )
}

export default function QuestionBank({ paperId }) {
  if (!paperId) {
    return (
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Question bank</h1>
        <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
          Every question from every past final in the folder, with a full exam-format solution. Questions that appeared in more than one
          paper — or that the class notes single out — are marked so you know what to over-prepare.
        </p>
        <div className="mt-7 space-y-4">
          {PAPERS.map((p) => (
            <a key={p.id} href={`#/qb/${p.id}`} className="press block border border-line bg-paper hover:border-ink p-5">
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-semibold text-[17px] tracking-tight">{p.name}</div>
                <div className="text-[12.5px] text-ash font-mono">{p.date}</div>
              </div>
              <div className="text-[13.5px] text-ash mt-1.5 leading-relaxed">{md(p.note)}</div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(p.counts || {}).map(([t, n]) => (
                  <span key={t} className="text-[11px] border border-line bg-panel px-2 py-0.5 text-ash">{TOPICS[t]?.name || t} ×{n}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }

  const p = PAPERS.find((x) => x.id === paperId)
  if (!p) return null

  return (
    <article>
      <a href="#/qb" className="press text-[12.5px] text-ash">← All papers</a>
      <h1 className="text-[26px] font-semibold tracking-tight mt-3">{p.name}</h1>
      <div className="text-[14px] text-ash mt-2 leading-relaxed">{md(p.note)}</div>
      {p.instruction ? (
        <aside className="mt-5 border border-line2 bg-panel p-4 text-[13.5px] leading-[1.7]">
          <span className="font-semibold">Paper structure: </span>{p.instruction}
        </aside>
      ) : null}
      <div className="mt-7 space-y-4">
        {p.questions.map((q) => <Question key={q.id} q={q} />)}
      </div>
    </article>
  )
}
