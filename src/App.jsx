import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import FloatingButtons from './components/layout/FloatingButtons.jsx'
import CartDrawer from './components/layout/CartDrawer.jsx'
import WishlistDrawer from './components/layout/WishlistDrawer.jsx'
import SearchOverlay from './components/layout/SearchOverlay.jsx'
import QuickView from './components/product/QuickView.jsx'
import ToastViewport from './components/ui/ToastViewport.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Categories from './pages/Categories.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Wishlist from './pages/Wishlist.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import FAQ from './pages/FAQ.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Products from './pages/admin/Products.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import CategoriesAdmin from './pages/admin/Categories.jsx'
import Orders from './pages/admin/Orders.jsx'
import Settings from './pages/admin/Settings.jsx'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute.jsx'

/** Wraps each route with a smooth fade/slide page transition. */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Admin — separate flow from the customer experience */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

/** Hides the customer chrome (navbar, footer, drawers) on admin routes. */
function AppShell() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatedRoutes />
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <>
          <CartDrawer />
          <WishlistDrawer />
          <SearchOverlay />
          <QuickView />
          <FloatingButtons />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <StoreProvider>
            <AppShell />
            <ToastViewport />
          </StoreProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}