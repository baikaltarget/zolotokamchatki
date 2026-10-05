import type { MetadataRoute } from "next";
import { categories, products, productPath, zonePages, abs, LASTMOD } from "@/lib/site";
import { getPosts } from "@/lib/blog";
/** lastmod — реальная дата правки (site.json → lastmod), а не дата сборки: иначе Яндекс перестаёт ему верить */
export default function sitemap(): MetadataRoute.Sitemap {
  const d = new Date(LASTMOD);
  return [
    { url: abs("/"), lastModified: d, priority: 1 },
    ...["/tseny/", "/opt/", "/dostavka/", "/novyj-god/", "/svezhaya-ikra/", "/sbory/", "/o-magazine/", "/kontakty/", "/blog/"].map((p) => ({ url: abs(p), lastModified: d, priority: 0.7 })),
    ...categories.map((c) => ({ url: abs(c.path), lastModified: d, priority: 0.9 })),
    ...products.filter((p) => !p.noindex).map((p) => ({ url: abs(productPath(p)), lastModified: d, priority: 0.8 })),
    ...zonePages.map((z) => ({ url: abs(`/dostavka/${z.slug}/`), lastModified: d, priority: 0.6 })),
    ...getPosts().map((p) => ({ url: abs(`/blog/${p.slug}/`), lastModified: new Date(p.updated || p.date), priority: 0.6 })),
  ];
}
