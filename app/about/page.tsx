import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "What Token Merchant is, why it exists, and how it ships.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="container-tight prose prose-neutral max-w-2xl py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        We make merch for people who ship.
      </h1>
      <p className="mt-6 text-muted">
        Token Merchant is a small drop store of t-shirts, mugs, stickers, and
        posters made for AI builders. Each design is an inside joke for someone
        who has actually had to wrangle a model in production.
      </p>
      <h2 className="mt-10 font-display text-xl font-semibold">How it works</h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
        <li>
          We don&apos;t hold inventory. Every order is printed on demand and
          shipped from a US fulfilment partner.
        </li>
        <li>
          That means we can ship more designs more often, and you only pay for
          what someone actually buys.
        </li>
        <li>
          Production runs 2–5 business days; shipping is another 3–7 days
          domestically.
        </li>
      </ul>
      <h2 className="mt-10 font-display text-xl font-semibold">Roadmap</h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
        <li>New drop every 2 weeks.</li>
        <li>Limited-run posters and screen prints once a month.</li>
        <li>Open source storefront — fork it on GitHub and run your own.</li>
      </ul>
      <p className="mt-10">
        <Link href="/shop" className="btn-primary">
          See current drop
        </Link>
      </p>
    </section>
  );
}
