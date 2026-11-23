import { useEffect } from 'react'
import SiteHeader from '../layout/SiteHeader.jsx'
import SiteFooter from '../layout/SiteFooter.jsx'
import { store } from '../../config/store.js'
import '../../pages/shop.css'
import '../shop/wishlist.css'
import SEO from '../seo/SEO.jsx'

export default function ShopLayout({ title, description, seoImage, seoPath, children }) {
  useEffect(() => {
    document.title = title ? `${title} | ${store.name}` : store.name
  }, [title])

  return (
    <div className="shop-shell">
      <a className="shop-skip" href="#shop-main">Skip to content</a>
      <SiteHeader variant="solid" />
      <main id="shop-main" className="shop-main"><SEO title={title} description={description} image={seoImage} path={seoPath} />{children}</main>
      <SiteFooter />
    </div>
  )
}
