import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
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

      // A dedicated pinned product film: the tub travels through three story beats.
      const story = gsap.timeline({
        scrollTrigger: {
          trigger: '.product-story',
          start: 'top top',
          end: '+=2400',
          scrub: 1,
          pin: '.story-stage',
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      story
        .to('.story-tub', { rotation: 105, scale: 1.12, x: '14vw', y: -12, ease: 'none' }, 0)
        .to('.story-orbit', { rotation: 130, scale: 1.25, ease: 'none' }, 0)
        .to('.story-panel-one', { autoAlpha: 0, y: -55, ease: 'none' }, 0.28)
        .fromTo('.story-panel-two', { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.28)
        .to('.story-tub', { rotation: 235, scale: 0.94, x: '-13vw', y: 18, ease: 'none' }, 0.48)
        .to('.story-panel-two', { autoAlpha: 0, y: -55, ease: 'none' }, 0.68)
        .fromTo('.story-panel-three', { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.68)
        .to('.story-tub', { rotation: 360, scale: 1.08, x: 0, y: 0, ease: 'none' }, 0.72)
        .to('.story-orbit', { rotation: 300, scale: 0.9, ease: 'none' }, 0.72)

      gsap.from('.intro-content > *', {
        y: 65,
        opacity: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 72%',
          once: true,
        },
      })

      gsap.from('.category-card', {
        y: 75,
        opacity: 0,
        duration: 0.85,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.category-grid',
          start: 'top 78%',
          once: true,
        },
      })

      gsap.from('.standards-section h2, .standards-section > p:last-child', {
        y: 55,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.standards-section',
          start: 'top 72%',
          once: true,
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

      <section className="product-story" aria-label="The Iron Vault product story">
        <div className="story-stage">
          <div className="story-grid-lines" />
          <div className="story-orbit" />
          <div className="story-heading"><span>IRON VAULT / 001</span><span>THE PRODUCT IN MOTION</span></div>
          <div className="story-tub-wrap">
            <div className="protein-tub story-tub">
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
          </div>
          <div className="story-panels">
            <div className="story-panel story-panel-one"><span>01 — THE FORMULA</span><h2>BUILT FOR<br /><em>THE DAILY.</em></h2><p>Purposeful performance, designed to fit your everyday training ritual.</p></div>
            <div className="story-panel story-panel-two"><span>02 — THE FOCUS</span><h2>NO NOISE.<br /><em>JUST RESULTS.</em></h2><p>Keep your focus on the work. Let consistency do the talking.</p></div>
            <div className="story-panel story-panel-three"><span>03 — THE STANDARD</span><h2>MAKE EVERY<br /><em>REP COUNT.</em></h2><p>Your routine. Your effort. Your next level starts with showing up.</p></div>
          </div>
          <div className="story-progress-label">SCROLL TO EXPLORE <span>↓</span></div>
        </div>
      </section>

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
