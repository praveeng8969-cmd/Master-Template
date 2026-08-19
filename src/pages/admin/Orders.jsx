import { useEffect } from 'react'
import { useOrders, updateOrderStatus, ORDER_STATUSES } from '../../store/catalog'
import { useToast } from '../../context/ToastContext'
import { formatPrice } from '../../utils/format'
import StatusBadge from '../../components/admin/StatusBadge'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function AdminOrders() {
  const orders = useOrders()
  const { toast } = useToast()

  useEffect(() => {
    document.title = 'VortexNova Admin — Orders'
  }, [])

  const changeStatus = (id, status) => {
    updateOrderStatus(id, status)
    toast(`Order ${id} — status updated to ${status}`, 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          {orders.length} orders — update the status to keep fulfilment moving.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-4 py-4 font-semibold">Customer</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Products</th>
                <th className="px-4 py-4 font-semibold">Total</th>
                <th className="px-4 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-primary/[0.02]">
                  <td className="px-6 py-4 font-semibold text-ink">{o.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-ink">{o.customer?.name}</p>
                    <p className="text-xs text-muted">{o.customer?.email}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{formatDate(o.date)}</td>
                  <td className="max-w-[220px] px-4 py-4">
                    <div className="space-y-0.5">
                      {o.items?.map((i) => (
                        <p key={i.name} className="truncate text-xs text-muted">
                          {i.qty}× {i.name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-ink">{formatPrice(o.total || 0)}</td>
                  <td className="px-4 py-4 text-muted">{o.payment}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status} />
                      <div className="relative">
                        <select
                          value={o.status}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                          className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-sm font-medium text-ink outline-none transition focus:border-primary"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">▼</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {orders.map((o) => (
          <div key={o.id} className="rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold text-ink">{o.id}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {o.customer?.name} · {formatDate(o.date)}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="mt-3 space-y-0.5">
              {o.items?.map((i) => (
                <p key={i.name} className="truncate text-xs text-muted">
                  {i.qty}× {i.name}
                </p>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">
                {o.payment} · {o.customer?.email}
              </span>
              <span className="font-bold text-ink">{formatPrice(o.total || 0)}</span>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted">
                Update status
              </label>
              <div className="relative">
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  className="h-11 w-full appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm font-medium text-ink outline-none transition focus:border-primary"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted">▼</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}