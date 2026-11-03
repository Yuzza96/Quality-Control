import { useLayoutEffect, useRef, useState } from 'react'

export function Icon({ d, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function Sidebar({ nav, active, open, onNavigate, onClose }) {
  const navRef = useRef(null)
  const [pill, setPill] = useState(null) // { top, height }; null until first measure so it doesn't slide in from 0
  const [ready, setReady] = useState(false)
  const [pinned, setPinned] = useState(() => {
    try { return localStorage.getItem('sidebarPinned') === '1' } catch { return false }
  })

  // Slide a single highlight pill between items instead of swapping backgrounds.
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector('.nav-item.active')
      if (el) setPill({ top: el.offsetTop, height: el.offsetHeight })
    }
    measure()
    const raf = requestAnimationFrame(() => setReady(true))
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure) }
  }, [active])

  const togglePin = () => setPinned((p) => {
    try { localStorage.setItem('sidebarPinned', p ? '0' : '1') } catch {}
    return !p
  })

  // On desktop the sidebar rests as an icon rail and opens on hover / keyboard focus (CSS only); --i staggers the labels in.
  const item = (it, i) => (
    <button key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`} style={{ '--i': i }}
      onClick={() => onNavigate(it.id)} title={it.label}>
      <Icon d={it.icon} /> <span className="nav-text">{it.label}</span>
      {it.soon && <span className="soon">Soon</span>}
      {it.soon && <i className="soon-dot" aria-hidden="true" />}
    </button>
  )
  const modules = nav.filter((n) => !n.soon)
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <div className={`sidebar-slot ${pinned ? 'pinned' : ''}`}>
        <aside className={`sidebar ${open ? 'open' : ''} ${pinned ? 'pinned' : ''}`}>
          <div className="brand">
            <img className="brand-mark" src={`${import.meta.env.BASE_URL}favicon.png`} alt="" aria-hidden="true" />
            <img className="logo-light" src={`${import.meta.env.BASE_URL}logo-tight.png`} alt="MIT Technologies" />
            <img className="logo-dark" src={`${import.meta.env.BASE_URL}logo-tight-dark.png`} alt="" aria-hidden="true" />
          </div>
          <nav ref={navRef}>
            {pill && (
              <span className={`nav-pill ${ready ? 'animated' : ''}`}
                style={{ transform: `translateY(${pill.top}px)`, height: pill.height }} />
            )}
            <div className="nav-label">Modules</div>
            {modules.map((it, i) => item(it, i))}
            <div className="nav-label">Coming soon</div>
            {nav.filter((n) => n.soon).map((it, i) => item(it, modules.length + i))}
          </nav>
          <button className="pin-btn" onClick={togglePin} aria-pressed={pinned}
            title={pinned ? 'Unpin sidebar' : 'Keep sidebar open'}>
            <Icon d="M12 17v5M9 3h6l-1 7 3 3v2H7v-2l3-3z" size={18} />
            <span className="nav-text">{pinned ? 'Unpin sidebar' : 'Pin sidebar open'}</span>
          </button>
        </aside>
      </div>
    </>
  )
}
