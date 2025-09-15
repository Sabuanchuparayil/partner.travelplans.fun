import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { mockUsers } from '../data/mockData';

// Helper function to find a user for a specific role
const findUserForRole = (role: UserRole) => {
    return mockUsers.find(u => u.roles.includes(role));
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // FIX: Create a ref for the form element to avoid direct DOM manipulation and fix TS error.
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled by the App component
    } catch (err: any) {
        // Handle simple error messages from the mock auth system
        setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = findUserForRole(role);
    if (user) {
        setEmail(user.email);
        setPassword('password123'); // Using a default password for all demo accounts
        // We need to use a timeout to allow React to update the state before submitting
        setTimeout(() => {
            // We reference the form element directly to submit it
            // FIX: Use the form ref to submit the form.
            formRef.current?.requestSubmit();
        }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">
                Travelplans.fun
            </h1>
            <p className="mt-4 text-sm text-gray-600">
                Sign in to access your portal
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-primary/70 transition-colors"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or quick login as a demo user</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => handleQuickLogin(UserRole.ADMIN)} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Admin</button>
              <button onClick={() => handleQuickLogin(UserRole.AGENT)} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Agent</button>
              <button onClick={() => handleQuickLogin(UserRole.CUSTOMER)} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Customer</button>
              <button onClick={() => handleQuickLogin(UserRole.RELATIONSHIP_MANAGER)} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">RM</button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">All demo accounts use the password: <strong className="font-mono">password123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;