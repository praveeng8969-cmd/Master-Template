import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Heart, ShoppingBag, Menu, X, Sun, Moon,
  ChevronDown, User, Package, Settings, LogOut, Sparkles,
} from 'lucide-react'
import { siteConfig } from '../../config/site'
import { useSettings } from '../../store/catalog'
import { useStore } from '../../context/StoreContext'
import { useTheme } from '../../context/ThemeContext'
import { useScrolled } from '../../hooks/useScroll'
import { Logo } from './Logo'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/** Rotating announcement bar shown above the main nav. */
function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const { announcement } = useSettings()
  useEffect(() => {
    if (!announcement.length) return
    const t = setInterval(
      () => setIdx((i) => (i + 1) % announcement.length),
      4500
    )
    return () => clearInterval(t)
  }, [announcement])

  if (!announcement.length) return null

  return (
    <div className="relative z-50 overflow-hidden bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 py-2 text-center text-[11px] font-medium uppercase tracking-widest2"
        >
          <Sparkles size={12} />
          {announcement[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(30)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { cartCount, wishlist, setCartOpen, setWishlistOpen, setSearchOpen } = useStore()
  const { dark, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  // Transparent over hero (home at top) → glass when scrolled
  const transparent = isHome && !scrolled

  useEffect(() => {
    setMobileOpen(false)
    setUserOpen(false)
  }, [pathname])

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'glass border-b border-line/70 shadow-soft'
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between gap-4 lg:h-[76px]">
          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Logo */}
          <Logo className={`text-xl ${transparent ? 'text-white dark:text-white' : ''}`} />

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-primary'
                      : transparent
                        ? 'text-white/80 hover:text-white'
                        : 'text-ink/70 hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-primary ${
                transparent ? 'text-white border-white/25 hover:border-white' : 'text-ink'
              }`}
            >
              <Search size={17} />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-primary ${
                transparent ? 'text-white border-white/25 hover:border-white' : 'text-ink'
              }`}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              aria-label="Wishlist"
              className={`relative hidden h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-primary sm:flex ${
                transparent ? 'text-white border-white/25 hover:border-white' : 'text-ink'
              }`}
            >
              <Heart size={17} />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-[rgb(var(--primary-contrast))]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-primary ${
                transparent ? 'text-white border-white/25 hover:border-white' : 'text-ink'
              }`}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-[rgb(var(--primary-contrast))]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative block">
              <button
                onClick={() => setUserOpen((o) => !o)}
                aria-label="Account"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-primary ${
                  transparent ? 'text-white border-white/25 hover:border-white' : 'text-ink'
                }`}
              >
                <User size={17} />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 z-20 w-60 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-lift"
                    >
                      <div className="border-b border-line px-3 pb-3 pt-2">
                        <p className="text-sm font-semibold text-ink">{siteConfig.user.name}</p>
                        <p className="text-xs text-muted">{siteConfig.user.email}</p>
                      </div>
                      {[
                        { icon: User, label: 'My Profile' },
                        { icon: Package, label: 'My Orders' },
                        { icon: Heart, label: 'Wishlist' },
                        { icon: Settings, label: 'Settings' },
                        { icon: LogOut, label: 'Log out' },
                      ].map(({ icon: Icon, label }) => (
                        <button
                          key={label}
                          onClick={() => setUserOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition hover:bg-line/50"
                        >
                          <Icon size={15} className="text-muted" />
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-canvas p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-primary/5 text-primary' : 'text-ink/80 hover:bg-line/40'
                      }`
                    }
                  >
                    {l.label}
                    <ChevronDown size={14} className="rotate-[-90deg] text-muted" />
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t border-line pt-6">
                <p className="text-xs text-muted">{siteConfig.contact.phone}</p>
                <p className="text-xs text-muted">{siteConfig.contact.email}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
