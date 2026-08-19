import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { useCategories, useSettings } from '../../store/catalog'
import Button from '../ui/Button'
import SmartImage from '../ui/SmartImage'

/**
 * Full-width hero: soft gradient canvas with animated orbs and a large
 * clean product image. Content comes from siteConfig.hero.
 */
export default function Hero() {
  const { headline, subheadline, primaryCta, secondaryCta } = siteConfig.hero
  const settings = useSettings()
  const categories = useCategories()
  const firstCat = categories[0]

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 lg:pt-36">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[130px]"
        />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="container-x relative grid items-center gap-14 pb-20 lg:grid-cols-2 lg:pb-28">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-muted"
          >
            <Sparkles size={13} className="text-primary" />
            {settings.tagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            {headline.split('\n').map((line, i) => (
              <span key={i} className={i === 0 ? 'block' : 'block text-primary'}>
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button to={primaryCta.link} variant="primary" size="lg">
              {primaryCta.label}
              <ArrowRight size={16} />
            </Button>
            <Button to={secondaryCta.link} variant="outline" size="lg">
              {secondaryCta.label}
            </Button>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift"
          >
            <SmartImage
              src={firstCat?.image}
              alt={firstCat?.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}