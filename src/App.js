import React from 'react';
import GiftCardBalanceChecker from './components/GiftCardBalanceChecker';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Shopify-ready widget</p>
        <h1>Gift Card Balance Checker</h1>
        <p className="subtitle">
          Give customers a frictionless way to verify the value of their gift cards before
          they start a checkout. Drop this React widget anywhere on your Shopify storefront
          or landing page and point it to your secure balance endpoint.
        </p>
      </header>

      <main className="content-grid">
        <section className="panel main-panel">
          <h2>Customer-facing experience</h2>
          <p className="panel-intro">
            This form validates gift cards with your Shopify store. It includes space for a
            card number, optional PIN, and an email address so you can route lookups through
            your preferred anti-fraud flow.
          </p>
          <GiftCardBalanceChecker />
        </section>

        <aside className="panel info-panel">
          <div>
            <h3>How to hook it up</h3>
            <ol>
              <li>
                Deploy a lightweight API route that proxies requests to the
                <strong> Shopify Admin GraphQL API</strong> and invokes the
                <code>giftCard</code> query.
              </li>
              <li>
                Store your Admin API token on the server only. The widget simply calls the
                proxy endpoint defined in <code>REACT_APP_GIFT_CARD_BALANCE_ENDPOINT</code>.
              </li>
              <li>
                Customize the response payload to match the <code>{'{ balance, currency }'}</code>
                shape used in this app.
              </li>
            </ol>
          </div>

          <div>
            <h3>Embed instructions</h3>
            <ul>
              <li>Add the built bundle to any Shopify theme section.</li>
              <li>
                Wrap the widget in a Shopify section block or a simple div with your brand
                styles.
              </li>
              <li>Localize the copy by editing <code>src/components/GiftCardBalanceChecker.jsx</code>.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
