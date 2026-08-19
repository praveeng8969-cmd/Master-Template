import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useCategories } from '../store/catalog'
import { CategoryCard } from '../components/home/CategoryCard'
import Breadcrumb from '../components/ui/Breadcrumb'
import Input from '../components/ui/Input'
import PageTransition from '../components/ui/PageTransition'

/** All categories grid page. */
export default function Categories() {
  const categories = useCategories()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(term))
  }, [query])

  return (
    <PageTransition>
      <div className="border-b border-line bg-surface">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumb items={[{ label: 'Categories' }]} />
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink lg:text-5xl">Browse Categories</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Every department, thoughtfully curated. Find your next favourite thing.
          </p>
        </div>
      </div>

      <div className="container-x py-10 lg:py-16">
        <div className="mb-8 max-w-md">
          <Input
            type="search"
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            aria-label="Search categories"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-line bg-surface py-20 text-center">
            <p className="font-display text-xl text-ink">No categories found</p>
            <p className="mt-2 text-sm text-muted">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((c, i) => (
              <CategoryCard key={c.slug} category={c} index={i} compact />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}