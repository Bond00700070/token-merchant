import type { Metadata } from "next";

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Token Merchant",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Merch for AI builders. Tees, mugs, stickers, and posters for prompt engineers, vibe coders, and LLM enthusiasts.",
  twitter: "@tokenmerchant",
};

export function buildMetadata(input: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = input.title ? `${input.title} — ${SITE.name}` : SITE.name;
  const description = input.description ?? SITE.description;
  const url = input.path ? `${SITE.url}${input.path}` : SITE.url;
  const image = input.image ?? `${SITE.url}/og.png`;

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE.twitter,
    },
  };
}
