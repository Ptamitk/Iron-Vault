// Pure catalogue + pricing helpers. Used by the browser AND by the serverless payment
// functions in /api, so the server always recomputes the amount itself (never trust the client).
// Do not use import.meta.env or browser APIs in this file.
import { products } from '../data/products.js'
import { store } from '../config/store.js'

export const byId = Object.fromEntries(products.map((product) => [product.id, product]))

export const groupOf = (category) => (category.startsWith('Pre-Workout') ? 'Pre-Workout' : category)

export const isBuyable = (product) => Boolean(product) && product.priceINR != null && product.inStock !== false

export const lineKey = (id, flavour, size) => [id, flavour || '', size || ''].join('|')

export const formatINR = (amount) => '₹' + Number(amount).toLocaleString('en-IN')

const clampQty = (qty) => Math.min(store.maxQtyPerItem, Math.max(1, Math.floor(Number(qty)) || 1))

// lines: [{ id, qty, flavour?, size? }] -> priced lines (unknown / unpriced products are dropped)
export function priceLines(lines) {
  return (Array.isArray(lines) ? lines : [])
    .map((line) => {
      const product = byId[line?.id]
      if (!isBuyable(product)) return null
      const qty = clampQty(line.qty)
      return {
        id: product.id,
        key: lineKey(product.id, line.flavour, line.size),
        flavour: line.flavour || null,
        size: line.size || null,
        qty,
        product,
        unit: product.priceINR,
        total: product.priceINR * qty,
      }
    })
    .filter(Boolean)
}

export function computeTotals(lines, method = 'online') {
  const priced = priceLines(lines)
  const subtotal = priced.reduce((sum, line) => sum + line.total, 0)
  const shipping = subtotal === 0 || subtotal >= store.freeShippingAbove ? 0 : store.shippingFee
  const codFee = method === 'cod' && subtotal > 0 ? store.codFee : 0
  return {
    lines: priced,
    count: priced.reduce((sum, line) => sum + line.qty, 0),
    subtotal,
    shipping,
    codFee,
    total: subtotal + shipping + codFee,
  }
}
