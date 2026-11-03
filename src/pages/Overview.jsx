import { useMemo } from 'react'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '../components/StatCard.jsx'
import { INSPECTION_STATUSES } from '../data/data.js'

// Recharts takes literal colors, so keep both themes here (mirrors styles.css).
const COLORS = {
  light: { accent: '#0a8a86', grid: 'rgba(15,23,42,.1)', text: '#4f5d75', card: 'rgba(255,255,255,.72)', ink: '#0c1424', Accepted: '#16a34a', 'On Hold': '#f59e0b', Rejected: '#ef4444' },
  dark: { accent: '#3cc9c3', grid: 'rgba(255,255,255,.1)', text: '#9ba8c0', card: 'rgba(28,36,60,.74)', ink: '#f3f6fc', Accepted: '#4ade80', 'On Hold': '#fbbf24', Rejected: '#f87171' },
}
const monthName = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleString('en', { month: 'short' })

export default function Overview({ inspections, ncs, theme }) {
  const c = COLORS[theme]

  const { stats, trend, split } = useMemo(() => {
    const ok = inspections.reduce((s, r) => s + r.qtyOk, 0)
    const ng = inspections.reduce((s, r) => s + r.qtyNg, 0)
    const passRate = ok + ng ? (ok / (ok + ng)) * 100 : 0

    const byMonth = {}
    for (const r of inspections) {
      const m = (byMonth[r.date.slice(0, 7)] ??= { ok: 0, ng: 0 })
      m.ok += r.qtyOk
      m.ng += r.qtyNg
    }
    const trend = Object.keys(byMonth).sort().map((k) => ({
      month: monthName(k),
      rate: Number(((byMonth[k].ok / (byMonth[k].ok + byMonth[k].ng || 1)) * 100).toFixed(1)),
    }))

    // trend arrow: last full month vs the one before
    const delta = trend.length > 2 ? trend.at(-1).rate - trend.at(-2).rate : 0
    const open = ncs.filter((n) => n.status !== 'Closed').length

    return {
      trend,
      split: INSPECTION_STATUSES.map((s) => ({ name: s, value: inspections.filter((r) => r.status === s).length })),
      stats: [
        { label: 'Total Inspections', value: inspections.length.toLocaleString(), note: `${(ok + ng).toLocaleString()} pcs inspected` },
        { label: 'Pass Rate', value: `${passRate.toFixed(1)}%`, change: Number(delta.toFixed(1)), hint: 'vs last month' },
        { label: 'Open NCs', value: String(open), note: `${ncs.filter((n) => n.status === 'In Progress').length} in progress`, warn: open > 0 },
      ],
    }
  }, [inspections, ncs])

  const tooltip = { background: c.card, border: `1px solid ${c.grid}`, borderRadius: 16, color: c.ink, backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }
  const lo = Math.floor(Math.min(...trend.map((t) => t.rate), 100) - 2)

  return (
    <>
      <div className="page-head"><div><h1>Overview</h1><p className="muted">Quality at a glance across all inspections and nonconformances.</p></div></div>

      <section className="grid stats">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid charts">
        <div className="card">
          <h2>Pass rate by month</h2>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke={c.text} tickLine={false} axisLine={false} />
                <YAxis stroke={c.text} tickLine={false} axisLine={false} domain={[lo, 100]} unit="%" />
                <Tooltip contentStyle={tooltip} formatter={(v) => [`${v}%`, 'Pass rate']} />
                <Line type="monotone" dataKey="rate" animationDuration={1000} animationEasing="ease-out" stroke={c.accent} strokeWidth={3} dot={{ r: 3, fill: c.accent }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Inspection status</h2>
          <div className="chart">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="none" animationDuration={900} animationEasing="ease-out">
                  {split.map((s) => <Cell key={s.name} fill={c[s.name]} />)}
                </Pie>
                <Tooltip contentStyle={tooltip} itemStyle={{ color: c.ink }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  )
}
