// Serverless function (Vercel format). Creates a Razorpay order.
// The amount is recomputed here from the catalogue: the browser can never choose its own price.
// Required env vars (set on your host, never commit them): RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
import { computeTotals } from '../src/lib/catalog.js'

const clip = (value, max) => String(value ?? '').slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return res.status(500).json({ error: 'Payments are not configured on the server.' })

  const { items, customer = {}, orderRef } = req.body || {}
  const totals = computeTotals(items, 'online')
  if (totals.lines.length === 0 || totals.total <= 0) return res.status(400).json({ error: 'Your bag is empty or has unavailable items.' })

  const summary = totals.lines.map((line) => `${line.qty}x ${line.product.name}${line.flavour ? ` (${line.flavour})` : ''}`).join(', ')

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
      },
      body: JSON.stringify({
        amount: totals.total * 100, // paise
        currency: 'INR',
        receipt: clip(orderRef || 'iv_' + Date.now(), 40),
        notes: {
          customer: clip(customer.name, 100),
          phone: clip(customer.phone, 20),
          email: clip(customer.email, 100),
          address: clip(`${customer.address1 || ''}, ${customer.address2 || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.pin || ''}`, 250),
          items: clip(summary, 250),
        },
      }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(502).json({ error: data?.error?.description || 'Could not start the payment.' })
    return res.status(200).json({ orderId: data.id, amount: data.amount, currency: data.currency, keyId })
  } catch {
    return res.status(502).json({ error: 'Could not reach the payment provider.' })
  }
}
