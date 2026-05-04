import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/shop", "/about", "/cart"];
  return [
    ...staticPaths.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE.url}/product/${p.slug}`,
      lastModified: now,
    })),
  ];
}
