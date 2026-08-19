import { useMemo } from 'react'
import { useProducts } from '../store/catalog'
import { useScrollTop } from '../hooks/useScroll'
import SectionHeading from '../components/ui/SectionHeading'
import PageTransition from '../components/ui/PageTransition'
import Hero from '../components/home/Hero'
import CategoriesSection from '../components/home/CategoryCard'
import ProductCard from '../components/product/ProductCard'

/**
 * Home page — hero, categories and a compact popular-products showcase.
 * Everything else is one click away via the dedicated pages.
 */
export default function Home() {
  useScrollTop()
  const products = useProducts()

  const popular = useMemo(
    () => products.filter((p) => p.badge === 'Best Seller').slice(0, 4),
    []
  )

  return (
    <PageTransition>
      <Hero />

      <div className="container-x">
        <CategoriesSection />

        {/* Popular products */}
        <section className="section pt-0">
          <SectionHeading title="Popular Products" to="/shop" linkLabel="View All Products" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {popular.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}