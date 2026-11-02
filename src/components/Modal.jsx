import { useEffect, useRef, useState } from 'react'

// Native <dialog>: focus trap, Escape to close and backdrop come for free.
// Closing plays an exit animation first; `children` may be a function receiving that animated `close`.
export default function Modal({ title, subtitle, wide, onClose, children }) {
  const ref = useRef(null)
  const [closing, setClosing] = useState(false)
  useEffect(() => { ref.current?.showModal() }, [])

  const close = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => ref.current?.close(), 200)
  }

  return (
    <dialog ref={ref} className={`modal ${wide ? 'wide' : ''} ${closing ? 'closing' : ''}`} onClose={onClose}
      onCancel={(e) => { e.preventDefault(); close() }}
      onClick={(e) => { if (e.target === ref.current) close() }}>
      <div className="modal-head">
        <div><h2>{title}</h2>{subtitle && <p className="muted">{subtitle}</p>}</div>
        <button className="icon-btn" onClick={close} aria-label="Close">✕</button>
      </div>
      {typeof children === 'function' ? children(close) : children}
    </dialog>
  )
}
