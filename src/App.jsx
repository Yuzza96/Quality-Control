import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Overview from './pages/Overview.jsx'
import InspectionReport from './pages/InspectionReport.jsx'
import NcReport from './pages/NcReport.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { inspections as seedInspections, ncs as seedNcs } from './data/data.js'

// To add a module: append an entry here (soon: true => placeholder page) and render it below.
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-3H4z' },
  { id: 'inspection', label: 'Inspection Report', icon: 'M9 11l2 2 4-4M6 3h12v18H6z' },
  { id: 'nc', label: 'NC Report', icon: 'M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z' },
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const addInspection = (rec) => { setInspections((l) => [rec, ...l]); return rec }
  const addNc = (rec) => { setNcs((l) => [rec, ...l]); return rec }
  const current = NAV.find((n) => n.id === page)

  return (
    <div className="shell">
      <Sidebar nav={NAV} active={page} open={navOpen}
        onNavigate={(id) => { setPage(id); setNavOpen(false) }} onClose={() => setNavOpen(false)} />
      <div className="main">
        <Topbar
          query={query} onQuery={setQuery} theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onMenu={() => setNavOpen(true)}
        />
        <main className="content">
          {page === 'overview' && <Overview inspections={inspections} ncs={ncs} theme={theme} />}
          {page === 'inspection' && <InspectionReport rows={inspections} onAdd={addInspection} globalQuery={query} />}
          {page === 'nc' && <NcReport rows={ncs} onAdd={addNc} globalQuery={query} />}
          {current?.soon && <Placeholder title={current.label} />}
        </main>
      </div>
    </div>
  )
}
