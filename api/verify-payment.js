// Serverless function (Vercel format). Verifies the Razorpay payment signature.
// Required env var: RAZORPAY_KEY_SECRET
import { createHmac, timingSafeEqual } from 'node:crypto'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return res.status(500).json({ error: 'Payments are not configured on the server.' })

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {}
  if (!orderId || !paymentId || !signature) return res.status(400).json({ error: 'Missing payment details.' })

  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(String(signature))
  const valid = a.length === b.length && timingSafeEqual(a, b)

  return valid ? res.status(200).json({ ok: true }) : res.status(400).json({ error: 'Payment could not be verified.' })
}
