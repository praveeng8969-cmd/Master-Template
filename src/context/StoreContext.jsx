import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 * Store context — single source of truth for cart, wishlist and
 * global UI state (drawers, quick view, search). Persisted to
 * localStorage so data survives refreshes.
 */
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('vortexnova_cart', [])
  const [wishlist, setWishlist] = useLocalStorage('vortexnova_wishlist', [])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickView, setQuickView] = useState(null) // product object

  /* ---------------- Cart ---------------- */
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        )
      }
      return [...prev, { id: product.id, product, qty }]
    })
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.min(qty, i.product.stock) } : i
      )
    )
  }

  const clearCart = () => setCart([])

  /* ---------------- Wishlist ---------------- */
  const isWishlisted = (id) => wishlist.some((p) => p.id === id)

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id))
      return false
    }
    setWishlist((prev) => [...prev, product])
    return true
  }

  /* ---------------- Derived values ---------------- */
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const cartItems = cart // cart items carry a `.product` reference

  useEffect(() => {
    document.body.style.overflow = cartOpen || wishlistOpen || searchOpen ? 'hidden' : ''
  }, [cartOpen, wishlistOpen, searchOpen])

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        wishlist,
        isWishlisted,
        toggleWishlist,
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,
        searchOpen,
        setSearchOpen,
        quickView,
        setQuickView,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
