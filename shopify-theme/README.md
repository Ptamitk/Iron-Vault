# IRON VAULT — Shopify theme

This is the Shopify Online Store 2.0 Liquid theme conversion of the approved IRON VAULT React storefront design. The React application remains in `src/` as the design/reference implementation; the Shopify theme lives in this directory.

## What is included

- Custom IRON VAULT storefront shell, announcement bar, header and footer
- Campaign hero, ticker marquee, featured Shopify collection, trust strip, FAQ and closing CTA
- Shopify-native product detail form, variant selection, add-to-cart and dynamic checkout button
- Shopify-native collection listing, sorting and pagination
- Shopify-native cart and checkout hand-off
- Shopify-native storefront search and standard content pages
- Responsive styling using Barlow Condensed + DM Sans, black/off-white/red palette, hover transitions and reduced-motion support

## Preview locally

Install Shopify CLI, authenticate with the store owner account, then run from the repository root:

```bash
shopify theme dev --path shopify-theme --store YOUR-STORE.myshopify.com
```

The preview command creates a development preview. It does not publish or replace the live theme.

## Upload as an unpublished theme

After preview and QA:

```bash
shopify theme push --path shopify-theme --store YOUR-STORE.myshopify.com --unpublished
```

Do not publish until the merchant has reviewed the unpublished theme and approved the final content, products, shipping, taxes, payment methods, policies and mobile experience.

## Store setup still required

1. Add/verify the approved products, variants, prices, inventory and product media in Shopify Admin.
2. Create collections and assign products; choose the desired collection in the homepage Featured collection section.
3. In Customize, choose the athlete photo and hero product for the homepage hero; set the button destinations and FAQ answers.
4. Configure navigation under Content > Menus (the theme reads the `main-menu` menu handle).
5. Configure customer accounts, payment providers, COD availability, shipping zones/rates, taxes, notifications and legal policies in Shopify Admin.
6. Review restricted/high-risk or unclear supplement listings with the merchant and applicable compliance requirements before publishing.

## Important

- Shopify Admin is the source of truth for product catalogue, inventory, customer accounts, orders and checkout.
- Wishlist, advanced filtering, reviews, loyalty and other app-like features are not part of this initial native theme foundation; add only after choosing compatible Shopify apps or a carefully scoped extension.
- The hero image pickers are intentionally configurable in the Shopify theme editor; no guessed product/athlete image is hard-coded.
- This theme has been committed to the development branch only. It has not been uploaded to or published on the client's live Shopify store.
