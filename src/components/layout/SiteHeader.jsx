import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../../lib/cart.jsx'
import { formatINR, shopLink } from '../../lib/catalog.js'
import { store } from '../../config/store.js'
import { getLenis } from '../SmoothScroll.jsx'
import './layout.css'

const NAV = [
  ['SHOP ALL', shopLink()],
  ['PRE-WORKOUT', shopLink('Pre-Workout')],
  ['PROTEIN', shopLink('Protein')],
  ['CREATINE', shopLink('Creatine')],
  ['WELLNESS', shopLink('Herbal & Wellness')],
]

const MENU_LINKS = [
  ['SHOP ALL', shopLink()],
  ['PRE-WORKOUT', shopLink('Pre-Workout')],
  ['PROTEIN', shopLink('Protein')],
  ['CREATINE', shopLink('Creatine')],
  ['HYDRATION', shopLink('Hydration')],
  ['WELLNESS', shopLink('Herbal & Wellness')],
]

// variant: 'overlay' (transparent over the hero until you scroll) or 'solid' (shop pages)
export default function SiteHeader({ variant = 'solid' }) {
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const menuButton = useRef(null)
  const closeButton = useRef(null)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (!openRef.current) {
        if (y > last + 6 && y > 160) setHidden(true)
        else if (y < last - 6 || y < 100) setHidden(false)
      }
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    openRef.current = open
    const lenis = getLenis()
    if (open) {
      setHidden(false)
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      closeButton.current?.focus()
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
    const onKey = (event) => {
      if (event.key === 'Escape' && openRef.current) {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const classes = ['site-header', `is-${variant}`, scrolled ? 'is-scrolled' : '', hidden ? 'is-hidden' : ''].filter(Boolean).join(' ')

  return (
    <>
      <header className={classes}>
        <div className="announce">
          <span>FREE SHIPPING ABOVE {formatINR(store.freeShippingAbove)}</span>
          <span className="announce-dot" aria-hidden="true" />
          <span className="announce-extra">DELIVERY ACROSS INDIA</span>
        </div>
        <div className="site-bar">
          <Link className="logo" to="/" aria-label={`${store.name} home`}>IRON<span>VAULT</span></Link>
          <nav className="site-nav" aria-label="Main">
            {NAV.map(([label, to]) => (<Link key={label} to={to}>{label}</Link>))}
          </nav>
          <div className="site-actions">
            <Link className="bag-btn" to="/cart" aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <ShoppingBag size={22} aria-hidden="true" />
              <span className="bag-label">BAG</span>
              {count > 0 && <i className="bag-count" aria-hidden="true">{count}</i>}
            </Link>
            <button
              type="button"
              ref={menuButton}
              className="menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={open ? 'mobile-menu is-open' : 'mobile-menu'} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <nav aria-label="Mobile">
          {MENU_LINKS.map(([label, to]) => (
            <Link key={label} to={to} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={30} aria-hidden="true" /></Link>
          ))}
        </nav>
        <button type="button" ref={closeButton} className="btn btn-ghost mobile-menu-close" onClick={() => { setOpen(false); menuButton.current?.focus() }}>CLOSE MENU</button>
        <div className="mobile-menu-foot">
          <Link to="/policy/shipping" onClick={() => setOpen(false)}>Shipping</Link>
          <Link to="/policy/returns" onClick={() => setOpen(false)}>Returns</Link>
          <Link to="/policy/privacy" onClick={() => setOpen(false)}>Privacy</Link>
          <Link to="/policy/terms" onClick={() => setOpen(false)}>Terms</Link>
        </div>
      </div>
    </>
  )
}
