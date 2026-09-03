import Image from "next/image";
import { meta } from "@/lib/seo";
import { BRAND } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
export const metadata = meta({ title: "О магазине «Золото Камчатки» — икра и рыба в Иркутске с 2013 года", description: "Магазин красной икры и рыбы в ТЦ «Кедр», Иркутск. Прямые поставки с рыбокомбинатов Камчатки, собственное холодное копчение, более 10 лет на рынке.", path: "/o-magazine" });
export default function Page() {
  return (
    <section className="wrap pt-6">
      <Breadcrumbs items={[{ name: "О магазине", path: "/o-magazine" }]} />
      <div className="mt-4 grid lg:grid-cols-2 gap-8 items-start">
        <div className="prose">
          <h1>«Золото Камчатки» — икорный магазин в Иркутске</h1>
          <p>Работаем с {BRAND.founded} года. Начинали с икры — отсюда название и «икорный сомелье» на печати: за десять лет научились с закрытыми глазами отличать кету от горбуши, камчатскую от охотской и правильный засол от «спасённого солью».</p>
          <h2>Откуда продукт</h2>
          <p>Икру берём напрямую у рыбокомбинатов Камчатки и Охотского побережья — Колпаковский рыбокомбинат и другие заводы, с которыми работаем годами. На каждой банке — их этикетка с датой, ТУ и составом. Рыбу — с Дальнего Востока и из Чили (форель), морепродукты — от поставщиков с шоковой заморозкой.</p>
          <h2>Своё производство</h2>
          <p>Слабый посол и холодное копчение делаем сами. Коптим на ольховой щепе, без «жидкого дыма». Форель холодного копчения — то, за чем к нам едут через весь город.</p>
          <h2>Как мы работаем</h2>
          <ul>
            <li>Даём попробовать икру перед покупкой.</li>
            <li>Оплата наличными — и в магазине, и курьеру.</li>
            <li>Доставка по Иркутску от 2000 ₽, в Октябрьском и Кировском районах — бесплатно.</li>
            <li>Сборы — совместные закупки по цене ниже витрины, без предоплаты.</li>
            <li>По пятницам — свежий привоз и обзор витрины в Telegram-канале.</li>
          </ul>
          <p>Магазин: {BRAND.address}. {BRAND.hours}. Телефон: <a href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a> ({BRAND.manager}).</p>
        </div>
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] rounded-tag overflow-hidden"><Image src="/img/ikra-fasovka.webp" alt="Фасовка икры в магазине Золото Камчатки" fill sizes="50vw" className="object-cover" /></div>
          <div className="grid grid-cols-2 gap-4"><div className="relative aspect-[3/4] rounded-tag overflow-hidden"><Image src="/img/declaration.webp" alt="Декларация о соответствии на икру" fill sizes="(max-width:1024px) 45vw, 260px" className="object-cover" /></div><div className="relative aspect-[3/4] rounded-tag overflow-hidden"><Image src="/img/label-skop.webp" alt="Этикетка рыбокомбината на банке икры кеты" fill sizes="(max-width:1024px) 45vw, 260px" className="object-cover" /></div></div>
          <div className="relative aspect-[4/3] rounded-tag overflow-hidden"><Image src="/img/vitrina-kopchenie.webp" alt="Витрина магазина «Золото Камчатки» с рыбой холодного копчения, Иркутск" fill sizes="(max-width:1024px) 92vw, 520px" className="object-cover" /></div>
        </div>
      </div>
    </section>
  );
}
