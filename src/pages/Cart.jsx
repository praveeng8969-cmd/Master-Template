import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, Tag, TicketPercent } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { useScrollTop } from '../hooks/useScroll'
import { siteConfig } from '../config/site'
import { formatPrice, lineTotal, shippingCost } from '../utils/format'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import QuantityStepper from '../components/ui/QuantityStepper'
import SmartImage from '../components/ui/SmartImage'

/** Cart page — line items, coupon codes and order summary. */
export default function Cart() {
  useScrollTop()
  const { cartItems, subtotal, updateQty, removeFromCart, clearCart } = useStore()
  const { toast } = useToast()
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)

  const freeShippingProgress = Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100)
  const leftForFree = siteConfig.freeShippingThreshold - subtotal
  const discount = applied
    ? applied.type === 'shipping'
      ? shippingCost(subtotal)
      : (subtotal * applied.value) / 100
    : 0
  const shipping = shippingCost(subtotal - discount)
  const tax = (subtotal - discount) * siteConfig.taxRate
  const total = subtotal - discount + shipping + tax

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    const found = siteConfig.couponCodes[code]
    if (!found) {
      toast(`Coupon "${code || '…'}" is invalid`, 'error')
      return
    }
    setApplied({ code, ...found })
    toast(`Coupon ${code} applied — ${found.label}`, 'success')
  }

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'Cart' }]} />
          <div className="mx-auto mt-16 max-w-md rounded-[2rem] border border-line bg-surface p-12 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Tag size={26} className="text-primary" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Your cart is empty</h1>
            <p className="mt-3 text-sm text-muted">Looks like you haven't added anything yet. Let's fix that.</p>
            <Button to="/shop" variant="primary" size="lg" className="mt-8">
              Start shopping
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
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <div className="mt-4 flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
            Your cart <span className="text-muted">({cartItems.length})</span>
          </h1>
          <button
            onClick={() => {
              clearCart()
              toast('Cart cleared', 'info')
            }}
            className="text-xs font-semibold text-muted underline-offset-4 hover:text-red-500 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-4">
            {/* Free shipping progress */}
            <div className="rounded-3xl border border-line bg-surface p-5">
              <p className="text-sm text-ink">
                {leftForFree > 0 ? (
                  <>
                    You're <span className="font-bold text-primary">{formatPrice(leftForFree)}</span> away from free
                    shipping
                  </>
                ) : (
                  <span className="font-bold text-emerald-600">You've unlocked free shipping!</span>
                )}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-3xl border border-line bg-surface p-4 sm:gap-5 sm:p-5"
              >
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <SmartImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                        {item.product.brand}
                      </p>
                      <Link to={`/product/${item.id}`} className="mt-0.5 block text-sm font-semibold text-ink hover:text-primary">
                        {item.product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id)
                        toast('Removed from cart', 'info')
                      }}
                      aria-label={`Remove ${item.product.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-red-200 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <QuantityStepper
                      value={item.qty}
                      onChange={(q) => updateQty(item.id, q)}
                      max={item.product.stock}
                      size="sm"
                    />
                    <div className="text-right">
                      {item.product.oldPrice && (
                        <p className="text-xs text-muted line-through">
                          {formatPrice(item.product.oldPrice * item.qty)}
                        </p>
                      )}
                      <p className="text-base font-bold text-ink">{formatPrice(lineTotal(item))}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-[2rem] border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold text-ink">Order summary</h2>

            {/* Coupon */}
            <div className="mt-5 flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="h-11"
              />
              <Button onClick={applyCoupon} variant="outline" className="h-11 shrink-0">
                Apply
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              <TicketPercent size={12} className="mr-1 inline" />
              Try WELCOME10, SAVE20 or FREESHIP
            </p>

            {applied && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10">
                {applied.code} applied — {applied.label}
              </p>
            )}

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>Discount</dt>
                  <dd className="font-semibold">-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-semibold text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Tax ({Math.round(siteConfig.taxRate * 100)}%)</dt>
                <dd className="font-semibold text-ink">{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-display text-xl font-bold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button to="/checkout" variant="primary" size="lg" className="mt-6 w-full">
              Proceed to checkout
              <ArrowRight size={16} />
            </Button>
            <Button to="/shop" variant="ghost" size="md" className="mt-2 w-full">
              Continue shopping
            </Button>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
