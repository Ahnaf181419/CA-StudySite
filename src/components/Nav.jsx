export default function Nav({ route }) {
  const [, view] = route.split('/')
  const tabs = [
    ['lectures', 'Lectures'],
    ['qb', 'Question bank'],
    ['patterns', 'Patterns'],
    ['search', 'Search'],
  ]
  return (
    <header className="border-b border-line sticky top-0 z-10 bg-paper/95 backdrop-blur">
      <div className="max-w-[860px] mx-auto px-5 md:px-8">
        <div className="flex items-baseline gap-4 pt-4 pb-2.5 md:pt-5 md:pb-3">
          <a href="#/lectures" className="font-semibold tracking-tight text-[16px] md:text-[17px] press">
            CSE 2213 <span className="text-ash font-normal">· Computer Architecture</span>
          </a>
        </div>
        <nav className="flex gap-1 -mb-px overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map(([id, label]) => {
            const active = (view || 'lectures') === id
            return (
              <a
                key={id}
                href={`#/${id}`}
                aria-current={active ? 'page' : undefined}
                className={`press inline-flex min-h-11 shrink-0 items-center px-2.5 md:px-3.5 py-2 text-[13.5px] border-b-2 ${active ? 'border-ink font-semibold' : 'border-transparent text-ash hover:text-ink'}`}
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
