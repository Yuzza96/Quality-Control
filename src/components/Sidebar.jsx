const items = [
  { name: 'Overview', icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
  { name: 'Customers', icon: 'M16 8a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0' },
  { name: 'Reports', icon: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6' },
  { name: 'Settings', icon: 'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0M16 4v4M8 10v4M18 16v4' },
]

export function Icon({ d, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function Sidebar({ active, open, onNavigate, onClose }) {
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand"><span className="logo">Q</span> QualityControl</div>
        <nav>
          {items.map((it) => (
            <button key={it.name} className={`nav-item ${active === it.name ? 'active' : ''}`}
              onClick={() => onNavigate(it.name)}>
              <Icon d={it.icon} /> {it.name}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
