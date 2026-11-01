import { useMemo, useState } from 'react'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '../components/StatCard.jsx'
import { activity, breakdown, monthly, stats } from '../data/mock.js'

// One accent color; the donut uses tints of it plus neutrals so status stays readable.
const DONUT = ['var(--accent)', 'var(--accent-soft-2)', 'var(--danger)', 'var(--neutral)']
const STATUSES = ['All', 'Passed', 'Rework', 'Failed', 'Pending']
const tooltipStyle = {
  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)',
}

export default function Overview({ globalQuery = '' }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')

  const rows = useMemo(() => {
    const needle = `${globalQuery} ${q}`.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return activity.filter((r) =>
      (status === 'All' || r.status === status) &&
      needle.every((w) => `${r.id} ${r.item} ${r.owner}`.toLowerCase().includes(w)))
  }, [q, status, globalQuery])

  return (
    <>
      <h1>Overview</h1>
      <section className="grid stats">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid charts">
        <div className="card">
          <h2>Monthly trend</h2>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart data={monthly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="passed" name="Passed" stroke="var(--accent)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="failed" name="Failed" stroke="var(--neutral)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Breakdown</h2>
          <div className="chart">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="none">
                  {breakdown.map((_, i) => <Cell key={i} fill={DONUT[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="table-head">
          <h2>Recent activity</h2>
          <div className="filters">
            <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activity…" />
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Item</th><th>Owner</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.item}</td><td>{r.owner}</td>
                  <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td className="muted">{r.date}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="5" className="empty">No matching activity.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
