import { store } from '../config/store.js'

// Payment mode comes from the VITE_PAYMENT_MODE env var:
//   'razorpay' -> real online payments (needs the /api functions and Razorpay keys, see docs/SHOP_SETUP.md)
//   'demo'     -> simulated payment, no money moves, nothing is sent anywhere (default in `npm run dev`)
//   otherwise  -> online payment is switched off
const mode = import.meta.env.VITE_PAYMENT_MODE || (import.meta.env.DEV ? 'demo' : 'off')
const apiBase = import.meta.env.VITE_API_BASE || ''

export const paymentMode = mode
export const onlineEnabled = mode === 'razorpay' || mode === 'demo'
export const codEnabled = store.codEnabled && (Boolean(store.whatsappNumber) || import.meta.env.DEV)

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error('Could not load the payment window. Check your connection and try again.'))
    document.body.appendChild(script)
  })

async function postJson(path, body) {
  const response = await fetch(apiBase + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Payment service error. Please try again.')
  return data
}

// Resolves { status: 'paid' | 'demo', paymentId } or rejects with a user-readable Error.
export async function payOnline(order) {
  if (mode === 'demo') {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return { status: 'demo', paymentId: 'demo_' + Date.now() }
  }
  if (mode !== 'razorpay') throw new Error('Online payment is not available right now. Please choose cash on delivery.')

  // The server recomputes the amount from the catalogue. We only send ids and quantities.
  const created = await postJson('/api/create-order', {
    items: order.items.map(({ id, qty, flavour, size }) => ({ id, qty, flavour, size })),
    customer: order.customer,
    orderRef: order.id,
  })
  if (created.amount !== order.totals.total * 100) {
    throw new Error('The price changed. Please review your bag and try again.')
  }

  await loadScript('https://checkout.razorpay.com/v1/checkout.js')

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      order_id: created.orderId,
      name: store.name,
      description: 'Order ' + order.id,
      prefill: { name: order.customer.name, email: order.customer.email, contact: order.customer.phone },
      theme: { color: '#B5C49A' },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      handler: async (response) => {
        try {
          await postJson('/api/verify-payment', response)
          resolve({ status: 'paid', paymentId: response.razorpay_payment_id })
        } catch (error) {
          reject(error)
        }
      },
    })
    razorpay.on('payment.failed', (event) => reject(new Error(event?.error?.description || 'Payment failed. Please try again.')))
    razorpay.open()
  })
}
