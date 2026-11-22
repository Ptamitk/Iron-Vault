import { Link, Navigate } from 'react-router-dom'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import { formatINR } from '../lib/catalog.js'
import { buildWhatsAppLink, loadOrder, methodLabel } from '../lib/orders.js'
import { store } from '../config/store.js'

const STATUS_TEXT = {
  paid: 'Payment received. Thank you!',
  'demo-paid': 'DEMO ORDER: no payment was taken and nothing was sent to the store.',
  'cod-pending': 'Order placed. You will pay in cash when it arrives.',
}

export default function OrderSuccessPage() {
  const order = loadOrder()
  if (!order) return <Navigate to="/shop" replace />

  const whatsapp = buildWhatsAppLink(order)
  const isDemo = order.status === 'demo-paid'

  return (
    <ShopLayout title="Order confirmed">
      <section className="shop-hero shop-center">
        <CheckCircle2 size={44} className="success-icon" aria-hidden="true" />
        <p className="eyebrow"><span className="eyebrow-line" /> ORDER {order.id}</p>
        <h1>THANK <em>YOU.</em></h1>
        <p className="shop-lede" role="status">{STATUS_TEXT[order.status] || 'Order received.'}</p>
      </section>

      <div className="success-card">
        <ul className="summary-lines">
          {order.items.map((item) => (
            <li key={`${item.id}|${item.flavour}|${item.size}`}>
              <span>{item.qty} × {item.name}{[item.flavour, item.size].filter(Boolean).length > 0 && <small> {[item.flavour, item.size].filter(Boolean).join(' / ')}</small>}</span>
              <b>{formatINR(item.unit * item.qty)}</b>
            </li>
          ))}
        </ul>
        <dl className="summary">
          <div><dt>Subtotal</dt><dd>{formatINR(order.totals.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{order.totals.shipping ? formatINR(order.totals.shipping) : 'Free'}</dd></div>
          {order.totals.codFee > 0 && (<div><dt>COD fee</dt><dd>{formatINR(order.totals.codFee)}</dd></div>)}
          <div className="summary-total"><dt>Total</dt><dd>{formatINR(order.totals.total)}</dd></div>
          <div><dt>Payment</dt><dd>{methodLabel(order.method)}</dd></div>
        </dl>
        <p className="success-address"><b>Delivering to</b><br />{order.customer.name}, {order.customer.phone}<br />{order.customer.address1}{order.customer.address2 ? `, ${order.customer.address2}` : ''}, {order.customer.city}, {order.customer.state} {order.customer.pin}</p>

        {whatsapp && !isDemo && (
          <a className="shop-btn" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> SEND ORDER ON WHATSAPP</a>
        )}
        {whatsapp && !isDemo && order.method === 'cod' && <p className="summary-note">Tap the button to send your order details to us on WhatsApp so we can confirm and ship it.</p>}
        {!whatsapp && !isDemo && <p className="summary-note">Keep your order number handy{store.supportEmail ? ` and email ${store.supportEmail}` : ''} for any support.</p>}
        <Link className="shop-link-btn" to="/shop">CONTINUE SHOPPING</Link>
      </div>
    </ShopLayout>
  )
}
