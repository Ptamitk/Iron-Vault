import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, LockKeyhole, LoaderCircle, ShieldCheck } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import './payment.css'
import { useCart } from '../lib/cart.jsx'
import { formatINR } from '../lib/catalog.js'
import { payOnline, paymentMode } from '../lib/payment.js'
import { clearPendingOrder, loadPendingOrder, methodLabel, saveOrder } from '../lib/orders.js'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { clear } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const order = loadPendingOrder()

  if (!order || !Array.isArray(order.items) || !order.items.length) return <Navigate to="/checkout" replace />

  async function completePayment() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (order.method === 'online') {
        const result = await payOnline(order)
        order.status = result.status === 'demo' ? 'demo-paid' : 'paid'
        order.paymentId = result.paymentId
      } else {
        order.status = 'cod-pending'
      }
      saveOrder(order)
      clearPendingOrder()
      clear()
      navigate('/order/success', { replace: true })
    } catch (paymentError) {
      setError(paymentError?.message || 'Payment could not be completed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <ShopLayout noindex title="Secure payment" description="Review your Iron Vault order and continue to secure payment.">
      <section className="shop-hero">
        <p className="eyebrow"><span className="eyebrow-line" /> FINAL STEP</p>
        <h1>SECURE <em>PAYMENT.</em></h1>
        <p className="shop-lede">Your order is ready. Confirm the selected payment method to continue.</p>
      </section>

      <div className="payment-layout">
        <section className="payment-panel">
          <div className="payment-security"><ShieldCheck size={24} /><div><b>Secure checkout</b><span>Your payment is handled by the payment provider. Iron Vault does not store card details.</span></div></div>
          <div className="payment-method">
            <span>SELECTED PAYMENT METHOD</span>
            <strong>{methodLabel(order.method)}</strong>
            <p>{order.method === 'online' ? (paymentMode === 'demo' ? 'Demo mode is active. No real money will be charged.' : 'You will continue to the secure Razorpay checkout to complete your payment.') : 'Pay the order amount in cash when your delivery arrives.'}</p>
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="button" className="shop-btn" onClick={completePayment} disabled={busy}>
            {busy ? <><LoaderCircle size={17} className="spin-icon" /> PROCESSING…</> : order.method === 'cod' ? 'CONFIRM CASH ON DELIVERY' : 'CONTINUE TO SECURE PAYMENT'}
          </button>
          <Link className="shop-link-btn" to="/checkout"><ArrowLeft size={15} /> BACK TO CHECKOUT</Link>
          <p className="payment-footnote"><LockKeyhole size={14} /> Secure payment handoff · No card details are collected on this page</p>
        </section>

        <aside className="summary payment-summary" aria-label="Order summary">
          <h2>ORDER SUMMARY</h2>
          <ul className="summary-lines">
            {order.items.map((item) => (
              <li key={item.id + '|' + item.flavour + '|' + item.size}>
                <span>{item.qty} × {item.name}{[item.flavour, item.size].filter(Boolean).length > 0 && <small> {[item.flavour, item.size].filter(Boolean).join(' / ')}</small>}</span>
                <b>{formatINR(item.unit * item.qty)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatINR(order.totals.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{order.totals.shipping ? formatINR(order.totals.shipping) : 'Free'}</dd></div>
            {order.totals.codFee > 0 && <div><dt>COD fee</dt><dd>{formatINR(order.totals.codFee)}</dd></div>}
            <div className="summary-total"><dt>Total due</dt><dd>{formatINR(order.totals.total)}</dd></div>
          </dl>
          <p className="summary-note"><CheckCircle2 size={15} /> Delivering to {order.customer.name}, {order.customer.city} · {order.customer.pin}</p>
        </aside>
      </div>
    </ShopLayout>
  )
}
