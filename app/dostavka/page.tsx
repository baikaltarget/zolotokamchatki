import Link from "next/link";
import { meta } from "@/lib/seo";
import { SITE, BRAND, fmt, zonePages, byCat, products } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import DeliveryCalc from "@/components/DeliveryCalc";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import Vitrina from "@/components/Vitrina";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/site";
const D = SITE.delivery;
export const metadata = meta({
  title: "Доставка рыбы, икры и морепродуктов по Иркутску — от 2000 ₽, бесплатно в Октябрьском и Кировском",
  description: "Доставка красной икры, копчёной и слабосолёной рыбы, морепродуктов по Иркутску в день заказа. Октябрьский и Кировский районы — бесплатно от 2000 ₽, остальные — 25 ₽/км. Шелехов, Мамоны, Пивовариха, Байкальский тракт — от 5000 ₽.",
  path: "/dostavka/",
});
const faq = [
  { q: "Когда привезёте?", a: "Заказ до 15:00 — обычно в тот же день, позже — на следующее утро. В Ленинский район — до 14:00. Перед Новым годом просим заказывать за день-два. Точное время согласует Светлана по телефону." },
  { q: "Как считается расстояние?", a: "В приложении 2ГИС: маршрут на машине от ул. Волжская, 3 до вашего адреса. Километры округляем в вашу пользу." },
  { q: "Можно оплатить картой курьеру?", a: "Нет. Оплата только наличными — приготовьте сумму заказа плюс доставку." },
  { q: "Как перевозите икру, рыбу и заморозку?", a: "Икра — в термопакете с хладоэлементом, копчёная рыба — в пергаменте, замороженная рыба и морепродукты — в изотермической сумке. До самой дальней точки города — не больше часа, ничего не оттаивает." },
  { q: "Можно объединить заказ с соседями?", a: "Да, и это выгодно: доставка одна на всех, а минимальная сумма набирается легче. Так часто делают в Шелехове, Мамонах и на Байкальском тракте." },
];
export default function Page() {
  const districts = D.zones.filter((z) => z.type === "district"), towns = D.zones.filter((z) => z.type === "town");
  const pageSlugs = new Set(zonePages.map((z) => z.slug));
  const hits = products.filter((p) => p.hit).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@type": "Service", name: "Доставка рыбы, икры и морепродуктов по Иркутску", provider: { "@type": "LocalBusiness", name: BRAND.name, telephone: BRAND.phoneRaw }, areaServed: D.zones.map((z) => ({ "@type": "Place", name: `${z.name}, Иркутск` })), url: abs("/dostavka/") };
  return (
    <>
      <JsonLd data={ld} />
      <section className="wrap pt-6">
        <Breadcrumbs items={[{ name: "Доставка", path: "/dostavka/" }]} />
        <h1 className="mt-4">Доставка рыбы, икры и морепродуктов по Иркутску</h1>
        <p className="mt-4 text-lg text-stone max-w-3xl">Привозим всё, что есть на витрине магазина в ТЦ «Кедр»: красную икру с Камчатки, рыбу холодного копчения из нашей коптильни, слабосолёное филе, замороженную рыбу и морепродукты. Обычно — в день заказа. Минимальный заказ по городу {fmt(D.minOrder)} ₽, в пригород — 5 000 ₽.</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <a href="#oktyabrskiy-rayon" className="bg-ink text-ivory rounded-tag p-5 hover:ring-2 ring-gold"><p className="tag-price text-4xl">0 ₽</p><p className="mt-1 font-display uppercase">Октябрьский, Кировский</p><p className="text-ivory/60 text-sm">при заказе от {fmt(D.minOrder)} ₽</p></a>
          <a href="#sverdlovskiy-rayon" className="bg-ink text-ivory rounded-tag p-5 hover:ring-2 ring-gold"><p className="tag-price text-4xl">{D.perKm} ₽/км</p><p className="mt-1 font-display uppercase">Свердловский, Куйбышевский, Ленинский</p><p className="text-ivory/60 text-sm">при заказе от {fmt(D.minOrder)} ₽</p></a>
          <a href="#prigorod" className="bg-ink text-ivory rounded-tag p-5 hover:ring-2 ring-gold"><p className="tag-price text-4xl">{D.perKm} ₽/км</p><p className="mt-1 font-display uppercase">Шелехов, Мамоны, Пивовариха, Байкальский тракт</p><p className="text-ivory/60 text-sm">при заказе от 5 000 ₽</p></a>
        </div>
        <p className="mt-4 text-stone">{D.note} Заказы и вопросы — {BRAND.manager}, <a href={`tel:${BRAND.phoneRaw}`} className="text-caviar2 font-semibold">{BRAND.phone}</a>.</p>
      </section>
      <section className="wrap mt-10"><DeliveryCalc /></section>

      <section className="wrap mt-14">
        <h2>Доставка по районам Иркутска</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {districts.map((z) => (
            <article key={z.slug} id={z.slug} className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6 scroll-mt-28">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl">{z.name}</h3>
                <span className="font-display text-caviar2">{z.free ? "бесплатно" : `${D.perKm} ₽/км · ≈ ${fmt(z.km * D.perKm)} ₽`}</span>
              </div>
              {z.landmarks.length > 0 && <p className="mt-1 text-sm text-stone">{z.landmarks.join(", ")}</p>}
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{z.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="prigorod" className="wrap mt-14 scroll-mt-28">
        <h2>Доставка в пригород и Шелехов</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {towns.map((z) => (
            <article key={z.slug} id={z.slug} className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6 scroll-mt-28">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl">{pageSlugs.has(z.slug) ? <Link href={`/dostavka/${z.slug}/`} className="hover:text-caviar2 underline decoration-gold/50">{z.name}</Link> : z.name}</h3>
                <span className="font-display text-caviar2">от {fmt(z.minOrder)} ₽ · ≈ {fmt(z.km * D.perKm)} ₽</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{z.text}</p>
              {pageSlugs.has(z.slug) && <Link href={`/dostavka/${z.slug}/`} className="mt-3 inline-block text-sm text-caviar2 underline">Подробнее про доставку: {z.name} →</Link>}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap mt-14"><h2>Что чаще всего заказывают с доставкой</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{hits.map((p) => <ProductCard key={p.slug} p={p} />)}</div></section>
      <section className="wrap mt-10 grid lg:grid-cols-2 gap-6"><Vitrina title="Красная икра" items={byCat("ikra")} href="/ikra/" /><Vitrina title="Морепродукты" items={byCat("moreprodukty")} href="/moreprodukty/" /></section>
      <Faq items={faq} />
      <section className="wrap mt-14 grid lg:grid-cols-2 gap-8"><div><h2>Заказать доставку</h2><p className="mt-2 text-stone">Напишите, что нужно и адрес. Перезвоним, посчитаем и согласуем время.</p></div><LeadForm compact product="доставка" /></section>
    </>
  );
}
