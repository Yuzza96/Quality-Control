// Single source of dummy data. To move to Supabase later, replace the exports below
// with fetch/insert calls (e.g. supabase.from('inspections').select()) and keep the
// record shapes the same.

export const INSPECTION_STATUSES = ['Accepted', 'On Hold', 'Rejected']
export const NC_STATUSES = ['Open', 'In Progress', 'Closed']

// status -> badge tone (green / amber / red)
export const STATUS_TONE = {
  Accepted: 'green',
  'On Hold': 'amber',
  Rejected: 'red',
  Open: 'red',
  'In Progress': 'amber',
  Closed: 'green',
}

export const INSPECTORS = ['Ana Reyes', 'Ben Cruz', 'Cara Lim', 'Dan Ortiz', 'Eli Tan']

const PARTS = [
  'Shaft Ø20 x 150', 'Bracket L-type', 'Housing Cover A2', 'Flange DN50', 'Bushing Bronze',
  'Gear Z32 m2', 'Base Plate 200x120', 'Valve Body V1', 'Spacer Ring 30', 'Pin Dowel Ø8',
]
const DEFECTS = [
  'Oversize diameter', 'Burr on edge', 'Surface scratch', 'Thread damage', 'Wrong hole position',
  'Porosity in casting', 'Flatness out of tolerance', 'Missing chamfer',
]

// Small seeded generator so the dummy data is stable between reloads.
let seed = 7
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
const pad = (n, w = 4) => String(n).padStart(w, '0')
const isoDay = (daysAgo) => {
  const d = new Date(Date.UTC(2026, 10, 2))
  d.setUTCDate(d.getUTCDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

export const inspections = Array.from({ length: 48 }, (_, i) => {
  const total = 40 + Math.floor(rnd() * 160)
  const rate = 0.9 + rnd() * 0.1 - i * 0.0003 // quality drifts slightly over time
  const ng = Math.round(total * (1 - Math.min(rate, 1)))
  const status = ng === 0 ? 'Accepted' : ng / total > 0.07 ? 'Rejected' : rnd() > 0.6 ? 'On Hold' : 'Accepted'
  return {
    id: `INS-${pad(1048 - i)}`,
    date: isoDay(Math.floor(i * 3.6)),
    routeCard: `RC-${pad(2200 - i * 3)}`,
    po: `PO-${24000 + Math.floor(rnd() * 900)}`,
    part: pick(PARTS),
    inspector: pick(INSPECTORS),
    status,
    qtyOk: total - ng,
    qtyNg: ng,
  }
})

export const ncs = Array.from({ length: 22 }, (_, i) => {
  const age = Math.floor(i * 7.5)
  const status = age < 25 ? pick(['Open', 'Open', 'In Progress']) : age < 60 ? pick(['In Progress', 'Closed']) : 'Closed'
  return {
    id: `NCR-${pad(322 - i, 3)}`,
    date: isoDay(age),
    part: pick(PARTS),
    defect: pick(DEFECTS),
    qtyNg: 1 + Math.floor(rnd() * 24),
    status,
    remark: status === 'Closed' ? 'Reworked and re-inspected' : status === 'In Progress' ? 'Waiting for corrective action' : '',
  }
})

export const nextInspectionId = (list) =>
  `INS-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(4)))) + 1)}`
export const nextNcrNo = (list) =>
  `NCR-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(4)))) + 1, 3)}`
