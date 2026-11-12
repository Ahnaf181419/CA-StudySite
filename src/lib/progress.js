// Per-question "done" marks, kept in localStorage. Key format: q:<paper>:<qid>.
// Falls back to an in-memory map when storage is unavailable (private mode, tests).
const KEY = 'ca-study-progress-v1'

let memory = {}

function read() {
  try {
    const raw =
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(KEY)
        : JSON.stringify(memory)
    return JSON.parse(raw || '{}') || {}
  } catch {
    return {}
  }
}

function write(map) {
  memory = map
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(KEY, JSON.stringify(map))
    }
  } catch {
    /* storage unavailable — the marks stay in memory for this session */
  }
}

export const qkey = (paper, qid) => `q:${paper}:${qid}`

export function isDone(key) {
  return !!read()[key]
}

export function toggleDone(key) {
  const map = read()
  if (map[key]) delete map[key]
  else map[key] = 1
  write(map)
  return !!map[key]
}

// whole map — used to render per-paper counters
export function progressMap() {
  return read()
}

export function countDone(paperId, qids) {
  const map = read()
  return qids.filter((id) => map[qkey(paperId, id)]).length
}
