import Blocks from './Blocks.jsx'
import { PAPERS, TOPICS } from '../data/papers/index.js'
import { md } from '../lib/md.jsx'

function Badge({ label }) {
  return <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 whitespace-nowrap border border-line2 bg-panel">{label}</span>
}

function Question({ q }) {
  return (
    <section className="border border-line bg-paper">
      <h2 id={q.id} tabIndex={-1} className="scroll-mt-32 px-4 pt-4 font-mono text-[14px] font-semibold md:px-5">{q.id} <span className="font-sans font-normal text-ash">{q.marks}</span></h2>
      <div className="p-4 md:p-5">
        <div className="text-[14.5px] leading-[1.7] whitespace-pre-line">{md(q.q)}</div>
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <span className="text-[11.5px] border border-line bg-panel px-2 py-0.5 text-ash">{TOPICS[q.topic].name}</span>
          {q.repeats > 1 ? <Badge label={`Topic in ${q.repeats} papers`} /> : null}
          {q.inNotes ? <Badge label="In class notes" /> : null}
          {q.flagged ? <span className="text-[10.5px] uppercase tracking-[0.08em] text-ash">Supplemental question</span> : null}
        </div>
        {q.pattern ? <p className="text-[12.5px] text-ash mt-2 italic">{md(q.pattern)}</p> : null}
      </div>
      {q.think ? (
        <details className="border-t border-line px-4 md:px-5">
          <summary className="press cursor-pointer py-3 text-[14px] font-medium">Show hint for {q.id}</summary>
          <div className="pb-4 text-[14.5px] leading-[1.75] space-y-2">
            {(Array.isArray(q.think) ? q.think : [q.think]).map((t, i) => <p key={i}>{md(t)}</p>)}
          </div>
        </details>
      ) : null}
      <details className="border-t border-line px-4 md:px-5">
        <summary className="press cursor-pointer py-3 text-[14px] font-medium">Show solution for {q.id}</summary>
        <div className="pb-3">
          <Blocks blocks={q.solution} />
        </div>
      </details>
      <a className="press inline-flex min-h-11 items-center px-4 text-[13px] text-ash underline underline-offset-4 md:px-5" href={`#/lectures/${TOPICS[q.topic].module}`}>
        Study {TOPICS[q.topic].name}
      </a>
    </section>
  )
}

export default function QuestionBank({ paperId }) {
  if (!paperId) {
    return (
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Question bank</h1>
        <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
          Attempt a question before opening its hint or solution. Use Fall 2024 as the timed practice paper for the current syllabus.
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
