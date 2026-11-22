import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../lib/cart.jsx'
import { store } from '../../config/store.js'
import '../../pages/shop.css'

export default function ShopLayout({ title, children }) {
  const { count } = useCart()

  useEffect(() => {
    document.title = title ? `${title} | ${store.name}` : store.name
  }, [title])

  return (
    <div className="shop-shell">
      <a className="shop-skip" href="#shop-main">Skip to content</a>
      <header className="shop-header">
        <Link className="wordmark" to="/" aria-label={`${store.name} home`}>IRON<span>VAULT</span><i>.</i></Link>
        <nav className="shop-nav" aria-label="Shop navigation">
          <Link to="/">HOME</Link>
          <Link to="/shop">SHOP ALL</Link>
        </nav>
        <Link className="shop-bag" to="/cart" aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
          <ShoppingBag size={19} /><span>{count}</span>
        </Link>
      </header>

      <main id="shop-main" className="shop-main">{children}</main>

      <footer className="shop-footer">
        <div>
          <Link className="wordmark" to="/">IRON<span>VAULT</span><i>.</i></Link>
          <p>Performance essentials for the everyday athlete.</p>
        </div>
        <nav aria-label="Policies">
          <Link to="/policy/shipping">Shipping</Link>
          <Link to="/policy/returns">Returns &amp; refunds</Link>
          <Link to="/policy/privacy">Privacy</Link>
          <Link to="/policy/terms">Terms</Link>
        </nav>
        <div className="shop-footer-info">
          {store.legalName && <span>{store.legalName}</span>}
          {store.address && <span>{store.address}</span>}
          {store.supportEmail && <a href={`mailto:${store.supportEmail}`}>{store.supportEmail}</a>}
          {store.supportPhone && <a href={`tel:${store.supportPhone}`}>{store.supportPhone}</a>}
          {store.gstin && <span>GSTIN: {store.gstin}</span>}
          {store.fssai && <span>FSSAI: {store.fssai}</span>}
        </div>
        <small>© {new Date().getFullYear()} {store.name}. Supplements are not intended to diagnose, treat, cure or prevent any disease.</small>
      </footer>
    </div>
  )
}
