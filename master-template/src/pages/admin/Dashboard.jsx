import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, FolderTree, Boxes, ClipboardList, DollarSign, AlertTriangle } from 'lucide-react'
import { useProducts, useCategories, useOrders } from '../../store/catalog'
import { formatPrice } from '../../utils/format'
import StatusBadge from '../../components/admin/StatusBadge'

const ONGOING = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped']

function stockStatus(stock) {
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function Dashboard() {
  const products = useProducts()
  const categories = useCategories()
  const orders = useOrders()

  useEffect(() => {
    document.title = 'VortexNova Admin — Dashboard'
  }, [])

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const ongoing = orders.filter((o) => ONGOING.includes(o.status)).length
    const revenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)
    return { totalStock, ongoing, revenue }
  }, [products, orders])

  const lowStock = useMemo(
    () => products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock).slice(0, 5),
    [products]
  )

  const cards = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Total Categories', value: categories.length, icon: FolderTree },
    { label: 'Current Stock', value: stats.totalStock.toLocaleString(), icon: Boxes },
    { label: 'Ongoing Orders', value: stats.ongoing, icon: ClipboardList },
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign },
  ]

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">A quick overview of your store.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-3xl border border-line bg-surface p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon size={18} />
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-ink">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-muted">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        {/* Recent orders */}
        <section className="rounded-3xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-ink">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-primary transition hover:opacity-80">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  to="/admin/orders"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line/70 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{o.id}</p>
                    <p className="truncate text-xs text-muted">
                      {o.customer?.name} · {formatDate(o.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-ink">{formatPrice(o.total || 0)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <AlertTriangle size={17} className="text-amber-500" /> Low Stock Products
          </h2>
          {lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-muted">All products are well stocked. Nice work!</p>
          ) : (
            <div className="mt-5 space-y-3">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/products/edit/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{p.stock} in stock</p>
                  </div>
                  <StatusBadge status={stockStatus(p.stock)} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Stock overview */}
      <section className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-bold text-ink">Stock Overview</h2>
        <p className="mt-0.5 text-xs text-muted">Current inventory across all products.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4 font-semibold">Product</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {products.map((p) => (
                <tr key={p.id} className={p.stock <= 10 ? 'bg-amber-500/[0.04]' : ''}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-line/40">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package size={15} className="text-muted" />
                        )}
                      </span>
                      <span className="line-clamp-1 max-w-[220px] font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize text-muted">{p.category}</td>
                  <td className="py-3 pr-4 font-semibold text-ink">{p.stock}</td>
                  <td className="py-3">
                    <StatusBadge status={stockStatus(p.stock)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export { ONGOING, stockStatus }