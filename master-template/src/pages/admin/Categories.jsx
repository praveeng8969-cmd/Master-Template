import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImageOff, ImagePlus, X } from 'lucide-react'
import { useProducts, useCategories, addCategory, updateCategory, deleteCategory } from '../../store/catalog'
import { useToast } from '../../context/ToastContext'
import { fileToDataUrl } from '../../utils/image'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const emptyForm = { name: '', image: '', description: '', featured: true }

export default function AdminCategories() {
  const categories = useCategories()
  const products = useProducts()
  const { toast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = 'VortexNova Admin — Categories'
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, image: c.image || '', description: c.tagline || '', featured: c.featured !== false })
    setFormOpen(true)
  }

  const countFor = (slug) => products.filter((p) => p.category === slug).length

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const url = await fileToDataUrl(file)
      setForm((f) => ({ ...f, image: url }))
      toast('Image uploaded', 'success')
    } catch {
      toast('Could not read that image file', 'error')
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast('Category name is required', 'error')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      image: form.image.trim(),
      tagline: form.description.trim(),
      featured: form.featured,
    }
    setTimeout(() => {
      if (editing) {
        updateCategory(editing.slug, payload)
        toast('Category updated successfully', 'success')
      } else {
        addCategory(payload)
        toast('Category added successfully', 'success')
      }
      setSaving(false)
      setFormOpen(false)
      setEditing(null)
    }, 350)
  }

  const confirmDelete = () => {
    deleteCategory(toDelete.slug)
    toast('Category deleted successfully', 'success')
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-muted">
            {categories.length} categories — synced with the storefront.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[rgb(var(--primary-contrast))] transition hover:opacity-90"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-line bg-surface md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-4 py-4 font-semibold">Description</th>
              <th className="px-4 py-4 font-semibold">Products</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {categories.map((c) => (
              <tr key={c.slug} className="transition hover:bg-primary/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-line/40">
                      {c.image ? (
                        <img src={c.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff size={16} className="text-muted" />
                      )}
                    </span>
                    <span className="font-medium text-ink">{c.name}</span>
                  </div>
                </td>
                <td className="max-w-[260px] truncate px-4 py-4 text-muted">{c.tagline || '—'}</td>
                <td className="px-4 py-4 text-ink">{countFor(c.slug)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      c.featured
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-line/60 text-muted'
                    }`}
                  >
                    {c.featured ? 'Featured' : 'Standard'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      aria-label={`Edit ${c.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-primary hover:text-primary"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setToDelete(c)}
                      aria-label={`Delete ${c.name}`}
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

      {/* Mobile cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:hidden">
        {categories.map((c) => (
          <div key={c.slug} className="rounded-3xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-line/40">
                {c.image ? (
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff size={16} className="text-muted" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-muted">{countFor(c.slug)} products</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEdit(c)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => setToDelete(c)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-red-500 transition hover:border-red-400"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / edit form */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={submit} className="space-y-5 p-6">
          <Input label="Category name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Outdoor Gear" required />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Category image
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-canvas/50 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary/40">
                <ImagePlus size={15} /> Upload from device
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: '' }))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition hover:underline"
                >
                  <X size={13} /> Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="…or paste an image URL (https://…)"
              className="mt-3 h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Image preview"
                className="mt-3 h-24 w-24 rounded-xl border border-line object-cover"
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Short description shown with the category"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              form.featured ? 'border-primary/50 bg-primary/5 text-ink' : 'border-line text-muted'
            }`}
          >
            Featured on homepage
            <span className={`relative h-6 w-11 rounded-full transition ${form.featured ? 'bg-primary' : 'bg-line'}`} aria-hidden>
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  form.featured ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </span>
          </button>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} className="w-full sm:w-auto">
              {editing ? 'Save' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete Category?" size="sm">
        <div className="p-6">
          <p className="text-sm leading-relaxed text-muted">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">“{toDelete?.name}”</span>? It will be removed from the storefront.
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