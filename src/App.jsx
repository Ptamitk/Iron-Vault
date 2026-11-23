import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SiteHeader from './components/layout/SiteHeader.jsx'
import SiteFooter from './components/layout/SiteFooter.jsx'
import ProductImage from './components/shop/ProductImage.jsx'
import FeaturedSupplements from './components/sections/FeaturedSupplements.jsx'
import ProductShowcase from './components/sections/ProductShowcase.jsx'
import { products } from './data/products.js'
import { byId, formatINR, groupOf, shopLink } from './lib/catalog.js'
import { store } from './config/store.js'
import './App.css'
import SEO from './components/seo/SEO.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HERO_PRODUCT = 'bl-hype-reloaded'
const HERO_WORDS = ['TRAIN.', 'FUEL.', 'RECOVER.', 'REPEAT.']
const MARQUEE = ['PRE-WORKOUT', 'PROTEIN', 'CREATINE', 'HYDRATION', 'AMINO ACIDS', 'WELLNESS']
const CTA_WORDS = ['STRONGER', 'FASTER', 'LEANER', 'HARDER']

const TABS = [
  { key: 'Pre-Workout', label: 'Pre-Workout', blurb: 'Energy, focus and pump for the session ahead. Stimulant and stimulant-free options.' },
  { key: 'Protein', label: 'Protein', blurb: 'Clean protein to help you hit your daily target and support recovery.' },
  { key: 'Creatine', label: 'Creatine', blurb: 'The most-studied supplement in sport, in simple, single-ingredient formats.' },
  { key: 'Herbal & Wellness', label: 'Wellness', blurb: 'Everyday support for the hours you are not in the gym.' },
]

