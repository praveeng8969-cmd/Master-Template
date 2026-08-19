import { Truck, RotateCcw, ShieldCheck, Headphones, Heart, Star, Gift } from 'lucide-react'

/**
 * Maps icon names (strings) from site.config.js to lucide components.
 * Add any new icon used in the config here.
 */
const iconMap = {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Heart,
  Star,
  Gift,
}

export const Icon = ({ name, size = 20, className = '' }) => {
  const Cmp = iconMap[name] || Star
  return <Cmp size={size} className={className} />
}
