import React, { useState } from 'react';
import { fetchGiftCardBalance } from '../services/giftCardService';

const initialFormState = {
  code: '',
  pin: '',
  email: ''
};

const GiftCardBalanceChecker = () => {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.code.trim()) {
      setStatus({ type: 'error', message: 'Enter the full gift card number before submitting.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Checking balance…' });
    setResult(null);

    try {
      const data = await fetchGiftCardBalance(form);
      setResult(data);
      setStatus({ type: 'success', message: data.note || 'Balance retrieved successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to check the balance right now.' });
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    setResult(null);
    setStatus({ type: 'idle', message: '' });
  };

  return (
    <div className="checker">
      <form className="checker__form" onSubmit={handleSubmit}>
        <label>
          Gift card number
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="0000 0000 0000"
            autoComplete="off"
            required
          />
        </label>

        <div className="field-grid">
          <label>
            PIN (optional)
            <input
              type="password"
              name="pin"
              value={form.pin}
              onChange={handleChange}
              placeholder="••••"
            />
          </label>

          <label>
            Email (optional)
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Checking…' : 'Check balance'}
          </button>
          <button type="button" className="ghost" onClick={handleReset} disabled={status.type === 'loading'}>
            Reset
          </button>
        </div>

        {status.type !== 'idle' && (
          <div className={`alert alert--${status.type}`} role="status">
            {status.message}
          </div>
        )}
      </form>

      {result && (
        <div className="result-card">
          <p className="result-label">Available balance</p>
          <p className="result-value">{result.formattedBalance}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{result.status}</dd>
            </div>
            <div>
              <dt>Currency</dt>
              <dd>{result.currency}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{result.lastChecked}</dd>
            </div>
            {result.source && (
              <div>
                <dt>Source</dt>
                <dd>{result.source}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
};

export default GiftCardBalanceChecker;
