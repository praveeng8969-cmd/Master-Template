import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import { useToast } from '../context/ToastContext'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const cards = [
  { icon: MapPin, title: 'Visit us', lines: [siteConfig.contact.address] },
  { icon: Phone, title: 'Call us', lines: [siteConfig.contact.phone] },
  { icon: Mail, title: 'Email us', lines: [siteConfig.contact.email] },
  { icon: Clock, title: 'Opening hours', lines: [siteConfig.contact.hours] },
]

const emptyForm = { name: '', email: '', subject: '', message: '' }

/** Contact page — info cards, form and a map embed. */
export default function Contact() {
  useScrollTop()
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [sending, setSending] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast('Please fill in all required fields', 'error')
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setForm(emptyForm)
      toast('Message sent — we\'ll reply within 24h!', 'success')
    }, 1000)
  }

  return (
    <PageTransition>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink lg:text-5xl">Get in touch</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Questions, feedback or a bespoke order — we reply within one business day.
          </p>
        </div>
      </div>

      <div className="container-x py-12 lg:py-16">
        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-3xl border border-line bg-surface p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon size={19} />
              </span>
              <h3 className="mt-4 text-sm font-bold text-ink">{c.title}</h3>
              {c.lines.map((line) => (
                <p key={line} className="mt-1 text-xs leading-relaxed text-muted">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            onSubmit={submit}
            className="rounded-[2rem] border border-line bg-surface p-6 sm:p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-ink">Send a message</h2>
            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={set('name')} placeholder="Alex Morgan" />
                <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </div>
              <Input label="Subject" value={form.subject} onChange={set('subject')} placeholder="How can we help?" />
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={5}
                  placeholder="Tell us everything…"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" loading={sending} className="w-full sm:w-auto">
                Send message
              </Button>
            </div>
          </motion.form>

          {/* Map + WhatsApp */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-line"
            >
              <iframe
                title="Store location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.mapQuery)}&output=embed`}
                className="h-72 w-full border-0"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex items-center justify-between rounded-3xl bg-emerald-600 px-6 py-5 text-white"
            >
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <MessageCircle size={18} /> Prefer chat?
                </p>
                <p className="mt-1 text-xs text-white/80">Instant replies on WhatsApp, 9 AM – 9 PM.</p>
              </div>
              <Button
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20${encodeURIComponent(siteConfig.storeName)}!`}
                variant="white"
                size="sm"
              >
                Chat now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
