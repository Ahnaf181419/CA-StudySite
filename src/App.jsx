import { useEffect, useLayoutEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Lectures from './components/Lectures.jsx'
import QuestionBank from './components/QuestionBank.jsx'
import Patterns from './components/Patterns.jsx'
import { MODULES } from './data/syllabus.js'
import { PAPERS } from './data/papers/index.js'

function useHash() {
  const [h, setH] = useState(() => window.location.hash.replace(/^#/, '') || '/')
  useEffect(() => {
    const on = () => setH(window.location.hash.replace(/^#/, '') || '/')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return h
}

export default function App() {
  const route = useHash()
  const [, view, arg, target] = route.split('/')

  useEffect(() => {
    if (!window.location.hash.includes('#')) window.location.hash = '#/lectures'
  }, [])

  useLayoutEffect(() => {
    const destination = target ? document.getElementById(target) : null
    if (destination) {
      destination.focus({ preventScroll: true })
      destination.scrollIntoView({ behavior: 'instant' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route, target])

  let page
  if (view === 'qb') page = <QuestionBank key={arg} paperId={arg} />
  else if (view === 'patterns') page = <Patterns />
  else page = <Lectures moduleId={arg} />

  const moduleTitle = MODULES.find((m) => m.id === arg)?.title

  return (
    <div className="min-h-screen flex flex-col">
      <Nav route={route} />
      <main className="flex-1 w-full max-w-[860px] mx-auto px-5 md:px-8 wrap-anywhere py-8 md:py-12">
        {view === 'qb' && arg && !PAPERS.find((p) => p.id === arg) ? (
          <p className="text-ash">Unknown paper.</p>
        ) : view === 'lectures' && arg && !moduleTitle ? (
          <p className="text-ash">Unknown module.</p>
        ) : (
          page
        )}
      </main>
      <footer className="border-t border-line mt-10">
        <div className="max-w-[860px] mx-auto px-5 md:px-8 py-5 text-[12px] text-ash">
          CSE 2213 · Computer Architecture — built from the faculty slides, class notes and past papers. Content stops at what the material covers.
        </div>
      </footer>
    </div>
  )
}
