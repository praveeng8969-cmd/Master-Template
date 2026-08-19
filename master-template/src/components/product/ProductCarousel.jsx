import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Horizontal product carousel powered by Swiper.
 * Pair with a SectionHeading that includes a "View all" link.
 */
export default function ProductCarousel({ products, id = 'carousel', slidesPerView = { xs: 1.4, sm: 2.4, lg: 4 }, navigation = true }) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={1.3}
        grabCursor
        autoplay={{ delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true }}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: slidesPerView.sm ?? 2.4 },
          1024: { slidesPerView: slidesPerView.lg ?? 4 },
          1280: { slidesPerView: 4.2 },
        }}
        navigation={
          navigation
            ? {
                nextEl: `.car-next-${id}`,
                prevEl: `.car-prev-${id}`,
              }
            : false
        }
        className="!px-1 !py-2"
      >
        {products.map((p, i) => (
          <SwiperSlide key={p.id} className="h-auto !pb-2">
            <ProductCard product={p} index={i} />
          </SwiperSlide>
        ))}
      </Swiper>

      {navigation && products.length > 4 && (
        <div className="absolute -top-1 right-0 z-10 flex gap-2">
          <button
            aria-label="Previous"
            className={`car-prev-${id} flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft transition hover:border-primary hover:text-primary`}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label="Next"
            className={`car-next-${id} flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft transition hover:border-primary hover:text-primary`}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  )
}
