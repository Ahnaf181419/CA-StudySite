// Resolves "Fall 2024 Q1(a)" style references in the text to paper/question links.
import { PAPERS } from '../data/papers/index.js'

const BY_TERM = new Map()
for (const p of PAPERS) {
  const m = p.name.match(/^(fall|spring)\s*(\d{2,4})/i)
  if (!m) continue
  BY_TERM.set(`${m[1].toLowerCase()} ${m[2]}`, p) // 'fall 2024'
  BY_TERM.set(`${m[1].toLowerCase()} ${m[2].slice(-2)}`, p) // 'fall 24'
}

export function paperFor(term) {
  return BY_TERM.get(String(term).trim().toLowerCase()) || null
}

export function questionFor(paper, ref) {
  if (!paper || !ref) return null
  const id = ref.toLowerCase().replace(/[()]/g, '')
  return paper.questions.find((q) => q.id.toLowerCase() === id) || null
}

// bold spans first, so a reference inside **…** keeps the emphasis
function splitBold(text) {
  const src = String(text ?? '')
  const out = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ bold: false, text: src.slice(last, m.index) })
    out.push({ bold: true, text: m[1] })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ bold: false, text: src.slice(last) })
  return out
}

// → [{ kind: 'text' | 'ref', text, bold, paper?, question? }]
export function splitRefs(text) {
  const parts = []
  for (const seg of splitBold(text)) {
    const re = /\b(fall|spring)['’`]?\s*(\d{2,4})\b/gi
    let last = 0
    let m
    while ((m = re.exec(seg.text))) {
      const paper = paperFor(`${m[1]} ${m[2]}`)
      if (!paper) continue
      let end = re.lastIndex
      let question = null
      const qm = seg.text.slice(end).match(/^\s*(Q\d+(?:\([a-z]\))?)/i)
      if (qm) {
        question = questionFor(paper, qm[1])
        if (question) end += qm[0].length
      }
      parts.push({ kind: 'text', text: seg.text.slice(last, m.index), bold: seg.bold })
      parts.push({ kind: 'ref', text: seg.text.slice(m.index, end), bold: seg.bold, paper, question })
      last = end
      re.lastIndex = end
    }
    parts.push({ kind: 'text', text: seg.text.slice(last), bold: seg.bold })
  }
  return parts
}

export function refHref(part) {
  if (!part.paper) return null
  return part.question
    ? `#/qb/${part.paper.id}/${part.question.id}`
    : `#/qb/${part.paper.id}`
}
