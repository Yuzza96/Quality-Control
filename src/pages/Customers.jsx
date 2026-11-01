import { customers } from '../data/mock.js'

const badge = { Active: 'passed', Paused: 'pending', Churned: 'failed' }

export default function Customers() {
  return (
    <>
      <h1>Customers</h1>
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Contact</th><th>Orders</th><th>Status</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td><td>{c.contact}</td><td>{c.orders}</td>
                  <td><span className={`badge ${badge[c.status]}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
