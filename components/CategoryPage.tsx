import Image from "next/image";
import Link from "next/link";
import { cat, byCat, categories, SITE } from "@/lib/site";
import Breadcrumbs from "./Breadcrumbs";
import ProductCard from "./ProductCard";
import Vitrina from "./Vitrina";
import Faq from "./Faq";
import LeadForm from "./LeadForm";
import JsonLd from "./JsonLd";
import { abs } from "@/lib/site";

const catFaq: Record<string, { q: string; a: string }[]> = {
  ikra: SITE.faq.filter((f) => /икр/i.test(f.q + f.a)).slice(0, 4),
  slabosolenaya: [
    { q: "Сколько хранится слабосолёное филе?", a: "В вакууме — до 10 дней при 0…+4 °C, после вскрытия — 2–3 дня в холодильнике под плёнкой." },
    { q: "Кости в филе есть?", a: "Крупные кости удалены. Мелкие рёберные у некоторых видов (омуль, муксун) могут встречаться — это особенность рыбы." },
    { q: "Можно ли заказать нарезку?", a: "Да, в магазине нарежем ломтиками бесплатно. Для доставки — уточните при заказе." },
  ],
  "kholodnoe-kopchenie": [
    { q: "Чем холодное копчение отличается от горячего?", a: "Холодное — при 25–30 °C от суток и дольше: рыба остаётся плотной, сырой по текстуре, с долгим дымным вкусом. Горячее — при 80–120 °C, мясо готовое, рассыпчатое." },
    { q: "На чём коптите?", a: "Ольховая щепа, без «жидкого дыма». Собственная коптильня." },
    { q: "Сколько хранится?", a: "Тушка — до 2 недель в холодильнике в бумаге, филе в вакууме — до 20 дней. Замораживать можно." },
  ],
  zamorozka: [
    { q: "Рыба размораживалась?", a: "Нет. Шоковая заморозка на производстве, храним при −18 °C, на витрине не оттаивает." },
    { q: "Как правильно разморозить?", a: "В холодильнике 8–12 часов. В воде и микроволновке рыба теряет сок." },
    { q: "Масло только брусками?", a: "Да, сладко-сливочное 72,5 %, брусками от 1 кг. От 5 кг — 850 ₽, от 20 кг — 790 ₽ за кг." },
  ],
};

export default function CategoryPage({ slug }: { slug: string }) {
  const c = cat(slug);
  const items = byCat(slug);
  const others = categories.filter((x) => x.slug !== slug);
  const ld = { "@context": "https://schema.org", "@type": "ItemList", name: c.name, itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`${c.path}/${p.slug}`), name: p.name })) };
  return (
    <>
      <JsonLd data={ld} />
      <section className="bg-ink text-ivory">
        <div className="wrap py-8 sm:py-12 grid lg:grid-cols-[1fr_380px] gap-8 items-end">
          <div>
            <Breadcrumbs dark items={[{ name: c.name, path: c.path }]} />
            <h1 className="mt-4 text-gold2">{c.h1}</h1>
            <p className="mt-4 text-ivory/75 text-lg max-w-2xl">{c.intro}</p>
          </div>
          <div className="relative aspect-[4/3] rounded-tag overflow-hidden"><Image src={c.image} alt={c.name} fill priority sizes="(max-width:1024px) 92vw, 520px" className="object-cover" /></div>
        </div>
      </section>
      <section className="wrap mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>
      <section className="wrap mt-14 grid lg:grid-cols-2 gap-8 items-start">
        <Vitrina title={`${c.name}: прайс`} items={items} />
        <div>
          <h2>Заказать с доставкой</h2>
          <p className="mt-2 text-stone">Минимальный заказ 2000 ₽, Октябрьский и Кировский — бесплатно. <Link href="/dostavka" className="underline">Условия и калькулятор</Link>.</p>
          <div className="mt-4"><LeadForm compact product={c.name} /></div>
        </div>
      </section>
      <Faq items={catFaq[slug] ?? []} />
      <section className="wrap mt-14">
        <h2 className="text-xl">Ещё на витрине</h2>
        <div className="mt-3 flex flex-wrap gap-2">{others.map((o) => <Link key={o.slug} href={o.path} className="border border-ink/20 rounded-tag px-3 py-1.5 text-sm hover:border-ink">{o.name}</Link>)}</div>
      </section>
    </>
  );
}
