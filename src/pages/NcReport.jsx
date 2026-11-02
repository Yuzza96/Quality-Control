import RecordsPage from '../components/RecordsPage.jsx'
import { NC_STATUSES, nextNcrNo } from '../data/data.js'
import { today } from '../utils.js'

const columns = [
  { key: 'id', label: 'NCR No.' },
  { key: 'date', label: 'Date' },
  { key: 'part', label: 'Part' },
  { key: 'defect', label: 'Defect Description' },
  { key: 'qtyNg', label: 'Qty NG', num: true },
  { key: 'status', label: 'Status' },
  { key: 'remark', label: 'Remark' },
]

const formFields = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', options: NC_STATUSES },
  { name: 'part', label: 'Part', type: 'text', required: true, wide: true },
  { name: 'defect', label: 'Defect Description', type: 'textarea', required: true, wide: true },
  { name: 'qtyNg', label: 'Qty NG', type: 'number', required: true },
  { name: 'remark', label: 'Remark', type: 'textarea', wide: true },
]

export default function NcReport({ rows, onAdd, onUpdate, globalQuery }) {
  return (
    <RecordsPage
      title="NC Report"
      subtitle="Nonconformance records and their corrective-action status."
      columns={columns}
      rows={rows}
      statuses={NC_STATUSES}
      globalQuery={globalQuery}
      csvName="nc-report.csv"
      addLabel="New NC"
      formFields={formFields}
      formInitial={() => ({ date: today(), status: 'Open', part: '', defect: '', qtyNg: '', remark: '' })}
      onUpdate={onUpdate}
      onAdd={(v) => onAdd({ id: nextNcrNo(rows), ...v })}
    />
  )
}
