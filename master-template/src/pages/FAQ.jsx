import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'

const faqs = [
  {
    q: 'How long does shipping take?',
    a: `Standard shipping takes 3–5 business days within the US and 7–12 days internationally. Orders over ${siteConfig.currency === 'USD' ? '$' : ''}${siteConfig.freeShippingThreshold} ship free, and every order gets a tracking link the moment it leaves our warehouse.`,
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day money-back guarantee. If you are not completely satisfied, return the item in its original condition for a full refund — no questions asked, and we even cover return shipping on defective items.',
  },
  {
    q: 'How do I apply a coupon code?',
    a: 'Add items to your cart, open the cart page and enter your coupon in the "Coupon code" field, then press Apply. The discount updates instantly. Only one coupon can be used per order.',
  },
  {
    q: 'Do you ship internationally?',
    a: `Yes — we ship to 38 countries. International orders typically arrive in 7–12 business days and include full customs documentation. Duties and taxes are calculated at checkout where applicable.`,
  },
  {
    q: 'Can I track my order?',
    a: 'Absolutely. As soon as your order ships you receive an email with a tracking link. You can also contact us any time with your order number and we will pull up the latest status for you.',
  },
  {
    q: 'Are the products authentic?',
    a: 'Every product is sourced directly from the manufacturer or an authorised distributor. We inspect each piece in-house before it ships, and we back that with a 12-month quality guarantee.',
  },
  {
    q: 'How do I contact support?',
    a: `Email us at ${siteConfig.contact.email}, call ${siteConfig.contact.phone}, or use the WhatsApp button — our team replies within one business day, usually much faster.`,
  },
]

/** FAQ page — accordion, searchable by mental model, plus a contact CTA. */
export default function FAQ() {
  useScrollTop()
  const [open, setOpen] = useState(0)

  return (
    <PageTransition>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink lg:text-5xl">Frequently asked questions</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">Everything you need to know about ordering, shipping and returns.</p>
        </div>
      </div>

      <div className="container-x py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
                className={`overflow-hidden rounded-3xl border transition-colors ${isOpen ? 'border-primary/40 bg-surface' : 'border-line bg-surface hover:border-primary/30'}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink sm:text-base">{f.q}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen ? 'rotate-45 border-primary bg-primary text-[rgb(var(--primary-contrast))]' : 'border-line text-muted'
                    }`}
                  >
                    <Plus size={15} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-14 max-w-3xl rounded-[2rem] bg-neutral-950 px-8 py-10 text-center text-white dark:bg-white dark:text-neutral-950"
        >
          <HelpCircle size={26} className="mx-auto opacity-60" />
          <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm opacity-70">Our support team is happy to help — reach out any time.</p>
          <Button to="/contact" variant="white" size="lg" className="mt-6">
            Contact support
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
