// Store settings. Edit this file to change shipping rules and your business details.
// Prices in products.js are treated as tax-inclusive (GST included) selling prices in INR.
// Nothing here is a secret: never put API keys in this file.

export const store = {
  name: 'Iron Vault',

  // Shipping (INR)
  shippingFee: 79,
  freeShippingAbove: 1499,

  // Cash on delivery. COD is only offered in production when `whatsappNumber` is set,
  // because that is how COD orders reach you until you add an order backend.
  codEnabled: true,
  codFee: 50,

  maxQtyPerItem: 10,

  // Orders are sent to you on WhatsApp from the order-success page.
  // Country code + number, digits only. Example: '919876543210'
  whatsappNumber: '',

  // Business details shown in the footer and on the policy pages (leave '' to hide).
  supportEmail: '',
  supportPhone: '',
  legalName: '',
  address: '',
  gstin: '',
  fssai: '',
}
