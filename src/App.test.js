import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Shopify gift card checker headline', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /gift card balance checker/i })
  expect(heading).toBeInTheDocument()
})
