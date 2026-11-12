import fall22 from './fall22.js'
import spring22 from './spring22.js'
import fall23 from './fall23.js'
import spring23 from './spring23.js'
import spring24 from './spring24.js'
import fall24 from './fall24.js'

import { TOPICS } from '../topics.js'

const papers = [fall24, spring24, spring23, fall23, spring22, fall22]
const topicPapers = {}
for (const paper of papers) {
  for (const topic of new Set(paper.questions.map((q) => q.topic))) {
    topicPapers[topic] = (topicPapers[topic] || 0) + 1
  }
}

export const PAPERS = papers.map((p) => {
  const counts = {}
  for (const q of p.questions) {
    if (!q.topic) continue
    counts[q.topic] = (counts[q.topic] || 0) + 1
  }
  const questions = p.questions.map((q) => ({ ...q, repeats: topicPapers[q.topic] }))
  return { ...p, counts, questions }
})

export { TOPICS }
