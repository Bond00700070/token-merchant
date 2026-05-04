/**
 * Fulfillment provider abstraction.
 *
 * The storefront treats fulfillment as a pluggable interface so the same
 * checkout + webhook flow can serve print-on-demand (Printful) and traditional
 * dropshipping (CJ/AliExpress aggregators) without duplicating logic.
 *
 * To add a new provider, implement `FulfillmentProvider` and register it in
 * `getProvider`.
 */

import type { Product } from "@/lib/products";
import { printfulProvider } from "@/lib/providers/printful";
import { dropshipProvider } from "@/lib/providers/dropship";

export type ShippingAddress = {
  name: string;
  email: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
};

export type FulfillmentLineItem = {
  product: Product;
  variantId: string;
  quantity: number;
};

export type FulfillmentOrder = {
  externalOrderId: string;
  items: FulfillmentLineItem[];
  shipping: ShippingAddress;
};

export type FulfillmentResult = {
  providerOrderId: string;
  status: "submitted" | "pending" | "skipped";
  notes?: string;
};

export interface FulfillmentProvider {
  readonly name: "printful" | "dropship";
  submitOrder(order: FulfillmentOrder): Promise<FulfillmentResult>;
}

export function getProvider(name: "printful" | "dropship"): FulfillmentProvider {
  switch (name) {
    case "printful":
      return printfulProvider;
    case "dropship":
      return dropshipProvider;
  }
}

export function defaultProvider(): FulfillmentProvider {
  const name = (process.env.FULFILLMENT_DEFAULT_PROVIDER ?? "printful") as
    | "printful"
    | "dropship";
  return getProvider(name);
}
