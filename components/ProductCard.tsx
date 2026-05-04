import Image from "next/image";
import Link from "next/link";
import { type Product, formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const cheapest = product.variants.reduce(
    (min, v) => (v.priceCents < min ? v.priceCents : min),
    product.variants[0]?.priceCents ?? 0,
  );
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-ink/10 bg-paper transition hover:border-ink"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="label">{product.category}</div>
        <h3 className="mt-1 font-display text-base font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.tagline}</p>
        <p className="mt-2 text-sm">
          From <span className="font-medium">{formatPrice(cheapest)}</span>
        </p>
      </div>
    </Link>
  );
}
