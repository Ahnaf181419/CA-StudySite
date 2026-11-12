export default function Nav({ route }) {
  const [, view] = route.split('/')
  const tabs = [
    ['lectures', 'Lectures'],
    ['qb', 'Question bank'],
    ['patterns', 'Patterns'],
  ]
  return (
    <header className="border-b border-line sticky top-0 z-10 bg-paper/95 backdrop-blur">
      <div className="max-w-[860px] mx-auto px-5 md:px-8">
        <div className="flex items-baseline gap-4 pt-5 pb-3">
          <a href="#/lectures" className="font-semibold tracking-tight text-[17px] press">
            CSE 2213 <span className="text-ash font-normal">· Computer Architecture</span>
          </a>
        </div>
        <nav className="flex gap-1 -mb-px">
          {tabs.map(([id, label]) => {
            const active = (view || 'lectures') === id
            return (
              <a
                key={id}
                href={`#/${id}`}
                aria-current={active ? 'page' : undefined}
                className={`press inline-flex min-h-11 items-center px-3.5 py-2 text-[13.5px] border-b-2 ${active ? 'border-ink font-semibold' : 'border-transparent text-ash hover:text-ink'}`}
              >
                {label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
