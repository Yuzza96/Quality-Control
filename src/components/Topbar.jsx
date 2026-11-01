import { useEffect, useRef, useState } from 'react'
import { Icon } from './Sidebar.jsx'

export default function Topbar({ query, onQuery, theme, onToggleTheme, onMenu }) {
  const [menu, setMenu] = useState('closed') // 'closed' | 'open' | 'closing' (exit animation)
  const ref = useRef(null)

  const closeMenu = () => {
    setMenu('closing')
    setTimeout(() => setMenu('closed'), 160)
  }

  useEffect(() => {
    if (menu !== 'open') return
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) closeMenu() }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menu])

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
        <span key={theme} className="theme-icon">
          {theme === 'dark'
            ? <Icon d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6M12 16a4 4 0 100-8 4 4 0 000 8z" />
            : <Icon d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" />}
        </span>
      </button>
      <div className="profile" ref={ref}>
        <button className="avatar-btn" onClick={() => (menu === 'open' ? closeMenu() : setMenu('open'))}
          aria-haspopup="menu" aria-expanded={menu === 'open'}>
          <span className="avatar">YU</span>
          <span className="profile-name">Yuzza</span>
        </button>
        {menu !== 'closed' && (
          <div className={`dropdown ${menu === 'closing' ? 'closing' : ''}`} role="menu">
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
