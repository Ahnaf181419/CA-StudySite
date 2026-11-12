import { test } from 'node:test'
import assert from 'node:assert/strict'
import { splitRefs, refHref, paperFor, questionFor } from './paperrefs.js'
import { PAPERS } from '../data/papers/index.js'

test('paper names resolve to papers', () => {
  assert.equal(paperFor('Fall 2024').id, 'fall24')
  assert.equal(paperFor('spring 2023').id, 'spring23')
  assert.equal(paperFor('Fall 22').id, 'fall22')
  assert.equal(paperFor('Spring 2022').id, 'spring22')
  assert.equal(paperFor('Fall 1999'), null)
})

test('question refs resolve inside their paper', () => {
  const f24 = PAPERS.find((p) => p.id === 'fall24')
  assert.equal(questionFor(f24, 'Q2(a)').id, 'Q2a')
  assert.equal(questionFor(f24, 'q2a').id, 'Q2a')
  assert.equal(questionFor(f24, 'Q9z'), null)
})

test('a reference splits into a linkable part', () => {
  const parts = splitRefs('Ask **Fall 2024 Q1(a)** about the cache.')
  const ref = parts.find((p) => p.kind === 'ref')
  assert.ok(ref)
  assert.equal(ref.paper.id, 'fall24')
  assert.equal(ref.question.id, 'Q1a')
  assert.equal(ref.bold, true)
  assert.equal(refHref(ref), '#/qb/fall24/Q1a')
})

test('a paper without a question still links to the paper', () => {
  const parts = splitRefs('Fall 2022 repeats the cache question.')
  const ref = parts.find((p) => p.kind === 'ref')
  assert.equal(refHref(ref), '#/qb/fall22')
})

test('text without references is left alone', () => {
  const parts = splitRefs('The three-bus datapath moves R1 to R3.')
  assert.equal(parts.length, 1)
  assert.equal(parts[0].kind, 'text')
})
