import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Simple numbered pagination.
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)

  const btn =
    'flex h-10 min-w-10 items-center justify-center rounded-full border border-line px-3 text-sm font-medium transition hover:border-primary hover:text-primary'

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <button
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${btn} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className={btn}>
            1
          </button>
          <span className="text-muted">…</span>
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`${btn} ${
            p === page
              ? 'border-primary bg-primary text-[rgb(var(--primary-contrast))] hover:text-[rgb(var(--primary-contrast))]'
              : ''
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="text-muted">…</span>
          <button onClick={() => onChange(totalPages)} className={btn}>
            {totalPages}
          </button>
        </>
      )}

      <button
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={`${btn} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
