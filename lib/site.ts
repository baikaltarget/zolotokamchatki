import site from "@/content/site.json";
export interface Product {
  slug: string; category: string; name: string; price: number | null; unit: string; image: string; short: string;
  desc?: string; details?: { h: string; p: string }[]; faq?: { q: string; a: string }[]; origin?: string; hit?: boolean;
  preorder?: boolean; badge?: string; todo?: string; tiers?: [string, number][];
  /** Название под поисковый запрос: идёт в H1 и title. Если нет — берётся name */
  seoName?: string;
  /** Уникальный вводный абзац карточки */
  intro?: string;
  /** Характеристики: [название, значение] */
  specs?: [string, string][];
  /** Слаги статей блога по теме */
  posts?: string[];
  /** Не индексировать (остаётся в каталоге и прайсе) */
  noindex?: boolean;
}
export type Category = (typeof site.categories)[number];
export type Zone = (typeof site.delivery.zones)[number];
export const SITE = site;
export const BRAND = site.brand;
export const products = site.products as unknown as Product[];
export const categories = site.categories;
export const zones = site.delivery.zones;
/** Районы с отдельной страницей доставки. Остальные — разделами на /dostavka/ */
export const zonePages = zones.filter((z) => z.page);

/** Все внутренние пути — со слэшем на конце, как canonical: без лишних 308-редиректов */
export const slash = (p: string) => (p.endsWith("/") ? p : p + "/");
export const cat = (slug: string) => categories.find((c) => c.slug === slug)!;
export const byCat = (slug: string) => products.filter((p) => p.category === slug);
export const catPath = (slug: string) => slash(cat(slug).path);
export const productPath = (p: Product) => `${catPath(p.category)}${p.slug}/`;
export const productTitle = (p: Product) => p.seoName ?? p.name;
export const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");
export const priceLabel = (p: Product) => (p.price ? `${fmt(p.price)} ₽` : "по телефону");
/** Домен в punycode: кириллицу в robots.txt, sitemap и canonical роботы читают некорректно */
export const SITE_URL = (() => {
  try { return new URL(BRAND.siteUrl).origin; } catch { return BRAND.siteUrl; }
})();
export const abs = (path: string) => `${SITE_URL}${slash(path)}`;
export const todoText = (key?: string) => (key ? (site.todo.items as Record<string, string>)[key] : undefined);
export const RATINGS = (site.brand as unknown as { ratings: { name: string; score: string; count: string; url: string; note?: string }[] }).ratings;
export const showTodo = site.todo.showTodoFrames;
/** Дата последнего обновления контента — для sitemap. Менять при правке цен и текстов */
export const LASTMOD = (site as unknown as { lastmod: string }).lastmod;
