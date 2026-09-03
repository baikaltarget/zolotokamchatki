import Link from "next/link";
import { meta } from "@/lib/seo";
import { SITE, BRAND, fmt } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import DeliveryCalc from "@/components/DeliveryCalc";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
const D = SITE.delivery;
export const metadata = meta({ title: "Доставка красной икры и рыбы по Иркутску — условия, районы, калькулятор", description: "Доставка от 2000 ₽: Октябрьский и Кировский районы бесплатно, остальные — 25 ₽/км по 2ГИС. Шелехов, Мамоны, Пивовариха, Байкальский тракт — от 5000 ₽. Оплата наличными.", path: "/dostavka" });
const faq = [
  { q: "Когда привезёте?", a: "Обычно в день заказа, в рабочие часы магазина. Точное время согласует Светлана по телефону." },
  { q: "Как считается расстояние?", a: "В приложении 2ГИС: маршрут на машине от ул. Волжская, 3 до вашего адреса. Километры округляем в вашу пользу." },
  { q: "Можно оплатить картой курьеру?", a: "Нет. Оплата только наличными — приготовьте сумму заказа плюс доставку." },
  { q: "Как перевозите икру и рыбу?", a: "В термопакетах с хладоэлементами. От магазина до самой дальней точки — не больше часа." },
];
export default function Page() {
  const districts = D.zones.filter((z) => z.type === "district"), towns = D.zones.filter((z) => z.type === "town");
  return (
    <>
      <section className="wrap pt-6">
        <Breadcrumbs items={[{ name: "Доставка", path: "/dostavka" }]} />
        <h1 className="mt-4">Доставка по Иркутску и пригороду</h1>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="bg-ink text-ivory rounded-tag p-5"><p className="tag-price text-4xl">0 ₽</p><p className="mt-1 font-display uppercase">Октябрьский, Кировский</p><p className="text-ivory/60 text-sm">при заказе от {fmt(D.minOrder)} ₽</p></div>
          <div className="bg-ink text-ivory rounded-tag p-5"><p className="tag-price text-4xl">{D.perKm} ₽/км</p><p className="mt-1 font-display uppercase">Свердловский, Куйбышевский, Ленинский</p><p className="text-ivory/60 text-sm">при заказе от {fmt(D.minOrder)} ₽</p></div>
          <div className="bg-ink text-ivory rounded-tag p-5"><p className="tag-price text-4xl">{D.perKm} ₽/км</p><p className="mt-1 font-display uppercase">Шелехов, Мамоны, Пивовариха, Байкальский тракт</p><p className="text-ivory/60 text-sm">при заказе от 5 000 ₽</p></div>
        </div>
        <p className="mt-4 text-stone">{D.note} Заказы и вопросы — {BRAND.manager}, <a href={`tel:${BRAND.phoneRaw}`} className="text-caviar2 font-semibold">{BRAND.phone}</a>.</p>
      </section>
      <section className="wrap mt-10"><DeliveryCalc /></section>
      <section className="wrap mt-12 grid md:grid-cols-2 gap-8">
        <div><h2 className="text-2xl">Районы Иркутска</h2><ul className="mt-3 divide-y divide-ivory2 border-y border-ivory2">{districts.map((z) => <li key={z.slug}><Link href={`/dostavka/${z.slug}`} className="flex justify-between py-3 hover:text-caviar2"><span className="font-display uppercase">{z.name}</span><span className="text-stone text-sm">{z.free ? "бесплатно" : `${D.perKm} ₽/км`}</span></Link></li>)}</ul></div>
        <div><h2 className="text-2xl">Пригород</h2><ul className="mt-3 divide-y divide-ivory2 border-y border-ivory2">{towns.map((z) => <li key={z.slug}><Link href={`/dostavka/${z.slug}`} className="flex justify-between py-3 hover:text-caviar2"><span className="font-display uppercase">{z.name}</span><span className="text-stone text-sm">от 5000 ₽, {D.perKm} ₽/км</span></Link></li>)}</ul></div>
      </section>
      <Faq items={faq} />
      <section className="wrap mt-14 grid lg:grid-cols-2 gap-8"><div><h2>Заказать доставку</h2><p className="mt-2 text-stone">Напишите, что нужно и адрес. Перезвоним, посчитаем и согласуем время.</p></div><LeadForm compact /></section>
    </>
  );
}
