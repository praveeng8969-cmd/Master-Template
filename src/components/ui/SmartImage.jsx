import { useState } from 'react'

/**
 * Image with lazy loading and a graceful placeholder fallback
 * if the remote image fails to load.
 */
export default function SmartImage({ src, alt = '', className = '', seed = '', ...rest }) {
  const [failed, setFailed] = useState(false)

  if (failed)
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 ${className}`}
      >
        <span className="text-3xl font-display text-muted/60">
          {alt?.charAt(0)?.toUpperCase() || '★'}
        </span>
      </div>
    )

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
