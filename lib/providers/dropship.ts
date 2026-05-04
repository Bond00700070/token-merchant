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

    const payload = buildPayload(order);
    const res = await fetch(`${apiBase.replace(/\/$/, "")}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
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
