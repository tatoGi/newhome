'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api/client';
import { FrontendCartItem } from '@/lib/api/types';

interface Product {
  id: number;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
  unit_price?: number;
  line_total?: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, delta: number) => Promise<void>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_TOKEN_KEY = 'newhome_cart_token';
const WISHLIST_KEY = 'newhome_wishlist';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token: authToken, user, openAuthModal } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const persistCartToken = (nextToken: string | null) => {
    if (nextToken) {
      window.localStorage.setItem(CART_TOKEN_KEY, nextToken);
      document.cookie = `${CART_TOKEN_KEY}=${nextToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(CART_TOKEN_KEY);
      document.cookie = `${CART_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }

    setCartToken(nextToken);
  };

  const normalizeCartItems = (items: FrontendCartItem[]): CartItem[] =>
    items.map((item) => ({
      id: item.product_id,
      slug: item.slug ?? undefined,
      name: item.name,
      price: item.unit_price,
      image: item.image || '/placeholder.jpg',
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total,
    }));

  const syncWishlist = async () => {
    if (!authToken) {
      // If not logged in, use localStorage
      const savedWishlist = window.localStorage.getItem(WISHLIST_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      return;
    }

    try {
      const response = await api.getWishlist(authToken);
      setWishlist(response.items.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.feature_image || '/placeholder.jpg',
        category: item.category,
      })));
    } catch {
      setWishlist([]);
    }
  };

  const syncCart = async (tokenOverride?: string | null) => {
    setIsCartLoading(true);

    try {
      const response = await api.getCart(tokenOverride ?? cartToken, authToken);
      persistCartToken(response.cart.token || tokenOverride || null);
      setCart(normalizeCartItems(response.cart.items));
    } catch {
      setCart([]);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem(CART_TOKEN_KEY);
    const savedWishlist = window.localStorage.getItem(WISHLIST_KEY);

    if (savedWishlist && !authToken) {
      // Only use localStorage if not logged in
      setWishlist(JSON.parse(savedWishlist));
    }

    void syncCart(storedToken);
    void syncWishlist();
  }, []);

  useEffect(() => {
    if (cartToken === null && authToken === null) {
      return;
    }

    void syncCart(cartToken);
    void syncWishlist();
  }, [authToken]);

  useEffect(() => {
    // Only save to localStorage if not logged in
    if (!authToken) {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, authToken]);

  const addToCart = async (product: Product) => {
    if (!authToken || !user) {
      openAuthModal('register');
      return;
    }

    const response = await api.addCartItem({ product_id: product.id, quantity: 1 }, cartToken, authToken);
    persistCartToken(response.cart.token || cartToken);
    setCart(normalizeCartItems(response.cart.items));
  };

  const removeFromCart = async (productId: number) => {
    const response = await api.removeCartItem(productId, cartToken, authToken);
    persistCartToken(response.cart.token || cartToken);
    setCart(normalizeCartItems(response.cart.items));
  };

  const updateQuantity = async (productId: number, delta: number) => {
    const existing = cart.find((item) => item.id === productId);
    if (!existing) {
      return;
    }

    const response = await api.updateCartItem(productId, {
      quantity: Math.max(1, existing.quantity + delta),
    }, cartToken, authToken);

    persistCartToken(response.cart.token || cartToken);
    setCart(normalizeCartItems(response.cart.items));
  };

  const addToWishlist = async (product: Product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      if (authToken) {
        // Sync with server if logged in
        try {
          await api.addToWishlist({ product_id: product.id }, authToken);
          await syncWishlist();
        } catch {
          // Fallback to localStorage
          setWishlist((prev) => [...prev, product]);
        }
      } else {
        // Use localStorage if not logged in
        setWishlist((prev) => [...prev, product]);
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (authToken) {
      // Sync with server if logged in
      try {
        await api.removeFromWishlist(productId, authToken);
        await syncWishlist();
      } catch {
        // Fallback to localStorage
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
      }
    } else {
      // Use localStorage if not logged in
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const isInWishlist = (productId: number) => wishlist.some((item) => item.id === productId);

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      isCartLoading,
      refreshCart: () => syncCart(cartToken),
      addToCart,
      removeFromCart,
      updateQuantity,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
};
