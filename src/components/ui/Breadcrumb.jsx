import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Breadcrumb navigation: Home / Parent / Current.
 * Pass `items` as [{ label, to? }].
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-muted"
    >
      <Link to="/" className="flex items-center gap-1 transition hover:text-primary">
        <Home size={13} />
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="text-muted/50" />
          {item.to ? (
            <Link to={item.to} className="transition hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </motion.nav>
  )
}
