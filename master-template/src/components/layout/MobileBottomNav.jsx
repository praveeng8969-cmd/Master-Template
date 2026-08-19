import { NavLink } from 'react-router-dom'
import { House, ShoppingBag, LayoutGrid, Info, Mail } from 'lucide-react'

const items = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Shop', to: '/shop', icon: ShoppingBag },
  { label: 'Category', to: '/categories', icon: LayoutGrid },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Mail },
]

/** Fixed full-width bottom navigation — mobile only (hidden on lg+). */
export default function MobileBottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-primary' : 'text-muted hover:text-ink'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}