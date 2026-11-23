import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import { useCart } from '../lib/cart.jsx'
import { formatINR } from '../lib/catalog.js'
import { store } from '../config/store.js'

export default function CartPage() {
  const { lines, count, subtotal, shipping, total, setQty, remove } = useCart()
  const toFree = Math.max(0, store.freeShippingAbove - subtotal)

  return (
    <ShopLayout noindex title="Your bag">
      <section className="shop-hero shop-hero--cart">
        <p className="eyebrow"><span className="eyebrow-line" /> YOUR BAG</p>
        <h1>YOUR <em>SELECTION.</em></h1>\n        <a className="shop-hero-credit" href="https://commons.wikimedia.org/wiki/File:Female_bodybuilder_Aleesha_Young_flexing.jpg" target="_blank" rel="noreferrer">Athlete photo: Aleesha Young · Wikimedia Commons</a>
      </section>

      {lines.length === 0 ? (
        <div className="shop-empty-state">
          <ShoppingBag size={36} aria-hidden="true" />
          <h2>YOUR BAG IS EMPTY.</h2>
          <p>Browse the shop and add something to get started.</p>
          <Link className="shop-btn" to="/shop">GO TO THE SHOP</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-lines">
            {lines.map((line) => {
              const variant = [line.flavour, line.size].filter(Boolean).join(' / ')
              return (
                <li key={line.key} className="cart-line">
                  <div className="cart-line-info">
                    <span>{line.product.brand}</span>
                    <Link to={`/product/${line.id}`}>{line.product.name}</Link>
                    {variant && <small>{variant}</small>}
                    <small>{formatINR(line.unit)} each</small>
                  </div>
                  <div className="qty" role="group" aria-label={`Quantity for ${line.product.name}`}>
                    <button type="button" onClick={() => setQty(line.key, line.qty - 1)} aria-label="Decrease quantity"><Minus size={15} /></button>
                    <output>{line.qty}</output>
                    <button type="button" onClick={() => setQty(line.key, Math.min(store.maxQtyPerItem, line.qty + 1))} aria-label="Increase quantity"><Plus size={15} /></button>
                  </div>
                  <strong className="cart-line-total">{formatINR(line.total)}</strong>
                  <button type="button" className="shop-icon-btn" onClick={() => remove(line.key)} aria-label={`Remove ${line.product.name}`}><X size={17} /></button>
                </li>
              )
            })}
          </ul>

          <aside className="summary" aria-label="Order summary">
            <h2>SUMMARY</h2>
            <dl>
              <div><dt>Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt><dd>{formatINR(subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{shipping ? formatINR(shipping) : 'Free'}</dd></div>
              <div className="summary-total"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
            </dl>
            <p className="summary-note">{toFree > 0 ? `Add ${formatINR(toFree)} more for free shipping.` : 'You get free shipping on this order.'} Prices include taxes. Cash on delivery adds a small fee at checkout.</p>
            <Link className="shop-btn" to="/checkout">CHECKOUT</Link>
            <Link className="shop-link-btn" to="/shop">CONTINUE SHOPPING</Link>
          </aside>
        </div>
      )}
    </ShopLayout>
  )
}
