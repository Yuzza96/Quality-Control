export default function Placeholder({ title }) {
  return (
    <>
      <h1>{title}</h1>
      <section className="card"><p className="muted">{title} is coming soon.</p></section>
    </>
  )
}
