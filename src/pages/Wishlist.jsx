import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { useScrollTop } from '../hooks/useScroll'
import { formatPrice, discountPercent } from '../utils/format'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'
import Rating from '../components/ui/Rating'
import SmartImage from '../components/ui/SmartImage'

/** Wishlist page — saved products with quick actions. */
export default function Wishlist() {
  useScrollTop()
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const { toast } = useToast()

  const moveToCart = (p) => {
    addToCart(p)
    toast(`${p.name} added to cart`, 'success')
  }

  if (wishlist.length === 0) {
    return (
      <PageTransition>
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
          <div className="mx-auto mt-16 max-w-md rounded-[2rem] border border-line bg-surface p-12 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart size={26} className="text-primary" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Your wishlist is empty</h1>
            <p className="mt-3 text-sm text-muted">
              Tap the heart on any product to save it here for later.
            </p>
            <Button to="/shop" variant="primary" size="lg" className="mt-8">
              Explore products
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container-x py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
          Your wishlist <span className="text-muted">({wishlist.length})</span>
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group overflow-hidden rounded-3xl border border-line bg-surface"
            >
              <Link to={`/product/${p.id}`} className="relative block aspect-square overflow-hidden">
                <SmartImage
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {discountPercent(p) > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    -{discountPercent(p)}%
                  </span>
                )}
              </Link>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{p.brand}</p>
                <Link to={`/product/${p.id}`} className="mt-1 block text-sm font-semibold text-ink hover:text-primary">
                  {p.name}
                </Link>
                <div className="mt-1.5">
                  <Rating value={p.rating} reviews={p.reviewCount} size={13} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-base font-bold text-ink">
                    {formatPrice(p.price)}
                    {p.oldPrice && <span className="ml-2 text-xs font-normal text-muted line-through">{formatPrice(p.oldPrice)}</span>}
                  </p>
                  <button
                    onClick={() => {
                      toggleWishlist(p)
                      toast('Removed from wishlist', 'info')
                    }}
                    aria-label="Remove from wishlist"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <button
                  onClick={() => moveToCart(p)}
                  disabled={p.stock === 0}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-950"
                >
                  <ShoppingBag size={14} />
                  {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
