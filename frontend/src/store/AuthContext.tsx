import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authApi, clearApiCache } from '../services/apiClient';

export type UserRole = 'SUPER_ADMIN' | 'PAPER_SETTER' | 'CENTRE_ADMIN' | 'INVIGILATOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centre_id?: string;
  is_active: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<User>;
  signup: (data: { email: string; password: string; name: string; role: UserRole; centre_id?: string }) => Promise<User>;
  logout: (showToast?: boolean) => void;
  switchRole: (role: UserRole) => Promise<void>;
  getDashboardUrl: (role?: UserRole) => string;
}

const DEMO_ROLE_CREDENTIALS: Record<UserRole, { email: string; name: string }> = {
  SUPER_ADMIN: { email: 'admin@veriq.local', name: 'Dr. Rajesh Sharma' },
  PAPER_SETTER: { email: 'setter@veriq.local', name: 'Prof. Ananya Sen' },
  CENTRE_ADMIN: { email: 'centre@veriq.local', name: 'Suresh Kulkarni' },
  INVIGILATOR: { email: 'invigilator@veriq.local', name: 'Rohit Verma' },
};

export const getRoleDashboardUrl = (role?: string): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard/admin';
    case 'PAPER_SETTER':
      return '/dashboard/paper-setter';
    case 'CENTRE_ADMIN':
      return '/dashboard/centre';
    case 'INVIGILATOR':
      return '/dashboard/invigilator';
    default:
      return '/dashboard/admin';
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('veriq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('veriq_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const hasToken = !!localStorage.getItem('veriq_access_token');
    const hasUser = !!localStorage.getItem('veriq_user');
    return hasToken && !hasUser;
  });

  const fetchUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data);
      localStorage.setItem('veriq_user', JSON.stringify(res.data));
    } catch {
      setUser(null);
      localStorage.removeItem('veriq_access_token');
      localStorage.removeItem('veriq_user');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password = 'password123'): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('veriq_access_token', access_token);
      localStorage.setItem('veriq_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (err: any) {
      console.error('Login failed', err);
      const msg = err.response?.data?.detail || 'The email or password is incorrect.';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { email: string; password: string; name: string; role: UserRole; centre_id?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authApi.signup(data);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('veriq_access_token', access_token);
      setToken(access_token);
      setUser(userData);
      toast.success('Account created and verified securely.');
      return userData;
    } catch (err: any) {
      console.error('Signup failed', err);
      const msg = err.response?.data?.detail || 'Account registration failed. Please try again.';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (role: UserRole) => {
    const creds = DEMO_ROLE_CREDENTIALS[role];
    if (creds) {
      try {
        clearApiCache();
        const u = await login(creds.email, 'password123');
        toast.success(`Switched persona to ${role.replace('_', ' ')} (${u.name})`);
      } catch (e: any) {
        toast.error(`Unable to switch to ${role}: ${e.message}`);
      }
    }
  };

  const logout = (showToast = true) => {
    clearApiCache();
    localStorage.removeItem('veriq_access_token');
    localStorage.removeItem('veriq_user');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Signed out securely.');
    }
  };

  const getDashboardUrl = (role?: UserRole): string => {
    return getRoleDashboardUrl(role || user?.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        switchRole,
        getDashboardUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
