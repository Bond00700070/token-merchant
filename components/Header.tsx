"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { count, hydrated } = useCart();
  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="container-tight flex items-center justify-between py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Token<span className="text-accent">.</span>Merchant
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/shop" className="hover:text-accent">
            Shop
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/cart" className="relative hover:text-accent" aria-label="Cart">
            Cart
            {hydrated && count > 0 ? (
              <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-xs text-paper">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
