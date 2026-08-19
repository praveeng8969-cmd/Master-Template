import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-sky-500" />,
}

/** Renders the toast stack fixed to the bottom of the viewport. */
export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3.5 text-left shadow-lift backdrop-blur-xl"
          >
            {icons[t.type] || icons.success}
            <span className="flex-1 text-sm font-medium text-ink">{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
