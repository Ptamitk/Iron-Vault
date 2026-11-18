import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag, MoveUpRight } from 'lucide-react'
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
      gsap.from('.closing-title', {
        y: 80, autoAlpha: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.closing-section', start: 'top 75%', toggleActions: 'play none none reverse' },
      })
    })
    return () => motion.revert()
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
          <button className="icon-button" type="button" aria-label="Shopping bag"><ShoppingBag size={19} /></button>
          <button className="icon-button mobile-menu" type="button" aria-label="Open menu"><Menu size={21} /></button>
        </div>
      </header>

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

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">IRON<span>VAULT</span><i>.</i></a>
        <span>BUILT WITH INTENT. WORN WITH PURPOSE.</span><a href="#top">BACK TO TOP ↑</a>
        <small>© 2026 IRON VAULT. DEMO EXPERIENCE.</small>
      </footer>
    </main>
  )
}

export default App
