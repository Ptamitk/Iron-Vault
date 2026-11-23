import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import ProductCard from '../components/shop/ProductCard.jsx'
import { products } from '../data/products.js'
import { groupOf } from '../lib/catalog.js'

const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.priceINR - b.priceINR },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.priceINR - a.priceINR },
  name: { label: 'Name A-Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

const haystack = (product) =>
  [product.name, product.brand, product.category, ...product.flavours, ...product.facts.map((fact) => fact.ingredient)]
    .join(' ')
    .toLowerCase()

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const category = params.get('cat') || 'All'
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'featured'

  const groups = useMemo(() => ['All', ...new Set(products.map((product) => groupOf(product.category)))], [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products
      .filter((product) => category === 'All' || groupOf(product.category) === category)
      .filter((product) => !needle || haystack(product).includes(needle))
      .slice()
      .sort(SORTS[sort].fn)
  }, [query, category, sort])

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === 'All' || value === 'featured') next.delete(key)
      else next.set(key, value)
    })
    setParams(next, { replace: true })
  }

  return (
    <ShopLayout title="Shop">
      <section className="shop-hero">
        <p className="eyebrow"><span className="eyebrow-line" /> THE SHOP</p>
        <h1>ALL <em>PRODUCTS.</em></h1>
        <p className="shop-lede">Performance essentials from our partner brands. Prices include taxes.</p>
      </section>

      <section className="shop-controls" aria-label="Filter and sort products">
        <label className="shop-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input type="search" placeholder="SEARCH PRODUCTS" value={query} onChange={(event) => update({ q: event.target.value })} />
        </label>
        <label className="shop-sort">
          <span>SORT</span>
          <select value={sort} onChange={(event) => update({ sort: event.target.value })}>
            {Object.entries(SORTS).map(([value, { label }]) => (<option key={value} value={value}>{label}</option>))}
          </select>
        </label>
        <div className="shop-chips" role="group" aria-label="Filter by category">
          {groups.map((group) => (
            <button type="button" key={group} className={category === group ? 'is-active' : undefined} aria-pressed={category === group} onClick={() => update({ cat: group })}>{group}</button>
          ))}
        </div>
      </section>

      <p className="shop-count" role="status">{visible.length} {visible.length === 1 ? 'product' : 'products'}{(query || category !== 'All') && <> · <button type="button" className="shop-link-btn" style={{ display: 'inline-flex', minHeight: 0, border: 0, background: 'none', textDecoration: 'underline' }} onClick={() => setParams({}, { replace: true })}>Clear filters</button></>}</p>
      {visible.length > 0 ? (
        <div className="shop-grid">{visible.map((product) => (<ProductCard key={product.id} product={product} />))}</div>
      ) : (
        <div className="shop-empty">
          <p>No products match your search. Try a different keyword or category.</p>
          <button type="button" className="shop-btn" style={{ width: 'auto' }} onClick={() => setParams({}, { replace: true })}>CLEAR FILTERS</button>
        </div>
      )}
    </ShopLayout>
  )
}
