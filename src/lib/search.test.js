import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildIndex, search } from './search.js'
import { MODULES } from '../data/syllabus.js'
import { PAPERS } from '../data/papers/index.js'

test('index covers every section and every question', () => {
  const idx = buildIndex()
  const sections = idx.filter((i) => i.kind === 'section').length
  const questions = idx.filter((i) => i.kind === 'question').length
  assert.equal(sections, MODULES.reduce((a, m) => a + m.sections.length, 0))
  assert.equal(questions, PAPERS.reduce((a, p) => a + p.questions.length, 0))
})

test('every indexed href points at a real route target', () => {
  const idx = buildIndex()
  const modIds = new Set(MODULES.map((m) => m.id))
  const paperIds = new Set(PAPERS.map((p) => p.id))
  for (const i of idx) {
    if (i.kind === 'section') {
      const m = i.href.split('/')[2]
      assert.ok(modIds.has(m), `bad module link ${i.href}`)
    } else {
      const [, , paper, qid] = i.href.split('/')
      assert.ok(paperIds.has(paper), `bad paper link ${i.href}`)
      assert.ok(/^Q\d[a-z]?$/i.test(qid), `bad question anchor ${i.href}`)
    }
  }
})

test('search finds known terms and ranks nothing for gibberish', () => {
  const idx = buildIndex()
  assert.ok(search(idx, 'daisy chain').length >= 2)
  assert.ok(search(idx, 'branch penalty').length >= 3)
  assert.ok(search(idx, 'set-associative').length >= 3)
  assert.ok(search(idx, 'control sequence').length >= 1)
  assert.equal(search(idx, 'zzzznotopic').length, 0)
})

test('search strips formatting syntax from haystacks', () => {
  const idx = buildIndex()
  // '**bold**' and `code` must not leak into the searchable text
  assert.ok(idx.every((i) => !i.hay.includes('**') && !i.hay.includes('`')))
})

test('a heading that matches the query ranks first', () => {
  const idx = buildIndex()
  const res = search(idx, 'operand forwarding')
  assert.ok(res.length > 1)
  assert.ok(res[0].title.includes('forwarding'), `top hit was ${res[0].title}`)
})
