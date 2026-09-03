import site from "@/content/site.json";
export interface Product { slug: string; category: string; name: string; price: number | null; unit: string; image: string; short: string; desc?: string; details?: { h: string; p: string }[]; faq?: { q: string; a: string }[]; origin?: string; hit?: boolean; preorder?: boolean; badge?: string; todo?: string; tiers?: [string, number][] }
export type Category = (typeof site.categories)[number];
export type Zone = (typeof site.delivery.zones)[number];
export const SITE = site;
export const BRAND = site.brand;
export const products = site.products as unknown as Product[];
export const categories = site.categories;
export const zones = site.delivery.zones;

export const cat = (slug: string) => categories.find((c) => c.slug === slug)!;
export const byCat = (slug: string) => products.filter((p) => p.category === slug);
export const productPath = (p: Product) => `${cat(p.category).path}/${p.slug}`;
export const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
export const priceLabel = (p: Product) => (p.price ? `${fmt(p.price)} ₽` : "по телефону");
/** Домен в punycode: кириллицу в robots.txt, sitemap и canonical роботы читают некорректно */
export const SITE_URL = (() => {
  try { return new URL(BRAND.siteUrl).origin; } catch { return BRAND.siteUrl; }
})();
export const abs = (path: string) => `${SITE_URL}${path.endsWith("/") ? path : path + "/"}`;
export const todoText = (key?: string) => (key ? (site.todo.items as Record<string, string>)[key] : undefined);
export const RATINGS = (site.brand as unknown as { ratings: { name: string; score: string; count: string; url: string; note?: string }[] }).ratings;
export const showTodo = site.todo.showTodoFrames;
