import { render, screen } from '@testing-library/react';
import App from './App';

test('renders gift card hero heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /gift card balance checker/i });
  expect(heading).toBeInTheDocument();
});
