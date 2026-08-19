import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ImagePlus, X } from 'lucide-react'
import { useProducts, useCategories, addProduct, updateProduct } from '../../store/catalog'
import { useToast } from '../../context/ToastContext'
import { fileToDataUrl } from '../../utils/image'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  oldPrice: '',
  stock: '',
  image: '',
  extraImages: '',
  rating: '4.5',
  featured: false,
  popular: false,
  newArrival: false,
}

const badgeFromForm = (f) => {
  if (f.featured) return 'Best Seller'
  if (f.popular) return 'Popular'
  if (f.newArrival) return 'New Arrival'
  return ''
}

const formFromBadge = (badge) => ({
  featured: badge === 'Best Seller',
  popular: badge === 'Popular',
  newArrival: badge === 'New Arrival',
})

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
        checked ? 'border-primary/50 bg-primary/5 text-ink' : 'border-line text-muted hover:border-primary/30'
      }`}
    >
      {label}
      <span
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-primary' : 'bg-line'}`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

/** Add / edit product form — shared by /admin/products/add and /admin/products/edit/:id. */
export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const products = useProducts()
  const categories = useCategories()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const editing = useMemo(() => (isEdit ? products.find((p) => String(p.id) === id) : null), [isEdit, id, products])

  useEffect(() => {
    document.title = isEdit ? 'VortexNova Admin — Edit Product' : 'VortexNova Admin — Add Product'
  }, [isEdit])

  useEffect(() => {
    if (!editing) return
    setForm({
      name: editing.name || '',
      category: editing.category || '',
      description: editing.description || '',
      price: String(editing.price ?? ''),
      oldPrice: String(editing.oldPrice ?? ''),
      stock: String(editing.stock ?? ''),
      image: editing.images?.[0] || '',
      extraImages: (editing.images?.slice(1) || []).join('\n'),
      rating: String(editing.rating ?? '4.5'),
      ...formFromBadge(editing.badge),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const url = await fileToDataUrl(file)
      setForm((f) => ({ ...f, image: url }))
      toast('Image uploaded', 'success')
    } catch {
      toast('Could not read that image file', 'error')
    }
  }

  const handleExtraImages = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    try {
      const urls = await Promise.all(files.map((file) => fileToDataUrl(file)))
      setForm((f) => ({ ...f, extraImages: [f.extraImages, ...urls].filter(Boolean).join('\n') }))
      toast(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`, 'success')
    } catch {
      toast('Could not read those image files', 'error')
    }
  }

  const discount = useMemo(() => {
    const price = Number(form.price)
    const oldPrice = Number(form.oldPrice)
    if (!price || !oldPrice || oldPrice <= price) return 0
    return Math.round((1 - price / oldPrice) * 100)
  }, [form.price, form.oldPrice])

  if (isEdit && !editing) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-12 text-center">
        <p className="font-display text-xl text-ink">Product not found</p>
        <Link to="/admin/products" className="mt-3 inline-block text-sm font-semibold text-primary">
          Back to products
        </Link>
      </div>
    )
  }

  const valid = form.name.trim() && form.category && Number(form.price) > 0

  const submit = (e) => {
    e.preventDefault()
    if (!valid) {
      toast('Please fill in the required fields', 'error')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || 0,
      stock: Math.max(0, Number(form.stock) || 0),
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      reviewCount: editing?.reviewCount || 0,
      badge: badgeFromForm(form),
      tags: editing?.tags || [],
      short: editing?.short || form.description.trim().slice(0, 120),
      images: [
        form.image.trim(),
        ...form.extraImages
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      ].filter(Boolean),
      brand: editing?.brand || 'VortexNova',
      features: editing?.features || [],
      specs: editing?.specs || {},
    }

    setTimeout(() => {
      if (isEdit) {
        updateProduct(editing.id, payload)
        toast('Product updated successfully', 'success')
      } else {
        addProduct(payload)
        toast('Product added successfully', 'success')
      }
      setSaving(false)
      navigate('/admin/products')
    }, 350)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-primary"
        >
          <ChevronLeft size={15} /> Back to products
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="space-y-5">
          <Input
            label="Product name *"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. VortexNova Smart Speaker"
            required
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Category *
            </label>
            <select
              value={form.category}
              onChange={set('category')}
              required
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              placeholder="Describe the product…"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="Selling price (₹) *" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
            <Input label="Original price (₹)" type="number" min="0" step="0.01" value={form.oldPrice} onChange={set('oldPrice')} />
            <Input label="Stock quantity *" type="number" min="0" value={form.stock} onChange={set('stock')} />
          </div>

          <div className="rounded-2xl border border-line bg-canvas/50 px-4 py-3 text-sm text-muted">
            Discount:{' '}
            <span className="font-bold text-red-500">{discount > 0 ? `-${discount}%` : '—'}</span>
            <span className="ml-2 text-xs">(auto-calculated from the original price)</span>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Product image *
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary/40">
                <ImagePlus size={15} /> Upload from device
                <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: '' }))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition hover:underline"
                >
                  <X size={13} /> Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={set('image')}
              placeholder="…or paste an image URL (https://…)"
              className="mt-3 h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Image preview"
                className="mt-3 h-24 w-24 rounded-xl border border-line object-cover"
              />
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Additional images
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary/40">
              <ImagePlus size={15} /> Upload images from device
              <input type="file" accept="image/*" multiple onChange={handleExtraImages} className="hidden" />
            </label>
            <textarea
              value={form.extraImages}
              onChange={set('extraImages')}
              rows={2}
              placeholder="One image URL per line"
              className="mt-3 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <Input label="Rating (0–5)" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />

          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle label="Featured" checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            <Toggle label="Popular" checked={form.popular} onChange={(v) => setForm((f) => ({ ...f, popular: v }))} />
            <Toggle label="New Arrival" checked={form.newArrival} onChange={(v) => setForm((f) => ({ ...f, newArrival: v }))} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button to="/admin/products" variant="outline" size="lg" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" loading={saving}>
            {isEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}