import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'
import { loginAdmin, useAdminAuth } from '../../store/admin'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

/**
 * Admin login — completely separate from the customer login flow.
 * Demo credentials: admin / admin
 */
export default function AdminLogin() {
  const authenticated = useAdminAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'VortexNova Admin — Sign in'
  }, [])

  if (authenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      if (loginAdmin(username.trim(), password)) {
        toast('Welcome back, Admin', 'success')
        navigate('/admin/dashboard', { replace: true })
      } else {
        setError('Invalid username or password')
        toast('Invalid username or password', 'error')
      }
    }, 400)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-line bg-surface p-8 shadow-lift sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[rgb(var(--primary-contrast))]">
              <ShieldCheck size={24} />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold text-ink">VortexNova</h1>
            <p className="mt-1 text-sm font-medium text-muted">Admin Portal</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
              Sign in to manage products, categories, orders and store settings.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Input
              label="Username"
              icon={User}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="!pr-12"
                  wrapperClassName="!mb-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[28px] flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
              Login
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-line bg-canvas/60 px-4 py-3 text-center text-xs text-muted">
            Demo credentials — username <span className="font-semibold text-ink">admin</span>, password{' '}
            <span className="font-semibold text-ink">admin</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/" className="transition hover:text-primary">
            ← Back to the storefront
          </a>
        </p>
      </motion.div>
    </div>
  )
}