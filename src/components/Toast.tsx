import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ToastProps {
  message: string | null
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: ToastProps) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!elRef.current) return
    const el = elRef.current
    if (message) {
      requestAnimationFrame(() => el.classList.add('show'))
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        el.classList.remove('show')
        onDismiss()
      }, 1800)
    } else {
      el.classList.remove('show')
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [message, onDismiss])

  return createPortal(
    <div className="toast" ref={elRef}>
      <span className="toast-dot" />
      {message}
    </div>,
    document.body
  )
}
