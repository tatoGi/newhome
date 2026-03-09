'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import { api } from '@/lib/api/client';
import { FrontendUser } from '@/lib/api/types';

interface AuthContextType {
  user: FrontendUser | null;
  token: string | null;
  isLoading: boolean;
  showAuthModal: boolean;
  authModalMode: 'login' | 'register';
  login: (payload: { email: string; password: string; }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  updateProfile: (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'newhome_auth_token';
const TOKEN_COOKIE = 'newhome_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const persistToken = (nextToken: string | null) => {
    if (nextToken) {
      window.localStorage.setItem(TOKEN_KEY, nextToken);
      document.cookie = `${TOKEN_COOKIE}=${nextToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
      document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    }
  };

  const readCookieToken = () => {
    const cookie = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${TOKEN_COOKIE}=`));

    return cookie ? decodeURIComponent(cookie.split('=')[1] || '') : null;
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY) || readCookieToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    persistToken(storedToken);
    setToken(storedToken);
    api.me(storedToken)
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        persistToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const persistAuth = (nextToken: string, nextUser: FrontendUser) => {
    persistToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload: { email: string; password: string; }) => {
    const response = await api.login(payload);
    persistAuth(response.token, response.user);
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.register(payload);
    persistAuth(response.token, response.user);
  };

  const updateProfile = async (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    if (!token) {
      throw new Error('Not authenticated.');
    }

    const response = await api.updateProfile(token, payload);
    setUser(response.user);
  };

  const logout = async () => {
    if (token) {
      try {
        await api.logout(token);
      } catch {}
    }

    persistToken(null);
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      showAuthModal,
      authModalMode,
      login,
      register,
      updateProfile,
      logout,
      openAuthModal,
      closeAuthModal,
    }}
    >
      <>
        {children}
        <AuthModal show={showAuthModal} onHide={closeAuthModal} initialMode={authModalMode} />
      </>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
