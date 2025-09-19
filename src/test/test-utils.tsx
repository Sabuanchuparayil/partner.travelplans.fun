import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ToastProvider } from '@/context/ToastContext';
import { User, UserRole, UserStatus } from '@/types';
import { MemoryRouter } from 'react-router-dom';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  roles: [UserRole.AGENT],
  status: UserStatus.ACTIVE,
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const renderWithProviders = (
  ui: React.ReactElement,
  { 
    authState = { 
        isAuthenticated: false, 
        user: null, 
        loading: false, 
        login: () => Promise.resolve(), 
        logout: () => {}, 
        sendPasswordResetEmail: () => Promise.resolve(),
    },
    ...renderOptions 
  }: { authState?: Partial<AuthContextType> } & Omit<RenderOptions, 'queries'> = {},
) => {
  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <MemoryRouter>
      <AuthContext.Provider value={authState as AuthContextType}>
        <DataProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </DataProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export { renderWithProviders, mockUser };
