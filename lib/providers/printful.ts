import type {
  FulfillmentOrder,
  FulfillmentProvider,
  FulfillmentResult,
} from "@/lib/providers";

const PRINTFUL_API = "https://api.printful.com";

type PrintfulOrderItem = {
  sync_variant_id?: number;
  external_variant_id?: string;
  quantity: number;
};

type PrintfulOrderPayload = {
  external_id: string;
  recipient: {
    name: string;
    email: string;
    address1: string;
    address2?: string | null;
    city: string;
    state_code?: string | null;
    country_code: string;
    zip: string;
  };
  items: PrintfulOrderItem[];
};

export const printfulProvider: FulfillmentProvider = {
  name: "printful",
  async submitOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    const apiKey = process.env.PRINTFUL_API_KEY;
    if (!apiKey) {
      // Allow the storefront to operate without Printful in dev/preview.
      // The Stripe order is still recorded; fulfillment is skipped.
      return {
        providerOrderId: "printful_skipped",
        status: "skipped",
        notes: "PRINTFUL_API_KEY not set; fulfillment was not submitted.",
      };
    }

    const payload: PrintfulOrderPayload = {
      external_id: order.externalOrderId,
      recipient: {
        name: order.shipping.name,
        email: order.shipping.email,
        address1: order.shipping.line1,
        address2: order.shipping.line2 ?? null,
        city: order.shipping.city,
        state_code: order.shipping.state ?? null,
        country_code: order.shipping.country,
        zip: order.shipping.postalCode,
      },
      items: order.items.map((item) => {
        const variant = item.product.variants.find((v) => v.id === item.variantId);
        const providerId = variant?.providerId ?? "";
        // Printful exposes both numeric sync_variant_id and external_variant_id.
        // We treat any non-numeric providerId as an external variant ID.
        const numeric = Number(providerId);
        if (Number.isFinite(numeric) && providerId !== "" && !providerId.startsWith("printful_")) {
          return { sync_variant_id: numeric, quantity: item.quantity };
        }
        return { external_variant_id: providerId, quantity: item.quantity };
      }),
    };

    const storeId = process.env.PRINTFUL_STORE_ID;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    if (storeId) headers["X-PF-Store-Id"] = storeId;

    const res = await fetch(`${PRINTFUL_API}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Printful order failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { result?: { id: number } };
    return {
      providerOrderId: String(data.result?.id ?? "unknown"),
      status: "submitted",
    };
  },
};
