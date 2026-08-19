import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const sizes = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-[52px] px-8 text-sm',
  icon: 'h-10 w-10',
}

const variants = {
  primary: 'bg-primary text-[rgb(var(--primary-contrast))] hover:opacity-90',
  dark: 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200',
  outline: 'border border-line text-ink hover:border-primary hover:text-primary',
  ghost: 'text-ink hover:bg-line/50',
  white: 'bg-white text-neutral-950 hover:bg-neutral-100',
}

/**
 * Ripple-enabled button with link / button / loading modes.
 * <Button to="/shop" variant="primary" size="lg">Shop now</Button>
 */
const Button = forwardRef(function Button(
  {
    children,
    to,
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    ripple = true,
    type = 'button',
    ...rest
  },
  ref
) {
  const handleClick = (e) => {
    if (!ripple || loading) return
    const host = e.currentTarget
    const circle = document.createElement('span')
    const d = Math.max(host.clientWidth, host.clientHeight)
    const rect = host.getBoundingClientRect()
    circle.style.width = circle.style.height = `${d}px`
    circle.style.left = `${e.clientX - rect.left - d / 2}px`
    circle.style.top = `${e.clientY - rect.top - d / 2}px`
    circle.className = `ripple ${variant === 'outline' || variant === 'ghost' ? 'ripple-dark' : ''}`
    host.appendChild(circle)
    setTimeout(() => circle.remove(), 700)
    rest.onClick?.(e)
  }

  const classes = `ripple-host inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`

  const content = loading ? (
    <>
      <Loader2 size={16} className="animate-spin" /> Loading...
    </>
  ) : (
    children
  )

  if (to)
    return (
      <Link ref={ref} to={to} className={classes} onClick={handleClick} {...rest}>
        {content}
      </Link>
    )
  if (href)
    return (
      <a ref={ref} href={href} target="_blank" rel="noreferrer" className={classes} onClick={handleClick} {...rest}>
        {content}
      </a>
    )
  return (
    <button ref={ref} type={type} className={classes} onClick={handleClick} disabled={loading} {...rest}>
      {content}
    </button>
  )
})

export default Button
