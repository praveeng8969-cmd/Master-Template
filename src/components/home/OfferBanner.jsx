import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import banners from '../../data/banners.json'
import Button from '../ui/Button'
import SmartImage from '../ui/SmartImage'

/** Countdown ticking down to a rolling target ~3 days from first view. */
function useCountdown() {
  const target = useMemo(() => Date.now() + 3 * 24 * 60 * 60 * 1000, [])
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const pad = (n) => String(n).padStart(2, '0')

/**
 * Flash-sale banner with live countdown — content from banners.json.
 */
export default function OfferBanner() {
  const flash = banners.find((b) => b.type === 'flash') || banners[0]
  const { days, hours, minutes, seconds } = useCountdown()
  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Mins', value: minutes },
    { label: 'Secs', value: seconds },
  ]

  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br text-white ${flash.gradient}`}
      >
        <SmartImage
          src={flash.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative grid items-center gap-10 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Zap size={13} className="fill-current" />
              {flash.title}
            </span>
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">{flash.subtitle}</h2>

            <div className="mt-8 flex gap-3">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="flex min-w-[68px] flex-col items-center rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md"
                >
                  <span className="font-display text-3xl tabular-nums">{pad(u.value)}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-widest text-white/70">{u.label}</span>
                </div>
              ))}
            </div>

            <Button href={flash.link} variant="white" size="lg" className="mt-9">
              {flash.cta}
            </Button>
          </div>

          <div className="hidden lg:block">
            <p className="text-right font-display text-[11rem] leading-none opacity-20">40%</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
