import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Instagram, Facebook, Twitter, Youtube, Send,
  MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw,
} from 'lucide-react'
import { siteConfig } from '../../config/site'
import { useCategories, useSettings } from '../../store/catalog'
import { Logo } from './Logo'
import { useToast } from '../../context/ToastContext'

const socialIcons = [
  { key: 'instagram', icon: Instagram },
  { key: 'facebook', icon: Facebook },
  { key: 'twitter', icon: Twitter },
  { key: 'youtube', icon: Youtube },
]

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Checkout', to: '/checkout' },
]

export default function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const settings = useSettings()
  const categories = useCategories()

  const subscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setEmail('')
    toast('Subscribed! Welcome to the list.')
  }

  return (
    <footer className="border-t border-line bg-surface">
      {/* Trust strip */}
      <div className="border-b border-line">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free Shipping', text: `Orders over $${settings.freeShippingThreshold}` },
            { icon: RotateCcw, title: '30-Day Returns', text: 'No questions asked' },
            { icon: ShieldCheck, title: 'Secure Checkout', text: 'SSL encrypted payments' },
            { icon: Clock, title: 'Fast Support', text: 'Reply within 24h' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main columns */}
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {settings.tagline}. A carefully curated collection of premium products
            for everyday life — {siteConfig.about.intro.split('.')[0].toLowerCase()}.
          </p>
          <div className="mt-6 flex gap-2">
            {socialIcons.map(({ key, icon: Icon }) =>
              siteConfig.social[key] ? (
                <a
                  key={key}
                  href={siteConfig.social[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-[rgb(var(--primary-contrast))]"
                >
                  <Icon size={16} />
                </a>
              ) : null
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-muted transition hover:pl-1 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink">Categories</h4>
          <ul className="space-y-3">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className="text-sm text-muted transition hover:pl-1 hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest2 text-ink">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              {siteConfig.contact.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-primary" />
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="transition hover:text-primary">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-primary" />
              <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-primary">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="shrink-0 text-primary" />
              {siteConfig.contact.hours}
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center gap-5 py-10 lg:flex-row lg:justify-between">
          <div>
            <h4 className="font-display text-xl text-ink">Join our newsletter</h4>
            <p className="mt-1 text-sm text-muted">Get 10% off your first order, plus early access to drops.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-line bg-canvas px-5 text-sm text-ink outline-none transition focus:border-primary"
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p>Designed with care. Crafted for premium commerce.</p>
        </div>
      </div>
    </footer>
  )
}
