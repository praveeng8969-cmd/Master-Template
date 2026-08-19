import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Centered modal dialog with backdrop blur and scale-in animation.
 */
export default function Modal({ open, onClose, children, title, size = 'md', hideClose = false }) {
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`relative w-full ${widths[size]} max-h-[90vh] overflow-y-auto rounded-3xl bg-surface shadow-lift`}
            role="dialog"
            aria-modal="true"
          >
            {(title || !hideClose) && (
              <div className="flex items-center justify-between border-b border-line px-6 py-4 sticky top-0 bg-surface z-10 rounded-t-3xl">
                <h3 className="font-display text-xl text-ink">{title}</h3>
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-primary hover:text-primary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
