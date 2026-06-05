import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../models/types';

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateCartQty: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Hydrate Cart, Wishlist, and Recently Viewed from Local Storage
  useEffect(() => {
    const localCart = localStorage.getItem('rdx_cart_v1');
    const localWishlist = localStorage.getItem('rdx_wishlist_v1');
    const localRecent = localStorage.getItem('rdx_recent_v1');

    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (e) {
        console.error("Cart hydration error: ", e);
      }
    }
    if (localWishlist) {
      try {
        setWishlist(JSON.parse(localWishlist));
      } catch (e) {
        console.error("Wishlist hydration error: ", e);
      }
    }
    if (localRecent) {
      try {
        setRecentlyViewed(JSON.parse(localRecent));
      } catch (e) {
        console.error("Recently Viewed hydration error: ", e);
      }
    }
  }, []);

  const saveCart = (ct: CartItem[]) => {
    setCart(ct);
    localStorage.setItem('rdx_cart_v1', JSON.stringify(ct));
  };

  const toggleWishlist = (productId: string) => {
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(nextWishlist);
    localStorage.setItem('rdx_wishlist_v1', JSON.stringify(nextWishlist));
  };

  const addToRecentlyViewed = (productId: string) => {
    const filtered = recentlyViewed.filter(id => id !== productId);
    const nextRecent = [productId, ...filtered].slice(0, 8); // Store up to latest 8 unique products
    setRecentlyViewed(nextRecent);
    localStorage.setItem('rdx_recent_v1', JSON.stringify(nextRecent));
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('rdx_recent_v1');
  };

  const addToCart = (productId: string, variantId: string, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
    const nextCart = [...cart];
    if (existingIndex > -1) {
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        quantity: nextCart[existingIndex].quantity + quantity
      };
    } else {
      nextCart.push({ productId, variantId, quantity });
    }
    saveCart(nextCart);
  };

  const updateCartQty = (productId: string, variantId: string, quantity: number) => {
    const nextCart = [...cart];
    const index = cart.findIndex(item => item.productId === productId && item.variantId === variantId);
    if (index > -1) {
      if (quantity <= 0) {
        nextCart.splice(index, 1);
      } else {
        nextCart[index] = { ...nextCart[index], quantity };
      }
      saveCart(nextCart);
    }
  };

  const removeFromCart = (productId: string, variantId: string) => {
    const nextCart = cart.filter(item => !(item.productId === productId && item.variantId === variantId));
    saveCart(nextCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      recentlyViewed,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      addToRecentlyViewed,
      clearRecentlyViewed
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
