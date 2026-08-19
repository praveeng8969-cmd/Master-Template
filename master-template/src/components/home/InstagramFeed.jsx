import { motion } from 'framer-motion'
import { Instagram as InstagramIcon } from 'lucide-react'
import { useProducts } from '../../store/catalog'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'
import { siteConfig } from '../../config/site'

const instaImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512353087810-25dfcd100962?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
]

/**
 * Instagram-style photo strip with hover overlay.
 */
export default function InstagramFeed() {
  const products = useProducts()
  const fallback = products.slice(0, 6).map((p) => p.images[0])

  return (
    <section className="section">
      <SectionHeading
        eyebrow="@vortexnova.store"
        title="Follow the feed"
        description="Tag us to get featured — and be first to see new drops."
        align="center"
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-6">
        {instaImages.map((src, i) => (
          <motion.a
            key={i}
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative block aspect-square overflow-hidden rounded-2xl"
          >
            <SmartImage
              src={src || fallback[i]}
              alt="Instagram post"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <InstagramIcon size={22} className="text-white" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
