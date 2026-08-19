import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Package, FolderTree, ClipboardList, Settings,
  Sun, Moon, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { logoutAdmin } from '../../store/admin'
import { useToast } from '../../context/ToastContext'

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
        >
          <Menu size={18} />
        </button>
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-surface"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
              >
                <X size={16} />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}