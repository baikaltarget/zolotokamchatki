import { products, categories, productPath, productTitle, abs, SITE_URL, BRAND, LASTMOD } from "@/lib/site";

/** Товарный фид YML для Яндекса (Вебмастер → Товары → Фиды).
 *  Собирается из тех же данных, что и сайт, поэтому цены всегда совпадают со страницами.
 *  В фид не попадают товары без цены (под заказ) и закрытые от индексации. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const catId = new Map(categories.map((c, i) => [c.slug, i + 1]));
  const items = products.filter((p) => p.price && !p.noindex);
  const offers = items.map((p) => {
    const perKg = p.unit === "кг";
    // sales_notes — не длиннее 50 символов
    const notes = perKg && p.category === "ikra" ? "Цена за 1 кг, фасуем 250 и 500 г. Наличные" : perKg ? "Цена за 1 кг, на вес. Оплата наличными" : "Оплата наличными, самовывоз и доставка";
    return `<offer id="${esc(p.slug)}" available="${p.preorder ? "false" : "true"}">
<url>${esc(abs(productPath(p)))}</url>
<price>${p.price}</price>
<currencyId>RUR</currencyId>
<categoryId>${catId.get(p.category)}</categoryId>
<picture>${esc(SITE_URL + p.image)}</picture>
<store>true</store>
<pickup>true</pickup>
<delivery>true</delivery>
<name>${esc(productTitle(p))}${perKg ? ", 1 кг" : `, ${esc(p.unit)}`}</name>
<description><![CDATA[${(p.intro ?? p.desc ?? p.short).replace(/]]>/g, "")}]]></description>
<sales_notes>${esc(notes)}</sales_notes>
${p.origin ? `<param name="Происхождение">${esc(p.origin)}</param>\n` : ""}</offer>`;
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
