
import React, { createContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    // In a real app, this would involve an API call.
    // Prioritize logging in a user who *only* has the selected role to avoid ambiguity.
    let userToLogin = mockUsers.find(u => u.roles.length === 1 && u.roles[0] === role);

    // If no single-role user is found, fall back to finding any user with that role.
    if (!userToLogin) {
      userToLogin = mockUsers.find(u => u.roles.includes(role));
    }
    
    if (userToLogin) {
      setUser(userToLogin);
    } else {
      console.error(`No mock user found for role: ${role}`);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
