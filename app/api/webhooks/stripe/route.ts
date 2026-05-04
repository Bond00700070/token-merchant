import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getProduct } from "@/lib/products";
import {
  getProvider,
  type FulfillmentLineItem,
  type FulfillmentResult,
  type ProviderName,
  type ShippingAddress,
} from "@/lib/providers";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Pull line items so we can map back to our products.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  const items: FulfillmentLineItem[] = [];
  for (const li of lineItems.data) {
    const productMeta =
      li.price?.product && typeof li.price.product !== "string"
        ? (li.price.product as Stripe.Product).metadata
        : null;
    const slug = productMeta?.productSlug;
    const variantId = productMeta?.variantId;
    if (!slug || !variantId) continue;
    const product = getProduct(slug);
    if (!product) continue;
    items.push({
      product,
      variantId,
      quantity: li.quantity ?? 1,
    });
  }

  if (items.length === 0) {
    // Nothing we can fulfill (e.g. metadata stripped); ack to Stripe.
    return NextResponse.json({ received: true, fulfilled: 0 });
  }

  const customer = session.customer_details;
  const shipping = session.shipping_details ?? null;
  const address = shipping?.address ?? customer?.address ?? null;
  if (!customer?.email || !shipping?.name || !address) {
    return NextResponse.json(
      { error: "Missing shipping details" },
      { status: 400 },
    );
  }

  const shippingAddress: ShippingAddress = {
    name: shipping.name ?? customer.name ?? "",
    email: customer.email,
    line1: address.line1 ?? "",
    line2: address.line2 ?? null,
    city: address.city ?? "",
    state: address.state ?? null,
    postalCode: address.postal_code ?? "",
    country: address.country ?? "",
  };

  // Group items by their fulfillment provider so each provider receives only
  // the items it can fulfill. A cart can mix POD and dropship products in the
  // same Stripe order; without grouping, the wrong provider would receive
  // SKUs it can't fulfill.
  const groups = groupByProvider(items);

  const submissions = await Promise.allSettled(
    Array.from(groups.entries()).map(async ([providerName, groupItems]) => {
      const provider = getProvider(providerName);
      // Suffix the external order ID per-provider so a single Stripe session
      // never collides with itself across providers.
      const externalOrderId =
        groups.size > 1 ? `${session.id}__${providerName}` : session.id;
      const result = await provider.submitOrder({
        externalOrderId,
        items: groupItems,
        shipping: shippingAddress,
      });
      return { providerName, result };
    }),
  );

  const successes: Array<{ provider: ProviderName; result: FulfillmentResult }> = [];
  const failures: Array<{ provider: ProviderName; error: string }> = [];
  for (const [index, settled] of submissions.entries()) {
    const providerName = Array.from(groups.keys())[index]!;
    if (settled.status === "fulfilled") {
      successes.push({
        provider: providerName,
        result: settled.value.result,
      });
    } else {
      const reason = settled.reason;
      failures.push({
        provider: providerName,
        error: reason instanceof Error ? reason.message : String(reason),
      });
    }
  }

  if (failures.length > 0) {
    // Return 500 so Stripe retries the webhook. Idempotent providers will
    // dedupe on `externalOrderId`; non-idempotent providers should expose a
    // dashboard for manual reconciliation of duplicate orders.
    return NextResponse.json(
      {
        received: true,
        fulfilled: successes,
        failed: failures,
        error: `Partial fulfillment failure: ${failures
          .map((f) => `${f.provider}: ${f.error}`)
          .join("; ")}`,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    received: true,
    fulfilled: successes,
  });
}

function groupByProvider(
  items: FulfillmentLineItem[],
): Map<ProviderName, FulfillmentLineItem[]> {
  const groups = new Map<ProviderName, FulfillmentLineItem[]>();
  for (const item of items) {
    const existing = groups.get(item.product.provider);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(item.product.provider, [item]);
    }
  }
  return groups;
}
