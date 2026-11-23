import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart, Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../../lib/cart.jsx'
import { formatINR, shopLink } from '../../lib/catalog.js'
import { store } from '../../config/store.js'
import { useWishlist } from '../../features/wishlist/useWishlist.js'
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
  const { ids } = useWishlist()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const menuButton = useRef(null)
  const closeButton = useRef(null)
  const mobileMenu = useRef(null)

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
        return
      }
      if (event.key === 'Tab' && openRef.current) {
        const focusable = mobileMenu.current?.querySelectorAll('a[href], button:not([disabled])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
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
            <Link className="bag-btn wishlist-nav" to="/wishlist" aria-label={`Wishlist, ${ids.length} saved products`}><Heart size={21} aria-hidden="true" /><span className="bag-label">SAVED</span>{ids.length > 0 && <i className="bag-count">{ids.length}</i>}</Link>
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
              onClick={() => { if (!open) setHidden(false); setOpen((value) => !value) }}
            >
              {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div ref={mobileMenu} id="mobile-menu" className={open ? 'mobile-menu is-open' : 'mobile-menu'} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
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
