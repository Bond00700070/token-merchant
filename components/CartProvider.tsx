"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type Cart,
  type CartItem,
  addItem as addItemFn,
  emptyCart,
  loadCart,
  removeItem as removeItemFn,
  saveCart,
  totalQuantity,
  updateQuantity as updateQuantityFn,
} from "@/lib/cart";

type CartContextValue = {
  cart: Cart;
  count: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productSlug: string, variantId: string) => void;
  updateQuantity: (productSlug: string, variantId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(cart);
  }, [cart, hydrated]);

  const addItem = useCallback((item: CartItem) => setCart((c) => addItemFn(c, item)), []);
  const removeItem = useCallback(
    (productSlug: string, variantId: string) =>
      setCart((c) => removeItemFn(c, productSlug, variantId)),
    [],
  );
  const updateQuantity = useCallback(
    (productSlug: string, variantId: string, quantity: number) =>
      setCart((c) => updateQuantityFn(c, productSlug, variantId, quantity)),
    [],
  );
  const clear = useCallback(() => setCart(emptyCart()), []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: totalQuantity(cart),
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [cart, hydrated, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
