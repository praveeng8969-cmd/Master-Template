import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { useProducts, useCategories, deleteProduct } from '../../store/catalog'
import { useToast } from '../../context/ToastContext'
import { formatPrice } from '../../utils/format'
import Modal from '../../components/ui/Modal'
import StatusBadge from '../../components/admin/StatusBadge'

function stockStatus(stock) {
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

export default function AdminProducts() {
  const products = useProducts()
  const categories = useCategories()
  const { toast } = useToast()
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    document.title = 'VortexNova Admin — Products'
  }, [])

  const confirmDelete = () => {
    deleteProduct(toDelete.id)
    toast('Product deleted successfully', 'success')
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} products in your catalog.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-4 py-4 font-semibold">Category</th>
                <th className="px-4 py-4 font-semibold">Price</th>
                <th className="px-4 py-4 font-semibold">Stock</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-primary/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-line/40">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package size={16} className="text-muted" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <Link
                          to={`/product/${p.id}`}
                          className="line-clamp-1 max-w-[260px] font-medium text-ink transition hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted">#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 capitalize text-muted">
                    {categories.find((c) => c.slug === p.category)?.name || p.category}
                  </td>
                  <td className="px-4 py-4 font-semibold text-ink">{formatPrice(p.price)}</td>
                  <td className="px-4 py-4 text-ink">{p.stock}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={stockStatus(p.stock)} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        aria-label={`Edit ${p.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-primary hover:text-primary"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setToDelete(p)}
                        aria-label={`Delete ${p.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-red-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-3xl border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-line/40">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Package size={18} className="text-muted" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${p.id}`} className="line-clamp-2 text-sm font-semibold text-ink">
                  {p.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted">
                  {categories.find((c) => c.slug === p.category)?.name || p.category} · {formatPrice(p.price)}
                </p>
                <p className="mt-0.5 text-xs text-muted">Stock: {p.stock}</p>
                <div className="mt-2">
                  <StatusBadge status={stockStatus(p.stock)} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/admin/products/edit/${p.id}`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <Pencil size={14} /> Edit
              </Link>
              <button
                onClick={() => setToDelete(p)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-red-500 transition hover:border-red-400"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete Product?" size="sm">
        <div className="p-6">
          <p className="text-sm leading-relaxed text-muted">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">“{toDelete?.name}”</span>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setToDelete(null)}
              className="h-11 rounded-full border border-line px-6 text-sm font-semibold text-ink transition hover:border-primary"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="h-11 rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}