const FAQ = [
  ['Are the products genuine?', 'Iron Vault sells products from our partner brands, Blackstone Labs and DNA Sports. Every product page lists the brand, so you always know who made what you are buying.'],
  ['How long does delivery take?', `We deliver across India. Orders above ${formatINR(store.freeShippingAbove)} ship free; below that a flat ${formatINR(store.shippingFee)} applies. Exact timelines are on the shipping page.`],
  ['Can I see the ingredients before I buy?', 'Yes. Each product page has the supplement facts, suggested use and warnings, taken from the brand. Always read the label on your pack as well.'],
  ['What payment options are there?', 'Pay securely online at checkout. Cash on delivery may also be offered where available, with a small handling fee.'],
  ['What if I receive the wrong or a damaged item?', 'Contact us with your order details and a photo. Our returns page explains what we can replace or refund.'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="display" data-reveal>QUESTIONS,<br /><span className="outline">ANSWERED</span></h2>
      <div className="faq-list">
        {FAQ.map(([question, answer], index) => {
          const isOpen = open === index
          return (
            <div className={isOpen ? 'faq-item is-open' : 'faq-item'} key={question} data-reveal>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={`faq-${index}`} onClick={() => setOpen(isOpen ? -1 : index)}>
                  <span>{question}</span><Plus size={26} aria-hidden="true" />
                </button>
              </h3>
              <div className="faq-body" id={`faq-${index}`} role="region"><div><p>{answer}</p></div></div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Fuel() {
  const [tab, setTab] = useState(TABS[0].key)
  const current = TABS.find((item) => item.key === tab)
  const list = products.filter((product) => groupOf(product.category) === tab && product.priceINR != null).slice(0, 4)

  return (
    <section className="fuel" aria-labelledby="fuel-title">
      <div className="fuel-head" data-reveal>
        <p className="eyebrow"><span className="eyebrow-line" />THE RANGE</p>
        <h2 id="fuel-title" className="display">BUILT FOR<br />EVERY GOAL</h2>
      </div>
      <div className="fuel-tabs" role="tablist" aria-label="Product categories">
        {TABS.map((item) => (
          <button key={item.key} type="button" role="tab" id={`tab-${item.key}`} aria-selected={tab === item.key} aria-controls="fuel-panel" className={tab === item.key ? 'is-active' : ''} onClick={() => setTab(item.key)}>{item.label}</button>
        ))}
      </div>
      <div className="fuel-panel" id="fuel-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <p className="fuel-blurb">{current.blurb}</p>
        <div className="fuel-grid">
          {list.map((product) => (
            <Link className="fuel-card" key={product.id} to={`/product/${product.id}`}>
              <ProductImage product={product} />
              <span className="fuel-brand">{product.brand}</span>
              <strong>{product.name}</strong>
              <span className="fuel-price">{product.priceFrom ? 'From ' : ''}{formatINR(product.priceINR)}</span>
            </Link>
          ))}
        </div>
        <Link className="text-link" to={shopLink(tab)}>SHOP {current.label.toUpperCase()} <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const hero = byId[HERO_PRODUCT]
  const brands = new Set(products.map((product) => product.brand)).size

  useGSAP(
    () => {
      const motion = gsap.matchMedia()
      motion.add('(prefers-reduced-motion: no-preference)', () => {
        // Hero: words rise out of masks, product slides in.
        const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
        intro
          .from('.hero-word span', { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.1)
          .from('.hero-sub, .hero-actions', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 0.7)
          .from('.hero-media', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power3.inOut' }, 0.2)
          .from('.hero-stat', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 1)

        gsap.to('.hero-media img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
        gsap.to('.hero-words', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

        // Count-up stats.
        gsap.utils.toArray('[data-count]').forEach((node) => {
          const target = Number(node.dataset.count)
          const state = { value: 0 }
          gsap.to(state, {
            value: target, duration: 1.6, ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 92%', once: true },
            onUpdate: () => { node.textContent = String(Math.round(state.value)) },
          })
        })

        // Generic reveal for anything marked data-reveal.
        gsap.utils.toArray('[data-reveal]').forEach((node) => {
          gsap.from(node, { y: 50, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } })
        })

        // Feature images drift slightly against the scroll.
        gsap.utils.toArray('[data-parallax] img').forEach((img) => {
          gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } })
        })

        // Marquee speeds up while scrolling fast.
        const track = gsap.to('.marquee-track', { xPercent: -50, ease: 'none', duration: 28, repeat: -1 })
        ScrollTrigger.create({
          trigger: document.body, start: 0, end: 'max',
          onUpdate: (self) => { gsap.to(track, { timeScale: 1 + Math.min(4, Math.abs(self.getVelocity()) / 400), duration: 0.3, overwrite: true }); gsap.to(track, { timeScale: 1, delay: 0.3, duration: 1 }) },
        })

        // Rotating words in the closing call to action.
        const words = gsap.utils.toArray('.cta-word')
        if (words.length > 1) {
          gsap.set(words, { yPercent: 110 })
          gsap.set(words[0], { yPercent: 0 })
          const loop = gsap.timeline({ repeat: -1 })
          words.forEach((word, i) => {
            const next = words[(i + 1) % words.length]
            loop.to(word, { yPercent: -110, duration: 0.7, ease: 'power3.inOut' }, '+=1.4')
              .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' }, '<')
          })
        }
      })
      return () => motion.revert()
    },
    { scope: rootRef },
  )

  return (
    <div className="landing" ref={rootRef}>
      <SEO title="Performance Supplements" description="Shop international performance nutrition brands at Iron Vault. Explore pre-workout, protein, creatine and training essentials." path="/" />
      <SiteHeader variant="overlay" />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="sr-only">Iron Vault. Train, fuel, recover, repeat.</h1>
          <div className="hero-words display" aria-hidden="true">
            {HERO_WORDS.map((word, index) => (
              <span className={index % 2 ? 'hero-word is-outline' : 'hero-word'} key={word}><span>{word}</span></span>
            ))}
          </div>
          <div className="hero-athletes" aria-label="Full-body male and female bodybuilding athlete photography" role="img" />
          {hero && (
            <Link className="hero-media" to={`/product/${hero.id}`} aria-label={`View ${hero.name}`}>
              <ProductImage product={hero} eager />
              <span className="hero-tag">{hero.brand}<b>{hero.name}</b></span>
            </Link>
          )}
          <div className="hero-foot">
            <p className="hero-sub">Performance supplements from trusted brands, with every ingredient listed up front. Pick your goal and shop it in a minute.</p>
            <div className="hero-actions">
              <Link className="btn" to="/shop">SHOP NOW <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link className="btn btn-ghost" to={shopLink('Protein')}>SHOP PROTEIN</Link>
            </div>
            <dl className="hero-stats">
              <div className="hero-stat"><dt>PRODUCTS</dt><dd><span data-count={products.length}>{products.length}</span>+</dd></div>
              <div className="hero-stat"><dt>PARTNER BRANDS</dt><dd><span data-count={brands}>{brands}</span></dd></div>
              <div className="hero-stat"><dt>FREE SHIPPING</dt><dd>{formatINR(store.freeShippingAbove)}+</dd></div>
            </dl>
          </div>
          <p className="hero-photo-credit">Athlete photos: <a href="https://commons.wikimedia.org/wiki/File:Arnold_Schwarzenegger_1971.jpg" target="_blank" rel="noreferrer">Arnold Schwarzenegger</a> · <a href="https://commons.wikimedia.org/wiki/File:Rita_Jairath.jpg" target="_blank" rel="noreferrer">Rita Jairath</a> · Wikimedia Commons</p>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-set" key={copy}>
                {MARQUEE.map((item) => (<span key={item + copy}>{item}<i /></span>))}
                {MARQUEE.map((item) => (<span key={item + copy + 'b'}>{item}<i /></span>))}
              </div>
            ))}
          </div>
        </div>

        <FeaturedSupplements />
        <ProductShowcase />

        <Fuel />

        <section className="trust" aria-label="Why Iron Vault">
          <ul>
            <li data-reveal><b>01</b><h3>INGREDIENTS UP FRONT</h3><p>Supplement facts, suggested use and warnings on every product page.</p></li>
            <li data-reveal><b>02</b><h3>TRUSTED BRANDS</h3><p>We stock products from our partner brands, labelled clearly by brand.</p></li>
            <li data-reveal><b>03</b><h3>DELIVERED ACROSS INDIA</h3><p>Free shipping above {formatINR(store.freeShippingAbove)}.</p></li>
            <li data-reveal><b>04</b><h3>SECURE CHECKOUT</h3><p>Pay online securely. Your order details stay private.</p></li>
          </ul>
        </section>

        <Faq />

        <section className="cta" aria-labelledby="cta-title">
          <h2 id="cta-title" className="display">
            <span>GET</span>
            <span className="cta-rotator" aria-label="stronger, faster, leaner, harder">
              {CTA_WORDS.map((word) => (<span className="cta-word" aria-hidden="true" key={word}>{word}</span>))}
            </span>
          </h2>
          <Link className="btn" to="/shop">START SHOPPING <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
