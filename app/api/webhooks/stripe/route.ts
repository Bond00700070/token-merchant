import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getProduct } from "@/lib/products";
import { defaultProvider, type FulfillmentLineItem, type ShippingAddress } from "@/lib/providers";
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

  const provider = defaultProvider();
  try {
    const result = await provider.submitOrder({
      externalOrderId: session.id,
      items,
      shipping: shippingAddress,
    });
    return NextResponse.json({
      received: true,
      provider: provider.name,
      providerOrderId: result.providerOrderId,
      status: result.status,
      notes: result.notes,
    });
  } catch (err) {
    // Returning 500 here makes Stripe retry, which is what we want for transient
    // provider failures.
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Fulfillment failed",
      },
      { status: 500 },
    );
  }
}
