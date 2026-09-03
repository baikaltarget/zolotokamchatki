import Link from "next/link";
import { notFound } from "next/navigation";
import { meta } from "@/lib/seo";
import { zones, SITE, BRAND, byCat, products, fmt, abs } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import DeliveryCalc from "@/components/DeliveryCalc";
import Vitrina from "@/components/Vitrina";
import ProductCard from "@/components/ProductCard";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
type P = Promise<{ zone: string }>;
export function generateStaticParams() { return zones.map((z) => ({ zone: z.slug })); }
const gen = (n: string) => n.replace(/ район$/, "");
export async function generateMetadata({ params }: { params: P }) {
  const { zone } = await params; const z = zones.find((x) => x.slug === zone); if (!z) return {};
  const cost = z.free ? "бесплатно" : `${SITE.delivery.perKm} ₽/км`;
  return meta({ title: `Доставка красной икры и рыбы — ${z.name}, Иркутск | ${cost}`, description: `Красная икра, рыба холодного копчения и слабого посола с доставкой: ${z.name}. ${z.free ? "Бесплатно" : `${SITE.delivery.perKm} ₽ за км`} при заказе от ${fmt(z.minOrder)} ₽. Магазин «Золото Камчатки», ТЦ «Кедр».`, path: `/dostavka/${z.slug}` });
}
export default async function Page({ params }: { params: P }) {
  const { zone } = await params; const z = zones.find((x) => x.slug === zone); if (!z) notFound();
  const others = zones.filter((x) => x.slug !== z.slug);
  const hits = products.filter((p) => p.hit).slice(0, 3);
  const faq = [
    { q: `Сколько стоит доставка в ${z.name}?`, a: z.free ? `Бесплатно при заказе от ${fmt(z.minOrder)} ₽.` : `${SITE.delivery.perKm} ₽ за километр по 2ГИС от магазина (ул. Волжская, 3), при заказе от ${fmt(z.minOrder)} ₽. Ориентир для ${z.name}: около ${fmt(z.km * SITE.delivery.perKm)} ₽.` },
    { q: "Какой минимальный заказ?", a: `${fmt(z.minOrder)} ₽ — например, ${z.minOrder >= 5000 ? "две банки икры кеты и килограмм копчёной форели" : "банка икры кеты или два филе слабой соли и копчёная корюшка"}.` },
    { q: "Как оплатить?", a: "Наличными курьеру. Карты не принимаем." },
  ];
  const ld = { "@context": "https://schema.org", "@type": "Service", name: `Доставка икры и рыбы — ${z.name}`, provider: { "@type": "LocalBusiness", name: BRAND.name, telephone: BRAND.phoneRaw }, areaServed: { "@type": "Place", name: `${z.name}, Иркутск` }, offers: { "@type": "Offer", price: z.free ? 0 : SITE.delivery.perKm, priceCurrency: "RUB", description: z.free ? `Бесплатно от ${z.minOrder} ₽` : `${SITE.delivery.perKm} ₽ за км, заказ от ${z.minOrder} ₽` }, url: abs(`/dostavka/${z.slug}`) };
  return (
    <>
      <JsonLd data={ld} />
      <section className="bg-ink text-ivory"><div className="wrap py-8 sm:py-12">
        <Breadcrumbs dark items={[{ name: "Доставка", path: "/dostavka" }, { name: z.name, path: `/dostavka/${z.slug}` }]} />
        <h1 className="mt-4 text-gold2">Доставка красной икры и рыбы — {z.name}</h1>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <span><span className="tag-price text-5xl">{z.free ? "0 ₽" : `${SITE.delivery.perKm} ₽/км`}</span><span className="block text-ivory/60 text-sm mt-1">{z.free ? "бесплатно" : `≈ ${fmt(z.km * SITE.delivery.perKm)} ₽ для ${gen(z.name)}`}</span></span>
          <span><span className="font-display text-3xl">от {fmt(z.minOrder)} ₽</span><span className="block text-ivory/60 text-sm mt-1">минимальный заказ</span></span>
          <span><span className="font-display text-3xl">{BRAND.hours.replace("Ежедневно ", "")}</span><span className="block text-ivory/60 text-sm mt-1">ежедневно, в день заказа</span></span>
        </div>
        <p className="mt-6 text-ivory/80 text-lg max-w-2xl">{z.text}</p>
        {z.landmarks.length > 0 && <p className="mt-3 text-ivory/55 text-sm">Возим: {z.landmarks.join(", ")} и другие адреса района.</p>}
        <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar mt-6">Заказать: {BRAND.phone}</a>
      </div></section>
      <section className="wrap mt-10"><DeliveryCalc defaultZone={z.slug} /></section>
      <section className="wrap mt-14"><h2>Что чаще всего заказывают с доставкой</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{hits.map((p) => <ProductCard key={p.slug} p={p} />)}</div></section>
      <section className="wrap mt-14 grid lg:grid-cols-2 gap-6"><Vitrina title="Красная икра" items={byCat("ikra")} href="/ikra" /><Vitrina title="Холодное копчение" items={byCat("kholodnoe-kopchenie")} href="/ryba/kholodnoe-kopchenie" /></section>
      <Faq items={faq} />
      <section className="wrap mt-14 grid lg:grid-cols-2 gap-8"><div><h2>Заказать в {gen(z.name)}</h2><p className="mt-2 text-stone">Оставьте телефон и адрес — перезвоним и посчитаем доставку.</p><div className="mt-5 flex flex-wrap gap-2">{others.map((o) => <Link key={o.slug} href={`/dostavka/${o.slug}`} className="text-sm border border-ink/20 rounded-tag px-3 py-1.5 hover:border-ink">{o.name}</Link>)}</div></div><LeadForm compact product={`доставка, ${z.name}`} /></section>
    </>
  );
}
