import ProductCard from './ProductCard'

/** Responsive product grid. */
export default function ProductGrid({ products, cols = 4, skeleton }) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }[cols]

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridClass}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  )
}
