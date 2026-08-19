import { useEffect, useState } from 'react'
import { useSettings, updateSettings } from '../../store/catalog'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function AdminSettings() {
  const settings = useSettings()
  const { toast } = useToast()
  const [form, setForm] = useState({
    storeName: '',
    tagline: '',
    freeShippingThreshold: '',
    taxRate: '',
    shippingFee: '',
    announcement: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = 'VortexNova Admin — Settings'
  }, [])

  useEffect(() => {
    setForm({
      storeName: settings.storeName,
      tagline: settings.tagline,
      freeShippingThreshold: String(settings.freeShippingThreshold ?? ''),
      taxRate: String(settings.taxRate ?? ''),
      shippingFee: String(settings.shippingFee ?? ''),
      announcement: (settings.announcement || []).join('\n'),
    })
  }, [settings.storeName, settings.tagline])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setSaving(true)
    updateSettings({
      storeName: form.storeName.trim() || 'VortexNova',
      tagline: form.tagline.trim(),
      freeShippingThreshold: Number(form.freeShippingThreshold) || 0,
      taxRate: Number(form.taxRate) || 0,
      shippingFee: Number(form.shippingFee) || 0,
      announcement: form.announcement
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setTimeout(() => {
      setSaving(false)
      toast('Settings saved successfully', 'success')
    }, 350)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">Store-wide settings — changes apply to the storefront instantly.</p>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="space-y-5">
          <Input label="Store name" value={form.storeName} onChange={set('storeName')} placeholder="VortexNova" />
          <Input label="Tagline" value={form.tagline} onChange={set('tagline')} placeholder="Premium Lifestyle & Essentials" />

          <div className="grid gap-5 sm:grid-cols-3">
            <Input
              label="Free shipping threshold ($)"
              type="number"
              min="0"
              value={form.freeShippingThreshold}
              onChange={set('freeShippingThreshold')}
            />
            <Input label="Tax rate (%)" type="number" min="0" step="0.01" value={form.taxRate} onChange={set('taxRate')} />
            <Input label="Shipping fee ($)" type="number" min="0" step="0.01" value={form.shippingFee} onChange={set('shippingFee')} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Announcement bar messages
            </label>
            <textarea
              value={form.announcement}
              onChange={set('announcement')}
              rows={3}
              placeholder="One message per line"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}