export function Icon({ d, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function Sidebar({ nav, active, open, onNavigate, onClose }) {
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
          <img src={`${import.meta.env.BASE_URL}logo-tight.png`} alt="MIT Technologies" />
        </div>
        <nav>
          <div className="nav-label">Modules</div>
          {nav.filter((n) => !n.soon).map(item)}
          <div className="nav-label">Coming soon</div>
          {nav.filter((n) => n.soon).map(item)}
        </nav>
      </aside>
    </>
  )
}
