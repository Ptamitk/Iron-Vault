import ShopLayout from '../components/shop/ShopLayout.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { Link, useParams } from 'react-router-dom'
import { store } from '../config/store.js'
import { formatINR } from '../lib/catalog.js'

// TEMPLATE TEXT. Have it reviewed against your actual business practice (and by a lawyer if you can)
// before going live. Edit freely: everything below is plain text.
const contact = () =>
  store.supportEmail || store.supportPhone
    ? `Contact us at ${[store.supportEmail, store.supportPhone].filter(Boolean).join(' or ')}.`
    : 'Contact details will be added here before launch.'

const POLICIES = {
  shipping: {
    title: 'Shipping policy',
    sections: () => [
      ['Where we deliver', 'We deliver to addresses across India. Enter a valid 6-digit PIN code at checkout.'],
      ['Shipping charges', `Shipping is ${formatINR(store.shippingFee)} per order. Orders of ${formatINR(store.freeShippingAbove)} or more ship free. Cash on delivery orders carry an extra ${formatINR(store.codFee)} COD fee.`],
      ['Dispatch and delivery times', 'Orders are usually dispatched within 1 to 3 working days and delivered within 3 to 8 working days depending on your location. These are estimates, not guarantees.'],
      ['Tracking', 'When your order ships we share tracking details on the contact number or email you provide.'],
      ['Wrong or incomplete address', 'Please double-check your address and phone number. Orders returned because of an incorrect address or repeated failed delivery attempts may be charged for re-shipping.'],
      ['Questions', contact()],
    ],
  },
  returns: {
    title: 'Returns & refunds',
    sections: () => [
      ['Because these are consumables', 'For health and safety reasons we cannot accept returns of opened or used supplements, or of products that were not stored properly after delivery.'],
      ['Damaged, defective or wrong item', 'If your order arrives damaged, leaking, tampered with, or is not what you ordered, tell us within 48 hours of delivery with your order number and clear photos of the product and the outer packaging. We will arrange a replacement or a refund.'],
      ['Cancellations', 'You can cancel an order before it is dispatched. Contact us as soon as possible with your order number.'],
      ['How refunds are paid', 'Approved refunds for online payments go back to the original payment method and usually take 5 to 7 working days to show up, depending on your bank. For cash on delivery orders we refund by bank transfer or UPI.'],
      ['Contact', contact()],
    ],
  },
  privacy: {
    title: 'Privacy policy',
    sections: () => [
      ['What we collect', 'When you order we collect your name, email, mobile number and delivery address, and what you ordered. Your bag is stored in your own browser so it is still there when you return.'],
      ['How we use it', 'We use your details only to process and deliver your order, to contact you about it, and to handle returns and support. We do not sell your personal information.'],
      ['Payments', 'Online payments are handled by our payment provider. We never see or store your card, UPI or bank details.'],
      ['Sharing', 'We share your name, address and phone number with courier and payment partners only as needed to deliver your order and take payment, and where the law requires it.'],
      ['Your choices', 'You can ask us to correct or delete your information, subject to records we must keep by law.'],
      ['Contact', contact()],
    ],
  },
  terms: {
    title: 'Terms of sale',
    sections: () => [
      ['About these terms', 'By placing an order on this website you agree to these terms, the Shipping policy, the Returns policy and the Privacy policy.'],
      ['Who can buy', 'You must be 18 or older. Products are not for pregnant or nursing women.'],
      ['Products and information', 'Product details come from the brands’ labels and public information and may change. Always read the label on your pack before use. Images are for illustration and the pack you receive may differ slightly.'],
      ['Health notice', 'Supplements are not intended to diagnose, treat, cure or prevent any disease and are not a substitute for a varied diet or medical advice. Talk to a doctor before use if you have a medical condition, take medication, or are sensitive to caffeine or other ingredients.'],
      ['Prices and payment', 'Prices are in Indian rupees and include applicable taxes. We may cancel and refund an order if a product is out of stock or a price was shown in error.'],
      ['Liability', 'To the extent the law allows, our liability for any order is limited to the amount you paid for it.'],
      ['Business details', [store.legalName, store.address, store.gstin && `GSTIN: ${store.gstin}`, store.fssai && `FSSAI: ${store.fssai}`].filter(Boolean).join(' · ') || 'Business details will be added here before launch.'],
    ],
  },
}

export default function PolicyPage() {
  const { slug } = useParams()
  const policy = POLICIES[slug]
  if (!policy) return <NotFoundPage />

  return (
    <ShopLayout title={policy.title}>
      <section className="shop-hero">
        <p className="eyebrow"><span className="eyebrow-line" /> POLICIES</p>
        <h1>{policy.title.toUpperCase()}</h1>
      </section>
      <article className="policy">
        {policy.sections().map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <nav className="policy-links" aria-label="Other policies">
          {Object.entries(POLICIES).filter(([key]) => key !== slug).map(([key, other]) => (<Link key={key} to={`/policy/${key}`}>{other.title}</Link>))}
        </nav>
      </article>
    </ShopLayout>
  )
}
