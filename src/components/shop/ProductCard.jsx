import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { useCart } from '../../lib/cart.jsx'
import { formatINR, groupOf, isBuyable } from '../../lib/catalog.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const timer = useRef(null)
  const buyable = isBuyable(product)
  const needsChoice = product.flavours.length > 1 || product.sizes.length > 1
  const href = `/product/${product.id}`

  useEffect(() => () => clearTimeout(timer.current), [])

  const quickAdd = () => {
    add({ id: product.id, flavour: product.flavours[0] || null, size: product.sizes[0]?.label || null })
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="shop-card">
      <Link className="shop-card-media" to={href} tabIndex={-1} aria-hidden="true"><ProductImage product={product} /></Link>
      <Link className="shop-card-body" to={href}>
        <span className="shop-card-top"><b>{product.brand}</b><span>{groupOf(product.category)}</span></span>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
      </Link>
      <div className="shop-card-foot">
        <strong>{buyable ? `${product.priceFrom ? 'From ' : ''}${formatINR(product.priceINR)}` : 'Unavailable'}</strong>
        {buyable && !needsChoice && (
          <button type="button" className={added ? 'shop-add is-added' : 'shop-add'} onClick={quickAdd} aria-label={`Add ${product.name} to bag`}>
            {added ? <><Check size={16} aria-hidden="true" /> ADDED</> : <><Plus size={16} aria-hidden="true" /> ADD</>}
          </button>
        )}
        {buyable && needsChoice && <Link className="shop-add" to={href} aria-label={`Choose options for ${product.name}`}>OPTIONS</Link>}
      </div>
      <span className="sr-only" role="status">{added ? `${product.name} added to bag` : ''}</span>
    </article>
  )
}
