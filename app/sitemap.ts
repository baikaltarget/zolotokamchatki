import type { MetadataRoute } from "next";
import { categories, products, productPath, zones, abs } from "@/lib/site";
import { getPosts } from "@/lib/blog";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const s: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, priority: 1 },
    ...["/tseny", "/opt", "/dostavka", "/sbory", "/o-magazine", "/kontakty", "/blog"].map((p) => ({ url: abs(p), lastModified: now, priority: 0.7 })),
    ...categories.map((c) => ({ url: abs(c.path), lastModified: now, priority: 0.9 })),
    ...products.map((p) => ({ url: abs(productPath(p)), lastModified: now, priority: 0.8 })),
    ...zones.map((z) => ({ url: abs(`/dostavka/${z.slug}`), lastModified: now, priority: 0.7 })),
    ...getPosts().map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: new Date(p.date), priority: 0.6 })),
  ];
  return s;
}
