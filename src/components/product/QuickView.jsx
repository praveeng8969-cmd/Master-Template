import { useState } from 'react'
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice, discountPercent } from '../../utils/format'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Rating from '../ui/Rating'
import QuantityStepper from '../ui/QuantityStepper'
import SmartImage from '../ui/SmartImage'

/**
 * Quick-view product modal — opened from product cards
 * via StoreContext.quickView / setQuickView.
 */
export default function QuickView() {
  const { quickView, setQuickView, addToCart, toggleWishlist, isWishlisted } = useStore()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)

  const close = () => {
    setQuickView(null)
    setQty(1)
  }

  if (!quickView) return null
  const p = quickView
  const wished = isWishlisted(p.id)
  const discount = discountPercent(p)

  const handleAdd = () => {
    addToCart(p, qty)
    toast(`${p.name} added to cart`, 'success')
    close()
  }

  const handleWishlist = () => {
    const added = toggleWishlist(p)
    toast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info')
  }

  return (
    <Modal open onClose={close} size="lg" hideClose>
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-line/30 md:aspect-auto md:min-h-[420px]">
          <SmartImage src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              -{discount}%
            </span>
          )}
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-soft backdrop-blur-sm transition ${
              wished
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-line bg-surface/90 text-ink hover:border-red-200 hover:text-red-500'
            }`}
          >
            <Heart size={16} className={wished ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{p.brand}</p>
          <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{p.name}</h3>
          <div className="mt-3">
            <Rating value={p.rating} reviews={p.reviewCount} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-ink">{formatPrice(p.price)}</span>
            {p.oldPrice && (
              <span className="text-sm text-muted line-through">{formatPrice(p.oldPrice)}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{p.short}</p>

          {p.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={p.stock} />
            <Button onClick={handleAdd} variant="primary" className="flex-1" disabled={p.stock === 0}>
              <ShoppingBag size={16} />
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 border-t border-line pt-6 text-xs text-muted">
            <p className="flex items-center gap-2.5">
              <Truck size={15} className="shrink-0 text-primary" /> Free shipping on orders over $99
            </p>
            <p className="flex items-center gap-2.5">
              <RotateCcw size={15} className="shrink-0 text-primary" /> 30-day easy returns
            </p>
            <p className="flex items-center gap-2.5">
              <ShieldCheck size={15} className="shrink-0 text-primary" /> Secure checkout, always
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
