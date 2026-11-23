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
    <section className="featured" id="supplements" aria-labelledby="featured-title">
      <header className="featured-head" data-reveal>
        <p className="eyebrow"><span className="eyebrow-line" />HAND-PICKED</p>
        <h2 id="featured-title" className="display">FIND YOUR<br /><span className="outline">FAVOURITE FUEL</span></h2>
      </header>

      {featured.map((product, index) => (
        <article className={index % 2 ? 'feat-row is-flip' : 'feat-row'} key={product.id}>
          <Link className="feat-media" to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true" data-parallax>
            <ProductImage product={product} />
          </Link>
          <div className="feat-copy" data-reveal>
            <span className="feat-num">{String(index + 1).padStart(2, '0')}</span>
            <p className="eyebrow">{product.brand} / {product.category}</p>
            <h3 className="display">{product.name}</h3>
            <p className="feat-text">{product.summary}</p>
            <div className="feat-meta">
              <strong>{product.priceINR != null ? `${product.priceFrom ? 'From ' : ''}${formatINR(product.priceINR)}` : 'Unavailable'}</strong>
              <Link className="btn" to={`/product/${product.id}`}>VIEW PRODUCT <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </article>
      ))}

      <p className="featured-cta" data-reveal><Link className="text-link" to="/shop">SHOP ALL PRODUCTS <ArrowUpRight size={16} aria-hidden="true" /></Link></p>
    </section>
  )
}
