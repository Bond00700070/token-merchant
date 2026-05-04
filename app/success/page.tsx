import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Order placed",
  description: "Your order is in. We'll send a confirmation email shortly.",
  path: "/success",
});

export default function SuccessPage() {
  return (
    <section className="container-tight py-24 text-center">
      <ClearCart />
      <p className="label">Drop received</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        Order placed.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        We&apos;ll send a confirmation email shortly with tracking info once
        your items ship.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="btn-primary">
          Keep shopping
        </Link>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </section>
  );
}
