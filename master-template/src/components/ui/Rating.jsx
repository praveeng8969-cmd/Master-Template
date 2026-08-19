import { Star, StarHalf } from 'lucide-react'

/**
 * Star rating display.
 * <Rating value={4.5} reviews={12} size={16} showValue />
 */
export default function Rating({ value = 0, reviews, size = 15, showValue = false, className = '' }) {
  const full = Math.floor(value)
  const hasHalf = value - full >= 0.4

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
        {[...Array(5)].map((_, i) => {
          if (i < full)
            return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />
          if (i === full && hasHalf)
            return (
              <span key={i} className="relative inline-flex">
                <Star size={size} className="text-line" />
                <StarHalf
                  size={size}
                  className="absolute inset-0 fill-amber-400 text-amber-400"
                />
              </span>
            )
          return <Star key={i} size={size} className="text-line" />
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-muted">{value.toFixed(1)}</span>}
      {reviews !== undefined && (
        <span className="text-xs text-muted">({reviews.toLocaleString()})</span>
      )}
    </div>
  )
}
