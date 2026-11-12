import { useState } from 'react'
import { flushSync } from 'react-dom'
import Blocks from './Blocks.jsx'
import { PAPERS, TOPICS } from '../data/papers/index.js'
import { md } from '../lib/md.jsx'
import { qkey, toggleDone, progressMap } from '../lib/progress.js'

function Badge({ label }) {
  return <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 whitespace-nowrap border border-line2 bg-panel">{label}</span>
}

function Question({ q, paperId, open, onToggle, done, onDone, target }) {
  const hintOpen = open.has(`h:${paperId}:${q.id}`)
  const solOpen = open.has(`s:${paperId}:${q.id}`)
  const hintId = `hint-${paperId}-${q.id}`
  const solId = `sol-${paperId}-${q.id}`
  return (
    <section id={q.id} tabIndex={-1} className={`border bg-paper scroll-mt-32 ${target ? 'border-ink' : 'border-line'}`}>
      <div className="px-4 pt-4 md:px-5 flex items-start justify-between gap-3">
        <h2 tabIndex={-1} className="font-mono text-[14px] font-semibold">
          {q.id} <span className="font-sans font-normal text-ash">{q.marks}</span>
        </h2>
        <button
          onClick={() => onDone(qkey(paperId, q.id))}
          aria-pressed={done}
          className={`press shrink-0 text-[11.5px] border px-2 py-1 whitespace-nowrap print:hidden ${done ? 'border-ink bg-ink text-paper' : 'border-line2 text-ash hover:text-ink'}`}
        >
          {done ? '✓ reviewed' : 'mark reviewed'}
        </button>
      </div>
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
        <div className="border-t border-line px-4 md:px-5">
          <button
            onClick={() => onToggle(`h:${paperId}:${q.id}`)}
            aria-expanded={hintOpen}
            aria-controls={hintId}
            className="press min-h-11 py-3 text-[14px] font-medium text-left w-full print:hidden"
          >
            {hintOpen ? 'Hide hint' : 'Show hint'} for {q.id}
          </button>
          <div id={hintId} className="pb-4 text-[14.5px] leading-[1.75] space-y-2">
            {hintOpen
              ? (Array.isArray(q.think) ? q.think : [q.think]).map((t, i) => <p key={i}>{md(t)}</p>)
              : null}
          </div>
        </div>
      ) : null}
      <div className="border-t border-line px-4 md:px-5">
        <button
          onClick={() => onToggle(`s:${paperId}:${q.id}`)}
          aria-expanded={solOpen}
          aria-controls={solId}
          className="press min-h-11 py-3 text-[14px] font-medium text-left w-full print:hidden"
        >
          {solOpen ? 'Hide solution' : 'Show solution'} for {q.id}
        </button>
        <div id={solId} className="pb-3">
          {solOpen ? <Blocks blocks={q.solution} /> : null}
        </div>
      </div>
      <a className="press inline-flex min-h-11 items-center px-4 text-[13px] text-ash underline underline-offset-4 md:px-5 print:hidden" href={`#/lectures/${TOPICS[q.topic].module}`}>
        Study {TOPICS[q.topic].name}
      </a>
    </section>
  )
}

export default function QuestionBank({ paperId, qId }) {
  const [open, setOpen] = useState(() => new Set())
  const [marks, setMarks] = useState(() => progressMap())

  const p = PAPERS.find((x) => x.id === paperId)

  const toggleOpen = (k) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const onDone = (k) => {
    toggleDone(k)
    setMarks(progressMap())
  }

  if (!p) {
    const total = PAPERS.reduce((a, x) => a + x.questions.length, 0)
    const done = PAPERS.reduce(
      (a, x) => a + x.questions.filter((q) => marks[qkey(x.id, q.id)]).length,
      0,
    )
    return (
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">Question bank</h1>
        <p className="text-ash text-[14.5px] mt-2 leading-relaxed">
          Attempt a question before opening its hint or solution. Use Fall 2024 as the timed practice paper for the current syllabus.
        </p>
        {total ? (
          <div className="mt-5 border border-line bg-panel p-4">
            <div className="flex items-baseline justify-between text-[13px]">
              <span>Questions reviewed</span>
              <span className="font-mono">{done} / {total}</span>
            </div>
            <div className="mt-2 h-[6px] bg-paper border border-line">
              <div className="h-full bg-ink" style={{ width: `${Math.round((done / total) * 100)}%` }} />
            </div>
          </div>
        ) : null}
        <div className="mt-7 space-y-4">
          {PAPERS.map((x) => {
            const d = x.questions.filter((q) => marks[qkey(x.id, q.id)]).length
            return (
              <a key={x.id} href={`#/qb/${x.id}`} className="press block border border-line bg-paper hover:border-ink p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-semibold text-[17px] tracking-tight">{x.name}</div>
                  <div className="text-[12.5px] text-ash font-mono">{x.date}</div>
                </div>
                <div className="text-[13.5px] text-ash mt-1.5 leading-relaxed">{md(x.note)}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {Object.entries(x.counts || {}).map(([t, n]) => (
                    <span key={t} className="text-[11px] border border-line bg-panel px-2 py-0.5 text-ash">{TOPICS[t]?.name || t} ×{n}</span>
                  ))}
                </div>
                <div className="text-[11.5px] text-ash mt-3 font-mono">{d} / {x.questions.length} reviewed</div>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  const printPaper = () => {
    flushSync(() => setOpen(new Set(p.questions.map((q) => `s:${p.id}:${q.id}`))))
    window.print()
  }

  return (
    <article>
      <a href="#/qb" className="press text-[12.5px] text-ash print:hidden">← All papers</a>
      <div className="flex flex-wrap items-end justify-between gap-3 mt-3">
        <h1 className="text-[26px] font-semibold tracking-tight">{p.name}</h1>
        <button onClick={printPaper} className="press text-[12.5px] border border-line2 px-3 py-2 text-ash hover:text-ink print:hidden">
          Print paper with solutions
        </button>
      </div>
      <div className="text-[14px] text-ash mt-2 leading-relaxed">{md(p.note)}</div>
      {p.instruction ? (
        <aside className="mt-5 border border-line2 bg-panel p-4 text-[13.5px] leading-[1.7]">
          <span className="font-semibold">Paper structure: </span>{p.instruction}
        </aside>
      ) : null}
      <div className="mt-7 space-y-4">
        {p.questions.map((q) => (
          <Question
            key={q.id}
            q={q}
            paperId={p.id}
            open={open}
            onToggle={toggleOpen}
            done={!!marks[qkey(p.id, q.id)]}
            onDone={onDone}
            target={!!qId && q.id.toLowerCase() === qId.toLowerCase()}
          />
        ))}
      </div>
    </article>
  )
}
