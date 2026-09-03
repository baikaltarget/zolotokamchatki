import { meta } from "@/lib/seo";
import { SITE, BRAND } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
export const metadata = meta({ title: "Сборы — совместные закупки икры, рыбы и масла в Иркутске | Золото Камчатки", description: "Как работают сборы в магазине «Золото Камчатки»: форель по 1200 ₽/кг, масло 790 ₽/кг, икра кеты по спеццене. Без предоплаты, расчёт в магазине.", path: "/sbory" });
const steps = [
  ["Объявляем сбор в Telegram и MAX", "Пост с товаром, ценой и датой окончания сбора. Обычно 3–4 дня."],
  ["Вы пишете количество в комментариях", "«1», «2», «0,5 кг» — этого достаточно. Предоплаты нет."],
  ["Выкуп и раздача", "Через несколько дней после закрытия сбора — приходите в магазин и забираете. Расчёт наличными на кассе."],
];
export default function Page() {
  return (
    <>
      <section className="wrap pt-6">
        <Breadcrumbs items={[{ name: "Сборы", path: "/sbory" }]} />
        <h1 className="mt-4">Сборы: закупка по цене ниже витрины</h1>
        <p className="mt-4 text-lg text-stone max-w-2xl">{SITE.sbory.intro}</p>
        <ol className="mt-8 grid md:grid-cols-3 gap-4">{steps.map(([t, d], i) => <li key={t} className="bg-white border border-ivory2 rounded-tag p-5"><span className="font-display text-caviar text-3xl">{i + 1}</span><h2 className="text-lg mt-2">{t}</h2><p className="text-stone text-sm mt-1">{d}</p></li>)}</ol>
        <div className="mt-6 flex flex-wrap gap-3"><a href={BRAND.telegram} className="btn btn-caviar" rel="noopener">Telegram — текущие сборы</a><a href={BRAND.max} className="btn btn-ghost" rel="noopener">MAX</a></div>
      </section>
      <section className="wrap mt-12">
        <h2>Какие сборы уже были</h2>
        <div className="mt-4 bg-ink text-ivory rounded-tag p-5 sm:p-7 divide-y divide-ivory/10">{SITE.sbory.examples.map((e) => <div key={e.name} className="py-3 flex flex-wrap justify-between gap-2"><span><span className="tag-name text-lg block">{e.name}</span><span className="text-ivory/50 text-sm">{e.note}</span></span><span className="font-display text-caviar text-xl">{e.price}</span></div>)}</div>
      </section>
      <Faq items={[{ q: "Нужна ли предоплата?", a: "Нет. Расчёт наличными на кассе при получении." }, { q: "Что если я не смогу забрать?", a: "Предупредите в комментариях или по телефону — товар вернётся в общий сбор." }, { q: "Как узнать о новом сборе?", a: "Подпишитесь на наш канал в Telegram или в MAX — ссылки на этой странице и в подвале сайта. Сборы объявляем там же, где и обзоры витрины." }]} />
    </>
  );
}
