import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>; // Mocked
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Attempting login with:", email, password);
    setLoading(true);
    const foundUser = mockUsers.find(u => u.email === email);

    if (foundUser) {
      // In a real app, you'd also check the password.
      // Here, we'll just simulate a successful login.
      console.log("User found:", foundUser);
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      console.log("User not found");
      throw new Error('Invalid email or password');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const sendPasswordResetEmail = async (email: string) => {
    console.log(`Password reset for ${email}`);
    const foundUser = mockUsers.find(u => u.email === email);
    if(foundUser){
      alert("Password reset email sent");
    }
    else{
      alert("User not found");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout, sendPasswordResetEmail }}>
      {children}
    </AuthContext.Provider>
  );
};