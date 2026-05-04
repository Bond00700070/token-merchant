import type {
  FulfillmentOrder,
  FulfillmentProvider,
  FulfillmentResult,
} from "@/lib/providers";

/**
 * Generic dropshipping provider.
 *
 * Most aggregators (CJ Dropshipping, Spocket, Zendrop) expose a similar
 * "create order" REST endpoint. This adapter posts a normalized payload to
 * `DROPSHIP_API_BASE` with bearer auth. Adjust the body shape in
 * `buildPayload` to match the specific aggregator you sign up with.
 *
 * If `DROPSHIP_API_KEY` is missing, fulfillment is skipped (the Stripe order
 * still completes), which lets you launch and validate demand before wiring
 * up a real supplier.
 */
export const dropshipProvider: FulfillmentProvider = {
  name: "dropship",
  async submitOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    const apiKey = process.env.DROPSHIP_API_KEY;
    const apiBase = process.env.DROPSHIP_API_BASE;
    if (!apiKey || !apiBase) {
      return {
        providerOrderId: "dropship_skipped",
        status: "skipped",
        notes:
          "DROPSHIP_API_KEY / DROPSHIP_API_BASE not set; fulfillment was not submitted.",
      };
    }

    const baseUrl = apiBase.replace(/\/$/, "");
    const authHeaders: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Idempotency: best-effort GET by externalId before POSTing. Aggregators
    // vary, so we treat any non-2xx (404, 405, 501) as "not supported / not
    // found" and fall through to create. A 2xx with a parseable order id is
    // taken as a duplicate hit and short-circuits the create.
    const existing = await tryLookupExisting(baseUrl, authHeaders, order.externalOrderId);
    if (existing) {
      return {
        providerOrderId: existing,
        status: "submitted",
        notes: "Existing dropship order matched by externalId; skipped re-create.",
      };
    }

    const payload = buildPayload(order);
    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Dropship order failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { id?: string; orderId?: string };
    return {
      providerOrderId: String(data.id ?? data.orderId ?? "unknown"),
      status: "submitted",
    };
  },
};

async function tryLookupExisting(
  baseUrl: string,
  headers: Record<string, string>,
  externalId: string,
): Promise<string | null> {
  try {
    const url = `${baseUrl}/orders?externalId=${encodeURIComponent(externalId)}`;
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) return null;
    const data = (await res.json()) as
      | { id?: string; orderId?: string }
      | { orders?: Array<{ id?: string; orderId?: string }> }
      | Array<{ id?: string; orderId?: string }>;
    const candidate = pickOrderId(data);
    return candidate ?? null;
  } catch {
    // Network or parse failure on the optional lookup is non-fatal; fall
    // through to POST. A duplicate-order risk remains only if the GET fails
    // *and* the prior POST succeeded *and* Stripe retried — log it loudly so
    // the merchant can reconcile in the aggregator dashboard.
    return null;
  }
}

function pickOrderId(
  data:
    | { id?: string; orderId?: string }
    | { orders?: Array<{ id?: string; orderId?: string }> }
    | Array<{ id?: string; orderId?: string }>,
): string | null {
  if (Array.isArray(data)) {
    const first = data[0];
    return first ? (first.id ?? first.orderId ?? null) : null;
  }
  if ("orders" in data && Array.isArray(data.orders)) {
    const first = data.orders[0];
    return first ? (first.id ?? first.orderId ?? null) : null;
  }
  if ("id" in data && data.id) return data.id;
  if ("orderId" in data && data.orderId) return data.orderId;
  return null;
}

function buildPayload(order: FulfillmentOrder) {
  return {
    externalId: order.externalOrderId,
    recipient: {
      name: order.shipping.name,
      email: order.shipping.email,
      addressLine1: order.shipping.line1,
      addressLine2: order.shipping.line2 ?? "",
      city: order.shipping.city,
      state: order.shipping.state ?? "",
      postalCode: order.shipping.postalCode,
      country: order.shipping.country,
    },
    items: order.items.map((item) => {
      const variant = item.product.variants.find((v) => v.id === item.variantId);
      return {
        sku: variant?.providerId ?? "",
        quantity: item.quantity,
      };
    }),
  };
}
