import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Heart, Minus, Plus } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import ProductCard from '../components/shop/ProductCard.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import ProductImage from '../components/shop/ProductImage.jsx'
import { useCart } from '../lib/cart.jsx'
import { byId, formatINR, groupOf, isBuyable } from '../lib/catalog.js'
import { products } from '../data/products.js'
import { store } from '../config/store.js'
import { useWishlist } from '../features/wishlist/useWishlist.js'
import SEO from '../components/seo/SEO.jsx'

function ProductView({ product }) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const isSaved = has(product.id)
  const [flavour, setFlavour] = useState(product.flavours[0] || null)
  const [size, setSize] = useState(product.sizes[0]?.label || null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const timer = useRef(null)
  const buyable = isBuyable(product)
  const facts = product.facts.filter((fact) => fact.ingredient)
  const related = products
    .filter((other) => other.id !== product.id && groupOf(other.category) === groupOf(product.category))
    .slice(0, 3)

  useEffect(() => () => clearTimeout(timer.current), [])

  const addToBag = () => {
    add({ id: product.id, flavour, size, qty })
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 2200)
  }

  return (
    <ShopLayout title={product.name}>
      <SEO title={product.name} description={product.summary} path={'/product/' + product.id} image={product.image} type="product" />
      <nav className="shop-crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link><span aria-hidden="true">/</span><span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-visual"><ProductImage product={product} eager className="pimg-large" /></div>

        <div className="pdp-info">
          <p className="eyebrow"><span className="eyebrow-line" /> {product.brand.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <button type="button" className={isSaved ? 'pdp-save is-saved' : 'pdp-save'} onClick={() => toggle(product.id)} aria-pressed={isSaved}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}</button>
          <p className="pdp-price">{buyable ? `${product.priceFrom ? 'From ' : ''}${formatINR(product.priceINR)}` : 'Currently unavailable'}<small> incl. taxes</small></p>
          <p className="pdp-summary">{product.summary}</p>

          {product.flavours.length > 0 && (
            <fieldset className="pdp-options">
              <legend>FLAVOUR</legend>
              <div>
                {product.flavours.map((option) => (
                  <button type="button" key={option} className={flavour === option ? 'is-active' : undefined} aria-pressed={flavour === option} onClick={() => setFlavour(option)}>{option}</button>
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className="pdp-options">
              <legend>SIZE</legend>
              <div>
                {product.sizes.map((option) => (
                  <button type="button" key={option.label} className={size === option.label ? 'is-active' : undefined} aria-pressed={size === option.label} onClick={() => setSize(option.label)}>{option.label}</button>
                ))}
              </div>
            </fieldset>
          )}

          {buyable && (
            <div className="pdp-buy">
              <div className="qty" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
                <output aria-live="polite">{qty}</output>
                <button type="button" onClick={() => setQty((n) => Math.min(store.maxQtyPerItem, n + 1))} aria-label="Increase quantity"><Plus size={15} /></button>
              </div>
              <button type="button" className="shop-btn" onClick={addToBag}>{added ? <><Check size={16} /> ADDED TO BAG</> : 'ADD TO BAG'}</button>
            </div>
          )}
          {added && <p className="pdp-added" role="status"><Link to="/cart">View bag</Link> or <Link to="/checkout">go to checkout</Link></p>}

          <dl className="pdp-meta">
            {product.servingSize && (<div><dt>SERVING</dt><dd>{product.servingSize}</dd></div>)}
            {product.usage && (<div><dt>DIRECTIONS</dt><dd>{product.usage}</dd></div>)}
          </dl>

          {facts.length > 0 && (
            <section className="pdp-block">
              <h2>INGREDIENTS &amp; AMOUNTS</h2>
              <ul className="pdp-facts">
                {facts.map((fact) => (<li key={fact.ingredient}><span>{fact.ingredient}</span><b>{fact.amount ?? 'Per label'}</b></li>))}
              </ul>
            </section>
          )}

          {product.warnings.length > 0 && (
            <section className="pdp-block">
              <h2>CAUTIONS</h2>
              <ul className="pdp-warnings">{product.warnings.map((warning) => (<li key={warning}>{warning}</li>))}</ul>
            </section>
          )}

          <p className="pdp-legal">Check the label on the pack before use. Not for under-18s, pregnant or nursing women. Consult a physician if you have a medical condition or take medication. This product is not intended to diagnose, treat, cure or prevent any disease.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pdp-related" aria-label="Related products">
          <h2>YOU MAY ALSO LIKE</h2>
          <div className="shop-grid">{related.map((other) => (<ProductCard key={other.id} product={other} />))}</div>
        </section>
      )}
    </ShopLayout>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const product = byId[id]
  return product ? <ProductView key={product.id} product={product} /> : <NotFoundPage />
}
