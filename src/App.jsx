import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Overview from './pages/Overview.jsx'
import InspectionReport from './pages/InspectionReport.jsx'
import NcReport from './pages/NcReport.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Equipment from './pages/Equipment.jsx'
import { inspections as seedInspections, ncs as seedNcs, equipment as seedEquipment } from './data/data.js'

// To add a module: append an entry here (soon: true => placeholder page) and render it below.
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-3H4z' },
  { id: 'inspection', label: 'Inspection Report', icon: 'M9 11l2 2 4-4M6 3h12v18H6z' },
  { id: 'nc', label: 'NC Report', icon: 'M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z' },
  { id: 'equipment', label: 'Equipment', icon: 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z' },
  { id: 'incoming', label: 'Incoming QC', icon: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', soon: true },
  { id: 'calibration', label: 'Calibration', icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M12 15a3 3 0 100-6 3 3 0 000 6z', soon: true },
  { id: 'supplier', label: 'Supplier Quality', icon: 'M16 8a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0', soon: true },
  { id: 'audits', label: 'Audits', icon: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6', soon: true },
]

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [page, setPage] = useState('overview')
  const [theme, setTheme] = useState(initialTheme)
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [inspections, setInspections] = useState(seedInspections)
  const [ncs, setNcs] = useState(seedNcs)
  const [equipment, setEquipment] = useState(seedEquipment)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  // Circular reveal: the new theme grows out of the toggle button. Only one clip-path animates
  // (View Transitions API), so nothing re-paints piecemeal. Falls back to an instant switch.
  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => { document.documentElement.dataset.theme = next; flushSync(() => setTheme(next)) }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) { apply(); return }

    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const root = document.documentElement

    root.classList.add('theme-switching')
    const t = document.startViewTransition(apply)
    t.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 900, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
    )).catch(() => {})
    t.finished.finally(() => root.classList.remove('theme-switching'))
  }

  const addInspection = (rec) => { setInspections((l) => [rec, ...l]); return rec }
  const addNc = (rec) => { setNcs((l) => [rec, ...l]); return rec }
  const addEquipment = (rec) => { setEquipment((l) => [rec, ...l]); return rec }
  const current = NAV.find((n) => n.id === page)

  return (
    <div className="shell">
      <Sidebar nav={NAV} active={page} open={navOpen}
        onNavigate={(id) => { setPage(id); setNavOpen(false) }} onClose={() => setNavOpen(false)} />
      <div className="main">
        <Topbar
          query={query} onQuery={setQuery} theme={theme}
          onToggleTheme={toggleTheme}
          onMenu={() => setNavOpen(true)}
        />
        <main className="content">
          {/* keyed by page so each navigation replays the enter animation */}
          <div className="page" key={page}>
            {page === 'overview' && <Overview inspections={inspections} ncs={ncs} theme={theme} />}
            {page === 'inspection' && <InspectionReport rows={inspections} onAdd={addInspection} globalQuery={query} />}
            {page === 'nc' && <NcReport rows={ncs} onAdd={addNc} globalQuery={query} />}
            {page === 'equipment' && <Equipment rows={equipment} onAdd={addEquipment} globalQuery={query} />}
            {current?.soon && <Placeholder title={current.label} />}
          </div>
        </main>
      </div>
    </div>
  )
}
