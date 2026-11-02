import { useMemo, useState } from 'react'
import Modal from './Modal.jsx'
import RecordForm from './RecordForm.jsx'
import { STATUS_TONE } from '../data/data.js'
import { downloadCsv } from '../utils.js'

export function Badge({ status }) {
  return <span className={`badge ${STATUS_TONE[status] ?? 'amber'}`}>{status}</span>
}

const dash = <span className="muted">—</span>
const fmtDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// Cell renderer. `kind` on a column opts into richer presentation (used by the Inspection Report).
function Cell({ c, r }) {
  const v = r[c.key]
  if ((c.badge || c.key === 'status') && v) return <Badge status={v} />
  switch (c.kind) {
    case 'date': return v ? <span className="date-cell">{fmtDate(v)}</span> : dash
    case 'rc': return <span className="rc">{v}</span>
    case 'chip': return v ? <span className="chip">{v}</span> : dash
    case 'ok': return <span className={`qty ${v ? 'ok' : 'zero'}`}>{v}</span>
    case 'ng': return <span className={`qty ${v > 0 ? 'ng' : 'zero'}`}>{v}</span>
    case 'short': return <span className={`qty ${v > 0 ? 'short' : 'zero'}`}>{v}</span>
    case 'remark': return v ? <span className="remark">{v}</span> : dash
    default: return v || (c.num && v === 0 ? 0 : dash)
  }
}

// Shared list page: search + status/date filters + CSV export + "add" dialog.
export default function RecordsPage({
  title, subtitle, columns, rows, statuses, globalQuery, csvName, addLabel, formFields, formInitial, onAdd, groups,
}) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    const words = `${globalQuery} ${q}`.toLowerCase().split(/\s+/).filter(Boolean)
    return rows
      .filter((r) =>
        (status === 'All' || r.status === status) &&
        (!from || r.date >= from) && (!to || r.date <= to) &&
        words.every((w) => columns.some((c) => String(r[c.key]).toLowerCase().includes(w))))
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)))
  }, [rows, columns, q, status, from, to, globalQuery])

  const hasFilters = q || status !== 'All' || from || to
  const reset = () => { setQ(''); setStatus('All'); setFrom(''); setTo('') }

  function submit(values) {
    const rec = onAdd(values)
    setNotice(`${rec.id} added`)
    setTimeout(() => setNotice(''), 3500)
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <button className="btn primary" onClick={() => setOpen(true)}>+ {addLabel}</button>
      </div>

      <section className="card">
        <div className="toolbar">
          <input className="field grow" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search records…" aria-label="Search records" />
          <select className="field" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="All">All statuses</option>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <label className="date-range">
            <input className="field" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
            <span className="muted">to</span>
            <input className="field" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
          </label>
          {hasFilters && <button className="btn ghost" onClick={reset}>Clear</button>}
          <button className="btn" onClick={() => downloadCsv(csvName, columns, filtered)} disabled={!filtered.length}>Export CSV</button>
        </div>

        <div className={`table-wrap${groups ? ' rich' : ''}`}>
          <table>
            <thead>
              {groups && (
                <tr className="group-row">
                  {groups.map((g, i) => <th key={g.label} colSpan={g.span} className={`group-th g${i % 2}`}><span>{g.label}</span></th>)}
                </tr>
              )}
              <tr>{columns.map((c) => <th key={c.key} className={`${c.num ? 'num' : ''}${c.divider ? ' divider' : ''}`}>{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={`row-in${groups ? ` tone-${STATUS_TONE[r.status]}` : ''}`}>
                  {columns.map((c) => (
                    <td key={c.key} className={`${c.num ? 'num' : c.key === 'id' ? 'strong' : ''}${c.divider ? ' divider' : ''}`}>
                      <Cell c={c} r={r} />
                    </td>
                  ))}
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={columns.length} className="empty">No records match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="muted count">Showing {filtered.length} of {rows.length} records</p>
      </section>

      {open && (
        <Modal title={addLabel} onClose={() => setOpen(false)}>
          {(close) => (
            <RecordForm fields={formFields} initial={formInitial()} submitLabel="Save"
              onSubmit={(v) => { submit(v); close() }} onCancel={close} />
          )}
        </Modal>
      )}
      {notice && <div className="toast" role="status">{notice}</div>}
    </>
  )
}
