import { Link } from 'react-router-dom'
import { useSettings } from '../../store/catalog'

/** Text-based logo — replace with an <img> by setting siteConfig.logoImage. */
export function Logo({ className = '' }) {
  const settings = useSettings()
  const { storeName, logoImage } = settings

  if (logoImage) {
    return <img src={logoImage} alt={storeName} className={`h-9 ${className}`} />
  }
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`} aria-label={storeName}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-[rgb(var(--primary-contrast))] transition-transform duration-300 group-hover:rotate-6">
        {storeName.charAt(0)}
      </span>
      <span className="font-display text-lg font-semibold tracking-wide text-ink">{storeName}</span>
    </Link>
  )
}