import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Shared slide-in drawer used by the cart & wishlist panels.
 */
export default function Drawer({ open, onClose, title, children, footer, width = 'max-w-md' }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute right-0 top-0 flex h-full w-full ${width} flex-col bg-canvas shadow-lift`}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl text-ink">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-primary hover:text-primary"
              >
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="border-t border-line px-6 py-5">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
