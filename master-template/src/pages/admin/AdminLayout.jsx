import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, FolderTree, ClipboardList, Settings,
  Sun, Moon, LogOut, ShieldCheck,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { logoutAdmin } from '../../store/admin'
import { useToast } from '../../context/ToastContext'
import AdminBottomNav from '../../components/admin/AdminBottomNav'

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = () => {
    logoutAdmin()
    toast('Logged out of admin', 'info')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-6 pb-6 pt-7" onClick={onNavigate}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-[rgb(var(--primary-contrast))]">
          V
        </span>
        <div>
          <p className="font-display text-base font-bold leading-tight text-ink">VortexNova</p>
          <p className="text-[11px] font-medium text-muted">Admin Panel</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-[rgb(var(--primary-contrast))]'
                  : 'text-ink/70 hover:bg-line/50 hover:text-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-ink/70 transition hover:bg-line/50 hover:text-ink"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  )
}

/**
 * Admin shell — fixed sidebar on desktop, drawer on mobile,
 * with theme toggle and logout.
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-[rgb(var(--primary-contrast))]">
            V
          </span>
          <span className="font-display text-sm font-bold text-ink">VortexNova Admin</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted">
          <ShieldCheck size={16} />
        </div>
      </header>

      {/* Content */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <AdminBottomNav />
    </div>
  )
}