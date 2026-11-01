// `change` (optional) renders a trend arrow; `note` is a plain caption. `warn` tints the value amber.
export default function StatCard({ label, value, change, hint, note, warn }) {
  const up = change >= 0
  return (
    <div className="card stat">
      <span className="muted">{label}</span>
      <strong className={`stat-value ${warn ? 'warn' : ''}`}>{value}</strong>
      {change !== undefined ? (
        <span className={`trend ${up ? 'good' : 'bad'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={up ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} />
          </svg>
          {Math.abs(change)} pts <span className="muted">{hint}</span>
        </span>
      ) : (
        <span className="muted">{note}</span>
      )}
    </div>
  )
}
