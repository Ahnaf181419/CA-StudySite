import { md } from '../lib/md.jsx'
import Diagram from './Diagram.jsx'

function Timing({ block }) {
  // Pipeline / timing chart: rows of labelled cells. cell = '' | string | {t, dim, box}
  const cols = block.columns
  return (
    <figure className="my-5 overflow-x-auto">
      <table className="border-collapse font-mono text-[12.5px] w-full min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left font-sans font-semibold text-ash text-[11px] uppercase tracking-wider px-2 pb-1">Clock</th>
            {Array.from({ length: cols }, (_, i) => (
              <th key={i} className="border border-line bg-panel font-semibold px-2 py-1 text-center min-w-[38px]">{(block.start ?? 1) + i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((r, i) => (
            <tr key={i}>
              <th scope="row" className="px-2 py-1 min-w-[7rem] text-left font-normal text-ash font-sans text-[12px] pr-3">{md(r.label)}</th>
              {Array.from({ length: cols }, (_, c) => {
                const cell = r.cells[c]
                const t = typeof cell === 'object' ? cell : { t: cell }
                const txt = t.t ?? ''
                return (
                  <td
                    key={c}
                    className={[
                      'border px-2 py-1 text-center',
                      t.box ? 'border-ink' : 'border-line',
                      t.dim ? 'text-ash bg-paper' : txt ? 'bg-panel' : 'bg-paper',
                    ].join(' ')}
                  >
                    {t.dim && txt ? <s>{txt}</s> : md(txt)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption ? <figcaption className="text-[12px] text-ash mt-2">{md(block.caption)}</figcaption> : null}
    </figure>
  )
}

const Block = ({ b }) => {
  switch (b.type) {
    case 'h':
      return <h4 className="font-semibold text-[15px] mt-7 mb-2 tracking-tight">{md(b.text)}</h4>
    case 'p':
      return <p className="my-3 leading-[1.75] text-[15.5px]">{md(b.text)}</p>
    case 'list':
      return (
        <ul className={`my-3 space-y-1.5 pl-1 ${b.ordered ? 'list-none' : ''}`}>
          {b.items.map((it, i) =>
            b.ordered ? (
              <li key={i} className="flex gap-3 leading-[1.7] text-[15.5px]">
                <span className="font-mono text-ash text-[13px] pt-[3px] min-w-[1.4rem]">{i + 1}.</span>
                <span>{md(it)}</span>
              </li>
            ) : (
              <li key={i} className="flex gap-3 leading-[1.7] text-[15.5px]">
                <span className="text-ink/50 pt-[2px]">—</span>
                <span>{md(it)}</span>
              </li>
            ),
          )}
        </ul>
      )
    case 'table':
      return (
        <div className="my-5 overflow-x-auto">
          <table className="border-collapse w-full min-w-[420px] text-[13.5px]">
            {b.head ? (
              <thead>
                <tr>
                  {b.head.map((h, i) => (
                    <th key={i} className="border border-line bg-panel text-left px-3 py-1.5 font-semibold">{md(h)}</th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className={`border border-line px-3 py-1.5 align-top ${j === 0 && b.boldFirst ? 'font-mono text-[12.5px]' : ''}`}>{md(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.caption ? <div className="text-[12px] text-ash mt-2">{md(b.caption)}</div> : null}
        </div>
      )
    case 'note':
      return (
        <aside className="my-5 border border-line2 bg-panel p-4">
          {b.title ? <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash mb-1.5">{b.title}</div> : null}
          <div className="leading-[1.7] text-[14.5px]">{(Array.isArray(b.text) ? b.text : [b.text]).map((t, i) => <p key={i} className="my-1.5">{md(t)}</p>)}</div>
        </aside>
      )
    case 'think':
      return (
        <aside className="my-6 border-2 border-ink bg-paper">
          <div className="bg-ink text-paper text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-1.5">How to think about it</div>
          <div className="p-4 leading-[1.75] text-[15px] space-y-2">
            {(Array.isArray(b.text) ? b.text : [b.text]).map((t, i) => <p key={i}>{md(t)}</p>)}
          </div>
        </aside>
      )
    case 'exam':
      return (
        <aside className="my-5 border-l-[3px] border-ink bg-panel px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash mb-1">In the exam</div>
          <div className="leading-[1.7] text-[14.5px]">{(Array.isArray(b.text) ? b.text : [b.text]).map((t, i) => <p key={i} className="my-1">{md(t)}</p>)}</div>
        </aside>
      )
    case 'pre':
      return (
        <div className="my-4 overflow-x-auto">
          <pre className="font-mono text-[12.5px] leading-[1.65] bg-panel border border-line p-3.5 whitespace-pre">{b.text}</pre>
          {b.caption ? <div className="text-[12px] text-ash mt-1.5">{md(b.caption)}</div> : null}
        </div>
      )
    case 'timing':
      return <Timing block={b} />
    case 'diagram':
      return <Diagram id={b.id} caption={b.caption} />
    case 'answer':
      return (
        <div className="my-4 border-2 border-ink px-4 py-3 font-medium">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] block text-ash mb-1">Answer</span>
          <div className="leading-[1.7]">{(Array.isArray(b.text) ? b.text : [b.text]).map((t, i) => <div key={i}>{md(t)}</div>)}</div>
        </div>
      )
    case 'example':
      return (
        <section className="my-6 border border-line2">
          <div className="bg-panel border-b border-line2 px-4 py-2 text-[13px] font-semibold">{md(b.title)}</div>
          <div className="p-4">{(b.blocks || []).map((x, i) => <Block key={i} b={x} />)}</div>
        </section>
      )
    case 'practice':
      return (
        <section className="my-6 border border-line2 bg-panel px-4 py-3">
          <h3 className="text-[14px] font-semibold">Try it yourself</h3>
          <p className="mt-2 text-[15px] leading-[1.7]">{md(b.prompt)}</p>
          <details className="mt-3 border-t border-line2">
            <summary className="press cursor-pointer py-3 text-[14px] font-medium">Show worked answer</summary>
            <Blocks blocks={b.blocks} />
          </details>
        </section>
      )
    case 'steps':
      return (
        <ol className="my-3 space-y-2">
          {(b.items || []).map((it, i) => (
            <li key={i} className="flex gap-3 leading-[1.7] text-[15.5px]">
              <span className="font-mono text-[12px] border border-line2 bg-panel h-[22px] min-w-[22px] flex items-center justify-center mt-[3px]">{i + 1}</span>
              <span className="flex-1">{md(it)}</span>
            </li>
          ))}
        </ol>
      )
    default:
      return null
  }
}

export default function Blocks({ blocks }) {
  return <div>{(blocks || []).map((b, i) => <Block key={i} b={b} />)}</div>
}
