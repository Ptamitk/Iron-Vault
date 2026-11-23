import { Link } from 'react-router-dom'
import { shopLink } from '../../lib/catalog.js'
import { store } from '../../config/store.js'
import './layout.css'

export default function SiteFooter() {
  const hasContact = store.supportEmail || store.supportPhone || store.address || store.legalName

  return (
    <footer className="site-footer">
      <div className="footer-mark" aria-hidden="true">IRON<span>VAULT</span></div>
      <div className="footer-cols">
        <nav aria-label="Shop">
          <h2>SHOP</h2>
          <Link to={shopLink()}>All products</Link>
          <Link to={shopLink('Pre-Workout')}>Pre-workout</Link>
          <Link to={shopLink('Protein')}>Protein</Link>
          <Link to={shopLink('Creatine')}>Creatine</Link>
          <Link to={shopLink('Hydration')}>Hydration</Link>
          <Link to={shopLink('Herbal & Wellness')}>Herbal &amp; wellness</Link>
        </nav>
        <nav aria-label="Help">
          <h2>HELP</h2>
          <Link to="/cart">Your bag</Link>
          <Link to="/policy/shipping">Shipping</Link>
          <Link to="/policy/returns">Returns &amp; refunds</Link>
          <Link to="/policy/privacy">Privacy</Link>
          <Link to="/policy/terms">Terms of sale</Link>
        </nav>
        <div className="footer-contact">
          <h2>CONTACT</h2>
          {hasContact ? (
            <>
              {store.legalName && <span>{store.legalName}</span>}
              {store.address && <span>{store.address}</span>}
              {store.supportEmail && <a href={`mailto:${store.supportEmail}`}>{store.supportEmail}</a>}
              {store.supportPhone && <a href={`tel:${store.supportPhone}`}>{store.supportPhone}</a>}
            </>
          ) : (
            <span>Contact details will be added here.</span>
          )}
          {store.gstin && <span>GSTIN: {store.gstin}</span>}
          {store.fssai && <span>FSSAI: {store.fssai}</span>}
        </div>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} {store.name}. Product details are summarised from the brands&apos; public information; always read the label on your pack. Supplements are not intended to diagnose, treat, cure or prevent any disease. Not for under-18s, pregnant or nursing women.</p>
    </footer>
  )
}
