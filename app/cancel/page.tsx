import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout cancelled",
  description: "Checkout cancelled. Your cart is still saved.",
  path: "/cancel",
});

export default function CancelPage() {
  return (
    <section className="container-tight py-24 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Checkout cancelled
      </h1>
      <p className="mt-2 text-muted">Your cart is still saved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/cart" className="btn-primary">
          Back to cart
        </Link>
        <Link href="/shop" className="btn-ghost">
          Keep shopping
        </Link>
      </div>
    </section>
  );
}
