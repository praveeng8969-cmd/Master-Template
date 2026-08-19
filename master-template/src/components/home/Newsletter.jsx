import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Input from '../ui/Input'

/**
 * Newsletter signup block — purely frontend (toast confirmation).
 */
export default function Newsletter() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const submit = (e) => {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast('Please enter a valid email address', 'error')
      return
    }
    setEmail('')
    toast('Welcome to the club — check your inbox for 10% off!', 'success')
  }

  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-neutral-950 px-6 py-16 text-white dark:bg-white dark:text-neutral-950 sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-[100px] dark:bg-neutral-950/10"
        />
        <div className="relative mx-auto max-w-xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md dark:bg-neutral-950/5">
            <Mail size={22} />
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">Join the inner circle</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-70">
            Early access to drops, members-only offers and 10% off your first order. No spam, ever.
          </p>

          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="!h-12 flex-1 rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/50 !ring-white/40 dark:border-neutral-950/20 dark:bg-neutral-950/5 dark:text-neutral-950 dark:placeholder:text-neutral-950/40"
            />
            <Button type="submit" variant="white" size="lg" className="shrink-0">
              Subscribe
              <Send size={15} />
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
