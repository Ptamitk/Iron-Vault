import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ProductExperience from './components/sections/ProductExperience.jsx'
import './App.css'

const App = () => {
  const pageRef = useRef(null)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      // The hero tub responds continuously to the visitor's scroll position.
      gsap.to('.hero-art .protein-tub', {
        rotation: 8,
        y: 58,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to('.orbit-one', {
        rotation: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })


    })

    return () => motion.revert()
  }, { scope: pageRef })

  return (
    <main className="site-shell" ref={pageRef}>
      <div className="announcement-bar">
        <span>BUILT FOR THE WORK</span>
        <span>PERFORMANCE. WITHOUT COMPROMISE.</span>
        <span>INDIA <span aria-hidden="true">↗</span></span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Iron Vault home">IRON<span>VAULT</span><i>.</i></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">SHOP ALL</a>
          <a href="#philosophy">OUR PHILOSOPHY</a>
          <a href="#standards">THE STANDARD</a>
        </nav>
        <div className="header-actions">
          <a className="shop-link" href="#shop">SHOP NOW <ArrowUpRight size={15} /></a>
          <button className="icon-button" type="button" aria-label="Shopping bag"><ShoppingBag size={19} /></button>
          <button className="icon-button mobile-menu" type="button" aria-label="Open menu"><Menu size={21} /></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> ENGINEERED FOR THE EVERYDAY ATHLETE</p>
          <h1>MAKE<br />YOURSELF<br /><em>UNSTOPPABLE.</em></h1>
          <div className="hero-bottom">
            <p>Good days are built.<br />So is a stronger you.</p>
            <a className="round-link" href="#shop" aria-label="Explore the collection"><ArrowDown size={20} /></a>
          </div>
        </div>

        <div className="hero-art" aria-label="Iron Vault performance protein product illustration">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="product-glow" />
          <div className="product-shadow" />
          <div className="protein-tub">
            <div className="tub-lid" />
            <div className="tub-body">
              <div className="tub-topline">IRON VAULT / PERFORMANCE SERIES</div>
              <div className="tub-brand">IRON<br /><b>VAULT</b></div>
              <div className="tub-divider" />
              <div className="tub-product">WHEY<br />PROTEIN</div>
              <div className="tub-flavour">DARK COCOA · PREMIUM BLEND</div>
              <div className="tub-footer"><span>24G<br />PROTEIN</span><span>01<br />KG</span></div>
            </div>
          </div>
          <div className="art-index"><span>01 / 03</span><span>THE DAILY STANDARD</span></div>
          <span className="vertical-note">FORM FOLLOWS FUNCTION — EST. FOR THE DRIVEN</span>
        </div>

        <div className="hero-side-note">NO SHORTCUTS. JUST SHOW UP.</div>
      </section>

      <section className="ticker" aria-label="Brand values">
        <div>DISCIPLINE IS A DAILY PRACTICE <span>✳</span> BUILT FOR PROGRESS <span>✳</span> EARN YOUR EDGE <span>✳</span> DISCIPLINE IS A DAILY PRACTICE <span>✳</span></div>
      </section>

      <ProductExperience />

      <section className="intro-section" id="philosophy">
        <p className="eyebrow"><span className="eyebrow-line" /> THE IRON VAULT MINDSET</p>
        <div className="intro-content">
          <h2>SHOW UP.<br /><em>STACK DAYS.</em></h2>
          <p>Progress isn't a moment. It's the work you put in when nobody's watching. We're here for the early starts, the last reps, and every small win in between.</p>
        </div>
      </section>

      <section className="collection-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> THE COLLECTION</p><h2>GEAR UP.<br /><em>GET AFTER IT.</em></h2></div>
          <a className="text-link" href="#standards">EXPLORE THE VAULT <ArrowUpRight size={16} /></a>
        </div>
        <div className="category-grid">
          <a className="category-card supplements-card" href="#standards"><span className="category-number">01 / PERFORMANCE</span><span className="category-title">FUEL<br />YOUR <em>FOCUS.</em></span><span className="category-cta">EXPLORE SUPPLEMENTS <ArrowUpRight size={16} /></span></a>
          <a className="category-card apparel-card" href="#standards"><span className="category-number">02 / APPAREL</span><span className="category-title">MADE TO<br /><em>MOVE.</em></span><span className="category-cta">EXPLORE APPAREL <ArrowUpRight size={16} /></span></a>
        </div>
      </section>

      <section className="standards-section" id="standards">
        <p className="eyebrow"><span className="eyebrow-line" /> THE STANDARD</p>
        <h2>NOT MORE NOISE.<br /><em>MORE INTENTION.</em></h2>
        <p>Thoughtful essentials for people who take their progress seriously. No empty promises. Just a commitment to keep getting better.</p>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">IRON<span>VAULT</span><i>.</i></a>
        <span>BUILT WITH INTENT. WORN WITH PURPOSE.</span>
        <a href="#top">BACK TO TOP ↑</a>
        <small>© 2026 IRON VAULT. DEMO EXPERIENCE.</small>
      </footer>
    </main>
  )
}

export default App
