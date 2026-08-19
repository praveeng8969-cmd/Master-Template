import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronRight, Check } from 'lucide-react'
import { useProducts } from '../store/catalog'
import reviewsData from '../data/reviews.json'
import { useScrollTop } from '../hooks/useScroll'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatPrice, discountPercent } from '../utils/format'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Rating from '../components/ui/Rating'
import Button from '../components/ui/Button'
import QuantityStepper from '../components/ui/QuantityStepper'
import SmartImage from '../components/ui/SmartImage'
import SectionHeading from '../components/ui/SectionHeading'
import ProductCarousel from '../components/product/ProductCarousel'

const TABS = ['Description', 'Features', 'Specifications']

/** Product detail page — gallery, tabs, related & recently viewed. */
export default function ProductDetails() {
  useScrollTop()
  const { id } = useParams()
  const products = useProducts()
  const product = products.find((p) => String(p.id) === id)

  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const { toast } = useToast()
  const [recent, setRecent] = useLocalStorage('vortexnova_recent', [])

  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [tab, setTab] = useState('Description')

  useEffect(() => {
    if (!product) return
    setActiveImg(0)
    setTab('Description')
    setQty(1)
    setRecent((prev) => [product.id, ...prev.filter((i) => i !== product.id)].slice(0, 8))
  }, [id, product, setRecent])

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 12),
    [product]
  )
  const recentlyViewed = useMemo(
    () => recent.map((rid) => products.find((p) => p.id === rid)).filter(Boolean).slice(0, 12),
    [recent]
  )
  const reviews = reviewsData.filter((r) => r.productId === product?.id)

  if (!product) {
    return (
      <PageTransition>
        <div className="container-x py-24 text-center">
          <p className="font-display text-3xl text-ink">Product not found</p>
          <Button to="/shop" variant="primary" size="lg" className="mt-6">
            Back to shop
          </Button>
        </div>
      </PageTransition>
    )
  }

  const wished = isWishlisted(product.id)
  const discount = discountPercent(product)

  const handleWishlist = () => {
    const added = toggleWishlist(product)
    toast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info')
  }

  const handleAdd = () => {
    addToCart(product, qty)
    toast(`${product.name} added to cart`, 'success')
  }

  return (
    <PageTransition>
      <div className="container-x py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.category, to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        {/* Top: gallery + info */}
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-surface"
            >
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className={`h-full w-full object-cover transition-transform duration-500 ${
                  zoom ? 'scale-125 cursor-zoom-in' : 'scale-100'
                }`}
              />
              {discount > 0 && (
                <span className="absolute left-5 top-5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  -{discount}%
                </span>
              )}
              {product.badge && (
                <span className="absolute right-5 top-5 rounded-full bg-neutral-950/85 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm dark:bg-white/90 dark:text-neutral-950">
                  {product.badge}
                </span>
              )}
            </motion.div>

            {/* Thumbs */}
            <div className="mt-4 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`w-20 overflow-hidden rounded-2xl border-2 transition ${
                    activeImg === i ? 'border-primary' : 'border-line hover:border-primary/40'
                  }`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{product.brand}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Rating value={product.rating} reviews={product.reviewCount} showValue size={16} />
              <span className="text-xs text-muted">·</span>
              <span className={`text-xs font-semibold ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-ink">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-muted line-through">{formatPrice(product.oldPrice)}</span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-500/10">
                  Save {formatPrice(product.oldPrice - product.price)}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="rounded-full bg-primary/5 px-3.5 py-1.5 text-[11px] font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Qty + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
              <Button
                onClick={handleAdd}
                variant="primary"
                size="lg"
                className="min-w-[220px] flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingBag size={16} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <button
                onClick={handleWishlist}
                aria-label="Toggle wishlist"
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border transition ${
                  wished
                    ? 'border-red-200 bg-red-50 text-red-500 dark:bg-red-500/10'
                    : 'border-line text-ink hover:border-red-200 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={wished ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-1 gap-3 rounded-3xl border border-line bg-surface p-6 text-xs text-muted sm:grid-cols-3">
              <p className="flex items-center gap-2.5">
                <Truck size={16} className="shrink-0 text-primary" /> Free shipping over ₹99
              </p>
              <p className="flex items-center gap-2.5">
                <RotateCcw size={16} className="shrink-0 text-primary" /> 30-day returns
              </p>
              <p className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="shrink-0 text-primary" /> Secure checkout
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  tab === t ? 'bg-primary text-[rgb(var(--primary-contrast))]' : 'text-muted hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === 'Description' && (
              <p className="max-w-3xl text-sm leading-relaxed text-ink/85">{product.description}</p>
            )}
            {tab === 'Features' && (
              <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'Specifications' && (
              <dl className="max-w-xl divide-y divide-line">
                {Object.entries(product.specs || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-6 py-3.5">
                    <dt className="text-sm font-semibold text-ink">{k}</dt>
                    <dd className="text-sm text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <SectionHeading eyebrow="Reviews" title={`What customers say (${reviews.length})`} />
          {reviews.length === 0 ? (
            <p className="rounded-3xl border border-line bg-surface p-10 text-center text-sm text-muted">
              No reviews yet — be the first to review this product.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.id} className="rounded-3xl border border-line bg-surface p-6">
                  <Rating value={r.rating} size={14} />
                  <p className="mt-3 text-sm font-semibold text-ink">{r.title}</p>
                  <blockquote className="mt-1.5 text-sm leading-relaxed text-muted">“{r.text}”</blockquote>
                  <figcaption className="mt-4 text-xs font-medium text-muted">
                    {r.name} {r.verified && <span className="text-emerald-600">· Verified buyer</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        <section className="mt-16">
          <SectionHeading eyebrow="You may also like" title="Related products" to={`/shop?category=${product.category}`} />
          <ProductCarousel products={related.length ? related : products.slice(0, 8)} id="related" />
        </section>

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Keep browsing" title="Recently viewed" />
            <ProductCarousel products={recentlyViewed} id="recent" />
          </section>
        )}
      </div>
    </PageTransition>
  )
}
