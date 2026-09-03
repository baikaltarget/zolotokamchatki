import Image from "next/image";
import Link from "next/link";
import { cat, byCat, products, productPath, abs, BRAND, Product, fmt } from "@/lib/site";
import Breadcrumbs from "./Breadcrumbs";
import PriceTag from "./PriceTag";
import ProductCard from "./ProductCard";
import LeadForm from "./LeadForm";
import JsonLd from "./JsonLd";
import Todo from "./Todo";
import Faq from "./Faq";

function unitToGrams(u: string) { const m = u.match(/([\d,.]+)\s*(кг|г)/); if (!m) return u === "кг" ? 1000 : null; const n = parseFloat(m[1].replace(",", ".")); return m[2] === "кг" ? n * 1000 : n; }

export default function ProductPage({ p }: { p: Product }) {
  const c = cat(p.category);
  const related = byCat(p.category).filter((x) => x.slug !== p.slug).slice(0, 3);
  const g = unitToGrams(p.unit);
  const perKg = p.price && g ? Math.round((p.price / g) * 1000) : null;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, image: abs(p.image), description: (p as { desc?: string }).desc ?? p.short,
    brand: { "@type": "Brand", name: BRAND.name }, ...(p.origin ? { countryOfOrigin: "RU", additionalProperty: [{ "@type": "PropertyValue", name: "Происхождение", value: p.origin }] } : {}),
    ...(p.price ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "RUB", availability: p.preorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock", url: abs(productPath(p)), seller: { "@type": "Organization", name: BRAND.name }, areaServed: "Иркутск", eligibleQuantity: { "@type": "QuantitativeValue", unitText: p.unit } } } : {}),
  };
  return (
    <>
      <JsonLd data={ld} />
      <section className="wrap pt-6">
        <Breadcrumbs items={[{ name: c.name, path: c.path }, { name: p.name, path: productPath(p) }]} />
        <div className="mt-6 grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative aspect-square rounded-tag overflow-hidden bg-ink">
            <Image src={p.image} alt={`${p.name} — ${BRAND.name}, Иркутск`} fill priority sizes="(max-width:1024px) 92vw, 560px" className="object-cover" />
            {p.origin && <span className="seal absolute left-4 top-4 bg-ink/80 text-xs">{p.origin}</span>}
          </div>
          <div>
            <p className="text-stone text-sm uppercase tracking-wider font-display">{c.name}{p.hit && <span className="ml-3 text-caviar">· Хит</span>}</p>
            <h1 className="mt-2">{p.name}</h1>
            {p.badge && <p className="mt-2 inline-block bg-gold/15 text-ink border border-gold/40 rounded-tag px-3 py-1 text-sm font-semibold">{p.badge}</p>}
            <Todo k={p.todo} className="mt-5 inline-block"><PriceTag p={p} size="lg" /></Todo>
            {perKg && g !== 1000 && <p className="mt-1 text-stone text-sm">≈ {fmt(perKg)} ₽ за кг</p>}
            {p.tiers && <ul className="mt-3 flex flex-wrap gap-2">{p.tiers.map(([l, v]) => <li key={l} className="border border-ink/20 rounded-tag px-3 py-1 text-sm">{l}: <b>{fmt(v)} ₽/кг</b></li>)}</ul>}
            <p className="mt-5 text-lg leading-relaxed">{(p as { desc?: string }).desc ?? p.short}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <li className="bg-white border border-ivory2 rounded-tag p-3"><span className="block text-stone text-xs uppercase tracking-wider">Где купить</span>{BRAND.addressShort}</li>
              <li className="bg-white border border-ivory2 rounded-tag p-3"><span className="block text-stone text-xs uppercase tracking-wider">Часы</span>{BRAND.hours}</li>
              <li className="bg-white border border-ivory2 rounded-tag p-3"><span className="block text-stone text-xs uppercase tracking-wider">Доставка</span>от 2000 ₽, <Link href="/dostavka" className="underline">условия</Link></li>
              <li className="bg-white border border-ivory2 rounded-tag p-3"><span className="block text-stone text-xs uppercase tracking-wider">Оплата</span>наличными</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3"><a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar">Позвонить {BRAND.phone}</a><a href="#zakaz" className="btn btn-ghost">Заказать с доставкой</a></div>
          </div>
        </div>
      </section>
      {p.details && p.details.length > 0 && (
        <section className="wrap mt-14 grid lg:grid-cols-3 gap-6">
          {p.details.map((d) => <div key={d.h} className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6"><h2 className="text-xl">{d.h}</h2><p className="mt-3 text-[15px] leading-relaxed text-ink/85">{d.p}</p></div>)}
        </section>
      )}
      {p.faq && p.faq.length > 0 && <Faq items={p.faq} title={`Вопросы про ${p.name.toLowerCase()}`} />}
      <section id="zakaz" className="wrap mt-14 grid lg:grid-cols-2 gap-8">
        <div><h2>Заказать {p.name.toLowerCase()}</h2><p className="mt-2 text-stone">Оставьте телефон — {BRAND.manager} перезвонит, уточнит наличие и время доставки.</p></div>
        <LeadForm compact product={p.name} />
      </section>
      {related.length > 0 && <section className="wrap mt-14"><h2 className="text-2xl">Ещё из раздела «{c.name}»</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div><Link href={c.path} className="mt-4 inline-block text-caviar2 underline">Все позиции раздела →</Link></section>}
    </>
  );
}
