# Shop setup guide

The site now has a working shop: `/shop`, `/product/:id`, `/cart`, `/checkout`, `/order/success`, `/policy/{shipping,returns,privacy,terms}`.
The landing page is unchanged apart from real cart/shop links.

## What works out of the box
- Product list, search, category filter, sorting, product pages with flavour/size choice.
- Cart (saved in the visitor's browser), checkout form with validation (Indian mobile, PIN, state).
- Totals are always computed from `src/data/products.js` + `src/config/store.js`.
- **Demo payment mode** (`npm run dev`): simulated payment, no money moves.

## Before you launch (checklist)
1. **Prices**: replace placeholder `priceINR` values in `src/data/products.js`. Prices are treated as GST-inclusive.
2. **Business details**: fill `src/config/store.js` (legal name, address, GSTIN, FSSAI licence, email, phone, WhatsApp number). Supplements sold in India need FSSAI registration/licence and correct labelling.
3. **Product data gaps**: search `todo:` in `src/data/products.js`. Fill the missing serving sizes/amounts from the supplier's real label. Items with an incomplete label should not go live.
4. **Images**: cards are text-only. Add images only with the brands' written permission, or your own photos.
5. **Policies**: `src/pages/PolicyPage.jsx` is template text. Read it and change it to match what you really do, ideally with legal review.
6. **Stock**: set `inStock: false` on any product to make it unavailable. Confirm availability with your supplier.

## Taking real payments (Razorpay)
1. Create a Razorpay account and complete KYC. Get the Key ID and Key Secret (use Test keys first).
2. Deploy on **Vercel** (the `/api` folder is Vercel serverless format and `vercel.json` handles page routing). Netlify users: `public/_redirects` handles routing, but `/api` must be ported to Netlify functions.
3. In the Vercel project settings add environment variables:
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (server only, never put in the repo)
   - `VITE_PAYMENT_MODE=razorpay`
4. Test with Razorpay test cards/UPI, then switch to live keys.

How it stays safe: the browser sends only product ids and quantities. `/api/create-order` recomputes the amount from the catalogue and `/api/verify-payment` checks Razorpay's signature.

## Orders (important limitation)
There is **no database or admin panel yet**. Orders reach you via:
- Razorpay dashboard (online payments: customer details and items are saved in the order notes).
- The "Send order on WhatsApp" button on the success page (set `whatsappNumber` in `store.js`). **Cash on delivery is only enabled in production when a WhatsApp number is set**, because that is how COD orders get to you.

For a real operation add a backend or a service (Shopify, Supabase, Google Sheets webhook) that records each order and sends confirmation emails. A paid online order whose customer closes the browser before returning to the site will still be visible in Razorpay, but not in the site itself.

## Not included
GST invoices, shipping-rate/PIN serviceability checks, discount codes, customer accounts, order tracking, emails.
