export default function StatCard({ label, value, change, hint, goodWhenDown }) {
  const up = change >= 0
  const good = goodWhenDown ? !up : up
  return (
    <div className="card stat">
      <span className="muted">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className={`trend ${good ? 'good' : 'bad'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={up ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} />
        </svg>
        {Math.abs(change)}% <span className="muted">{hint}</span>
      </span>
    </div>
  )
}
