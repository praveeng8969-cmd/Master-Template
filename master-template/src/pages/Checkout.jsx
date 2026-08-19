import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, CreditCard, PackageCheck, ShieldCheck } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { addOrder } from '../store/catalog'
import { useScrollTop } from '../hooks/useScroll'
import { siteConfig } from '../config/site'
import { formatPrice, shippingCost } from '../utils/format'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SmartImage from '../components/ui/SmartImage'

const STEPS = ['Shipping', 'Payment', 'Review']

const emptyForm = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  country: 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

/** Checkout — 3-step flow with an animated success screen. */
export default function Checkout() {
  useScrollTop()
  const { cartItems, subtotal, clearCart } = useStore()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [placing, setPlacing] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const shipping = shippingCost(subtotal)
  const tax = subtotal * siteConfig.taxRate
  const total = subtotal + shipping + tax
  const orderNo = `AUR-${Math.floor(100000 + Math.random() * 900000)}`

  const shippingValid = form.email && form.firstName && form.lastName && form.address && form.city && form.zip
  const paymentValid = form.cardName && form.cardNumber && form.expiry && form.cvc

  const placeOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      addOrder({
        id: orderNo,
        customer: { name: `${form.firstName} ${form.lastName}`, email: form.email },
        date: new Date().toISOString(),
        items: cartItems.map((i) => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
        total: Math.round(total * 100) / 100,
        payment: 'Card',
        status: 'Pending',
        address: `${form.address}, ${form.city} ${form.zip}, ${form.country}`,
      })
      setPlacing(false)
      setDone(true)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast('Order placed successfully!', 'success')
    }, 1200)
  }

  /* ---------- Success screen ---------- */
  if (done) {
    return (
      <PageTransition>
        <div className="container-x py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            className="mx-auto max-w-lg rounded-[2rem] border border-line bg-surface p-10 text-center sm:p-14"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 12 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15"
            >
              <Check size={36} />
            </motion.span>
            <h1 className="mt-7 font-display text-3xl font-semibold text-ink sm:text-4xl">Thank you!</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Your order <span className="font-bold text-ink">{orderNo}</span> has been placed. A confirmation email
              is on its way to <span className="font-semibold text-ink">{form.email}</span>.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line p-5 text-left text-xs text-muted">
              <div>
                <p className="uppercase tracking-widest">Delivery to</p>
                <p className="mt-1.5 font-semibold text-ink">{form.firstName} {form.lastName}</p>
                <p>{form.address}, {form.city} {form.zip}</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-widest">Total paid</p>
                <p className="mt-1.5 font-display text-xl font-bold text-ink">{formatPrice(total)}</p>
                <p>Paid via {form.cardName.split(' ').slice(-1)[0] || 'card'}</p>
              </div>
            </div>
            <Button to="/shop" variant="primary" size="lg" className="mt-8 w-full">
              Continue shopping
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  /* ---------- Empty cart guard ---------- */
  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'Checkout' }]} />
          <div className="mx-auto mt-16 max-w-md rounded-[2rem] border border-line bg-surface p-12 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PackageCheck size={26} className="text-primary" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Nothing to checkout</h1>
            <p className="mt-3 text-sm text-muted">Your cart is empty — add some products first.</p>
            <Button to="/shop" variant="primary" size="lg" className="mt-8">
              Browse products
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container-x py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">Checkout</h1>

        {/* Stepper */}
        <ol className="mt-8 flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  i === step
                    ? 'border-primary bg-primary text-[rgb(var(--primary-contrast))]'
                    : i < step
                      ? 'border-primary/40 text-primary'
                      : 'border-line text-muted'
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${i < step ? 'bg-primary text-[rgb(var(--primary-contrast))]' : i === step ? 'bg-white/20' : 'bg-line/60'}`}>
                  {i < step ? <Check size={11} /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-12" />}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            {step === 0 && (
              <div className="space-y-5 rounded-[2rem] border border-line bg-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-ink">Shipping details</h2>
                <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="First name" value={form.firstName} onChange={set('firstName')} placeholder="Alex" />
                  <Input label="Last name" value={form.lastName} onChange={set('lastName')} placeholder="Morgan" />
                </div>
                <Input label="Street address" value={form.address} onChange={set('address')} placeholder="128 Madison Avenue" />
                <div className="grid gap-5 sm:grid-cols-3">
                  <Input label="City" value={form.city} onChange={set('city')} placeholder="New York" />
                  <Input label="ZIP code" value={form.zip} onChange={set('zip')} placeholder="10016" />
                  <Input label="Country" value={form.country} onChange={set('country')} placeholder="United States" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 rounded-[2rem] border border-line bg-surface p-6 sm:p-8">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
                  <CreditCard size={20} className="text-primary" /> Payment
                </h2>
                <Input label="Name on card" value={form.cardName} onChange={set('cardName')} placeholder="Alex Morgan" />
                <Input
                  label="Card number"
                  value={form.cardNumber}
                  onChange={set('cardNumber')}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Expiry" value={form.expiry} onChange={set('expiry')} placeholder="MM/YY" />
                  <Input label="CVC" value={form.cvc} onChange={set('cvc')} placeholder="123" inputMode="numeric" />
                </div>
                <p className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-xs text-muted">
                  <ShieldCheck size={15} className="shrink-0 text-primary" />
                  Demo checkout — no real payment is processed. This is dummy data.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-ink">Review your order</h2>
                <div className="mt-5 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <SmartImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">{item.product.name}</p>
                        <p className="text-xs text-muted">Qty {item.qty} × {formatPrice(item.product.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-ink">{formatPrice(item.product.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 rounded-2xl border border-line p-5 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">Ship to</p>
                    <p className="mt-1.5 font-semibold text-ink">{form.firstName} {form.lastName}</p>
                    <p className="text-xs text-muted">{form.address}, {form.city} {form.zip}, {form.country}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">Payment</p>
                    <p className="mt-1.5 font-semibold text-ink">
                      {form.cardName} ···· {form.cardNumber.replace(/\s/g, '').slice(-4)}
                    </p>
                    <p className="text-xs text-muted">Expires {form.expiry}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              {step > 0 ? (
                <Button onClick={() => setStep(step - 1)} variant="ghost">
                  <ChevronLeft size={16} /> Back
                </Button>
              ) : (
                <Button to="/cart" variant="ghost">
                  <ChevronLeft size={16} /> Back to cart
                </Button>
              )}
              {step < 2 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  variant="primary"
                  size="lg"
                  disabled={step === 0 ? !shippingValid : !paymentValid}
                >
                  Continue
                </Button>
              ) : (
                <Button onClick={placeOrder} variant="primary" size="lg" loading={placing}>
                  Place order — {formatPrice(total)}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Summary */}
          <aside className="h-fit rounded-[2rem] border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold text-ink">Summary</h2>
            <div className="mt-5 max-h-56 space-y-3 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <SmartImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-xs font-semibold text-ink">{item.product.name}</p>
                    <p className="text-[11px] text-muted">×{item.qty}</p>
                  </div>
                  <p className="text-xs font-bold text-ink">{formatPrice(item.product.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-semibold text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="font-semibold text-ink">{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-base">
                <dt className="font-bold text-ink">Total</dt>
                <dd className="font-display text-xl font-bold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-center gap-2 text-[11px] text-muted">
              <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
              256-bit SSL encrypted — demo only, no real charges.
            </p>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
