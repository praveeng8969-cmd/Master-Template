import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, TrendingUp } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useProducts, useCategories } from '../../store/catalog'
import SmartImage from '../ui/SmartImage'

const popular = ['Headphones', 'Watch', 'Leather', 'Skincare', 'Sofa']

/** Fullscreen search overlay with live results & recent searches. */
export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const navigate = useNavigate()
  const products = useProducts()
  const categories = useCategories()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useLocalStorage('vortexnova_recent_searches', [])

  const results = query.trim()
    ? products
        .filter((p) =>
          [p.name, p.brand, p.category, ...p.tags]
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 6)
    : []

  const close = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const go = (path) => {
    close()
    navigate(path)
  }

  const search = () => {
    if (!query.trim()) return
    setRecent((r) => [query, ...r.filter((x) => x !== query)].slice(0, 6))
    go(`/shop?q=${encodeURIComponent(query)}`)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[85]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative mx-auto mt-20 w-full max-w-2xl px-4"
          >
            <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
              <div className="flex items-center gap-3 border-b border-line px-5">
                <Search size={18} className="text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && search()}
                  placeholder="Search products, brands, categories…"
                  className="h-16 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted/70"
                />
                <button onClick={close} aria-label="Close search" className="text-muted transition hover:text-ink">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-4">
                {query.trim() === '' ? (
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                      <TrendingUp size={13} /> Popular searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popular.map((p) => (
                        <button
                          key={p}
                          onClick={() => setQuery(p)}
                          className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink transition hover:border-primary hover:text-primary"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    {recent.length > 0 && (
                      <>
                        <p className="pt-2 text-xs font-semibold uppercase tracking-widest text-muted">Recent</p>
                        <div className="flex flex-wrap gap-2">
                          {recent.map((r) => (
                            <button
                              key={r}
                              onClick={() => setQuery(r)}
                              className="rounded-full bg-line/50 px-4 py-2 text-xs text-ink transition hover:bg-line"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {categories.slice(0, 4).map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => go(`/shop?category=${c.slug}`)}
                          className="rounded-full bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary/10"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted">
                    No results for “{query}”. Try a different keyword.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => go(`/product/${p.id}`)}
                        className="flex w-full items-center gap-4 rounded-2xl p-2.5 text-left transition hover:bg-line/40"
                      >
                        <SmartImage src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-xl border border-line object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                          <p className="text-xs text-muted">{p.brand}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">${p.price.toFixed(2)}</span>
                      </button>
                    ))}
                    <button
                      onClick={search}
                      className="mt-3 w-full rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--primary-contrast))]"
                    >
                      See all results for “{query}”
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
