import { Loader2 } from 'lucide-react'

/** Full-page or inline spinner. */
export default function Loader({ full = false, label = 'Loading...' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-muted ${
        full ? 'min-h-[60vh]' : 'py-12'
      }`}
    >
      <Loader2 size={32} className="animate-spin" />
      <p className="text-xs font-medium uppercase tracking-widest">{label}</p>
    </div>
  )
}
