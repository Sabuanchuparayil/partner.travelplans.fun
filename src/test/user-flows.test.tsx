import { screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { renderWithProviders } from './test-utils';
import { User, UserRole, UserStatus } from '@/types';

// Mock users for each role
const mockAdmin: User = { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', roles: [UserRole.ADMIN], status: UserStatus.ACTIVE };
const mockAgent: User = { id: 'agent-1', name: 'Agent User', email: 'agent@test.com', roles: [UserRole.AGENT], status: UserStatus.ACTIVE };
const mockRm: User = { id: 'rm-1', name: 'RM User', email: 'rm@test.com', roles: [UserRole.RELATIONSHIP_MANAGER], status: UserStatus.ACTIVE };
const mockCustomer: User = { id: 'customer-1', name: 'Customer User', email: 'customer@test.com', roles: [UserRole.CUSTOMER], status: UserStatus.ACTIVE };

describe('User Flow E2E Tests', () => {

  it('as an ADMIN, it renders the full navigation menu after login', async () => {
    renderWithProviders(<App />, { authState: { isAuthenticated: true, user: mockAdmin } });
    const nav = await screen.findByRole('navigation');

    // Check for all expected links for an Admin
    expect(within(nav).getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /user management/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /all customers/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /itineraries/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /bookings/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /compliance/i })).toBeInTheDocument();
  });

  it('as an AGENT, it renders the agent navigation menu after login', async () => {
    renderWithProviders(<App />, { authState: { isAuthenticated: true, user: mockAgent } });
    const nav = await screen.findByRole('navigation');

    // Check for agent-specific links
    expect(within(nav).getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /customers/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /itineraries/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /bookings/i })).toBeInTheDocument();

    // Assert that admin-specific links are not present
    expect(within(nav).queryByRole('link', { name: /user management/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: /compliance/i })).not.toBeInTheDocument();
  });

  it('as a RELATIONSHIP_MANAGER, it renders the RM navigation menu after login', async () => {
    renderWithProviders(<App />, { authState: { isAuthenticated: true, user: mockRm } });

    const nav = await screen.findByRole('navigation');

    // Check for RM-specific links
    expect(within(nav).getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /assigned customers/i })).toBeInTheDocument();

    // Assert that other role-specific links are not present
    expect(within(nav).queryByRole('link', { name: /itineraries/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: /user management/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: /compliance/i })).not.toBeInTheDocument();
  });

  it('as a CUSTOMER, it renders a limited navigation menu after login', async () => {
    renderWithProviders(<App />, { authState: { isAuthenticated: true, user: mockCustomer } });
    const nav = await screen.findByRole('navigation');

    // Check for customer-specific links
    expect(within(nav).getByRole('link', { name: /my dashboard/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /documents/i })).toBeInTheDocument();

    // Assert that business-related links are not present
    expect(within(nav).queryByRole('link', { name: /itineraries/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: /customers/i })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: /user management/i })).not.toBeInTheDocument();
  });

});
