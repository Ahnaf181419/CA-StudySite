// Flat search index over lecture sections and question-bank questions.
// Pure data → data, so it is testable without a DOM.
import { MODULES } from '../data/syllabus.js'
import { PAPERS } from '../data/papers/index.js'
import { TOPICS } from '../data/topics.js'

const strip = (s) => String(s ?? '')
  .replace(/\*\*|`|\^\{[^}]*\}|_\{[^}]*\}/g, '')
  .replace(/\s+/g, ' ')
  .toLowerCase()

export function buildIndex() {
  const items = []
  for (const m of MODULES) {
    m.sections.forEach((s, i) => {
      const text = strip(
        JSON.stringify(s.blocks
          .map((b) => [b.text, b.q, b.items, b.rows, b.head, b.caption, b.title].filter(Boolean).flat())
          .flat()),
      )
      items.push({
        kind: 'section',
        title: strip(s.heading),
        sub: m.title,
        hay: strip(`${m.title} ${m.chapter} ${s.heading} ${m.tags.join(' ')} ${text}`),
        href: `#/lectures/${m.id}/sec-${i}`,
      })
    })
  }
  for (const p of PAPERS) {
    for (const q of p.questions) {
      const topic = TOPICS[q.topic]?.name || ''
      items.push({
        kind: 'question',
        title: strip(`${p.name} ${q.id}`),
        sub: topic,
        hay: strip(`${p.name} ${q.id} ${q.marks} ${topic} ${q.q} ${q.pattern || ''} ${strip(JSON.stringify(q.solution?.map((b) => [b.text, b.q].filter(Boolean))))}`),
        href: `#/qb/${p.id}/${q.id}`,
      })
    }
  }
  return items
}

// every term must appear somewhere; titles that contain a term rank first
export function search(index, query, limit = 24) {
  const terms = strip(query).split(' ').filter(Boolean)
  if (!terms.length) return []
  const hits = []
  for (const item of index) {
    if (!terms.every((t) => item.hay.includes(t))) continue
    const inTitle = terms.filter((t) => item.title.includes(t)).length
    hits.push({ item, score: inTitle })
  }
  hits.sort((a, b) => b.score - a.score)
  return hits.slice(0, limit).map((h) => h.item)
}
