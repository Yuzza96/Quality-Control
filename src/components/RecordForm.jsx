import { useState } from 'react'
import { STATUS_TONE } from '../data/data.js'

// fields: [{ name, label, type: 'text'|'date'|'number'|'select'|'textarea', options, required, wide }]
export default function RecordForm({ fields, initial, submitLabel, onSubmit, onCancel, readOnly, onEdit }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  const inputs = fields.filter((f) => f.type !== 'heading')
  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  function submit(e) {
    e.preventDefault()
    const next = {}
    for (const f of inputs) {
      const v = values[f.name]
      if (f.required && String(v ?? '').trim() === '') next[f.name] = 'Required'
      else if (f.type === 'number' && v !== '' && (!Number.isInteger(Number(v)) || Number(v) < 0)) next[f.name] = 'Whole number ≥ 0'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(Object.fromEntries(inputs.map((f) => [f.name, f.type === 'number' ? Number(values[f.name] || 0) : String(values[f.name] ?? '').trim()])))
  }

  // A `heading` field starts a new titled panel (with an optional `tone`); without headings it's one plain grid.
  const sections = []
  for (const f of fields) {
    if (f.type === 'heading') sections.push({ heading: f, fields: [] })
    else {
      if (!sections.length) sections.push({ heading: null, fields: [] })
      sections[sections.length - 1].fields.push(f)
    }
  }
  const sectioned = sections.some((s) => s.heading)

  // Read-only view: values as plain text (statuses as badges) so the sheet reads like an inset list
  const renderValue = (f) => {
    const v = String(values[f.name] ?? '').trim()
    if (!v) return <span className="ro-value empty">—</span>
    const tone = f.type === 'select' && STATUS_TONE[v]
    return <span className="ro-value">{tone ? <span className={`badge ${tone}`}>{v}</span> : v}</span>
  }

  const renderField = (f) => readOnly ? (
    <div key={f.name} className={`form-field ${f.wide ? 'wide' : ''}`}>
      <span>{f.label}</span>
      {renderValue(f)}
    </div>
  ) : (
    <label key={f.name} className={`form-field ${f.wide ? 'wide' : ''} ${errors[f.name] ? 'invalid' : ''}`}>
      <span>{f.label}{f.required && <b aria-hidden="true"> *</b>}</span>
      {f.type === 'select' ? (
        <select className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
          {f.options.map((o) => <option key={o} value={o}>{o || '— None —'}</option>)}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea className="field" rows="3" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
      ) : (
        <input className="field" type={f.type} min={f.type === 'number' ? 0 : undefined} placeholder={f.placeholder}
          value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
      )}
      {errors[f.name] && <em className="error">{errors[f.name]}</em>}
    </label>
  )

  return (
    <form onSubmit={submit} noValidate className={sectioned ? 'sectioned' : ''}>
      <div className={`${sectioned ? 'form-body' : ''}${readOnly ? ' readonly' : ''}`}>
        {sectioned ? (
          <div className="form-panels">
            {sections.map((sec, i) => (
              <fieldset key={sec.heading?.label ?? i} disabled={readOnly} className={`form-panel ${sec.heading?.tone ?? ''}`}>
                <legend className="panel-head"><i>{i + 1}</i>{sec.heading?.label}</legend>
                <div className="form-grid">{sec.fields.map(renderField)}</div>
              </fieldset>
            ))}
          </div>
        ) : (
          <fieldset disabled={readOnly} className="plain-fs"><div className="form-grid">{inputs.map(renderField)}</div></fieldset>
        )}
      </div>
      <div className="form-actions">
        {sectioned && <span className="req-note">{readOnly ? 'Read only — press Edit record to make changes' : <><b>*</b> Required field</>}</span>}
        {readOnly ? (
          <>
            <button key="close" type="button" className="btn" onClick={onCancel}>Close</button>
            <button key="edit" type="button" className="btn primary" onClick={onEdit}>Edit record</button>
          </>
        ) : (
          <>
            <button key="cancel" type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button key="save" type="submit" className="btn primary">{submitLabel}</button>
          </>
        )}
      </div>
    </form>
  )
}
