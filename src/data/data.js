// Single source of dummy data. To move to Supabase later, replace the exports below
// with fetch/insert calls (e.g. supabase.from('inspections').select()) and keep the
// record shapes the same.

export const INSPECTION_STATUSES = ['Accepted', 'On Hold', 'Rejected']
export const NC_STATUSES = ['Open', 'In Progress', 'Closed']
export const ROUTE_CARD_STATUSES = ['Pending', 'In Progress', 'Completed']
export const FINAL_STATUSES = ['Open', 'Closed']

// status -> badge tone (green / amber / red)
export const STATUS_TONE = {
  Accepted: 'green',
  'On Hold': 'amber',
  Rejected: 'red',
  Open: 'red',
  'In Progress': 'amber',
  Closed: 'green',
  Pending: 'amber',
  'In Transit': 'amber',
  Received: 'green',
  Completed: 'green',
  'In Service': 'green',
  'Due Soon': 'amber',
  'Out of Service': 'red',
}

export const TRANSFER_STATUSES = ['Pending', 'In Transit', 'Received', 'Rejected']
export const DEPARTMENTS = ['Receiving', 'Warehouse', 'Machining', 'Assembly', 'QC Lab', 'Rework Area', 'Packing']
export const EQUIPMENT_STATUSES = ['In Service', 'Due Soon', 'Out of Service']
export const EQUIPMENT_CATEGORIES = ['Dimensional', 'Force / Torque', 'Pressure', 'Electrical', 'Temperature', 'Testing', 'Weighing']

export const INSPECTORS = ['Ana Reyes', 'Ben Cruz', 'Cara Lim', 'Dan Ortiz', 'Eli Tan']

