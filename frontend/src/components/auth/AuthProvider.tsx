'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCurrentUser,
  guestLogin as guestLoginRequest,
  login as loginRequest,
  logout as logoutRequest,
} from '@/lib/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && pathname !== '/login') {
      router.replace('/login');
    }

    if (user && pathname === '/login') {
      router.replace('/dashboard');
    }
  }, [loading, pathname, router, user]);

  async function login(identifier: string, password: string) {
    const response = await loginRequest(identifier, password);
    setUser(response.user);
    router.replace('/dashboard');
  }

  async function guestLogin() {
    const response = await guestLoginRequest();
    setUser(response.user);
    router.replace('/dashboard');
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    router.replace('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
