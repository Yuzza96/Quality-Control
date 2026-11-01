import RecordsPage from '../components/RecordsPage.jsx'
import { EQUIPMENT_CATEGORIES, EQUIPMENT_STATUSES, nextEquipmentId } from '../data/data.js'
import { today } from '../utils.js'

const columns = [
  { key: 'id', label: 'Asset Tag' },
  { key: 'name', label: 'Equipment' },
  { key: 'category', label: 'Category' },
  { key: 'serial', label: 'Serial No.' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Last Calibrated' },
  { key: 'nextDue', label: 'Next Due' },
  { key: 'status', label: 'Status' },
]

const formFields = [
  { name: 'name', label: 'Equipment Name', type: 'text', required: true, wide: true },
  { name: 'category', label: 'Category', type: 'select', options: EQUIPMENT_CATEGORIES },
  { name: 'serial', label: 'Serial No.', type: 'text', required: true },
  { name: 'location', label: 'Location', type: 'text', required: true },
  { name: 'status', label: 'Status', type: 'select', options: EQUIPMENT_STATUSES },
  { name: 'date', label: 'Last Calibrated', type: 'date', required: true },
  { name: 'nextDue', label: 'Next Due', type: 'date', required: true },
]

export default function Equipment({ rows, onAdd, globalQuery }) {
  return (
    <RecordsPage
      title="Equipment"
      subtitle="QC equipment inventory and calibration due dates."
      columns={columns}
      rows={rows}
      statuses={EQUIPMENT_STATUSES}
      globalQuery={globalQuery}
      csvName="equipment-inventory.csv"
      addLabel="New Equipment"
      formFields={formFields}
      formInitial={() => ({ name: '', category: EQUIPMENT_CATEGORIES[0], serial: '', location: '', status: 'In Service', date: today(), nextDue: '' })}
      onAdd={(v) => onAdd({ id: nextEquipmentId(rows), ...v })}
    />
  )
}
