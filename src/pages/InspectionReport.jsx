import RecordsPage from '../components/RecordsPage.jsx'
import { INSPECTION_STATUSES, INSPECTORS, nextInspectionId } from '../data/data.js'
import { today } from '../utils.js'

const columns = [
  { key: 'id', label: 'Inspection ID' },
  { key: 'date', label: 'Date' },
  { key: 'routeCard', label: 'Route Card' },
  { key: 'po', label: 'PO#' },
  { key: 'part', label: 'Part Description' },
  { key: 'inspector', label: 'Inspector' },
  { key: 'status', label: 'Status' },
  { key: 'qtyOk', label: 'Qty OK', num: true },
  { key: 'qtyNg', label: 'Qty NG', num: true },
]

const formFields = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'routeCard', label: 'Route Card', type: 'text', required: true },
  { name: 'po', label: 'PO#', type: 'text', required: true },
  { name: 'inspector', label: 'Inspector', type: 'select', options: INSPECTORS },
  { name: 'part', label: 'Part Description', type: 'text', required: true, wide: true },
  { name: 'status', label: 'Status', type: 'select', options: INSPECTION_STATUSES },
  { name: 'qtyOk', label: 'Qty OK', type: 'number', required: true },
  { name: 'qtyNg', label: 'Qty NG', type: 'number', required: true },
]

export default function InspectionReport({ rows, onAdd, globalQuery }) {
  return (
    <RecordsPage
      title="Inspection Report"
      subtitle="Inspection records by route card and purchase order."
      columns={columns}
      rows={rows}
      statuses={INSPECTION_STATUSES}
      globalQuery={globalQuery}
      csvName="inspection-report.csv"
      addLabel="New Inspection"
      formFields={formFields}
      formInitial={() => ({ date: today(), routeCard: '', po: '', inspector: INSPECTORS[0], part: '', status: 'Accepted', qtyOk: '', qtyNg: '0' })}
      onAdd={(v) => onAdd({ id: nextInspectionId(rows), ...v })}
    />
  )
}
