"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  function onAdd() {
    if (!variantId) return;
    addItem({ productSlug: product.slug, variantId, quantity });
    router.push("/cart");
  }

  return (
    <div className="space-y-4">
      {product.variants.length > 1 ? (
        <div>
          <label className="label" htmlFor="variant">
            Variant
          </label>
          <select
            id="variant"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label className="label" htmlFor="qty">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={50}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          className="mt-1 w-24 rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm"
        />
      </div>
      <button type="button" onClick={onAdd} className="btn-primary w-full">
        Add to cart
      </button>
    </div>
  );
}
