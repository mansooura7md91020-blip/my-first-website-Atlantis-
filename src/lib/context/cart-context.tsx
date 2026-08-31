"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLine } from "@/lib/types";

interface CartContextValue {
  lines: CartLine[];
  addItem: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "atlantis_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount (client only — cart is a session concern,
  // not something to file per Supabase user until checkout/login is wired up).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (productId: string, quantity: number) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { productId, quantity }];
      });
    };

    const updateQuantity = (productId: string, quantity: number) => {
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => l.productId !== productId)
          : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
      );
    };

    const removeItem = (productId: string) => {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
    };

    const clear = () => setLines([]);

    return {
      lines,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
