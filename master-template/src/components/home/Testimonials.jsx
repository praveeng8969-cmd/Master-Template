import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Star, BadgeCheck, Quote } from 'lucide-react'
import 'swiper/css'
import reviews from '../../data/reviews.json'
import SectionHeading from '../ui/SectionHeading'
import { formatDate } from '../../utils/format'

/**
 * Testimonials carousel — built from src/data/reviews.json.
 */
export default function Testimonials() {
  return (
    <section className="section">
      <SectionHeading
        eyebrow="Reviews"
        title="Loved by thousands"
        description="Real words from real customers — ratings we're genuinely proud of."
        align="center"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          grabCursor
          autoplay={{ delay: 4200, disableOnInteraction: true }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } }}
          className="!px-1 !py-2"
        >
          {reviews.slice(0, 9).map((r) => (
            <SwiperSlide key={r.id} className="h-auto !pb-2">
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface p-7 shadow-soft">
                <Quote size={26} className="text-primary/20" />
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-line'}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/90">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      {r.name}
                      {r.verified && <BadgeCheck size={14} className="text-emerald-500" />}
                    </p>
                    <p className="text-xs text-muted">{formatDate(r.date)}</p>
                  </div>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  )
}
