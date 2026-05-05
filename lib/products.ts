/**
 * Product catalog.
 *
 * The catalog is intentionally a flat TypeScript module so the storefront can
 * render statically and rank in search engines without a database. Replace the
 * `providerId` values with real Printful sync-variant IDs (or a dropshipping
 * SKU) once the user wires up their fulfillment account.
 *
 * To add a new product:
 *   1. Append an entry to `PRODUCTS`.
 *   2. Drop product images into `/public/products/<slug>/`.
 *   3. Set the appropriate provider + providerId.
 */

export type ProviderName = "printful" | "dropship";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  label: string;
  /** Provider's SKU/variant identifier used for fulfillment. */
  providerId: string;
  priceCents: number;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "apparel" | "drinkware" | "stickers" | "posters";
  provider: ProviderName;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "tokens-go-brrr-tee",
    name: "Tokens Go Brrr Tee",
    tagline: "For when the context window finally cooperates.",
    description:
      "Premium ringspun cotton tee printed on demand. Soft hand feel, zero shrink. Wear it to standup, wear it to the data center.",
    category: "apparel",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1200.png?text=Tokens+Go+Brrr",
        alt: "Tokens Go Brrr tee — front view",
      },
    ],
    variants: [
      { id: "s", label: "S", providerId: "printful_REPLACE_S", priceCents: 2800 },
      { id: "m", label: "M", providerId: "printful_REPLACE_M", priceCents: 2800 },
      { id: "l", label: "L", providerId: "printful_REPLACE_L", priceCents: 2800 },
      { id: "xl", label: "XL", providerId: "printful_REPLACE_XL", priceCents: 2800 },
      { id: "xxl", label: "2XL", providerId: "printful_REPLACE_XXL", priceCents: 3100 },
    ],
    tags: ["tee", "llm", "humor"],
  },
  {
    slug: "prompt-engineer-mug",
    name: "Prompt Engineer Mug",
    tagline: "11oz of context. Refill nightly.",
    description:
      "Glossy white ceramic mug, microwave and dishwasher safe. Holds enough caffeine for one full eval run.",
    category: "drinkware",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1000.png?text=Prompt+Engineer+Mug",
        alt: "Prompt Engineer mug — handle right",
      },
    ],
    variants: [
      { id: "11oz", label: "11 oz", providerId: "printful_REPLACE_MUG_11", priceCents: 1900 },
      { id: "15oz", label: "15 oz", providerId: "printful_REPLACE_MUG_15", priceCents: 2200 },
    ],
    tags: ["mug", "coffee", "humor"],
  },
  {
    slug: "ship-it-sticker-pack",
    name: "Ship It Sticker Pack",
    tagline: "5 vinyl stickers. Laptop-ready.",
    description:
      "Die-cut, weatherproof vinyl. Slap them on your laptop, your monitor, the side of your CI server.",
    category: "stickers",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1000.png?text=Sticker+Pack",
        alt: "Ship It vinyl sticker pack",
      },
    ],
    variants: [
      { id: "pack", label: "Pack of 5", providerId: "printful_REPLACE_STICKERS", priceCents: 1200 },
    ],
    tags: ["stickers", "laptop"],
  },
  {
    slug: "the-rag-poster",
    name: "The RAG Poster",
    tagline: "A diagram for the wall behind your standup.",
    description:
      "Matte 18×24\" giclée print. Numbered diagram of the canonical retrieval-augmented generation pipeline.",
    category: "posters",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1333.png?text=RAG+Poster",
        alt: "The RAG Poster — flat lay",
      },
    ],
    variants: [
      { id: "18x24", label: "18×24\"", providerId: "printful_REPLACE_POSTER_18", priceCents: 3400 },
    ],
    tags: ["poster", "rag", "diagram"],
  },
  {
    slug: "vibe-coder-hoodie",
    name: "Vibe Coder Hoodie",
    tagline: "Heavyweight fleece for late-night refactors.",
    description:
      "Premium 8.5oz cotton-poly fleece. Kangaroo pocket. Built for the 11pm git push.",
    category: "apparel",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1200.png?text=Vibe+Coder+Hoodie",
        alt: "Vibe Coder hoodie — front view",
      },
    ],
    variants: [
      { id: "s", label: "S", providerId: "printful_REPLACE_HOODIE_S", priceCents: 4800 },
      { id: "m", label: "M", providerId: "printful_REPLACE_HOODIE_M", priceCents: 4800 },
      { id: "l", label: "L", providerId: "printful_REPLACE_HOODIE_L", priceCents: 4800 },
      { id: "xl", label: "XL", providerId: "printful_REPLACE_HOODIE_XL", priceCents: 4800 },
    ],
    tags: ["hoodie", "apparel"],
  },
  {
    slug: "halt-and-catch-fire-cap",
    name: "Halt & Catch Fire Cap",
    tagline: "Six-panel dad hat for the on-call rotation.",
    description:
      "Unstructured low-profile cap with adjustable strap. Embroidered front. Fits any head, fits any incident.",
    category: "apparel",
    provider: "printful",
    images: [
      {
        src: "https://via.placeholder.com/1000x1000.png?text=Halt+%26+Catch+Fire+Cap",
        alt: "Halt and Catch Fire dad hat",
      },
    ],
    variants: [
      { id: "os", label: "One size", providerId: "printful_REPLACE_CAP", priceCents: 2400 },
    ],
    tags: ["hat", "apparel"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
