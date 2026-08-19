import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Consistent section heading — eyebrow + display title + optional
 * description and "view all" link.
 */
export default function SectionHeading({ eyebrow, title, description, to, align = 'left', linkLabel = 'View all' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col ${alignment}`}
      >
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="section-title max-w-xl">{title}</h2>
        {description && <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{description}</p>}
      </motion.div>
      {to && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="shrink-0"
        >
          <Link
            to={to}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-primary"
          >
            {linkLabel}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
