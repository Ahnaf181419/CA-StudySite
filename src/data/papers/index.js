import fall22 from './fall22.js'
import spring22 from './spring22.js'
import fall23 from './fall23.js'
import spring23 from './spring23.js'
import spring24 from './spring24.js'
import fall24 from './fall24.js'

import { TOPICS } from '../topics.js'

export const PAPERS = [fall24, spring24, spring23, fall23, spring22, fall22].map((p) => {
  const counts = {}
  for (const q of p.questions) {
    if (!q.topic) continue
    counts[q.topic] = (counts[q.topic] || 0) + 1
  }
  // repeats = number of distinct papers asking this topic (for badges on each question)
  const topicPapers = {}
  for (const paper of [fall24, spring24, spring23, fall23, spring22, fall22]) {
    const seen = new Set(paper.questions.map((q) => q.topic).filter(Boolean))
    for (const t of seen) topicPapers[t] = (topicPapers[t] || 0) + 1
  }
  const questions = p.questions.map((q) => ({ ...q, repeats: q.repeats ?? topicPapers[q.topic] ?? 1 }))
  return { ...p, counts, questions }
})

export { TOPICS }
