import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useProducts, useCategories } from '../../store/catalog'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'

/**
 * Single category tile — image, name and product count.
 * Pass `compact` for the minimal variant used on the home & categories pages.
 */
export function CategoryCard({ category, index = 0, className = '', compact = false }) {
  const products = useProducts()
  const count = products.filter((p) => p.category === category.slug).length

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
      >
        <Link to={`/shop?category=${category.slug}`} className={`group block ${className}`}>
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-[4/3] overflow-hidden">
              <SmartImage
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="px-1 pt-3">
              <h3 className="text-sm font-semibold text-ink transition group-hover:text-primary">
                {category.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted">{count} products</p>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
    >
      <Link
        to={`/shop?category=${category.slug}`}
        className={`group relative block overflow-hidden rounded-3xl bg-surface ${className}`}
      >
        <div className="aspect-[4/5] overflow-hidden">
          <SmartImage
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/75">{category.tagline}</p>
            <h3 className="mt-1 font-display text-2xl">{category.name}</h3>
            <p className="mt-1 text-xs text-white/70">{count} products</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-neutral-950">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/**
 * Compact category row — used on the homepage.
 * Mobile: horizontal scroll. Desktop: single row of 6 with "View All".
 */
export default function CategoriesSection({ limit = 6 }) {
  const categories = useCategories()
  const items = categories.filter((c) => c.featured).slice(0, limit)

  return (
    <section className="section">
      <SectionHeading title="Shop by Category" to="/categories" linkLabel="View All" />
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
        {items.map((c, i) => (
          <CategoryCard key={c.slug} category={c} index={i} compact className="w-[170px] shrink-0 md:w-auto" />
        ))}
      </div>
    </section>
  )
}