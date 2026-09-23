import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import {
  apiFetch,
  setStoredToken,
  setLoggedOutFlag,
  isExplicitlyLoggedOut,
  ensureAuthToken
} from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      // If user explicitly signed out, do not attempt auto-login
      if (isExplicitlyLoggedOut()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check current session
      let res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setError(null);
        setIsLoading(false);
        return;
      }

      // If session not found and not explicitly logged out, ensure fresh demo token
      const token = await ensureAuthToken(true);
      if (token) {
        res = await apiFetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setError(null);
          setIsLoading(false);
          return;
        }
      }

      setUser(null);
    } catch (err: any) {
      console.warn('Authentication check failed:', err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials. Please verify your email and password.');
        setIsLoading(false);
        return false;
      }

      // Save token to localStorage for iframe resilience
      if (data.token) {
        setStoredToken(data.token);
      }
      setLoggedOutFlag(false);
      setUser(data.user);
      setError(null);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Network connection error. Failed to communicate with authentication service.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoggedOutFlag(true);
      setStoredToken(null);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Logout endpoint error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
