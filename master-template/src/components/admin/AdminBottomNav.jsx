import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, ClipboardList, Settings } from 'lucide-react'

const items = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

/** Fixed full-width bottom navigation for the admin panel — mobile only. */
export default function AdminBottomNav() {
  return (
    <nav
      aria-label="Admin navigation"
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