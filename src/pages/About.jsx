import { motion } from 'framer-motion'
import { Award, Globe, HeartHandshake, Leaf } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import Testimonials from '../components/home/Testimonials'
import BrandSlider from '../components/home/BrandSlider'

const values = [
  { icon: Leaf, title: 'Sustainable sourcing', text: 'Responsibly made, ethically sourced — we audit every partner.' },
  { icon: HeartHandshake, title: 'Customer first', text: 'Real humans on support, 7 days a week. No bots, no scripts.' },
  { icon: Globe, title: 'Worldwide delivery', text: 'Shipping to 38 countries with tracked, insured parcels.' },
  { icon: Award, title: 'Quality guarantee', text: 'Every product passes a 12-point inspection before it ships.' },
]

/** About page — story, stats, values and brand trust signals. */
export default function About() {
  useScrollTop()

  return (
    <PageTransition>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'About' }]} />
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink lg:text-5xl">Our story</h1>
        </div>
      </div>

      <div className="container-x py-12 lg:py-20">
        {/* Story */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Since {siteConfig.about.stats[0].value}</span>
            <h2 className="section-title mt-3">{siteConfig.storeName} began with one simple belief</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">{siteConfig.about.intro}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{siteConfig.about.mission}</p>
            <Button to="/shop" variant="primary" size="lg" className="mt-8">
              Shop the collection
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2rem] shadow-lift"
          >
            <SmartImage
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop"
              alt="Inside the studio"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {siteConfig.about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl border border-line bg-surface p-7 text-center"
            >
              <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="What we stand for"
            title="Values that guide every order"
            align="center"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-3xl border border-line bg-surface p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <v.icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BrandSlider />
      <div className="container-x">
        <Testimonials />
      </div>
    </PageTransition>
  )
}
