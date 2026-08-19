import { siteConfig } from '../config/site'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: siteConfig.currency,
  minimumFractionDigits: 2,
})

/** Format a number as the store's configured currency. */
export const formatPrice = (value) => formatter.format(value ?? 0)

/** Percentage saved between old and new price. */
export const discountPercent = (product) => {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
}

/** Human friendly date, e.g. "Jun 18, 2026". */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

/** Free shipping threshold logic used by cart + checkout. */
export const shippingCost = (subtotal) =>
  subtotal >= siteConfig.freeShippingThreshold || subtotal === 0
    ? 0
    : siteConfig.shippingFee

/** Total price for one cart item. */
export const lineTotal = (item) => item.product.price * item.qty
