import { NextResponse } from "next/server";
import { z } from "zod";
import { cartItemSchema } from "@/lib/cart";
import { PRODUCTS, getProduct } from "@/lib/products";
import { SITE } from "@/lib/seo";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1),
});

export async function POST(req: Request) {
  let parsed;
  try {
    const json = await req.json();
    parsed = bodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const lineItems: Array<{
    price_data: {
      currency: "usd";
      product_data: { name: string; description?: string; metadata: Record<string, string> };
      unit_amount: number;
    };
    quantity: number;
  }> = [];

  for (const item of parsed.items) {
    const product = getProduct(item.productSlug);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant) {
      return NextResponse.json(
        { error: `Unknown line item: ${item.productSlug}/${item.variantId}` },
        { status: 400 },
      );
    }
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${product.name} — ${variant.label}`,
          description: product.tagline,
          metadata: {
            productSlug: product.slug,
            variantId: variant.id,
            providerId: variant.providerId,
            provider: product.provider,
          },
        },
        unit_amount: variant.priceCents,
      },
      quantity: item.quantity,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${SITE.url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE.url}/cancel`,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "IE"],
    },
    automatic_tax: { enabled: false },
    metadata: {
      cart: JSON.stringify(
        parsed.items.map((i) => ({
          productSlug: i.productSlug,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      ).slice(0, 500),
    },
  });

  return NextResponse.json({ url: session.url });
}

// Tiny health-check + sanity that the catalog is wired in:
export async function GET() {
  return NextResponse.json({
    ok: true,
    productCount: PRODUCTS.length,
  });
}
