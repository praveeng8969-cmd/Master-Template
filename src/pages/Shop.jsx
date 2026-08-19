import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../store/catalog'
import { useScrollTop } from '../hooks/useScroll'
import PageTransition from '../components/ui/PageTransition'
import Breadcrumb from '../components/ui/Breadcrumb'
import ProductGrid from '../components/product/ProductGrid'
import FilterSidebar from '../components/shop/FilterSidebar'
import SortBar, { SORTS } from '../components/shop/SortBar'
import Pagination from '../components/shop/Pagination'
import Modal from '../components/ui/Modal'
import { GridSkeleton } from '../components/ui/Skeleton'

const PER_PAGE = 12

const defaultFilters = { categories: [], brands: [], maxPrice: null, rating: 0, inStock: false }

/** Shop page — filtering, sorting, search and pagination driven by URL params. */
export default function Shop() {
  useScrollTop()
  const products = useProducts()
  const categories = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category') || ''
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'featured'
  const badgeParam = searchParams.get('badge') || ''

  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [searchParams, filters])

  // Reset to page 1 whenever the query/filters change
  useEffect(() => {
    setPage(1)
  }, [searchParams, filters])

  const filtered = useMemo(() => {
    let list = products

    if (categoryParam) list = list.filter((p) => p.category === categoryParam)
    if (badgeParam) list = list.filter((p) => p.badge === badgeParam)
    if (q) {
      const term = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.toLowerCase().includes(term))
      )
    }
    if (filters.categories.length) list = list.filter((p) => filters.categories.includes(p.category))
    if (filters.brands.length) list = list.filter((p) => filters.brands.includes(p.brand))
    if (filters.maxPrice) list = list.filter((p) => p.price <= filters.maxPrice)
    if (filters.rating) list = list.filter((p) => p.rating >= filters.rating)
    if (filters.inStock) list = list.filter((p) => p.stock > 0)

    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => b.id - a.id)
        break
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return list
  }, [searchParams, filters, categoryParam, badgeParam, q, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const activeCategory = categories.find((c) => c.slug === categoryParam)

  return (
    <PageTransition>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb
            items={[{ label: 'Shop', to: '/shop' }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]}
          />
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink lg:text-5xl">
            {activeCategory ? activeCategory.name : 'Shop all'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {q
              ? `Results for “${q}” — ${filtered.length} match${filtered.length === 1 ? '' : 'es'}.`
              : activeCategory?.tagline || 'Every product in the collection, filterable and sortable.'}
          </p>
        </div>
      </div>

      <div className="container-x py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-line bg-surface p-6">
              <FilterSidebar filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />
            </div>
          </div>

          <div>
            <SortBar
              count={filtered.length}
              sort={sort}
              onSort={(v) => updateParam('sort', v)}
              onToggleFilters={() => setFilterOpen(true)}
            />

            {loading ? (
              <GridSkeleton count={8} />
            ) : pageItems.length === 0 ? (
              <div className="rounded-3xl border border-line bg-surface py-24 text-center">
                <p className="font-display text-2xl text-ink">No products found</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  Try adjusting your filters or search for something else.
                </p>
                <button
                  onClick={() => {
                    setFilters(defaultFilters)
                    setSearchParams({}, { replace: true })
                  }}
                  className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
                >
                  Reset everything
                </button>
              </div>
            ) : (
              <ProductGrid products={pageItems} />
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" size="sm">
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <FilterSidebar
            filters={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onClose={() => setFilterOpen(false)}
          />
        </div>
      </Modal>
    </PageTransition>
  )
}

export { SORTS }
