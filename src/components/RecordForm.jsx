import { useState } from 'react'

// fields: [{ name, label, type: 'text'|'date'|'number'|'select'|'textarea', options, required, wide }]
export default function RecordForm({ fields, initial, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  function submit(e) {
    e.preventDefault()
    const next = {}
    for (const f of fields) {
      const v = values[f.name]
      if (f.required && String(v ?? '').trim() === '') next[f.name] = 'Required'
      else if (f.type === 'number' && v !== '' && (!Number.isInteger(Number(v)) || Number(v) < 0)) next[f.name] = 'Whole number ≥ 0'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(Object.fromEntries(fields.map((f) => [f.name, f.type === 'number' ? Number(values[f.name] || 0) : String(values[f.name] ?? '').trim()])))
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.name} className={`form-field ${f.wide ? 'wide' : ''}`}>
            <span>{f.label}{f.required && <b aria-hidden="true"> *</b>}</span>
            {f.type === 'select' ? (
              <select className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="field" rows="3" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <input className="field" type={f.type} min={f.type === 'number' ? 0 : undefined}
                value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            )}
            {errors[f.name] && <em className="error">{errors[f.name]}</em>}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  )
}
