# Shopify Gift Card Balance Checker

A React widget that lets shoppers verify the balance of a Shopify gift card before heading to checkout.
Drop the built bundle into any Shopify theme section or CMS block and point it to your own secure
balance endpoint.

## Getting started

```bash
npm install
npm start
```

The development server runs on `http://localhost:3000`.

## Wiring it to Shopify

1. **Create a secure API route** – use your preferred backend (Cloudflare Worker, Next.js API route, AWS Lambda,
   etc.) to proxy requests to the [Shopify Admin GraphQL API](https://shopify.dev/docs/api/admin-graphql) and
   execute a `giftCard` lookup. Keep the Admin API access token on the server only.
2. **Set the endpoint** – expose the route to the frontend and add the URL to an environment variable named
   `REACT_APP_GIFT_CARD_BALANCE_ENDPOINT` before running `npm run build`.
3. **Match the payload** – respond with JSON that contains at least `balance` and `currency`. Optional fields like
   `status`, `lastChecked`, and `note` will automatically populate in the UI.

Without the environment variable the component falls back to a deterministic demo mode so you can see the UX before
connecting real data.

## Customization

- Edit `src/components/GiftCardBalanceChecker.jsx` to adjust fields, copy, or validation.
- Update `src/App.css` to align the widget with your storefront’s typography and colors.
- Localize strings using any React i18n library or plain props.

## Deployment

Run `npm run build` and include the `build` folder in your Shopify theme assets (for example, through a theme app
extension or a custom section block). If you already have an existing React host, you can also embed this component
alongside other storefront tooling.
