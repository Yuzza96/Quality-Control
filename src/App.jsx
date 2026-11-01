import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Overview from './pages/Overview.jsx'
import Customers from './pages/Customers.jsx'
import Placeholder from './pages/Placeholder.jsx'

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [page, setPage] = useState('Overview')
  const [theme, setTheme] = useState(initialTheme)
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  return (
    <div className="shell">
      <Sidebar
        active={page}
        open={navOpen}
        onNavigate={(p) => { setPage(p); setNavOpen(false) }}
        onClose={() => setNavOpen(false)}
      />
      <div className="main">
        <Topbar
          query={query}
          onQuery={setQuery}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onMenu={() => setNavOpen(true)}
        />
        <main className="content">
          {page === 'Overview' && <Overview globalQuery={query} />}
          {page === 'Customers' && <Customers />}
          {(page === 'Reports' || page === 'Settings') && <Placeholder title={page} />}
        </main>
      </div>
    </div>
  )
}
