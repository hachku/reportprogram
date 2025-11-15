import React, { useMemo, useState } from 'react'
import './App.css'

const MOCK_GIFT_CARDS = [
  {
    normalized: 'SHOP87234451',
    displayNumber: 'SHOP-8723-4451',
    owner: 'Camila S.',
    balance: 85.5,
    currency: 'USD',
    lastUpdated: '2024-03-20T10:25:00.000Z',
    status: 'Active',
    transactions: [
      { date: '2024-03-19', description: 'Online order #1087', amount: -24.5 },
      { date: '2024-02-01', description: 'In-store order', amount: -40 },
      { date: '2024-01-15', description: 'Gift card issued', amount: 150 }
    ]
  },
  {
    normalized: 'SHOP44449876',
    displayNumber: 'SHOP-4444-9876',
    owner: 'Jordan E.',
    balance: 12.33,
    currency: 'USD',
    lastUpdated: '2024-03-06T08:00:00.000Z',
    status: 'Partially redeemed',
    transactions: [
      { date: '2024-03-05', description: 'Subscription renewal', amount: -27.67 },
      { date: '2024-02-10', description: 'Gift card issued', amount: 40 }
    ]
  },
  {
    normalized: 'SHOP99991234',
    displayNumber: 'SHOP-9999-1234',
    owner: 'Demo Customer',
    balance: 0,
    currency: 'USD',
    lastUpdated: '2024-02-14T15:40:00.000Z',
    status: 'Exhausted',
    transactions: [
      { date: '2024-02-14', description: 'Bundle purchase', amount: -75 },
      { date: '2024-02-01', description: 'Gift card issued', amount: 75 }
    ]
  }
]

const normalizeGiftCardNumber = (value) => value.replace(/[^0-9a-z]/gi, '').toUpperCase()

const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

const formatDate = (isoString) =>
  new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

const StatusBadge = ({ tone, children }) => (
  <span className={`status-badge status-badge--${tone}`}>{children}</span>
)

const TransactionHistory = ({ transactions, currency }) => (
  <div className="transaction-history">
    <h3>Recent activity</h3>
    {transactions.length === 0 && <p className="muted">No transactions yet.</p>}
    {transactions.length > 0 && (
      <ul>
        {transactions.map((transaction) => (
          <li key={`${transaction.date}-${transaction.description}`}>
            <div>
              <strong>{transaction.description}</strong>
              <span className="muted">{transaction.date}</span>
            </div>
            <span className={transaction.amount < 0 ? 'debit' : 'credit'}>
              {transaction.amount < 0 ? '-' : '+'}
              {formatCurrency(Math.abs(transaction.amount), currency)}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const IntegrationChecklist = () => {
  const snippet = `<!-- Gift card balance widget -->\n<div\n  class="gift-card-widget"\n  data-endpoint="https://api.your-domain.com/shopify/gift-card-balance"\n></div>\n<script async src="https://cdn.your-domain.com/shopify-gift-card-checker.js"></script>`

  return (
    <section className="integration">
      <h2>Install inside your Shopify storefront</h2>
      <p>
        Drop the widget into any page section (for example a custom Liquid block or the customer account page) and
        point the <code>data-endpoint</code> attribute to the secure API that proxies to Shopify&apos;s Admin API.
      </p>
      <ol>
        <li>Create a private app in Shopify with the <strong>Gift cards</strong> scope enabled.</li>
        <li>Host a lightweight endpoint that calls <code>giftCard</code> via the Admin GraphQL API.</li>
        <li>Paste the snippet below into your theme or Online Store 2.0 block.</li>
      </ol>
      <pre>
        <code>{snippet}</code>
      </pre>
    </section>
  )
}

function App() {
  const [cardNumber, setCardNumber] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('Enter your gift card number to view the balance.')
  const [tone, setTone] = useState('info')
  const [isLoading, setIsLoading] = useState(false)

  const cardHint = useMemo(() => {
    const normalized = normalizeGiftCardNumber(cardNumber)
    if (!normalized) return 'Format: SHOP-1234-5678'
    return `${normalized.length} characters detected`
  }, [cardNumber])

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalized = normalizeGiftCardNumber(cardNumber)

    if (normalized.length < 10) {
      setResult(null)
      setStatus('Please provide the full gift card number (at least 10 characters).')
      setTone('error')
      return
    }

    setIsLoading(true)
    setTone('info')
    setStatus('Contacting Shopify…')

    setTimeout(() => {
      const matchingCard = MOCK_GIFT_CARDS.find((card) => card.normalized === normalized)

      if (matchingCard) {
        setResult(matchingCard)
        setTone('success')
        setStatus(`Last updated on ${formatDate(matchingCard.lastUpdated)}`)
      } else {
        setResult(null)
        setTone('error')
        setStatus('No gift card matched that number. Double-check the digits and try again.')
      }

      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Shopify Embedded App</p>
        <h1>Gift Card Balance Checker</h1>
        <p className="lede">
          Give your customers a secure, self-serve way to confirm their remaining balance without leaving your Shopify store.
        </p>
      </header>

      <main className="grid">
        <section className="card-checker">
          <form onSubmit={handleSubmit}>
            <label htmlFor="giftCard">Gift card number</label>
            <input
              id="giftCard"
              type="text"
              placeholder="SHOP-1234-5678"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              autoComplete="off"
            />
            <span className="muted">{cardHint}</span>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Checking…' : 'Check balance'}
            </button>
          </form>

          <div className="status-line">
            <StatusBadge tone={tone}>{tone === 'info' ? 'Info' : tone === 'error' ? 'Alert' : 'Success'}</StatusBadge>
            <p>{status}</p>
          </div>

          {result && (
            <div className="result-panel">
              <div className="result-header">
                <div>
                  <p className="muted">Card owner</p>
                  <h3>{result.owner}</h3>
                </div>
                <StatusBadge tone={result.status === 'Active' ? 'success' : 'warning'}>
                  {result.status}
                </StatusBadge>
              </div>
              <dl className="result-grid">
                <div>
                  <dt>Card number</dt>
                  <dd>{result.displayNumber}</dd>
                </div>
                <div>
                  <dt>Available balance</dt>
                  <dd className="balance">{formatCurrency(result.balance, result.currency)}</dd>
                </div>
                <div>
                  <dt>Currency</dt>
                  <dd>{result.currency}</dd>
                </div>
                <div>
                  <dt>Last sync</dt>
                  <dd>{formatDate(result.lastUpdated)}</dd>
                </div>
              </dl>
              <TransactionHistory transactions={result.transactions} currency={result.currency} />
            </div>
          )}
        </section>

        <IntegrationChecklist />
      </main>
    </div>
  )
}

export default App
