import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MODULES } from '../data/syllabus.js'
import { PAPERS, TOPICS } from '../data/papers/index.js'
import { DIAGRAM_IDS } from '../components/diagrams/registry.js'

// every diagram referenced in lecture or solution content must exist
const BLOCK_DIAGRAM = (b) => b && b.type === 'diagram' && b.id

test('all referenced diagrams exist', () => {
  const missing = []
  const check = (blocks, where) => {
    for (const b of blocks || []) {
      if (BLOCK_DIAGRAM(b) && !DIAGRAM_IDS.includes(b.id)) missing.push(`${where}: ${b.id}`)
      if (b?.blocks) check(b.blocks, where)
    }
  }
  for (const m of MODULES) {
    for (const s of m.sections) check(s.blocks, m.id)
  }
  for (const p of PAPERS) for (const q of p.questions) check(q.solution, `${p.id} ${q.id}`)
  assert.deepEqual(missing, [])
})

test('every paper question has a topic, marks and a non-empty solution', () => {
  for (const p of PAPERS) {
    assert.ok(p.questions.length > 0, `${p.id} has no questions`)
    for (const q of p.questions) {
      assert.ok(q.topic, `${p.id} ${q.id} missing topic`)
      assert.ok(TOPICS[q.topic], `${p.id} ${q.id} unknown topic ${q.topic}`)
      assert.ok(q.marks, `${p.id} ${q.id} missing marks`)
      assert.ok(q.q, `${p.id} ${q.id} missing question text`)
      assert.ok(Array.isArray(q.solution) && q.solution.length > 0, `${p.id} ${q.id} missing solution`)
    }
  }
})

test('every lecture topic tag maps to a real topic or module', () => {
  for (const m of MODULES) {
    assert.ok(m.id && m.title && m.sections.length > 0, `module ${m.id} malformed`)
    const heads = m.sections.map((s) => s.heading)
    assert.equal(new Set(heads).size, heads.length, `duplicate section headings in ${m.id}`)
  }
})

test('every topic in TOPICS points to a real module', () => {
  const ids = new Set(MODULES.map((m) => m.id))
  for (const [tid, t] of Object.entries(TOPICS)) {
    assert.ok(ids.has(t.module), `topic ${tid} points to missing module ${t.module}`)
  }
})

test('each paper exposes counts computed from its questions', () => {
  for (const p of PAPERS) {
    const total = Object.values(p.counts).reduce((a, b) => a + b, 0)
    assert.equal(total, p.questions.length, `${p.id} counts mismatch`)
  }
})

test('each module has a checkpoint with a worked answer', () => {
  for (const m of MODULES) {
    const practice = m.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'practice'))
    assert.ok(practice.length > 0, `${m.id} needs a checkpoint`)
    for (const b of practice) {
      assert.ok(b.prompt?.trim(), `${m.id} checkpoint has no prompt`)
      assert.ok(b.blocks.some((solution) => solution.type === 'answer'), `${m.id} checkpoint has no answer`)
    }
  }
})

test('paper question IDs can be used as unique deep links', () => {
  for (const paper of PAPERS) {
    assert.match(paper.id, /^[a-z0-9-]+$/)
    assert.equal(new Set(paper.questions.map((q) => q.id)).size, paper.questions.length, paper.id)
    for (const q of paper.questions) assert.match(q.id, /^[a-zA-Z0-9-]+$/)
  }
})

// Blocks.jsx renders unknown types as nothing, so a typo would silently drop content.
const BLOCK_TYPES = new Set(['h', 'p', 'list', 'table', 'note', 'think', 'exam', 'pre', 'timing', 'diagram', 'answer', 'example', 'steps', 'practice'])

test('every content block has a type the renderer knows', () => {
  const bad = []
  const check = (blocks, where) => {
    for (const b of blocks || []) {
      if (!BLOCK_TYPES.has(b.type)) bad.push(`${where}: ${b.type}`)
      if (b.blocks) check(b.blocks, where)
    }
  }
  for (const m of MODULES) for (const s of m.sections) check(s.blocks, m.id)
  for (const p of PAPERS) for (const q of p.questions) check(q.solution, `${p.id} ${q.id}`)
  assert.deepEqual(bad, [])
})

test('every paper question has a think box and a boxed answer', () => {
  const answered = (blocks) => blocks.some((b) => b.type === 'answer' || (b.blocks && answered(b.blocks)))
  for (const p of PAPERS) {
    for (const q of p.questions) {
      assert.ok(q.think && q.think.length > 0, `${p.id} ${q.id} missing think box`)
      assert.ok(answered(q.solution), `${p.id} ${q.id} missing boxed answer`)
    }
  }
})

test('each timing chart has one cell per declared clock cycle', () => {
  const check = (blocks, where) => {
    for (const b of blocks) {
      if (b.type === 'timing') {
        for (const row of b.rows) assert.equal(row.cells.length, b.columns, `${where}: ${row.label}`)
      }
      if (b.blocks) check(b.blocks, where)
    }
  }
  for (const m of MODULES) for (const s of m.sections) check(s.blocks, m.id)
  for (const p of PAPERS) for (const q of p.questions) check(q.solution, `${p.id} ${q.id}`)
})

test('topic frequency counts distinct papers, even when a topic has multiple questions', () => {
  const cachePapers = PAPERS.filter((p) => p.questions.some((q) => q.topic === 'cache'))
  assert.equal(cachePapers.length, 7, 'all seven available papers include a cache question')
  for (const paper of cachePapers) {
    for (const q of paper.questions.filter((q) => q.topic === 'cache')) {
      assert.equal(q.repeats, cachePapers.length, `${paper.id} ${q.id} reports a stale topic frequency`)
    }
  }
})
