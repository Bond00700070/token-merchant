"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

/**
 * Renders nothing; clears the localStorage cart on mount.
 * Embed in `/success` so a customer who completes Stripe checkout doesn't
 * see paid-for items in their cart on return.
 */
export function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
