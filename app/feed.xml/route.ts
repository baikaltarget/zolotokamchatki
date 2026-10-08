import { products, categories, productPath, productTitle, abs, SITE_URL, BRAND, LASTMOD } from "@/lib/site";

/** Товарный фид YML для Яндекса (Вебмастер → Товары → Фиды).
 *  Собирается из тех же данных, что и сайт, поэтому цены всегда совпадают со страницами.
 *  В фид не попадают товары без цены (под заказ) и закрытые от индексации. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const catId = new Map(categories.map((c, i) => [c.slug, i + 1]));
  const items = products.filter((p) => p.price && !p.noindex);
  // Икра и другие товары с фасовками: каждая фасовка — отдельное предложение, объединённые group_id.
  // Ссылка ведёт на карточку с выбранной фасовкой (?v=250-g), чтобы цена на странице совпала с фидом.
  const offer = (p: (typeof items)[number], o: { id: string; url: string; price: number; name: string; notes: string; group?: number; grams?: number }) => `<offer id="${esc(o.id)}"${o.group ? ` group_id="${o.group}"` : ""} available="${p.preorder ? "false" : "true"}">
<url>${esc(o.url)}</url>
<price>${o.price}</price>
<currencyId>RUR</currencyId>
<categoryId>${catId.get(p.category)}</categoryId>
<picture>${esc(SITE_URL + p.image)}</picture>
<store>true</store>
<pickup>true</pickup>
<delivery>true</delivery>
<name>${esc(o.name)}</name>
<description><![CDATA[${(p.intro ?? p.desc ?? p.short).replace(/]]>/g, "")}]]></description>
<sales_notes>${esc(o.notes)}</sales_notes>
${o.grams ? `<param name="Вес" unit="г">${o.grams}</param>\n` : ""}${p.origin ? `<param name="Происхождение">${esc(p.origin)}</param>\n` : ""}</offer>`;
  const offers = items.flatMap((p, idx) => {
    const packs = (p.tiers ?? []).filter(([l]) => !/кг/.test(l));
    if (packs.length) return packs.map(([l, v]) => {
      const grams = parseInt(l, 10);
      return offer(p, { id: `${p.slug}-${grams}`, url: `${abs(productPath(p))}?v=${grams}-g`, price: v, name: `${productTitle(p)}, ${l}`, notes: "Фасуем при вас из заводского куба. Наличные", group: idx + 1, grams });
    });
    const perKg = p.unit === "кг";
    const notes = perKg ? "Цена за 1 кг, на вес. Оплата наличными" : "Оплата наличными, самовывоз и доставка";
    return [offer(p, { id: p.slug, url: abs(productPath(p)), price: p.price as number, name: `${productTitle(p)}${perKg ? ", 1 кг" : `, ${p.unit}`}`, notes })];
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${LASTMOD}T09:00+08:00">
<shop>
<name>${esc(BRAND.name)}</name>
<company>${esc((BRAND as unknown as { legalName: string }).legalName)}</company>
<url>${SITE_URL}/</url>
<currencies><currency id="RUR" rate="1"/></currencies>
<categories>
${categories.map((c) => `<category id="${catId.get(c.slug)}">${esc(c.name)}</category>`).join("\n")}
</categories>
<pickup-options><option cost="0" days="0"/></pickup-options>
<offers>
${offers}
</offers>
</shop>
</yml_catalog>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
