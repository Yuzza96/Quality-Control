import RecordsPage from '../components/RecordsPage.jsx'
import { DEPARTMENTS, INSPECTORS, TRANSFER_STATUSES, nextTransferId } from '../data/data.js'
import { today } from '../utils.js'

const columns = [
  { key: 'id', label: 'Transfer No.' },
  { key: 'date', label: 'Date' },
  { key: 'part', label: 'Part Description' },
  { key: 'qty', label: 'Qty', num: true },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'transferredBy', label: 'Transferred By' },
  { key: 'status', label: 'Status' },
  { key: 'remark', label: 'Remark' },
]

const formFields = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', options: TRANSFER_STATUSES },
  { name: 'part', label: 'Part Description', type: 'text', required: true, wide: true },
  { name: 'from', label: 'From', type: 'select', options: DEPARTMENTS },
  { name: 'to', label: 'To', type: 'select', options: DEPARTMENTS },
  { name: 'qty', label: 'Qty', type: 'number', required: true },
  { name: 'transferredBy', label: 'Transferred By', type: 'select', options: INSPECTORS },
  { name: 'remark', label: 'Remark', type: 'textarea', wide: true },
]

export default function GoodTransfer({ rows, onAdd, globalQuery }) {
  return (
    <RecordsPage
      title="Internal Good Transfer Record"
      subtitle="Parts moved between departments, with receipt status."
      columns={columns}
      rows={rows}
      statuses={TRANSFER_STATUSES}
      globalQuery={globalQuery}
      csvName="internal-good-transfer.csv"
      addLabel="New Transfer"
      formFields={formFields}
      formInitial={() => ({ date: today(), status: 'Pending', part: '', from: DEPARTMENTS[0], to: DEPARTMENTS[1], qty: '', transferredBy: INSPECTORS[0], remark: '' })}
      onAdd={(v) => onAdd({ id: nextTransferId(rows), ...v })}
    />
  )
}
