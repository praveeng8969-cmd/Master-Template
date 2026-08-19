import { motion } from 'framer-motion'
import Breadcrumb from './Breadcrumb'

/**
 * Shared layout for legal pages (Privacy / Terms).
 * `sections` = [{ title, body: [paragraphs] }]
 */
export default function LegalLayout({ title, updated, sections }) {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumb items={[{ label: title }]} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-8 max-w-3xl"
      >
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">{title}</h1>
        <p className="mt-3 text-xs text-muted">Last updated: {updated}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">{s.title}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-muted">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
