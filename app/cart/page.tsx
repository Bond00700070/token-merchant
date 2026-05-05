"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { PRODUCTS, formatPrice, getProduct } from "@/lib/products";

export default function CartPage() {
  const { cart, hydrated, removeItem, updateQuantity, clear } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const lines = useMemo(() => {
    return cart.items.flatMap((item) => {
      const product = getProduct(item.productSlug);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return [];
      return [{ item, product, variant }];
    });
  }, [cart.items]);

  const subtotalCents = lines.reduce(
    (acc, l) => acc + l.variant.priceCents * l.item.quantity,
    0,
  );

  async function onCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <section className="container-tight py-12">
        <h1 className="font-display text-2xl">Cart</h1>
        <p className="mt-2 text-muted">Loading…</p>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="container-tight py-16 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Cart is empty</h1>
        <p className="mt-2 text-muted">Nothing here yet. Pick a drop.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Browse the shop
        </Link>
        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="rounded-lg border border-ink/10 p-4 hover:border-ink"
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted">{p.tagline}</div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container-tight py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Cart</h1>
      <div className="mt-8 grid gap-12 md:grid-cols-[2fr_1fr]">
        <ul className="divide-y divide-ink/10">
          {lines.map(({ item, product, variant }) => {
            const image = product.images[0];
            return (
              <li
                key={`${item.productSlug}-${item.variantId}`}
                className="flex gap-4 py-6"
              >
                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-ink/5">
                  {image ? (
                    <Image src={image.src} alt={image.alt} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    <span className="font-medium">
                      {formatPrice(variant.priceCents * item.quantity)}
                    </span>
                  </div>
                  <div className="text-sm text-muted">{variant.label}</div>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productSlug,
                          item.variantId,
                          Math.max(1, Math.min(50, Number(e.target.value) || 1)),
                        )
                      }
                      className="w-20 rounded-md border border-ink/20 bg-paper px-2 py-1 text-sm"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productSlug, item.variantId)}
                      className="text-sm text-muted hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-lg border border-ink/10 p-6">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotalCents)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            disabled={checkoutLoading}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            {checkoutLoading ? "Loading…" : "Checkout"}
          </button>
          {checkoutError ? (
            <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
          ) : null}
          <button
            type="button"
            onClick={clear}
            className="mt-3 w-full text-xs text-muted hover:text-ink"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </section>
  );
}
