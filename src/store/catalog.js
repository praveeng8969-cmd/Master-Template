import { useSyncExternalStore } from 'react'
import seedProducts from '../data/products.json'
import seedCategories from '../data/categories.json'
import { siteConfig } from '../config/site'

/**
 * Central catalog store — the ONE source of truth for products,
 * categories, orders and store settings. The customer website and
 * the admin panel read and mutate the SAME data, persisted to
 * localStorage so changes survive refreshes and sync instantly
 * across both sides.
 */
const KEYS = {
  products: 'vortexnova_products',
  categories: 'vortexnova_categories',
  orders: 'vortexnova_orders',
  settings: 'vortexnova_settings',
}

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — ignore */
  }
}

/* ----------------------------- Seed data ----------------------------- */

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

const seedOrders = [
  {
    id: 'VNX-2081',
    customer: { name: 'Amelia Carter', email: 'amelia@example.com' },
    date: '2026-08-16T10:24:00.000Z',
    items: [{ id: 3, name: 'Lumen 4K Mirrorless Camera', qty: 1, price: 399 }],
    total: 431,
    payment: 'Card',
    status: 'Pending',
    address: '221B Baker Street, London',
  },
  {
    id: 'VNX-2080',
    customer: { name: 'Noah Bennett', email: 'noah@example.com' },
    date: '2026-08-15T16:02:00.000Z',
    items: [
      { id: 1, name: 'VortexNova Wireless Headphones', qty: 1, price: 249 },
      { id: 15, name: 'Heritage Leather Sneakers', qty: 1, price: 129 },
    ],
    total: 408,
    payment: 'Card',
    status: 'Processing',
    address: '84 Market Street, Manchester',
  },
  {
    id: 'VNX-2079',
    customer: { name: 'Sofia Reyes', email: 'sofia@example.com' },
    date: '2026-08-14T09:41:00.000Z',
    items: [{ id: 7, name: 'Echo Home Speaker', qty: 2, price: 89 }],
    total: 194,
    payment: 'PayPal',
    status: 'Confirmed',
    address: '17 Calle Mayor, Madrid',
  },
  {
    id: 'VNX-2078',
    customer: { name: 'Liam O\'Connor', email: 'liam@example.com' },
    date: '2026-08-13T14:18:00.000Z',
    items: [{ id: 21, name: 'Ceramic Table Lamp Duo', qty: 1, price: 59 }],
    total: 64,
    payment: 'Card',
    status: 'Packed',
    address: '5 O\'Connell Street, Dublin',
  },
  {
    id: 'VNX-2077',
    customer: { name: 'Priya Sharma', email: 'priya@example.com' },
    date: '2026-08-12T11:55:00.000Z',
    items: [{ id: 12, name: 'Diamond Stud Earrings', qty: 1, price: 79 }],
    total: 85,
    payment: 'Card',
    status: 'Shipped',
    address: '22 MG Road, Bengaluru',
  },
  {
    id: 'VNX-2076',
    customer: { name: 'Ethan Walker', email: 'ethan@example.com' },
    date: '2026-08-10T08:30:00.000Z',
    items: [{ id: 4, name: 'NovaBook Ultra 14"', qty: 1, price: 149 }],
    total: 161,
    payment: 'Card',
    status: 'Delivered',
    address: '90 King Street, Toronto',
  },
]

const defaultSettings = {
  storeName: siteConfig.storeName,
  tagline: siteConfig.tagline,
  announcement: siteConfig.announcement,
  freeShippingThreshold: siteConfig.freeShippingThreshold,
  taxRate: siteConfig.taxRate,
  shippingFee: siteConfig.shippingFee,
}

/* ----------------------------- Store state ---------------------------- */

let products = load(KEYS.products, seedProducts)
let categories = load(KEYS.categories, seedCategories)
let orders = load(KEYS.orders, seedOrders)
let settings = { ...defaultSettings, ...load(KEYS.settings, {}) }

const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach((fn) => fn())
}

/* ------------------------------- Hooks -------------------------------- */

export function useProducts() {
  return useSyncExternalStore(subscribe, () => products)
}

export function useCategories() {
  return useSyncExternalStore(subscribe, () => categories)
}

export function useOrders() {
  return useSyncExternalStore(subscribe, () => orders)
}

export function useSettings() {
  return useSyncExternalStore(subscribe, () => settings)
}

/* ----------------------------- Mutations ------------------------------ */

export function addProduct(data) {
  const id = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
  products = [{ ...data, id }, ...products]
  save(KEYS.products, products)
  emit()
  return id
}

export function updateProduct(id, data) {
  products = products.map((p) => (p.id === id ? { ...p, ...data, id } : p))
  save(KEYS.products, products)
  emit()
}

export function deleteProduct(id) {
  products = products.filter((p) => p.id !== id)
  save(KEYS.products, products)
  emit()
}

export function addCategory(data) {
  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  categories = [...categories, { ...data, slug }]
  save(KEYS.categories, categories)
  emit()
  return slug
}

export function updateCategory(slug, data) {
  categories = categories.map((c) => (c.slug === slug ? { ...c, ...data, slug } : c))
  save(KEYS.categories, categories)
  emit()
}

export function deleteCategory(slug) {
  categories = categories.filter((c) => c.slug !== slug)
  save(KEYS.categories, categories)
  emit()
}

export function addOrder(order) {
  orders = [order, ...orders]
  save(KEYS.orders, orders)
  emit()
}

export function updateOrderStatus(id, status) {
  orders = orders.map((o) => (o.id === id ? { ...o, status } : o))
  save(KEYS.orders, orders)
  emit()
}

export function updateSettings(patch) {
  settings = { ...settings, ...patch }
  save(KEYS.settings, settings)
  emit()
}

export { ORDER_STATUSES }