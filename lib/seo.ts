import type { Metadata } from "next";
import { SITE_URL, BRAND, abs, fmt, productPath, productTitle, type Product } from "./site";

export function meta(o: { title: string; description: string; path: string; image?: string; type?: "website" | "article"; noindex?: boolean }): Metadata {
  const url = abs(o.path);
  return {
    title: o.title, description: o.description,
    alternates: { canonical: url },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title: o.title, description: o.description, url, siteName: BRAND.name, locale: "ru_RU", type: o.type ?? "website", images: [{ url: abs(o.image ?? "/img/hero-ikra.webp") }] },
  };
}

export const orgLd = {
  "@context": "https://schema.org", "@type": "Organization", name: BRAND.name, url: SITE_URL,
  logo: abs("/img/logo.webp"), telephone: BRAND.phoneRaw, sameAs: [BRAND.telegram, BRAND.max, "https://go.2gis.com/NE8bO", "https://yandex.ru/profile/30908620746"],
};
export const localBusinessLd = {
  "@context": "https://schema.org", "@type": ["LocalBusiness", "GroceryStore"], name: BRAND.name, image: abs("/img/hero-ikra.webp"),
  url: SITE_URL, telephone: BRAND.phoneRaw, priceRange: "₽₽", paymentAccepted: "Cash",
  address: { "@type": "PostalAddress", streetAddress: "ул. Волжская, 3, ТЦ «Кедр», пав. 4 и 4А", addressLocality: "Иркутск", addressRegion: "Иркутская область", addressCountry: "RU" },
  geo: { "@type": "GeoCoordinates", latitude: BRAND.geo.lat, longitude: BRAND.geo.lng },
  hasMap: "https://yandex.ru/profile/30908620746",
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: BRAND.hoursOpen, closes: BRAND.hoursClose }],
};
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});
export const faqLd = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** Единый шаблон title/description для карточки товара */
export function productMeta(p: Product): Metadata {
  const price = p.price ? `, ${fmt(p.price)} ₽ за ${p.unit}` : "";
  const t = productTitle(p);
  return meta({
    title: `${t} — купить в Иркутске${price} | Золото Камчатки`,
    description: `${t}: ${p.short.replace(/\.$/, "")}. Цена ${p.price ? fmt(p.price) + " ₽ / " + p.unit : "по телефону"}. Магазин в ТЦ «Кедр» (Волжская, 3), можно попробовать перед покупкой, доставка по Иркутску от 2000 ₽.`,
    path: productPath(p), image: p.image, noindex: p.noindex,
  });
}
