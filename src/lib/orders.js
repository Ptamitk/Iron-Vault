import { formatINR } from './catalog.js'
import { store } from '../config/store.js'

const ORDER_KEY = 'iv-last-order-v1'

export const newOrderId = () => 'IV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()

export function saveOrder(order) {
  try {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(order))
  } catch {
    /* ignore */
  }
}

export function loadOrder() {
  try {
    return JSON.parse(window.localStorage.getItem(ORDER_KEY) || 'null')
  } catch {
    return null
  }
}

const METHOD_LABEL = { online: 'Online payment', cod: 'Cash on delivery' }
export const methodLabel = (method) => METHOD_LABEL[method] || method

export function buildWhatsAppLink(order) {
  if (!store.whatsappNumber) return null
  const { customer, items, totals } = order
  const lines = [
    `New order ${order.id}`,
    '',
    ...items.map((item) => {
      const variant = [item.flavour, item.size].filter(Boolean).join(' / ')
      return `${item.qty} x ${item.name}${variant ? ` (${variant})` : ''} - ${formatINR(item.unit * item.qty)}`
    }),
    '',
    `Subtotal: ${formatINR(totals.subtotal)}`,
    `Shipping: ${totals.shipping ? formatINR(totals.shipping) : 'Free'}`,
    ...(totals.codFee ? [`COD fee: ${formatINR(totals.codFee)}`] : []),
    `Total: ${formatINR(totals.total)}`,
    `Payment: ${methodLabel(order.method)} (${order.status})`,
    '',
    `${customer.name} | ${customer.phone}`,
    `${customer.address1}${customer.address2 ? ', ' + customer.address2 : ''}, ${customer.city}, ${customer.state} ${customer.pin}`,
    ...(customer.notes ? ['', `Note: ${customer.notes}`] : []),
  ]
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
}