const PARTS = [
  'Shaft Ø20 x 150', 'Bracket L-type', 'Housing Cover A2', 'Flange DN50', 'Bushing Bronze',
  'Gear Z32 m2', 'Base Plate 200x120', 'Valve Body V1', 'Spacer Ring 30', 'Pin Dowel Ø8',
]
const MODELS = ['MX-100', 'MX-200', 'TR-30', 'TR-45', 'HV-9']
const NEXT_PROCESSES = ['Machining', 'Assembly', 'Packing', 'Warehouse']
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
}).map((r, i) => {
  // Route card information + the rest of the inspection record. Derived from the fields above
  // (no extra rnd() calls) so the existing dummy data stays unchanged.
  const partIdx = PARTS.indexOf(r.part)
  const short = i % 9 === 4 ? 2 + (i % 5) : 0
  const rejected = r.status === 'Rejected' ? r.qtyNg : 0
  const ncr = r.qtyNg > 0 && r.status !== 'Accepted' ? `NCR-${pad(322 - (i % 22), 3)}` : ''
  const age = Math.floor(i * 3.6)
  const ncrStatus = !ncr ? '' : age > 40 ? 'Closed' : NC_STATUSES[i % 3]
  return {
    ...r,
    sender: INSPECTORS[(i + 2) % INSPECTORS.length],
    partId: `PN-${pad(1000 + partIdx * 37, 4)}`,
    rfm: `RFM-${pad(7100 - i * 2, 4)}`,
    model: MODELS[partIdx % MODELS.length],
    quantity: r.qtyOk + r.qtyNg + short,
    nextProcess: r.status === 'Rejected' ? 'Rework Area' : NEXT_PROCESSES[i % NEXT_PROCESSES.length],
    rcStatus: age < 4 && i % 2 ? 'In Progress' : age < 2 ? 'Pending' : 'Completed',
    inspectionDate: isoDay(Math.max(0, age - (i % 3 === 0 ? 1 : 0))),
    short,
    ncr,
    ncrStatus,
    rejected,
    finalStatus: r.status === 'Accepted' || ncrStatus === 'Closed' ? 'Closed' : 'Open',
    igt: r.status === 'Accepted' || r.status === 'Rejected' ? `IGT-${pad(526 - (i % 26), 4)}` : '',
    remark: r.status === 'On Hold' ? 'Awaiting customer concession' : short ? 'Short delivery from sender' : '',
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

// Internal good transfers: parts moved between departments. Generated after the other seeded data
// so the existing dummy records stay unchanged.
export const transfers = Array.from({ length: 26 }, (_, i) => {
  const age = Math.floor(i * 2.4)
  const from = pick(DEPARTMENTS)
  const to = pick(DEPARTMENTS.filter((d) => d !== from))
  const status = age < 3 ? pick(['Pending', 'In Transit']) : rnd() < 0.08 ? 'Rejected' : 'Received'
  return {
    id: `IGT-${pad(526 - i, 4)}`,
    date: isoDay(age),
    part: pick(PARTS),
    qty: 10 * (1 + Math.floor(rnd() * 30)),
    from,
    to,
    transferredBy: pick(INSPECTORS),
    status,
    remark: status === 'Rejected' ? 'Quantity mismatch on receipt' : status === 'Pending' ? 'Awaiting pickup' : '',
  }
})

// QC equipment inventory. `date` = last calibration (kept as `date` so the shared list page can filter it).
// Status is derived from the due date relative to the dummy "today" (2026-11-02): overdue gauges are out of service.
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
// [name, category, serial, location, calibration interval (days), days since last calibration, forced out of service]
const EQUIPMENT_ROWS = [
  ['Vernier Caliper 0–150 mm', 'Dimensional', 'MT-150-2291', 'QC Lab', 365, 120],
  ['Digital Caliper 0–200 mm', 'Dimensional', 'MT-200-5518', 'Line 1', 365, 340],
  ['Outside Micrometer 0–25 mm', 'Dimensional', 'MIT-25-0734', 'QC Lab', 365, 200],
  ['Outside Micrometer 25–50 mm', 'Dimensional', 'MIT-50-0735', 'QC Lab', 365, 395],
  ['Height Gauge 0–300 mm', 'Dimensional', 'HG-300-1180', 'Inspection Room', 365, 90],
  ['Dial Indicator 0.01 mm', 'Dimensional', 'DI-001-9042', 'Line 2', 180, 60],
  ['Bore Gauge 18–35 mm', 'Dimensional', 'BG-35-3317', 'Machining', 365, 310],
  ['Gauge Block Set (87 pcs)', 'Dimensional', 'GB-87-0021', 'Metrology Room', 730, 400],
  ['Profile Projector', 'Dimensional', 'PP-300-0008', 'Metrology Room', 365, 150],
  ['Coordinate Measuring Machine', 'Dimensional', 'CMM-7-2204', 'Metrology Room', 365, 45],
  ['Torque Wrench 10–50 Nm', 'Force / Torque', 'TW-50-6120', 'Assembly', 180, 175],
  ['Torque Screwdriver 1–6 Nm', 'Force / Torque', 'TS-06-4417', 'Assembly', 180, 210],
  ['Pressure Gauge 0–10 bar', 'Pressure', 'PG-10-7783', 'Test Bay', 365, 260],
  ['Digital Multimeter', 'Electrical', 'DMM-87-3350', 'Electrical Shop', 365, 100],
  ['Digital Thermometer', 'Temperature', 'TH-02-1129', 'QC Lab', 365, 330],
  ['Hardness Tester (Rockwell)', 'Testing', 'HT-RW-0516', 'Testing Lab', 365, 30],
  ['Surface Roughness Tester', 'Testing', 'SR-220-0942', 'Testing Lab', 365, 280],
  ['Precision Balance 0.01 g', 'Weighing', 'PB-200-8861', 'QC Lab', 180, 70],
]
export const equipment = EQUIPMENT_ROWS.map(([name, category, serial, location, interval, since], i) => {
  const date = isoDay(since)
  const nextDue = addDays(date, interval)
  const days = (new Date(`${nextDue}T00:00:00Z`) - new Date('2026-11-02T00:00:00Z')) / 86400000
  const status = days < 0 ? 'Out of Service' : days <= 45 ? 'Due Soon' : 'In Service'
  return { id: `EQ-${pad(i + 1, 3)}`, name, category, serial, location, date, nextDue, status }
})

export const nextTransferId = (list) =>
  `IGT-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(4)))) + 1, 4)}`
export const nextEquipmentId = (list) =>
  `EQ-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(3)))) + 1, 3)}`
export const nextInspectionId = (list) =>
  `INS-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(4)))) + 1)}`
export const nextNcrNo = (list) =>
  `NCR-${pad(Math.max(0, ...list.map((r) => Number(r.id.slice(4)))) + 1, 3)}`
