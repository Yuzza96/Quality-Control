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

  const item = (it) => (
    <button key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`} onClick={() => onNavigate(it.id)}>
      <Icon d={it.icon} /> <span>{it.label}</span>
      {it.soon && <span className="soon">Soon</span>}
    </button>
  )
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <img className="logo-light" src={`${import.meta.env.BASE_URL}logo-tight.png`} alt="MIT Technologies" />
          <img className="logo-dark" src={`${import.meta.env.BASE_URL}logo-tight-dark.png`} alt="" aria-hidden="true" />
        </div>
        <nav ref={navRef}>
          {pill && (
            <span className={`nav-pill ${ready ? 'animated' : ''}`}
              style={{ transform: `translateY(${pill.top}px)`, height: pill.height }} />
          )}
          <div className="nav-label">Modules</div>
          {nav.filter((n) => !n.soon).map(item)}
          <div className="nav-label">Coming soon</div>
          {nav.filter((n) => n.soon).map(item)}
        </nav>
      </aside>
    </>
  )
}
