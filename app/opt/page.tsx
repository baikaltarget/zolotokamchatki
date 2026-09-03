import Image from "next/image";
import Link from "next/link";
import { meta, faqLd } from "@/lib/seo";
import { BRAND, SITE, byCat } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import ProductCard from "@/components/ProductCard";

const opt = (SITE as unknown as { opt: { h1: string; title: string; description: string; intro: string; points: { h: string; p: string }[]; maslo: { h: string; p: string }; faq: { q: string; a: string }[] } }).opt;

export const metadata = meta({ title: opt.title, description: opt.description, path: "/opt", image: "/img/opt-kub.webp" });

const serviceLd = {
  "@context": "https://schema.org", "@type": "Service", name: "Оптовые поставки красной икры",
  provider: { "@type": "Organization", name: BRAND.name, telephone: BRAND.phoneRaw },
  areaServed: "Иркутск и Иркутская область", serviceType: "Оптовая продажа красной икры и сливочного масла",
  offers: { "@type": "Offer", price: 4000, priceCurrency: "RUB", description: "Кета от 4000 ₽/кг при закупке от куба 13 кг; цена зависит от объёма и партии" },
};

export default function Page() {
  const ikra = byCat("ikra").slice(0, 3);
  return (
    <>
      <JsonLd data={[serviceLd, faqLd(opt.faq)]} />
      <section className="wrap pt-6">
        <Breadcrumbs items={[{ name: "Опт", path: "/opt" }]} />
        <div className="mt-6 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <div>
            <h1>{opt.h1}</h1>
            <p className="mt-4 text-lg leading-relaxed">{opt.intro}</p>
            <p className="mt-3 text-stone">Кубы 13 и 25 кг · кета от <b className="text-caviar font-display text-xl">4000 ₽/кг</b> · документы на каждую партию</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar">Позвонить {BRAND.phone}</a>
              <a href={(BRAND as unknown as { telegramPersonal: string }).telegramPersonal} className="btn btn-ghost" rel="noopener">Написать в Telegram</a>
            </div>
            <p className="mt-2 text-stone text-sm">{BRAND.manager} · {BRAND.hours.toLowerCase()}</p>
          </div>
          <div className="relative aspect-[4/3] rounded-tag overflow-hidden shadow-2xl">
            <Image src="/img/opt-kub.webp" alt="Куб красной икры для оптовой поставки — «Золото Камчатки», Иркутск" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="wrap band grid gap-5 sm:grid-cols-2">
        {opt.points.map((x) => (
          <div key={x.h} className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6"><h2 className="text-xl">{x.h}</h2><p className="mt-2 text-[15px] leading-relaxed text-ink/85">{x.p}</p></div>
        ))}
      </section>

      <section className="wrap mt-14">
        <h2>Какая икра бывает оптом</h2>
        <p className="mt-2 text-stone max-w-2xl">Та же икра, что на витрине в розницу — можно приехать и попробовать партию перед закупкой:</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">{ikra.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        <Link href="/ikra" className="mt-4 inline-block text-caviar2 underline">Вся икра и розничные цены →</Link>
      </section>

      <section className="wrap mt-14">
        <div className="bg-ink text-ivory rounded-tag p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div><h2 className="text-gold2">{opt.maslo.h}</h2><p className="mt-2 text-ivory/80 max-w-2xl">{opt.maslo.p}</p></div>
          <Link href="/zamorozka/maslo-slivochnoe" className="btn btn-ghost-light justify-self-start sm:justify-self-end">Подробнее о масле</Link>
        </div>
      </section>

      <section className="wrap mt-14">
        <h2>Вопросы по опту</h2>
        <div className="mt-4 divide-y divide-ivory2 border-y border-ivory2">
          {opt.faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none flex justify-between gap-4 font-semibold text-lg">{f.q}<span className="text-caviar transition-transform group-open:rotate-45 text-2xl leading-none">+</span></summary>
              <p className="mt-3 text-stone max-w-3xl">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap mt-14 grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2>Обсудить поставку</h2>
          <p className="mt-3 text-stone text-lg">Напишите объём и вид икры — {BRAND.manager} посчитает цену под вашу партию и скажет сроки.</p>
          <a href={`tel:${BRAND.phoneRaw}`} className="mt-4 inline-block font-display font-bold text-4xl text-caviar2">{BRAND.phone}</a>
        </div>
        <LeadForm compact product="Опт: красная икра" />
      </section>
    </>
  );
}
