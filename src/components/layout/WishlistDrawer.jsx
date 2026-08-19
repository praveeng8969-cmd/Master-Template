import { Link } from 'react-router-dom'
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice } from '../../utils/format'
import Drawer from '../ui/Drawer'
import SmartImage from '../ui/SmartImage'

/** Slide-in wishlist panel. */
export default function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } = useStore()
  const { toast } = useToast()

  return (
    <Drawer
      open={wishlistOpen}
      onClose={() => setWishlistOpen(false)}
      title={`Wishlist (${wishlist.length})`}
    >
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-line/50 text-muted">
            <Heart size={28} />
          </span>
          <p className="font-display text-lg text-ink">Nothing saved yet</p>
          <p className="max-w-xs text-sm text-muted">Tap the heart on any product to keep it here.</p>
          <Link
            to="/shop"
            onClick={() => setWishlistOpen(false)}
            className="mt-2 flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[rgb(var(--primary-contrast))]"
          >
            Discover Products <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlist.map((p) => (
            <div key={p.id} className="flex gap-4">
              <Link to={`/product/${p.id}`} onClick={() => setWishlistOpen(false)} className="shrink-0">
                <SmartImage
                  src={p.images[0]}
                  alt={p.name}
                  className="h-24 w-20 rounded-2xl border border-line object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${p.id}`}
                    onClick={() => setWishlistOpen(false)}
                    className="text-sm font-semibold leading-snug text-ink transition hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <button
                    onClick={() => {
                      toggleWishlist(p)
                      toast('Removed from wishlist', 'info')
                    }}
                    aria-label="Remove"
                    className="text-red-500 transition hover:scale-110"
                  >
                    <Heart size={15} className="fill-red-500" />
                  </button>
                </div>
                <p className="mt-0.5 text-xs text-muted">{p.brand}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-ink">{formatPrice(p.price)}</span>
                  <button
                    onClick={() => {
                      addToCart(p)
                      setWishlistOpen(false)
                      toast('Added to cart')
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
                  >
                    <ShoppingBag size={13} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
