/**
 * Small colored status badge used across the admin panel.
 */
const STYLES = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  neutral: 'bg-line/60 text-muted',
}

const TONES = {
  'In Stock': 'emerald',
  'Low Stock': 'amber',
  'Out of Stock': 'red',
  Pending: 'amber',
  Confirmed: 'blue',
  Processing: 'violet',
  Packed: 'sky',
  Shipped: 'blue',
  Delivered: 'emerald',
  Cancelled: 'red',
  Published: 'emerald',
  Draft: 'neutral',
}

export default function StatusBadge({ status }) {
  const tone = TONES[status] || 'neutral'
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STYLES[tone]}`}
    >
      {status}
    </span>
  )
}