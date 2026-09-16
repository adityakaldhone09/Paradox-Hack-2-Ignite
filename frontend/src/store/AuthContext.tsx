import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  centre_id?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('veriq_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('veriq_access_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      // Auto login as default Authority for immediate frictionless hackathon preview
      login('authority@veriq.local', 'password123');
    }
  }, [token]);

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('veriq_access_token', access_token);
      setToken(access_token);
      setUser(userData);
    } catch (err) {
      console.error('Login error', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (email: string) => {
    await login(email, 'password123');
  };

  const logout = () => {
    localStorage.removeItem('veriq_access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
