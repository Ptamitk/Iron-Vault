import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Filter, SlidersHorizontal } from 'lucide-react'
import './ApparelShop.css'

const items = [
  { id: 'tee', name: 'THE EVERYDAY TEE', type: 'TOPS', code: '01 / TRAINING TEE', tone: 'sage', detail: 'Relaxed training fit' },
  { id: 'layer', name: 'THE DAILY LAYER', type: 'TOPS', code: '02 / TRAINING LAYER', tone: 'stone', detail: 'Lightweight outer layer' },
  { id: 'jogger', name: 'THE TRAINING JOGGER', type: 'BOTTOMS', code: '03 / TRAINING BOTTOM', tone: 'olive', detail: 'Tapered everyday fit' },
  { id: 'short', name: 'THE MOTION SHORT', type: 'BOTTOMS', code: '04 / TRAINING SHORT', tone: 'charcoal', detail: 'Easy-move silhouette' },
]

function Garment({ tone, id }) {
  return <div className={`apparel-product-art tone-${tone}`} aria-hidden="true">
    <div className={`garment-shape garment-${id}`}><span>IV.</span></div>
    <div className="apparel-art-shadow" />
    <span className="apparel-art-index">IV / OBJECT STUDY</span>
  </div>
}

export default function ApparelShop() {
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState('FEATURED')
  const visibleItems = useMemo(() => {
    const filtered = category === 'ALL' ? [...items] : items.filter((item) => item.type === category)
    return sort === 'A–Z' ? filtered.sort((a, b) => a.name.localeCompare(b.name)) : filtered
  }, [category, sort])

  return <main className="apparel-shop-page">
    <div className="apparel-shop-topline"><span>IRON VAULT / COLLECTION 002</span><span>BUILT FOR THE WORK</span></div>
    <header className="apparel-shop-header">
      <a className="apparel-shop-wordmark" href="/">IRON<span>VAULT</span><i>.</i></a>
      <nav aria-label="Apparel navigation"><a href="/">HOME</a><a className="active" href="/apparel">APPAREL</a></nav>
      <a className="apparel-back-link" href="/"><ArrowLeft size={15} /> BACK TO HOME</a>
    </header>
    <section className="apparel-shop-hero">
      <div className="apparel-shop-hero-copy">
        <p className="apparel-shop-eyebrow"><span /> PERFORMANCE APPAREL / 002</p>
        <h1>MADE TO<br /><em>MOVE.</em></h1>
        <p>Considered training essentials. Clean silhouettes, purposeful details, and room to move through every part of your day.</p>
        <a href="#apparel-catalogue" className="apparel-shop-cta">EXPLORE THE COLLECTION <ArrowUpRight size={16} /></a>
      </div>
      <div className="apparel-shop-hero-art" aria-label="Abstract apparel collection visual">
        <div className="hero-art-ring" /><div className="hero-art-crosshair" />
        <div className="hero-tee-shape"><span>IV.</span></div>
        <span className="hero-art-label">FORM / FUNCTION<br />SERIES 002</span>
        <span className="hero-art-number">02</span>
      </div>
      <div className="apparel-shop-hero-foot"><span>01 — EVERYDAY PERFORMANCE</span><span>DESIGNED TO BE WORN. MADE TO BE USED.</span></div>
    </section>
    <section className="apparel-catalogue" id="apparel-catalogue">
      <div className="apparel-catalogue-heading">
        <div><p className="apparel-shop-eyebrow"><span /> THE LINEUP / 004</p><h2>THE DAILY<br /><em>ROTATION.</em></h2></div>
        <p>Four concept pieces. One considered uniform. Final styles, colours, sizes and product photography can be added when the collection is confirmed.</p>
      </div>
      <div className="apparel-toolbar">
        <div className="apparel-filters" aria-label="Filter apparel">
          {['ALL', 'TOPS', 'BOTTOMS'].map((value) => <button key={value} className={category === value ? 'selected' : ''} onClick={() => setCategory(value)} type="button">{value}</button>)}
        </div>
        <label className="apparel-sort"><SlidersHorizontal size={15} /><span>SORT</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>FEATURED</option><option>A–Z</option></select></label>
      </div>
      <div className="apparel-product-grid">
        {visibleItems.map((item, index) => <article className="apparel-shop-card" key={item.id}>
          <Garment tone={item.tone} id={item.id} />
          <div className="apparel-shop-card-meta"><span>{item.code}</span><span>0{index + 1} / 0{visibleItems.length}</span></div>
          <h3>{item.name}</h3><p>{item.detail}</p>
          <span className="apparel-concept-tag">COLLECTION CONCEPT</span>
        </article>)}
      </div>
      <p className="apparel-shop-disclaimer"><Filter size={13} /> CONCEPT CATALOGUE — NO LIVE STOCK, PRICING OR CHECKOUT IS CONNECTED.</p>
    </section>
    <footer className="apparel-shop-footer"><a className="apparel-shop-wordmark" href="/">IRON<span>VAULT</span><i>.</i></a><span>BUILT WITH INTENT. WORN WITH PURPOSE.</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>BACK TO TOP ↑</a></footer>
  </main>
}
