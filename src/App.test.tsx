import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { renderWithProviders, mockUser } from './test/test-utils';

describe('App', () => {
  it('renders the login page when not authenticated', () => {
    renderWithProviders(<App />);
    expect(
      screen.getByRole('heading', { name: /travelplans.fun/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders the dashboard when authenticated', async () => {
    renderWithProviders(<App />, { authState: { isAuthenticated: true, user: mockUser } });
    expect(await screen.findByRole('heading', { name: /Bookings/i, level: 2 })).toBeInTheDocument();
  });
});
