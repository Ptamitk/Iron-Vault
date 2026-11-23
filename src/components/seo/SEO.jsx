import { useEffect } from 'react'
import { store } from '../../config/store.js'

const SITE_ORIGIN = 'https://ironvault.in'

export default function SEO({ title, description, path, image, type = 'website' }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${store.name}` : `${store.name} | Performance Nutrition`
    const summary = description || 'Explore performance nutrition and training essentials at Iron Vault.'
    const canonical = `${SITE_ORIGIN}${path || window.location.pathname}`
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
    if (image) setMeta('meta[property="og:image"]', 'property', 'og:image', image)

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
  }, [title, description, path, image, type])

  return null
}
