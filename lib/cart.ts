import { z } from "zod";

export const cartItemSchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});
export type Cart = z.infer<typeof cartSchema>;

export const CART_STORAGE_KEY = "token-merchant.cart.v1";

export function emptyCart(): Cart {
  return { items: [] };
}

export function loadCart(): Cart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCart();
    const parsed = cartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyCart();
  } catch {
    return emptyCart();
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage may be disabled (private mode); fail silently.
  }
}

export function addItem(cart: Cart, item: CartItem): Cart {
  const existing = cart.items.find(
    (i) => i.productSlug === item.productSlug && i.variantId === item.variantId,
  );
  if (existing) {
    return {
      items: cart.items.map((i) =>
        i === existing ? { ...i, quantity: Math.min(50, i.quantity + item.quantity) } : i,
      ),
    };
  }
  return { items: [...cart.items, item] };
}

export function removeItem(cart: Cart, productSlug: string, variantId: string): Cart {
  return {
    items: cart.items.filter(
      (i) => !(i.productSlug === productSlug && i.variantId === variantId),
    ),
  };
}

export function updateQuantity(
  cart: Cart,
  productSlug: string,
  variantId: string,
  quantity: number,
): Cart {
  if (quantity <= 0) return removeItem(cart, productSlug, variantId);
  return {
    items: cart.items.map((i) =>
      i.productSlug === productSlug && i.variantId === variantId
        ? { ...i, quantity: Math.min(50, quantity) }
        : i,
    ),
  };
}

export function totalQuantity(cart: Cart): number {
  return cart.items.reduce((acc, i) => acc + i.quantity, 0);
}
