export default function Placeholder({ title }) {
  return (
    <>
      <div className="page-head"><div><h1>{title}</h1></div></div>
      <section className="card coming-soon">
        <span className="badge amber">Coming soon</span>
        <h2>{title} is on the roadmap</h2>
        <p className="muted">This module isn't built yet. Add it in <code>src/App.jsx</code> (NAV list) when ready.</p>
      </section>
    </>
  )
}
