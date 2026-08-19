import { SlidersHorizontal } from 'lucide-react'

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
]

/**
 * Toolbar above the product grid: result count, sort select and
 * a mobile "filters" toggle button.
 */
export default function SortBar({ count, sort, onSort, onToggleFilters }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">{count}</span> {count === 1 ? 'product' : 'products'}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilters}
          className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition hover:border-primary hover:text-primary lg:hidden"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          aria-label="Sort products"
          className="h-10 cursor-pointer rounded-full border border-line bg-surface px-4 pr-8 text-sm font-medium text-ink outline-none transition focus:border-primary"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
