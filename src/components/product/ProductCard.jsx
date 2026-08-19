import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice, discountPercent } from '../../utils/format'
import Rating from '../ui/Rating'
import SmartImage from '../ui/SmartImage'

/**
 * Premium product card: hover image swap, discount badge, quick view,
 * wishlist toggle and add-to-cart slide-up actions.
 */
export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickView } = useStore()
  const { toast } = useToast()
  const [hovered, setHovered] = useState(false)
  const wished = isWishlisted(product.id)
  const discount = discountPercent(product)
  const outOfStock = product.stock === 0

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleWishlist(product)
    toast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info')
  }

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast(`${product.name} added to cart`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index % 8, 4) * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-3xl border border-line bg-surface transition-shadow duration-500 hover:shadow-card"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-line/30">
          <SmartImage
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
              hovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                -{discount}%
              </span>
            )}
            {product.badge && (
              <span className="rounded-full bg-neutral-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm dark:bg-white/90 dark:text-neutral-950">
                {product.badge}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
              wished
                ? 'border-red-200 bg-red-50 text-red-500 dark:bg-red-500/10'
                : 'border-line bg-surface/90 text-ink backdrop-blur-sm hover:border-red-200 hover:text-red-500'
            } ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-90 lg:opacity-0'}`}
          >
            <Heart size={15} className={wished ? 'fill-red-500' : ''} />
          </button>

          {/* Quick view */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setQuickView(product)
            }}
            aria-label="Quick view"
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-surface/95 px-5 py-2.5 text-xs font-semibold text-ink shadow-lift backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-[rgb(var(--primary-contrast))] ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Eye size={14} /> Quick View
          </button>

          {/* Add to cart */}
          <div
            className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950/90 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-neutral-950 dark:bg-white/90 dark:text-neutral-950 dark:hover:bg-white disabled:opacity-60"
            >
              <ShoppingBag size={14} />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{product.brand}</p>
            {product.tags?.slice(0, 1).map((t) => (
              <span key={t} className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                {t}
              </span>
            ))}
          </div>
          <h3 className="mt-1.5 line-clamp-1 text-sm font-semibold text-ink transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-1.5">
            <Rating value={product.rating} reviews={product.reviewCount} size={13} />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
