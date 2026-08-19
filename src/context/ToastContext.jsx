import { createContext, useContext, useState } from 'react'

/**
 * Toast notifications — lightweight, no backend.
 * Usage: const { toast } = useToast(); toast('Added to cart', 'success')
 */
const ToastContext = createContext(null)

let id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = (toastId) =>
    setToasts((t) => t.filter((t) => t.id !== toastId))

  const toast = (message, type = 'success') => {
    const toastId = ++id
    setToasts((t) => [...t, { id: toastId, message, type }])
    setTimeout(() => dismiss(toastId), 3200)
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
