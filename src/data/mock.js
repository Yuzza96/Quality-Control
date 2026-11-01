export const stats = [
  { label: 'Inspections', value: '1,284', change: 12.4, hint: 'vs last month' },
  { label: 'Pass Rate', value: '96.2%', change: 1.8, hint: 'vs last month' },
  { label: 'Open Defects', value: '73', change: -8.1, hint: 'vs last month', goodWhenDown: true },
  { label: 'Avg. Resolution', value: '2.4 d', change: 4.2, hint: 'vs last month', goodWhenDown: true },
]

export const monthly = [
  { month: 'Jan', passed: 820, failed: 64 },
  { month: 'Feb', passed: 910, failed: 58 },
  { month: 'Mar', passed: 880, failed: 71 },
  { month: 'Apr', passed: 1010, failed: 55 },
  { month: 'May', passed: 1090, failed: 49 },
  { month: 'Jun', passed: 1180, failed: 52 },
  { month: 'Jul', passed: 1240, failed: 47 },
  { month: 'Aug', passed: 1210, failed: 44 },
]

export const breakdown = [
  { name: 'Passed', value: 1124 },
  { name: 'Rework', value: 87 },
  { name: 'Failed', value: 47 },
  { name: 'Pending', value: 26 },
]

export const activity = [
  { id: 'QC-1042', item: 'Calibration – Torque Wrench', owner: 'Ana Reyes', status: 'Passed', date: '2026-10-30' },
  { id: 'QC-1041', item: 'Batch 88A Visual Inspection', owner: 'Ben Cruz', status: 'Failed', date: '2026-10-30' },
  { id: 'QC-1040', item: 'Pressure Gauge Verification', owner: 'Cara Lim', status: 'Pending', date: '2026-10-29' },
  { id: 'QC-1039', item: 'Incoming Material Check', owner: 'Dan Ortiz', status: 'Passed', date: '2026-10-29' },
  { id: 'QC-1038', item: 'Caliper Calibration', owner: 'Ana Reyes', status: 'Rework', date: '2026-10-28' },
  { id: 'QC-1037', item: 'Final Assembly Audit', owner: 'Eli Tan', status: 'Passed', date: '2026-10-28' },
  { id: 'QC-1036', item: 'Thermometer Verification', owner: 'Cara Lim', status: 'Passed', date: '2026-10-27' },
  { id: 'QC-1035', item: 'Packaging Seal Test', owner: 'Ben Cruz', status: 'Failed', date: '2026-10-27' },
  { id: 'QC-1034', item: 'Supplier Sample Review', owner: 'Dan Ortiz', status: 'Pending', date: '2026-10-26' },
  { id: 'QC-1033', item: 'Micrometer Calibration', owner: 'Eli Tan', status: 'Passed', date: '2026-10-26' },
]

export const customers = [
  { name: 'Acme Corp', contact: 'Jo Park', orders: 142, status: 'Active' },
  { name: 'Globex', contact: 'Lee Wong', orders: 98, status: 'Active' },
  { name: 'Initech', contact: 'Sam Patel', orders: 61, status: 'Paused' },
  { name: 'Umbrella Ltd', contact: 'Ria Gomez', orders: 215, status: 'Active' },
  { name: 'Hooli', contact: 'Max Chen', orders: 34, status: 'Churned' },
]
