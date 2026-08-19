import { forwardRef } from 'react'

/**
 * Styled text input with optional icon and label.
 */
const Input = forwardRef(function Input(
  { label, icon: Icon, error, className = '', wrapperClassName = '', ...rest },
  ref
) {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
        )}
        <input
          ref={ref}
          className={`h-12 w-full rounded-xl border bg-surface px-4 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
            Icon ? 'pl-11' : ''
          } ${error ? 'border-red-500' : 'border-line'} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})

export default Input
