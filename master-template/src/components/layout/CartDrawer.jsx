import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'
import { formatPrice, shippingCost } from '../../utils/format'
import { siteConfig } from '../../config/site'
import Drawer from '../ui/Drawer'
import QuantityStepper from '../ui/QuantityStepper'
import SmartImage from '../ui/SmartImage'

/** Slide-in cart panel with editable quantities and totals. */
export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, subtotal } = useStore()
  const { toast } = useToast()

  const shipping = shippingCost(subtotal)
  const freeShippingLeft = siteConfig.freeShippingThreshold - subtotal

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title={`Your Cart (${cart.length})`}
      footer={
        cart.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-full border border-line text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              View Full Cart
            </Link>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-line/50 text-muted">
            <ShoppingBag size={28} />
          </span>
          <p className="font-display text-lg text-ink">Your cart is empty</p>
          <p className="max-w-xs text-sm text-muted">Browse the collection and add something you love.</p>
          <Link
            to="/shop"
            onClick={() => setCartOpen(false)}
            className="mt-2 flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[rgb(var(--primary-contrast))]"
          >
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {freeShippingLeft > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs text-muted">
                Add <span className="font-semibold text-primary">{formatPrice(freeShippingLeft)}</span> more for{' '}
                <span className="font-semibold text-ink">free shipping</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <Link to={`/product/${item.product.id}`} onClick={() => setCartOpen(false)} className="shrink-0">
                <SmartImage
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-24 w-20 rounded-2xl border border-line object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={() => setCartOpen(false)}
                    className="text-sm font-semibold leading-snug text-ink transition hover:text-primary"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => {
                      removeFromCart(item.id)
                      toast('Removed from cart', 'info')
                    }}
                    aria-label="Remove"
                    className="text-muted transition hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="mt-0.5 text-xs text-muted">{item.product.brand}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QuantityStepper
                    size="sm"
                    value={item.qty}
                    max={item.product.stock}
                    onChange={(q) => updateQty(item.id, q)}
                  />
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
