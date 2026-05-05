import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { PRODUCTS, formatPrice, getProduct } from "@/lib/products";
import { SITE, buildMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return buildMetadata({ title: "Not found" });
  return buildMetadata({
    title: product.name,
    description: product.tagline,
    path: `/product/${product.slug}`,
    image: product.images[0]?.src,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cheapest = product.variants.reduce(
    (min, v) => (v.priceCents < min ? v.priceCents : min),
    product.variants[0]?.priceCents ?? 0,
  );
  const image = product.images[0];

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: image ? [image.src] : [],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: (cheapest / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  return (
    <section className="container-tight py-12">
      <Link href="/shop" className="label hover:text-accent">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-ink/10 bg-ink/5">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div>
          <p className="label">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-muted">{product.tagline}</p>
          <p className="mt-4 text-2xl font-semibold">From {formatPrice(cheapest)}</p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>{product.description}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Printed on demand. Shipped from the US.</li>
              <li>2–5 business days production · 3–7 days shipping.</li>
              <li>Returns accepted on damaged or misprinted items.</li>
            </ul>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </section>
  );
}
