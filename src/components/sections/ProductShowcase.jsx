import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ProductImage from '../shop/ProductImage.jsx'
import { byId, formatINR } from '../../lib/catalog.js'
import './ProductShowcase.css'

gsap.registerPlugin(ScrollTrigger)

// Which products appear in the scroll showcase (ids from src/data/products.js).
const SHOWCASE_IDS = ['bl-isolation-2lb', 'bl-hype-reloaded', 'dna-creatine-monohydrate', 'dna-hydra-1']

const pad = (value) => String(value).padStart(2, '0')

export default function ProductShowcase() {
  const rootRef = useRef(null)
  const items = SHOWCASE_IDS.map((id) => byId[id]).filter(Boolean)

  useGSAP(
    () => {
      const root = rootRef.current
      const slides = gsap.utils.toArray('.showcase-item', root)
      if (!root || slides.length < 2) return undefined

      const motion = gsap.matchMedia()
      // Reduced-motion visitors keep the plain stacked layout (no pinning, no movement).
      motion.add('(prefers-reduced-motion: no-preference)', () => {
        root.classList.add('is-animated')
        const count = root.querySelector('.showcase-count')
        const bar = root.querySelector('.showcase-bar span')
        const total = slides.length

        gsap.set(slides, { autoAlpha: 0 })
        gsap.set(slides[0], { autoAlpha: 1 })

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.querySelector('.showcase-stage'),
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * 0.8 * total),
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const index = Math.min(total - 1, Math.floor(timeline.time() + 0.2))
              if (count) count.textContent = `${pad(index + 1)} / ${pad(total)}`
            },
          },
        })

        timeline.to(bar, { scaleX: 1, duration: total }, 0)
        slides.forEach((slide, index) => {
          if (index === 0) return
          const previous = slides[index - 1]
          const at = index - 0.3
          timeline
            .to(previous, { autoAlpha: 0, duration: 0.15 }, at + 0.15)
            .to(previous.querySelector('.showcase-visual'), { y: -80, rotate: 6, scale: 0.94, duration: 0.3 }, at)
            .to(previous.querySelector('.showcase-copy'), { y: -30, autoAlpha: 0, duration: 0.3 }, at)
            .to(slide, { autoAlpha: 1, duration: 0.15 }, at)
            .fromTo(slide.querySelector('.showcase-visual'), { y: 90, rotate: -8, scale: 0.88 }, { y: 0, rotate: 0, scale: 1, duration: 0.3 }, at)
            .fromTo(slide.querySelector('.showcase-copy'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, at)
        })
        timeline.to({}, { duration: 1 }, total - 1) // hold on the last product

        return () => {
          root.classList.remove('is-animated')
          if (count) count.textContent = `01 / ${pad(total)}`
        }
      })

      return () => motion.revert()
    },
    { scope: rootRef },
  )

  if (items.length === 0) return null

  return (
    <section className="showcase" ref={rootRef} aria-label="Featured supplements">
      <div className="showcase-stage">
        <div className="showcase-top"><span>IRON VAULT / FEATURED</span><span className="showcase-count">01 / {pad(items.length)}</span></div>
        <div className="showcase-list">
          {items.map((product, index) => (
            <article className="showcase-item" key={product.id}>
              <div className="showcase-copy">
                <span className="showcase-index">{pad(index + 1)} / {product.category.toUpperCase()}</span>
                <h2>{product.name}</h2>
                <p>{product.summary}</p>
                <div className="showcase-meta">
                  <strong>{product.priceINR != null ? `${product.priceFrom ? 'From ' : ''}${formatINR(product.priceINR)}` : ''}</strong>
                  <Link to={`/product/${product.id}`}>VIEW PRODUCT <ArrowUpRight size={16} /></Link>
                </div>
              </div>
              <div className="showcase-visual">
                <ProductImage product={product} eager={index === 0} />
              </div>
            </article>
          ))}
        </div>
        <div className="showcase-bar" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}
