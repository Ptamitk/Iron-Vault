import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ProductImage from '../shop/ProductImage.jsx'
import { byId, formatINR } from '../../lib/catalog.js'
import './FeaturedSupplements.css'

// Which products are featured on the landing page (ids from src/data/products.js).
const FEATURED_IDS = ['bl-isolation-2lb', 'bl-hype-reloaded', 'dna-creatine-monohydrate']

export default function FeaturedSupplements() {
  const featured = FEATURED_IDS.map((id) => byId[id]).filter(Boolean)

  return (
    <section className="featured-section" id="supplements" aria-labelledby="featured-title">
      <div className="range-heading">
        <div><p className="eyebrow"><span className="eyebrow-line" /> THE SUPPLEMENTS / 003</p><h2 id="featured-title">FIND YOUR<br /><em>FAVOURITE FUEL.</em></h2></div>
        <p>Hand-picked performance essentials from our partner brands. Start with a favourite, or browse the full range.</p>
      </div>

      <div className="featured-grid">
        {featured.map((product, index) => (
          <article className="feat-card" key={product.id}>
            <Link className="feat-media" to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true"><ProductImage product={product} /></Link>
            <span className="feat-index">{String(index + 1).padStart(2, '0')} / {product.category.toUpperCase()}</span>
            <div className="feat-info">
              <div>
                <h3>{product.name}</h3>
                <p>{product.brand} · {product.priceINR != null ? `${product.priceFrom ? 'From ' : ''}${formatINR(product.priceINR)}` : 'Unavailable'}</p>
              </div>
              <Link className="feat-btn" to={`/product/${product.id}`} aria-label={`View ${product.name}`}><ArrowUpRight size={19} /></Link>
            </div>
          </article>
        ))}
      </div>

      <p className="featured-cta"><Link to="/shop">SHOP ALL PRODUCTS <ArrowUpRight size={15} /></Link></p>
      <p className="demo-disclaimer">Product details are summarised from the brands&apos; public information. Always check the label on your pack. Prices include taxes.</p>
    </section>
  )
}
