import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import Button from '../components/ui/Button'

/** 404 — playful lost-in-the-store page. */
export default function NotFound() {
  useScrollTop()

  return (
    <PageTransition>
      <div className="container-x flex flex-col items-center justify-center py-24 text-center lg:py-32">
        <motion.span
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-line bg-surface shadow-soft"
        >
          <Compass size={38} className="text-primary" />
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 font-display text-7xl font-bold text-primary sm:text-8xl"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl"
        >
          Looks like you're lost
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted"
        >
          The page you're looking for doesn't exist or has moved. Let's get you back to
          {siteConfig.storeName}'s best sellers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button to="/" variant="primary" size="lg">
            Back home
          </Button>
          <Button to="/shop" variant="outline" size="lg">
            Browse shop
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
