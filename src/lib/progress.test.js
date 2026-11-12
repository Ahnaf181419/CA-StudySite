import { test } from 'node:test'
import assert from 'node:assert/strict'
import { qkey, isDone, toggleDone, progressMap, countDone } from './progress.js'

test('a mark toggles on and off', () => {
  const k = qkey('fall24', 'Q1a')
  assert.equal(isDone(k), false)
  assert.equal(toggleDone(k), true)
  assert.equal(isDone(k), true)
  assert.equal(progressMap()[k], 1)
  assert.equal(toggleDone(k), false)
  assert.equal(isDone(k), false)
})

test('countDone only counts the given paper', () => {
  toggleDone(qkey('fall24', 'Q1a'))
  toggleDone(qkey('fall24', 'Q2a'))
  assert.equal(countDone('fall24', ['Q1a', 'Q2a', 'Q3a']), 2)
  assert.equal(countDone('spring24', ['Q1a']), 0)
})
