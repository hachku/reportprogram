const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD'
});

const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch (error) {
    return formatter.format(amount);
  }
};

const simulateBalanceLookup = ({ code }) => {
  const numericValue = parseInt((code || '').replace(/[^0-9]/g, ''), 10) || 0;
  const available = ((numericValue % 25000) + 2500) / 100;
  const now = new Date().toLocaleString();

  return {
    balance: available,
    formattedBalance: formatCurrency(available),
    currency: 'USD',
    lastChecked: now,
    status: available > 0 ? 'Active' : 'Pending activation',
    note: 'Demo data shown – connect your Shopify endpoint for live balances.',
    source: 'Demo simulator'
  };
};

export async function fetchGiftCardBalance(payload) {
  const endpoint = process.env.REACT_APP_GIFT_CARD_BALANCE_ENDPOINT;

  if (!endpoint) {
    return simulateBalanceLookup(payload);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to reach the gift card service.');
  }

  const data = await response.json();
  const { balance, currency = 'USD', status = 'Active', lastChecked = new Date().toLocaleString(), note } = data;

  return {
    balance,
    formattedBalance: formatCurrency(balance, currency),
    currency,
    lastChecked,
    status,
    note,
    source: 'Live Shopify data'
  };
}
