import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, LayoutGrid, Info, Phone } from 'lucide-react'

const items = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Shop', to: '/shop', icon: ShoppingBag },
  { label: 'Categories', to: '/categories', icon: LayoutGrid },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Phone },
]

/** Floating bottom navigation pill — shown on all screen sizes. */
export default function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-full border border-line bg-surface/95 px-2 py-1.5 shadow-lift backdrop-blur-md">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-semibold transition ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}