import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag, MoveUpRight, X, ChevronDown, Check } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { Link } from 'react-router-dom'
import { useCart } from './lib/cart.jsx'
import { byId, formatINR } from './lib/catalog.js'
import ProductShowcase from './components/sections/ProductShowcase.jsx'
import FeaturedSupplements from './components/sections/FeaturedSupplements.jsx'
import ProductImage from './components/shop/ProductImage.jsx'
import ProductCatalogue from './components/sections/ProductCatalogue.jsx'
import './App.css'

const heroProduct = byId['bl-isolation-2lb']
const tileProduct = byId['bl-creatine-monohydrate']

const App = () => {
  const pageRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { lines: cartLines, count: cartCount, subtotal: cartSubtotal } = useCart()
  const [openFaq, setOpenFaq] = useState(0)
  const [newsletterSent, setNewsletterSent] = useState(false)

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? 'hidden' : ''
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setCartOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [cartOpen, mobileOpen])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Respect the operating-system accessibility preference for reduced motion.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // One smooth-scroll engine drives both the page and GSAP ScrollTrigger.
    // It is intentionally disabled when reduced motion is requested.
    const lenis = prefersReducedMotion ? null : new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.35,
    })
    const syncScroll = (time) => lenis?.raf(time * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(syncScroll)
      gsap.ticker.lagSmoothing(0)
    }

    // Pointer-responsive depth is also disabled for reduced-motion users.
    const tiltTargets = prefersReducedMotion
      ? []
      : pageRef.current?.querySelectorAll('.category-card, .hero-art, .standard-item') ?? []
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
      gsap.to('.hero-art .hero-product', {
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

      // Layered editorial depth: foreground type, grid and stamp move at different rates.
      gsap.to('.editorial-visual-grid', {
        yPercent: -18, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '.editorial-section', start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })
      gsap.to('.editorial-big-type', {
        yPercent: -13, xPercent: 4, rotate: -4, ease: 'none',
        scrollTrigger: { trigger: '.editorial-section', start: 'top bottom', end: 'bottom top', scrub: 1.6 },
      })
      gsap.to('.editorial-stamp', {
        y: -54, rotate: 2, ease: 'none',
        scrollTrigger: { trigger: '.editorial-section', start: 'top bottom', end: 'bottom top', scrub: 1.8 },
      })
      gsap.to('.orbit-two', {
        rotation: 95, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
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
      gsap.from('.feat-card', { y: 70, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.featured-grid', start: 'top 82%', toggleActions: 'play none none reverse' } })
      gsap.from('.feat-media', { y: 40, scale: 0.9, stagger: 0.13, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.featured-grid', start: 'top 78%', toggleActions: 'play none none reverse' } })
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
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update)
        gsap.ticker.remove(syncScroll)
        lenis.destroy()
      }
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
          <Link to="/shop">SHOP ALL</Link><a href="#philosophy">OUR PHILOSOPHY</a><a href="#standards">THE STANDARD</a>
        </nav>
        <div className="header-actions">
          <Link className="shop-link" to="/shop">SHOP NOW <ArrowUpRight size={15} /></Link>
          <button className="icon-button bag-button" type="button" aria-label={'Open shopping bag, ' + cartCount + ' items'} onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span className="bag-count">{cartCount}</span></button>
          <button className="icon-button mobile-menu" type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>
      <div className={mobileOpen ? 'mobile-nav is-open' : 'mobile-nav'} aria-hidden={!mobileOpen}>
        <Link to="/shop" onClick={() => setMobileOpen(false)}>SHOP THE COLLECTION <ArrowUpRight size={17} /></Link>
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

        <div className="hero-art" aria-label="Featured performance supplement">
          <div className="hero-art-label hero-art-label-top"><span>OBJECT / 001</span><span>PERFORMANCE SERIES</span></div>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="product-glow" /><div className="product-shadow" />
          {heroProduct && (
            <div className="hero-product">
              <ProductImage product={heroProduct} eager />
              <div className="hero-product-meta"><span>{heroProduct.brand.toUpperCase()}</span><b>{heroProduct.name.replace(/\s*\(.*\)/, '')}</b></div>
            </div>
          )}
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

      <ProductShowcase />

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
          <a className="category-card supplements-card" href="#supplements">
            <span className="category-number">01 / PERFORMANCE NUTRITION</span>
            <span className="category-art supplement-art" aria-hidden="true"><span className="art-orbit-ring" /><span className="art-glow" />{tileProduct && <span className="mini-box"><ProductImage product={tileProduct} /></span>}<span className="art-caption">DAILY FUEL / 001</span></span>
            <span className="category-title">FUEL<br />YOUR <em>FOCUS.</em></span>
            <span className="category-cta">EXPLORE SUPPLEMENTS <ArrowUpRight size={16} /></span>
          </a>

        </div>
      </section>

      <FeaturedSupplements />

      <ProductCatalogue />


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
        <div className="faq-heading"><p className="eyebrow"><span className="eyebrow-line" /> GOOD TO KNOW / 005</p><h2>THE<br /><em>DETAILS.</em></h2><p>A few quick answers before you order.</p></div>
        <div className="faq-list">
          {[
            ['Can I place an order on this website?', 'Yes. Add products to your bag and check out with online payment or, where offered, cash on delivery. Prices include taxes and shipping is shown before you pay.'],
            ['Are the product details final?', 'Product details are summarised from the brands’ public information. Always check the label on your pack for the final ingredients, nutrition information and directions.'],
            ['How can I get support or ask a question?', 'Use the contact details shown on our shop pages and keep your order number handy when you get in touch.'],
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
        <small>© 2026 IRON VAULT. <Link to="/policy/shipping">SHIPPING</Link> · <Link to="/policy/returns">RETURNS</Link> · <Link to="/policy/privacy">PRIVACY</Link> · <Link to="/policy/terms">TERMS</Link></small>
      </footer>
      <div className={cartOpen ? 'drawer-backdrop is-visible' : 'drawer-backdrop'} onClick={() => setCartOpen(false)} aria-hidden={!cartOpen} />
      <aside className={cartOpen ? 'cart-drawer is-open' : 'cart-drawer'} role="dialog" aria-modal="true" aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="drawer-heading"><div><span>IRON VAULT / BAG</span><h2>YOUR SELECTION.</h2></div><button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={21} /></button></div>
        <div className="drawer-empty">{cartCount > 0 ? <><span className="drawer-check"><Check size={23} /></span><h3>{cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} IN YOUR BAG</h3><p>{cartLines.map((line) => line.qty + ' × ' + line.product.name).join(', ')}</p><p>Subtotal {formatINR(cartSubtotal)}</p></> : <><ShoppingBag size={35} /><h3>YOUR BAG IS WAITING.</h3><p>Browse the shop and add something to your bag.</p></>}</div>
        {cartCount > 0 ? <Link to="/checkout" className="button-primary drawer-continue" onClick={() => setCartOpen(false)}>CHECKOUT <ArrowUpRight size={16} /></Link> : <Link to="/shop" className="button-primary drawer-continue" onClick={() => setCartOpen(false)}>GO TO THE SHOP <ArrowUpRight size={16} /></Link>}
        <p className="drawer-note"><Link to="/cart" onClick={() => setCartOpen(false)}>VIEW FULL BAG</Link></p>
      </aside>
      <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUpRight size={18} /></button>
    </main>
  )
}

export default App
