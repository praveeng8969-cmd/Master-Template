import { useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../../store/catalog'
import { formatPrice } from '../../utils/format'

/**
 * Desktop / mobile filter panel.
 * `filters` shape: { categories: [], brands: [], maxPrice: null, rating: 0, inStock: false }
 * `onChange` receives a partial patch object.
 */
export default function FilterSidebar({ filters, onChange, onClose }) {
  const products = useProducts()

  const categories = useMemo(() => {
    const counts = {}
    products.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1))
    return Object.entries(counts)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
  }, [products])

  const brands = useMemo(() => {
    const counts = {}
    products.forEach((p) => (counts[p.brand] = (counts[p.brand] || 0) + 1))
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [products])

  const prices = [50, 100, 250, 500]

  const toggle = (key, value) => {
    const list = filters[key] || []
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] })
  }

  const hasFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.maxPrice ||
    filters.rating > 0 ||
    filters.inStock

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="flex items-center gap-2 text-base font-bold text-ink">
          <SlidersHorizontal size={16} /> Filters
        </h3>
        <button
          onClick={onClose}
          aria-label="Close filters"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-primary"
        >
          <X size={16} />
        </button>
      </div>

      {hasFilters && (
        <button
          onClick={() => onChange({ categories: [], brands: [], maxPrice: null, rating: 0, inStock: false })}
          className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Category</h4>
        <div className="space-y-2.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center justify-between text-sm text-ink/90">
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c.slug)}
                  onChange={() => toggle('categories', c.slug)}
                  className="h-4 w-4 accent-[rgb(var(--primary))]"
                />
                <span className="capitalize">{c.slug.replace(/-/g, ' ')}</span>
              </span>
              <span className="text-xs text-muted">{c.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="border-t border-line pt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Brand</h4>
        <div className="space-y-2.5">
          {brands.slice(0, 8).map((b) => (
            <label key={b.name} className="flex cursor-pointer items-center justify-between text-sm text-ink/90">
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b.name)}
                  onChange={() => toggle('brands', b.name)}
                  className="h-4 w-4 accent-[rgb(var(--primary))]"
                />
                {b.name}
              </span>
              <span className="text-xs text-muted">{b.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-line pt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Max price</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ maxPrice: null })}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              !filters.maxPrice
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-line text-ink hover:border-primary'
            }`}
          >
            Any
          </button>
          {prices.map((p) => (
            <button
              key={p}
              onClick={() => onChange({ maxPrice: p })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filters.maxPrice === p
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-line text-ink hover:border-primary'
              }`}
            >
              Under {formatPrice(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="border-t border-line pt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ rating: filters.rating === r ? 0 : r })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filters.rating === r
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-line text-ink hover:border-primary'
              }`}
            >
              {r}★ & up
            </button>
          ))}
        </div>
      </div>

      {/* In stock */}
      <div className="border-t border-line pt-6">
        <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-ink">
          In stock only
          <span className="relative inline-flex">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onChange({ inStock: e.target.checked })}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-primary" />
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </div>
    </aside>
  )
}
