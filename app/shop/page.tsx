import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, type Product } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop",
  description: "All current drops — tees, mugs, stickers, and posters for AI builders.",
  path: "/shop",
});

const CATEGORIES: { id: Product["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "apparel", label: "Apparel" },
  { id: "drinkware", label: "Drinkware" },
  { id: "stickers", label: "Stickers" },
  { id: "posters", label: "Posters" },
];

type ShopPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = (await searchParams) ?? {};
  const active = (params.category ?? "all") as Product["category"] | "all";
  const products =
    active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <section className="container-tight py-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label">Drop 001</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Shop</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const href = c.id === "all" ? "/shop" : `/shop?category=${c.id}`;
            const isActive = active === c.id;
            return (
              <Link
                key={c.id}
                href={href}
                className={`rounded-full border px-3 py-1 text-sm ${
                  isActive
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 hover:border-ink"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No products in this category yet.</p>
      ) : null}
    </section>
  );
}
