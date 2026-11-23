import { useEffect } from 'react'
import { store } from '../../config/store.js'

export default function SEO({ title, description, path, image, type = 'website', noindex = false }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${store.name}` : `${store.name} | Performance Nutrition`
    const summary = description || 'Explore performance nutrition and training essentials at Iron Vault.'
    const canonical = `${window.location.origin}${path || window.location.pathname}`
    document.title = pageTitle

    const setMeta = (selector, attribute, value, content) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, value)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', 'name', 'description', summary)
    setMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', summary)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    if (image) setMeta('meta[property="og:image"]', 'property', 'og:image', image)\n    else document.head.querySelector('meta[property="og:image"]')?.remove()\n    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
  }, [title, description, path, image, type, noindex])

  return null
}
