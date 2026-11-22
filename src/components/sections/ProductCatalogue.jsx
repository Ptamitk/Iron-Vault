import { useMemo, useState } from 'react'
import { products } from '../../data/products.js'
import './ProductCatalogue.css'

const groupOf = (category) => (category.startsWith('Pre-Workout') ? 'Pre-Workout' : category)

function ProductCard({ product }) {
  const { brand, name, category, flavours, servingSize, facts, usage, warnings, summary, sizes, priceINR } = product
  const knownFacts = facts.filter((fact) => fact.ingredient)

  return (
    <article className="catalogue-card">
      <header className="catalogue-card-head">
        <span className="catalogue-brand">{brand}</span>
        <span className="catalogue-category">{category}</span>
      </header>

      <h3>{name}</h3>
      <p className="catalogue-summary">{summary}</p>

      <dl className="catalogue-meta">
        {servingSize && (<div><dt>Serving</dt><dd>{servingSize}</dd></div>)}
        {sizes.length > 0 && (<div><dt>Sizes</dt><dd>{sizes.map((size) => size.label).join(' / ')}</dd></div>)}
        {flavours.length > 0 && (<div><dt>Flavours</dt><dd>{flavours.join(', ')}</dd></div>)}
        {priceINR != null && (<div><dt>Price</dt><dd>₹{priceINR.toLocaleString('en-IN')}</dd></div>)}
      </dl>

      {knownFacts.length > 0 && (
        <details className="catalogue-details">
          <summary>Ingredients &amp; amounts</summary>
          <ul>
            {knownFacts.map((fact) => (
              <li key={fact.ingredient}><span>{fact.ingredient}</span><b>{fact.amount ?? '—'}</b></li>
            ))}
          </ul>
        </details>
      )}

      {(usage || warnings.length > 0) && (
        <details className="catalogue-details">
          <summary>Usage &amp; cautions</summary>
          {usage && <p>{usage}</p>}
          {warnings.length > 0 && (
            <ul className="catalogue-warnings">
              {warnings.map((warning) => (<li key={warning}>{warning}</li>))}
            </ul>
          )}
        </details>
      )}
    </article>
  )
}

export default function ProductCatalogue() {
  const groups = useMemo(() => ['All', ...new Set(products.map((product) => groupOf(product.category)))], [])
  const [active, setActive] = useState('All')
  const visible = active === 'All' ? products : products.filter((product) => groupOf(product.category) === active)

  return (
    <section className="catalogue-section" id="catalogue" aria-labelledby="catalogue-title">
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> THE CATALOGUE / 004</p>
          <h2 id="catalogue-title">BUILT FOR<br /><em>THE GRIND.</em></h2>
        </div>
        <p>Performance essentials from our partner brands. Open a card for ingredients, directions and cautions.</p>
      </div>

      <div className="catalogue-filters" role="group" aria-label="Filter products by category">
        {groups.map((group) => (
          <button
            type="button"
            key={group}
            className={active === group ? 'is-active' : undefined}
            aria-pressed={active === group}
            onClick={() => setActive(group)}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="catalogue-grid">
        {visible.map((product) => (<ProductCard key={product.id} product={product} />))}
      </div>

      <p className="catalogue-disclaimer">
        Details are summarised from the brands&apos; public product pages and must be checked against the label on the pack. Prices and availability to be confirmed. These products are not intended to diagnose, treat, cure or prevent any disease. Not for under-18s, pregnant or nursing women. Consult a physician if you have a medical condition or take medication.
      </p>
    </section>
  )
}
