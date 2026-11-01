import { useEffect, useRef, useState } from 'react'
import { Icon } from './Sidebar.jsx'

export default function Topbar({ query, onQuery, theme, onToggleTheme, onMenu }) {
  const [menu, setMenu] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">
        <Icon d="M4 6h16M4 12h16M4 18h16" />
      </button>
      <label className="search">
        <Icon d="M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5" size={18} />
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search…" />
      </label>
      <div className="spacer" />
      <button className="icon-btn" onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark'
          ? <Icon d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6M12 16a4 4 0 100-8 4 4 0 000 8z" />
          : <Icon d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" />}
      </button>
      <div className="profile" ref={ref}>
        <button className="avatar-btn" onClick={() => setMenu(!menu)} aria-haspopup="menu" aria-expanded={menu}>
          <span className="avatar">YU</span>
          <span className="profile-name">Yuzza</span>
        </button>
        {menu && (
          <div className="dropdown" role="menu">
            <button role="menuitem">Profile</button>
            <button role="menuitem">Account settings</button>
            <hr />
            <button role="menuitem">Sign out</button>
          </div>
        )}
      </div>
    </header>
  )
}
