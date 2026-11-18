import { useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag, MoveUpRight, X, Plus, ChevronDown, Check } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import ProductExperience from './components/sections/ProductExperience.jsx'
import './App.css'

const App = () => {
  const pageRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [newsletterSent, setNewsletterSent] = useState(false)
  const addToBag = () => setCartCount((count) => count + 1)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    // One smooth-scroll engine drives both the page and GSAP ScrollTrigger.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.35,
    })
    const syncScroll = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(syncScroll)
    gsap.ticker.lagSmoothing(0)

    // Pointer-responsive depth for the hero object and collection cards.
    const tiltTargets = pageRef.current?.querySelectorAll('.category-card, .hero-art, .standard-item') ?? []
    const cleanups = []
    tiltTargets.forEach((element) => {
      const move = (event) => {
        const rect = element.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * (element.classList.contains('category-card') ? 10 : 5)
        const rotateX = (0.5 - py) * (element.classList.contains('category-card') ? 8 : 4)
        element.style.setProperty('--pointer-x', `${px * 100}%`)
        element.style.setProperty('--pointer-y', `${py * 100}%`)
        element.style.setProperty('--tilt-x', `${rotateX}deg`)
        element.style.setProperty('--tilt-y', `${rotateY}deg`)
      }
      const leave = () => {
        element.style.setProperty('--tilt-x', '0deg')
        element.style.setProperty('--tilt-y', '0deg')
        element.style.setProperty('--pointer-x', '50%')
        element.style.setProperty('--pointer-y', '50%')
      }
      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', leave)
      })
    })

    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-kicker, .hero h1, .hero-description, .hero-actions', {
        y: 45, autoAlpha: 0, duration: 1, stagger: 0.13, ease: 'power4.out', delay: 0.15,
      })
      gsap.from('.hero-art', {
        y: 90, scale: 0.88, rotate: 4, autoAlpha: 0, duration: 1.35, ease: 'power4.out', delay: 0.25,
      })
      gsap.to('.hero-art .protein-tub', {
        y: 85, rotate: 7, scale: 0.9, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.hero-art .orbit-one', {
        rotation: 32, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      })
      gsap.from('.manifesto-line', {
        yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out',
        scrollTrigger: { trigger: '.manifesto-section', start: 'top 72%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.editorial-visual', {
        clipPath: 'inset(12% 12% 12% 12%)', scale: 0.9, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.editorial-section', start: 'top 70%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.editorial-copy > *', {
        y: 35, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.editorial-section', start: 'top 68%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo('.category-card', {
        y: 130, rotateX: 10, autoAlpha: 0.25, scale: 0.92, transformPerspective: 1200,
      }, {
        y: 0, rotateX: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.category-grid', start: 'top 88%', end: 'top 35%', scrub: 1 },
      })
      gsap.to('.category-art', {
        yPercent: -18, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.category-grid', start: 'top bottom', end: 'bottom top', scrub: 1.3 },
      })
      gsap.from('.standard-item', {
        y: 55, autoAlpha: 0, duration: 0.8, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: '.standards-grid', start: 'top 78%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.flavour-card, .apparel-feature-card', { y: 70, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.flavour-grid', start: 'top 82%', toggleActions: 'play none none reverse' } })
      gsap.from('.faq-row', { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: '.faq-list', start: 'top 82%', toggleActions: 'play none none reverse' } })
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.site-shell', start: 'top top', end: 'bottom bottom', scrub: true } })
      gsap.from('.closing-title', {
        y: 80, autoAlpha: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.closing-section', start: 'top 75%', toggleActions: 'play none none reverse' },
      })
    })
    return () => {
      motion.revert()
      cleanups.forEach((cleanup) => cleanup())
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(syncScroll)
      lenis.destroy()
    }
  }, { scope: pageRef })

  return (
    <main className="site-shell" ref={pageRef}>
      <div className="announcement-bar">
        <span>BUILT FOR THE WORK</span><span>PERFORMANCE. WITHOUT COMPROMISE.</span><span>INDIA <span aria-hidden="true">↗</span></span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Iron Vault home">IRON<span>VAULT</span><i>.</i></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">SHOP ALL</a><a href="#philosophy">OUR PHILOSOPHY</a><a href="#standards">THE STANDARD</a>
        </nav>
        <div className="header-actions">
          <a className="shop-link" href="#shop">SHOP NOW <ArrowUpRight size={15} /></a>
          <button className="icon-button bag-button" type="button" aria-label={'Open shopping bag, ' + cartCount + ' items'} onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span className="bag-count">{cartCount}</span></button>
          <button className="icon-button mobile-menu" type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>
      <div className={mobileOpen ? 'mobile-nav is-open' : 'mobile-nav'} aria-hidden={!mobileOpen}>
        <a href="#shop" onClick={() => setMobileOpen(false)}>SHOP THE COLLECTION <ArrowUpRight size={17} /></a>
        <a href="#philosophy" onClick={() => setMobileOpen(false)}>OUR PHILOSOPHY <ArrowUpRight size={17} /></a>
        <a href="#standards" onClick={() => setMobileOpen(false)}>THE STANDARD <ArrowUpRight size={17} /></a>
      </div>
      <div className="scroll-progress" aria-hidden="true" />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span className="eyebrow-line" /> BUILT FOR THE ONES WHO SHOW UP</p>
          <h1>THE WORK<br />IS <em>THE</em><br /><em>REWARD.</em></h1>
          <p className="hero-description">Performance essentials for the everyday athlete. Made to support the work you put in, day after day.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#shop">EXPLORE THE VAULT <ArrowUpRight size={16} /></a>
            <a className="hero-discover" href="#philosophy"><span className="discover-icon"><ArrowDown size={16} /></span> DISCOVER OUR APPROACH</a>
          </div>
        </div>

        <div className="hero-art" aria-label="Iron Vault performance protein product illustration">
          <div className="hero-art-label hero-art-label-top"><span>OBJECT / 001</span><span>PERFORMANCE SERIES</span></div>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="product-glow" /><div className="product-shadow" />
          <div className="protein-tub">
            <div className="tub-lid" /><div className="tub-body">
              <div className="tub-topline">IRON VAULT / PERFORMANCE SERIES</div>
              <div className="tub-brand">IRON<br /><b>VAULT</b></div><div className="tub-divider" />
              <div className="tub-product">WHEY<br />PROTEIN</div><div className="tub-flavour">DARK COCOA · PREMIUM BLEND</div>
              <div className="tub-footer"><span>24G<br />PROTEIN</span><span>01<br />KG</span></div>
            </div>
          </div>
          <div className="hero-art-label hero-art-label-bottom"><span>01 — DAILY FUEL</span><span>FORM FOLLOWS FUNCTION</span></div>
          <span className="vertical-note">NO SHORTCUTS. JUST SHOW UP.</span>
        </div>
        <div className="hero-scroll-cue"><span>SCROLL TO EXPLORE</span><span className="scroll-cue-line" /></div>
      </section>

      <section className="ticker" aria-label="Brand values"><div>DISCIPLINE IS A DAILY PRACTICE <span>✳</span> BUILT FOR PROGRESS <span>✳</span> EARN YOUR EDGE <span>✳</span> DISCIPLINE IS A DAILY PRACTICE <span>✳</span></div></section>

      <section className="manifesto-section" id="philosophy">
        <p className="eyebrow"><span className="eyebrow-line" /> THE IRON VAULT MINDSET / 001</p>
        <div className="manifesto-copy">
          <div className="manifesto-line">YOU DON'T NEED</div>
          <div className="manifesto-line manifesto-accent">ANOTHER SHORTCUT.</div>
          <div className="manifesto-line">YOU NEED A</div>
          <div className="manifesto-line">STANDARD.</div>
        </div>
        <div className="manifesto-foot"><span>BUILT ON CONSISTENCY.</span><p>For the early starts, the last reps, and every quiet decision to keep going. This is for the work behind the result.</p></div>
      </section>

      <ProductExperience />

      <section className="editorial-section">
        <div className="editorial-visual">
          <div className="editorial-visual-grid" />
          <div className="editorial-big-type">IV<span>.</span></div>
          <div className="editorial-stamp">DISCIPLINE<br />OVER<br />MOTIVATION</div>
          <span className="editorial-visual-caption">IRON VAULT / FIELD NOTES 001</span>
        </div>
        <div className="editorial-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> MORE THAN A MOMENT</p>
          <h2>SHOW UP.<br /><em>STACK DAYS.</em></h2>
          <p>Progress isn't a moment. It's the work you put in when nobody's watching. We believe in considered essentials, honest standards, and the power of showing up consistently.</p>
          <a className="text-link" href="#standards">OUR PHILOSOPHY <ArrowUpRight size={16} /></a>
          <span className="editorial-index">02 / THE MINDSET</span>
        </div>
      </section>

      <section className="collection-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> THE COLLECTION / 002</p><h2>FIND YOUR<br /><em>EVERYDAY EDGE.</em></h2></div>
          <a className="text-link" href="#standards">VIEW THE STANDARD <ArrowUpRight size={16} /></a>
        </div>
        <div className="category-grid">
          <a className="category-card supplements-card" href="#standards">
            <span className="category-number">01 / PERFORMANCE NUTRITION</span>
            <span className="category-art supplement-art" aria-hidden="true"><span className="art-orbit-ring" /><span className="art-glow" /><span className="mini-tub"><i /><b>IRON<br />VAULT</b><small>WHEY<br />PROTEIN</small><em>24G PROTEIN</em></span><span className="art-caption">DAILY FUEL / 001</span></span>
            <span className="category-title">FUEL<br />YOUR <em>FOCUS.</em></span>
            <span className="category-cta">EXPLORE SUPPLEMENTS <ArrowUpRight size={16} /></span>
          </a>
          <a className="category-card apparel-card" href="#standards">
            <span className="category-number">02 / TRAINING APPAREL</span>
            <span className="category-art apparel-art" aria-hidden="true"><span className="apparel-halo" /><span className="shirt-shape"><i>IV</i></span><span className="art-caption">TRAINING / SERIES 002</span></span>
            <span className="category-title">MADE TO<br /><em>MOVE.</em></span>
            <span className="category-cta">EXPLORE APPAREL <ArrowUpRight size={16} /></span>
          </a>
        </div>
      </section>

      <section className="flavour-range-section" id="supplements">
        <div className="range-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> THE FLAVOUR SERIES / 003</p><h2>FIND YOUR<br /><em>FAVOURITE FUEL.</em></h2></div>
          <p>Three considered blends. One everyday ritual. Explore the range and choose your starting point.</p>
        </div>
        <div className="flavour-grid">
          <article className="flavour-card flavour-cocoa"><span className="flavour-index">01 / RICH &amp; BOLD</span><div className="flavour-can"><i /><b>IRON<br />VAULT</b><small>WHEY<br />PROTEIN</small><em>DARK COCOA</em></div><div className="flavour-info"><div><h3>DARK COCOA</h3><p>Deep cocoa-inspired flavour</p></div><button type="button" onClick={addToBag} aria-label="Add Dark Cocoa demo product to bag"><Plus size={19} /></button></div></article>
          <article className="flavour-card flavour-vanilla"><span className="flavour-index">02 / SMOOTH &amp; CLEAN</span><div className="flavour-can"><i /><b>IRON<br />VAULT</b><small>WHEY<br />PROTEIN</small><em>VANILLA</em></div><div className="flavour-info"><div><h3>VANILLA</h3><p>A smooth, mellow blend</p></div><button type="button" onClick={addToBag} aria-label="Add Vanilla demo product to bag"><Plus size={19} /></button></div></article>
          <article className="flavour-card flavour-strawberry"><span className="flavour-index">03 / FRESH &amp; BRIGHT</span><div className="flavour-can"><i /><b>IRON<br />VAULT</b><small>WHEY<br />PROTEIN</small><em>STRAWBERRY</em></div><div className="flavour-info"><div><h3>STRAWBERRY</h3><p>A bright, fruit-forward blend</p></div><button type="button" onClick={addToBag} aria-label="Add Strawberry demo product to bag"><Plus size={19} /></button></div></article>
        </div>
        <p className="demo-disclaimer">Concept product visuals for presentation only. Final flavours, nutrition facts, pricing and pack sizes are subject to brand confirmation.</p>
      </section>

      <section className="apparel-showcase" id="apparel">
        <div className="apparel-showcase-copy"><p className="eyebrow"><span className="eyebrow-line" /> PERFORMANCE APPAREL / 004</p><h2>MADE FOR<br /><em>THE MOMENT.</em></h2><p>Training essentials with a considered fit and a no-distraction point of view. Designed for the routine, not the spotlight.</p><a className="button-primary" href="#shop">EXPLORE THE VAULT <ArrowUpRight size={16} /></a></div>
        <div className="apparel-feature-grid">
          <article className="apparel-feature-card apparel-feature-one"><span>01 / TRAINING TEE</span><div className="feature-shirt"><i>IV.</i></div><strong>THE EVERYDAY TEE</strong></article>
          <article className="apparel-feature-card apparel-feature-two"><span>02 / TRAINING LAYER</span><div className="feature-hoodie"><i>IRON VAULT</i></div><strong>THE DAILY LAYER</strong></article>
        </div>
      </section>

      <section className="standards-section" id="standards">
        <div className="standards-heading"><p className="eyebrow"><span className="eyebrow-line" /> THE IRON VAULT STANDARD</p><h2>LESS, BUT<br /><em>BETTER.</em></h2></div>
        <div className="standards-grid">
          <article className="standard-item"><span>01</span><h3>INTENTIONAL<br />BY DESIGN.</h3><p>Every detail has a reason. Essentials without unnecessary noise.</p><MoveUpRight size={19} /></article>
          <article className="standard-item"><span>02</span><h3>MADE FOR<br />THE ROUTINE.</h3><p>Built around the habits and effort that move you forward.</p><MoveUpRight size={19} /></article>
          <article className="standard-item"><span>03</span><h3>PROGRESS<br />OVER PROMISES.</h3><p>No empty claims. Just a commitment to keep getting better.</p><MoveUpRight size={19} /></article>
        </div>
      </section>

      <section className="closing-section">
        <p className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT REP STARTS HERE</p>
        <h2 className="closing-title">MAKE THE<br /><em>WORK COUNT.</em></h2>
        <a className="button-primary button-light" href="#shop">ENTER THE VAULT <ArrowUpRight size={16} /></a>
        <span className="closing-mark">IV.</span>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading"><p className="eyebrow"><span className="eyebrow-line" /> GOOD TO KNOW / 005</p><h2>THE<br /><em>DETAILS.</em></h2><p>A few quick answers about this Iron Vault concept experience.</p></div>
        <div className="faq-list">
          {[
            ['Can I place a real order on this website?', 'Not yet. This is a front-end demo. Cart interactions are illustrative; checkout, payments, inventory and order processing are not connected.'],
            ['Are these final product flavours and specifications?', 'No. The flavour names and product visuals are concept content. Final product details, ingredients, nutrition information, sizes and prices must be confirmed by the brand.'],
            ['Will the apparel collection be available here?', 'The page includes a visual apparel concept. Final styles, size charts, colours, stock and product photography can be added once the collection is confirmed.'],
            ['How can I get support or ask a question?', 'Use the brand’s confirmed contact details once they are supplied. This demo intentionally does not invent an email address or support channel.'],
          ].map(([question, answer], index) => (
            <article className={openFaq === index ? 'faq-row is-open' : 'faq-row'} key={question}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>0{index + 1}</span><strong>{question}</strong><ChevronDown size={19} /></button>
              <div className="faq-answer"><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="newsletter-section">
        <p className="eyebrow"><span className="eyebrow-line" /> STAY IN THE LOOP</p><h2>KEEP YOUR<br /><em>EDGE.</em></h2>
        <p>Updates, collection news and notes from the Iron Vault world.</p>
        <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setNewsletterSent(true) }}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="YOUR EMAIL ADDRESS" required />
          <button type="submit" aria-label="Submit email"><ArrowUpRight size={19} /></button>
        </form>
        <small>{newsletterSent ? 'Thanks — this demo form is not connected to an email service yet.' : 'Demo form only. No email is collected or sent.'}</small>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">IRON<span>VAULT</span><i>.</i></a>
        <span>BUILT WITH INTENT. WORN WITH PURPOSE.</span><a href="#top">BACK TO TOP ↑</a>
        <small>© 2026 IRON VAULT. DEMO EXPERIENCE.</small>
      </footer>
      <div className={cartOpen ? 'drawer-backdrop is-visible' : 'drawer-backdrop'} onClick={() => setCartOpen(false)} aria-hidden={!cartOpen} />
      <aside className={cartOpen ? 'cart-drawer is-open' : 'cart-drawer'} role="dialog" aria-modal="true" aria-label="Demo shopping bag" aria-hidden={!cartOpen}>
        <div className="drawer-heading"><div><span>IRON VAULT / BAG</span><h2>YOUR SELECTION.</h2></div><button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={21} /></button></div>
        <div className="drawer-empty">{cartCount > 0 ? <><span className="drawer-check"><Check size={23} /></span><h3>{cartCount} DEMO {cartCount === 1 ? 'ITEM' : 'ITEMS'} ADDED</h3><p>Your selection is only stored in this page preview. No order has been created.</p></> : <><ShoppingBag size={35} /><h3>YOUR BAG IS WAITING.</h3><p>Explore the flavour range and add a concept product to see how the bag interaction works.</p></>}</div>
        <button type="button" className="button-primary drawer-continue" onClick={() => setCartOpen(false)}>CONTINUE EXPLORING <ArrowUpRight size={16} /></button>
        <p className="drawer-note">DEMO EXPERIENCE · CHECKOUT DISABLED</p>
      </aside>
      <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUpRight size={18} /></button>
    </main>
  )
}

export default App
