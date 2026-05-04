---
name: testing-storefront
description: How to locally verify the Token Merchant storefront — cart flow, /success cart-clear, and Stripe webhook per-provider grouping — without live Stripe access.
---

# Testing Token Merchant locally

## Run the production build

No real Stripe keys are needed for local UI testing — dummy values keep the Stripe SDK happy at boot:

```bash
rm -rf .next
STRIPE_SECRET_KEY=sk_test_dummy \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy \
  NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  STRIPE_WEBHOOK_SECRET=whsec_test_dummy_for_local_testing \
  npx next build

STRIPE_SECRET_KEY=sk_test_dummy \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy \
  NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  STRIPE_WEBHOOK_SECRET=whsec_test_dummy_for_local_testing \
  npx next start -p 3000
```

The checkout API route (`/api/checkout`) and the webhook (`/api/webhooks/stripe`) will fail any *real* Stripe request, but the storefront UI (home, shop, product, cart, success) and the webhook signature/grouping code paths are exercisable.

## Test 1 — Cart cleared on /success (UI)

1. Visit `/product/tokens-go-brrr-tee`.
2. Set quantity = 2, click Add to cart. You should land on `/cart` with the line item and the header `Cart` link showing badge `2`.
3. Manually navigate to `/success` (simulates the Stripe redirect).
4. Verify the header `Cart` link shows no badge.
5. Click `Cart`. The empty-state `Cart is empty` should render.
6. (Optional) In DevTools console run `localStorage.getItem('token-merchant.cart.v1')`. It should equal `'{"items":[]}'`.

The behaviour is implemented by `components/ClearCart.tsx`, embedded in `app/success/page.tsx`. A regression would leave the badge populated and localStorage holding the slug.

## Test 2 — Webhook per-provider grouping (runtime)

The `groupByProvider` helper in `app/api/webhooks/stripe/route.ts` is *not* exported by default (Next.js route files conventionally only export route handlers). To unit-test it at runtime:

1. Temporarily prefix the function declaration with `export` (revert before commit/PR).
2. Run a tsx harness:

```ts
// scripts/test-grouping.ts (test-only, do not commit)
import { groupByProvider } from "@/app/api/webhooks/stripe/route";
import type { FulfillmentLineItem } from "@/lib/providers";
import { getProduct } from "@/lib/products";

const tee = getProduct("tokens-go-brrr-tee")!;
const sticker = getProduct("ship-it-sticker-pack")!;
const dropshipSticker = { ...sticker, provider: "dropship" as const };

const cart: FulfillmentLineItem[] = [
  { product: tee, variantId: "s", quantity: 2 },
  { product: tee, variantId: "m", quantity: 1 },
  { product: dropshipSticker, variantId: "default", quantity: 5 },
];

const groups = groupByProvider(cart);
if (groups.size !== 2) throw new Error(`expected 2 groups, got ${groups.size}`);
console.log("OK");
```

Run with `npx tsx scripts/test-grouping.ts`.

Full end-to-end webhook delivery (signed POST → real Stripe → `listLineItems`) requires a real `sk_test_...` key and `stripe listen`; the grouping logic itself is verified above.

## Common gotchas

- `next start` without prior `next build` will fail. Always rebuild after changing source.
- The seeded products use `https://via.placeholder.com/...` image URLs which are unreachable from this VM; product images appear blank locally but render fine in production.
- When testing the cart, use the SAME tab/origin throughout — localStorage is per-origin and Devin's previewed tunnel URL has a different origin from `localhost:3000`.
