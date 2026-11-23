import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './lib/cart.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import RouteFallback from './components/ui/RouteFallback.jsx'

// Shop pages are loaded on demand so the landing page bundle stays as light as before.
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const PaymentPage = lazy(() => import('./pages/PaymentPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'))
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll />
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            <Route path="/policy/:slug" element={<PolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
