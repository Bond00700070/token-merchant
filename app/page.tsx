import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3);
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="container-tight grid gap-8 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <p className="label">Drop 001 — open</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Merch for people who <span className="text-accent">ship</span>.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Tees, mugs, stickers, and posters for prompt engineers, vibe
              coders, and LLM enthusiasts. Printed on demand. Shipped from the
              US. No drop ship, no SHEIN.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the drop
              </Link>
              <Link href="/about" className="btn-ghost">
                About
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-ink p-8 text-paper">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
{`> claude --tee
loaded model: claude-3.5-sonnet
prompt: design a t-shirt that says
        "tokens go brrr"

✓ generated
✓ printed on demand
✓ shipped to your door

next →`}
            </pre>
          </div>
        </div>
      </section>

      <section className="container-tight py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Featured</h2>
          <Link href="/shop" className="text-sm hover:text-accent">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ink text-paper">
        <div className="container-tight grid gap-8 py-16 md:grid-cols-3">
          <div>
            <div className="label text-paper/60">No inventory</div>
            <h3 className="mt-2 font-display text-xl">Made when you order it.</h3>
            <p className="mt-2 text-sm text-paper/70">
              Every item is printed and shipped on demand. Less waste, less risk,
              more designs.
            </p>
          </div>
          <div>
            <div className="label text-paper/60">Designed for devs</div>
            <h3 className="mt-2 font-display text-xl">Inside jokes only.</h3>
            <p className="mt-2 text-sm text-paper/70">
              Every drop comes from someone who&apos;s actually shipped a model
              to prod and woken up to the pager at 3am.
            </p>
          </div>
          <div>
            <div className="label text-paper/60">Open road</div>
            <h3 className="mt-2 font-display text-xl">Built on the open stack.</h3>
            <p className="mt-2 text-sm text-paper/70">
              Storefront source available on GitHub. Run your own. Fork the
              drops. Make better merch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
