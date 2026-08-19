/**
 * Shimmer skeleton placeholders shown while data "loads".
 * Simulates async fetching for a realistic premium feel.
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface border border-line p-4">
      <div className="skeleton aspect-square w-full rounded-2xl" />
      <div className="skeleton mt-4 h-3 w-2/3" />
      <div className="skeleton mt-2 h-3 w-1/3" />
      <div className="mt-4 flex items-center justify-between">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="section">
      <div className="skeleton h-16 w-3/4 max-w-xl mx-auto" />
      <div className="skeleton mx-auto mt-4 h-5 w-1/2 max-w-sm" />
      <div className="skeleton mx-auto mt-8 h-12 w-56 rounded-full" />
    </div>
  )
}
