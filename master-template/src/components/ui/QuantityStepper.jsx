import { Minus, Plus } from 'lucide-react'

/**
 * Quantity stepper with min / max bounds.
 * <Quantity value={2} onChange={setQty} max={10} size="sm|md" />
 */
export default function QuantityStepper({ value, onChange, max = 99, size = 'md' }) {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`flex ${box} items-center justify-center text-muted transition hover:text-primary`}
      >
        <Minus size={15} />
      </button>
      <span className={`w-10 text-center font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {value}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`flex ${box} items-center justify-center text-muted transition hover:text-primary`}
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
