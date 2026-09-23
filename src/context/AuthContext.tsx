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
    try {
      // Require an active session in the current browser window to restore session.
      // This ensures the application starts cleanly with the sign-in page on initial launch.
      const hasActiveSession = sessionStorage.getItem('acme_active_session') === 'true';
      if (!hasActiveSession || isExplicitlyLoggedOut()) {
        setStoredToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check current session with backend
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setError(null);
      } else {
        sessionStorage.removeItem('acme_active_session');
        setStoredToken(null);
        setUser(null);
      }
    } catch (err: any) {
      console.warn('Authentication check failed:', err.message);
      sessionStorage.removeItem('acme_active_session');
      setStoredToken(null);
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

      // Mark session as active and store token
      sessionStorage.setItem('acme_active_session', 'true');
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
      sessionStorage.removeItem('acme_active_session');
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
