
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Travelplans.fun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select a role to sign in
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-sm font-medium text-gray-700">In a real app, this would be a secure login form.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Login as Admin
            </button>
            <button
              onClick={() => handleLogin(UserRole.AGENT)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Login as Agent
            </button>
            <button
              onClick={() => handleLogin(UserRole.CUSTOMER)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Login as Customer
            </button>
            <button
              onClick={() => handleLogin(UserRole.RELATIONSHIP_MANAGER)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Login as RM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIX: Add default export to be consumable by App.tsx
export default LoginPage;
