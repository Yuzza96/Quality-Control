import { useEffect, useRef } from 'react'

// Native <dialog>: focus trap, Escape to close and backdrop come for free.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.showModal() }, [])

  return (
    <dialog ref={ref} className="modal" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) ref.current.close() }}>
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" onClick={() => ref.current.close()} aria-label="Close">✕</button>
      </div>
      {children}
    </dialog>
  )
}
