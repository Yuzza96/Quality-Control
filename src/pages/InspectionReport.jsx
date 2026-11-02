import RecordsPage from '../components/RecordsPage.jsx'
import { INSPECTION_STATUSES, INSPECTORS, NC_STATUSES, ROUTE_CARD_STATUSES, FINAL_STATUSES, nextInspectionId } from '../data/data.js'
import { today } from '../utils.js'

// `date` is Date IN (kept as `date` so the shared date filter works); `status` is the Inspection Status.
const routeCardColumns = [
  { key: 'date', label: 'Date IN', kind: 'date' },
  { key: 'sender', label: 'Sender by' },
  { key: 'routeCard', label: 'Route Card', kind: 'rc' },
  { key: 'part', label: 'Part Name' },
  { key: 'partId', label: 'Part ID', kind: 'chip' },
  { key: 'po', label: 'PO No', kind: 'chip' },
  { key: 'rfm', label: 'RFM No', kind: 'chip' },
  { key: 'model', label: 'Model' },
  { key: 'quantity', label: 'Quantity', num: true },
  { key: 'nextProcess', label: 'Next Process' },
  { key: 'rcStatus', label: 'Status', badge: true },
]
const inspectionColumns = [
  { key: 'inspectionDate', label: 'Inspection Date', kind: 'date', divider: true },
  { key: 'inspector', label: 'Inspected By.' },
  { key: 'status', label: 'Inspection Status' },
  { key: 'qtyOk', label: 'Quantity OK', num: true, kind: 'ok' },
  { key: 'qtyNg', label: 'Quantity NG', num: true, kind: 'ng' },
  { key: 'short', label: 'Short', num: true, kind: 'short' },
  { key: 'ncr', label: 'NCR', kind: 'chip' },
  { key: 'ncrStatus', label: 'NCR Status', badge: true },
  { key: 'rejected', label: 'Rejected', num: true },
  { key: 'finalStatus', label: 'Status', badge: true },
  { key: 'igt', label: 'IGT No.', kind: 'chip' },
  { key: 'remark', label: 'Remark', kind: 'remark' },
]
const columns = [...routeCardColumns, ...inspectionColumns]
const groups = [
  { label: 'Route Card Information', span: routeCardColumns.length },
  { label: 'Inspection Record', span: inspectionColumns.length },
]

const formFields = [
  { type: 'heading', label: 'Route Card Information' },
  { name: 'date', label: 'Date IN', type: 'date', required: true },
  { name: 'sender', label: 'Sender by', type: 'select', options: INSPECTORS },
  { name: 'routeCard', label: 'Route Card', type: 'text', required: true },
  { name: 'po', label: 'PO No', type: 'text', required: true },
  { name: 'part', label: 'Part Name', type: 'text', required: true, wide: true },
  { name: 'partId', label: 'Part ID', type: 'text' },
  { name: 'rfm', label: 'RFM No', type: 'text' },
  { name: 'model', label: 'Model', type: 'text' },
  { name: 'quantity', label: 'Quantity', type: 'number', required: true },
  { name: 'nextProcess', label: 'Next Process', type: 'text' },
  { name: 'rcStatus', label: 'Status', type: 'select', options: ROUTE_CARD_STATUSES },
  { type: 'heading', label: 'Inspection Record' },
  { name: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
  { name: 'inspector', label: 'Inspected By.', type: 'select', options: INSPECTORS },
  { name: 'status', label: 'Inspection Status', type: 'select', options: INSPECTION_STATUSES },
  { name: 'qtyOk', label: 'Quantity OK', type: 'number', required: true },
  { name: 'qtyNg', label: 'Quantity NG', type: 'number', required: true },
  { name: 'short', label: 'Short', type: 'number' },
  { name: 'rejected', label: 'Rejected', type: 'number' },
  { name: 'ncr', label: 'NCR', type: 'text' },
  { name: 'ncrStatus', label: 'NCR Status', type: 'select', options: ['', ...NC_STATUSES] },
  { name: 'finalStatus', label: 'Status', type: 'select', options: FINAL_STATUSES },
  { name: 'igt', label: 'IGT No.', type: 'text' },
  { name: 'remark', label: 'Remark', type: 'textarea', wide: true },
]

export default function InspectionReport({ rows, onAdd, globalQuery }) {
  return (
    <RecordsPage
      title="Inspection Report"
      subtitle="Route card information and inspection records."
      columns={columns}
      groups={groups}
      rows={rows}
      statuses={INSPECTION_STATUSES}
      globalQuery={globalQuery}
      csvName="inspection-report.csv"
      addLabel="New Inspection"
      formFields={formFields}
      formInitial={() => ({
        date: today(), sender: INSPECTORS[0], routeCard: '', po: '', part: '', partId: '', rfm: '', model: '',
        quantity: '', nextProcess: '', rcStatus: 'Pending',
        inspectionDate: today(), inspector: INSPECTORS[0], status: 'Accepted', qtyOk: '', qtyNg: '0', short: '0', rejected: '0',
        ncr: '', ncrStatus: '', finalStatus: 'Open', igt: '', remark: '',
      })}
      onAdd={(v) => onAdd({ id: nextInspectionId(rows), ...v })}
    />
  )
}
