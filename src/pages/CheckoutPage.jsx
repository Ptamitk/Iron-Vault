import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import { useCart } from '../lib/cart.jsx'
import { computeTotals, formatINR } from '../lib/catalog.js'
import { codEnabled, onlineEnabled, paymentMode } from '../lib/payment.js'
import { newOrderId, savePendingOrder } from '../lib/orders.js'
import { store } from '../config/store.js'

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const EMPTY = { name: '', email: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '', notes: '', adult: false }

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, ''))) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (form.address1.trim().length < 5) errors.address1 = 'Enter your house number and street.'
  if (form.city.trim().length < 2) errors.city = 'Enter your city.'
  if (!STATES.includes(form.state)) errors.state = 'Select your state.'
  if (!/^[1-9]\d{5}$/.test(form.pin.trim())) errors.pin = 'Enter a valid 6-digit PIN code.'
  if (!form.adult) errors.adult = 'Please confirm to continue.'
  return errors
}

const cleanPhone = (value) => value.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '')

function Field({ id, label, error, children }) {
  return (
    <div className={error ? 'field has-error' : 'field'}>
      <label htmlFor={`field-${id}`}>{label}</label>
      {children}
      {error && <p className="field-error" id={`error-${id}`}>{error}</p>}
    </div>
  )
}

export default function CheckoutPage() {
  const { lines } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [method, setMethod] = useState(onlineEnabled ? 'online' : codEnabled ? 'cod' : null)
  const [payError, setPayError] = useState('')

  const totals = computeTotals(lines, method === 'cod' ? 'cod' : 'online')

  if (totals.lines.length === 0) return <Navigate to="/cart" replace />

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const fieldProps = (key) => ({
    id: `field-${key}`,
    value: form[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `error-${key}` : undefined,
  })

  function onSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`field-${first}`)?.focus()
      return
    }
    if (!method) {
      setPayError('No payment method is available right now. Please contact us to place your order.')
      return
    }

    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      method,
      status: 'pending',
      customer: { ...form, name: form.name.trim(), email: form.email.trim(), phone: cleanPhone(form.phone), pin: form.pin.trim() },
      items: totals.lines.map((line) => ({
        id: line.id, name: line.product.name, brand: line.product.brand,
        flavour: line.flavour, size: line.size, qty: line.qty, unit: line.unit,
      })),
      totals: { subtotal: totals.subtotal, shipping: totals.shipping, codFee: totals.codFee, total: totals.total },
    }

    if (!savePendingOrder(order)) {
      setPayError('Your browser could not save this checkout. Please enable site storage and try again.')
      return
    }
    navigate('/payment')
  }

  const payLabel = 'CONTINUE TO PAYMENT'

  return (
    <ShopLayout title="Checkout">
      <section className="shop-hero">
        <p className="eyebrow"><span className="eyebrow-line" /> CHECKOUT</p>
        <h1>ALMOST <em>THERE.</em></h1>
      </section>

      <form className="cart-layout checkout" onSubmit={onSubmit} noValidate>
        <div className="checkout-fields">
          <fieldset>
            <legend>CONTACT</legend>
            <Field id="name" label="Full name" error={errors.name}><input type="text" autoComplete="name" {...fieldProps('name')} /></Field>
            <div className="field-row">
              <Field id="email" label="Email" error={errors.email}><input type="email" autoComplete="email" {...fieldProps('email')} /></Field>
              <Field id="phone" label="Mobile number" error={errors.phone}><input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit number" {...fieldProps('phone')} /></Field>
            </div>
          </fieldset>

          <fieldset>
            <legend>DELIVERY ADDRESS (INDIA)</legend>
            <Field id="address1" label="House no., street, area" error={errors.address1}><input type="text" autoComplete="address-line1" {...fieldProps('address1')} /></Field>
            <Field id="address2" label="Landmark (optional)"><input type="text" autoComplete="address-line2" {...fieldProps('address2')} /></Field>
            <div className="field-row">
              <Field id="city" label="City" error={errors.city}><input type="text" autoComplete="address-level2" {...fieldProps('city')} /></Field>
              <Field id="pin" label="PIN code" error={errors.pin}><input type="text" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...fieldProps('pin')} /></Field>
            </div>
            <Field id="state" label="State" error={errors.state}>
              <select autoComplete="address-level1" {...fieldProps('state')}>
                <option value="">Select state</option>
                {STATES.map((state) => (<option key={state} value={state}>{state}</option>))}
              </select>
            </Field>
            <Field id="notes" label="Order note (optional)"><textarea rows={2} {...fieldProps('notes')} /></Field>
          </fieldset>

          <fieldset>
            <legend>PAYMENT</legend>
            {!onlineEnabled && !codEnabled && <p className="field-error">Payment is not set up yet. Please check back soon.</p>}
            {onlineEnabled && (
              <label className={method === 'online' ? 'pay-option is-active' : 'pay-option'}>
                <input type="radio" name="method" value="online" checked={method === 'online'} onChange={() => setMethod('online')} />
                <span><b>Pay online</b><small>UPI, cards, net banking, wallets{paymentMode === 'demo' ? ' · DEMO MODE: no money is charged' : ''}</small></span>
              </label>
            )}
            {codEnabled && (
              <label className={method === 'cod' ? 'pay-option is-active' : 'pay-option'}>
                <input type="radio" name="method" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                <span><b>Cash on delivery</b><small>Pay when your order arrives · {formatINR(store.codFee)} COD fee</small></span>
              </label>
            )}
          </fieldset>

          <div className={errors.adult ? 'field has-error' : 'field'}>
            <label className="check">
              <input type="checkbox" id="field-adult" checked={form.adult} onChange={set('adult')} aria-invalid={errors.adult ? 'true' : undefined} aria-describedby={errors.adult ? 'error-adult' : undefined} />
              <span>I am 18 or older, and I have read the product labels and cautions. I agree to the <Link to="/policy/terms" target="_blank">Terms</Link>, <Link to="/policy/returns" target="_blank">Returns policy</Link> and <Link to="/policy/privacy" target="_blank">Privacy policy</Link>.</span>
            </label>
            {errors.adult && <p className="field-error" id="error-adult">{errors.adult}</p>}
          </div>
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2>YOUR ORDER</h2>
          <ul className="summary-lines">
            {totals.lines.map((line) => (
              <li key={line.key}>
                <span>{line.qty} × {line.product.name}{[line.flavour, line.size].filter(Boolean).length > 0 && <small> {[line.flavour, line.size].filter(Boolean).join(' / ')}</small>}</span>
                <b>{formatINR(line.total)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{totals.shipping ? formatINR(totals.shipping) : 'Free'}</dd></div>
            {totals.codFee > 0 && (<div><dt>COD fee</dt><dd>{formatINR(totals.codFee)}</dd></div>)}
            <div className="summary-total"><dt>Total</dt><dd>{formatINR(totals.total)}</dd></div>
          </dl>
          <p className="summary-note">Prices include taxes.</p>
          {payError && <p className="field-error" role="alert">{payError}</p>}
          <button type="submit" className="shop-btn" disabled={!method}>{payLabel}</button>
          <Link className="shop-link-btn" to="/cart">BACK TO BAG</Link>
        </aside>
      </form>
    </ShopLayout>
  )
}
