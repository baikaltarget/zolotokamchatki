import Image from "next/image";
import Link from "next/link";
import { meta } from "@/lib/seo";
import { BRAND, SITE, byCat, categories, products } from "@/lib/site";
import Vitrina from "@/components/Vitrina";
import { getPosts } from "@/lib/blog";
import ProductCard from "@/components/ProductCard";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import Todo from "@/components/Todo";

export const metadata = meta({ title: "Красная икра в Иркутске — Золото Камчатки, магазин в ТЦ «Кедр»", description: "Красная икра кеты и нерки напрямую с заводов Камчатки, рыба холодного копчения и слабого посола. Магазин в ТЦ «Кедр», доставка по Иркутску от 2000 ₽. Опыт 10 лет.", path: "/" });

export default function Home() {
  const ikra = byCat("ikra");
  const hits = products.filter((p) => p.hit);
  return (
    <>
      {/* HERO: витрина с ценами прямо в первом экране */}
      <section className="relative bg-ink text-ivory overflow-hidden">
        <Image src="/img/ikra-macro.webp" alt="" fill priority sizes="100vw" quality={55} className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="relative wrap grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 py-10 sm:py-12 lg:py-16 items-center">
          <div className="fade-up">
            <p className="text-gold2 text-sm font-semibold">{BRAND.tagline} · с {BRAND.founded} года</p>
            <h1 className="mt-4"><span className="text-caviar">Золото Камчатки:</span> красная икра с Камчатки — <span className="h-light">в Иркутске</span></h1>
            <p className="mt-5 text-lg text-ivory/75 max-w-lg">Напрямую с рыбокомбинатов Камчатки и Охотского моря, с этикеткой завода на каждой банке. Даём попробовать перед покупкой. Плюс собственное холодное копчение и слабый посол.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar">{BRAND.phone}</a>
              <Link href="/dostavka" className="btn btn-ghost-light">Доставка по Иркутску</Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md text-sm">
              <div><dt className="text-ivory/50 text-xs uppercase tracking-wider">Магазин</dt><dd className="mt-1">ТЦ «Кедр», пав. 4 и 4А</dd></div>
              <div><dt className="text-ivory/50 text-xs uppercase tracking-wider">Часы</dt><dd className="mt-1">{BRAND.hours}</dd></div>
              <div><dt className="text-ivory/50 text-xs uppercase tracking-wider">Опыт</dt><dd className="mt-1">с {BRAND.founded} года</dd></div>
            </dl>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[5/4] rounded-tag overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image src="/img/hero-ikra.webp" alt="Икра кеты с Камчатки на витрине магазина Золото Камчатки" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4 sm:p-6">
                <ul className="divide-y divide-ivory/15">
                  {ikra.slice(0, 4).map((p) => (
                    <li key={p.slug}><Link href={`/ikra/${p.slug}`} className="flex items-baseline justify-between py-2 hover:text-gold2"><span className="tag-name text-lg">{p.name}</span><span className="font-display text-caviar text-xl whitespace-nowrap">{p.price ? `${p.price.toLocaleString("ru-RU")} ₽` : "по тел."}<span className="text-ivory/50 text-xs uppercase ml-1">/ {p.unit}</span></span></Link></li>
                  ))}
                </ul>
                <Link href="/ikra" className="mt-2 inline-block text-sm text-gold2">Вся икра и цены →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="wrap mt-14">
        <h2>Что на витрине</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={c.path} className="group relative aspect-[4/5] rounded-tag overflow-hidden bg-ink">
              <Image src={c.image} alt={c.name} fill sizes="(max-width:640px) 92vw, 300px" className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition duration-500" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5">
                <h3 className="text-ivory text-2xl">{c.name}</h3>
                <p className="text-ivory/70 text-sm mt-1">{byCat(c.slug).length} позиций · от {Math.min(...byCat(c.slug).filter((p) => p.price).map((p) => p.price as number)).toLocaleString("ru-RU")} ₽</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Хиты */}
      <section className="wrap band">
        <div className="flex items-baseline justify-between gap-4"><h2>Берут чаще всего</h2><Link href="/tseny" className="text-sm text-caviar2 hover:underline whitespace-nowrap">Полный прайс →</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{hits.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>

      {/* Почему */}
      <section className="wrap mt-16 grid lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-tag overflow-hidden"><Image src="/img/label-kolpakovo.webp" alt="Этикетка Колпаковского рыбокомбината на банке икры" fill sizes="50vw" className="object-cover" /></div>
        <div>
          <p className="seal">Откуда икра</p>
          <h2 className="mt-3">Завод → наш холодильник → ваш стол</h2>
          <ul className="mt-5 space-y-4 text-lg">
            <li><strong className="font-display uppercase text-caviar2">Без перекупщиков.</strong> Берём партии напрямую у рыбокомбинатов Камчатки и Охотского побережья больше 10 лет.</li>
            <li><strong className="font-display uppercase text-caviar2">Этикетка на банке.</strong> Дата выработки, ТУ, состав — всё читается. Икры «из ведра» у нас нет.</li>
            <li><strong className="font-display uppercase text-caviar2">Пробуете перед покупкой.</strong> Открытая банка каждого вида на витрине — сравните кету, нерку и горбушу.</li>
            <li><strong className="font-display uppercase text-caviar2">Своё копчение.</strong> Форель холодного копчения на ольховой щепе — главный хит магазина.</li>
          </ul>
        </div>
      </section>

      {/* Доставка */}
      <section className="wrap mt-16">
        <div className="bg-ink text-ivory rounded-tag p-6 sm:p-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-gold2">Доставка по Иркутску</h2>
            <p className="mt-3 text-ivory/75 max-w-xl">Октябрьский и Кировский районы — бесплатно от 2000 ₽. Остальной город — 25 ₽ за километр по 2ГИС от магазина. Шелехов, Мамоны, Пивовариха и Байкальский тракт — от 5000 ₽.</p>
            <div className="mt-5 flex flex-wrap gap-2">{SITE.delivery.zones.map((z) => <Link key={z.slug} href={`/dostavka/${z.slug}`} className="text-sm border border-ivory/25 rounded-tag px-3 py-1.5 hover:border-gold2 hover:text-gold2">{z.name}</Link>)}</div>
          </div>
          <Link href="/dostavka" className="btn btn-caviar">Рассчитать доставку</Link>
        </div>
      </section>

      {/* Сборы */}
      <section className="wrap mt-16 grid lg:grid-cols-2 gap-8">
        <div>
          <p className="seal">Как у нас дешевле</p>
          <h2 className="mt-3">Сборы: совместная закупка по цене ниже витрины</h2>
          <p className="mt-4 text-lg text-stone">Объявляем товар в наших каналах — в Telegram и MAX. Вы пишете количество, через несколько дней забираете в магазине. Без предоплаты. Так форель выходит 1200 вместо 1300 ₽/кг, масло — 790 вместо 925.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Link href="/sbory" className="btn btn-ghost">Как работают сборы</Link><a href={BRAND.telegram} className="btn btn-caviar" rel="noopener">Telegram</a><a href={BRAND.max} className="btn btn-ghost" rel="noopener">MAX</a></div>
        </div>
        <Vitrina title="Холодное копчение" items={byCat("kholodnoe-kopchenie").slice(0, 6)} href="/ryba/kholodnoe-kopchenie" />
      </section>

      {/* Отзывы */}
<section className="wrap band">
        <h2>Нам доверяют</h2>
        <p className="mt-2 text-stone max-w-2xl">Отзывы о магазине — в открытых сервисах, читайте и оставляйте свои:</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 max-w-3xl">
          <a href="https://go.2gis.com/NE8bO" rel="noopener" className="bg-white border border-ivory2 rounded-tag p-5 flex items-center gap-4 hover:border-gold transition-colors">
            <span className="font-display font-bold text-4xl text-caviar">5,0<span className="text-gold text-2xl"> ★</span></span>
            <span><span className="block font-semibold">2ГИС</span><span className="text-stone text-sm">253 отзыва · профиль подтверждён</span></span>
          </a>
          <div className="bg-white border border-ivory2 rounded-tag p-5 flex items-center gap-4">
            <iframe src="https://yandex.ru/sprav/widget/rating-badge/30908620746?type=rating" width="150" height="50" frameBorder="0" title="Рейтинг «Золото Камчатки» в Яндексе" className="shrink-0" />
            <span><span className="block font-semibold">Яндекс</span><a href="https://yandex.ru/profile/30908620746" rel="noopener" className="text-stone text-sm underline hover:text-caviar2">читать и оставить отзыв</a></span>
          </div>
        </div>
      </section>

      {/* Блог */}
      <section className="wrap mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2>Разбираемся в икре и рыбе</h2>
          <Link href="/blog" className="text-caviar2 underline">Все статьи →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {getPosts().slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white border border-ivory2 rounded-tag overflow-hidden hover:border-gold transition-colors">
              <div className="relative aspect-[16/10]"><Image src={p.image} alt={p.title} fill sizes="(max-width:640px) 92vw, 380px" className="object-cover" /></div>
              <div className="p-5">
                <p className="text-xs text-stone">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
                <h3 className="mt-2 text-lg leading-snug group-hover:text-caviar2 transition-colors">{p.title}</h3>
                <p className="mt-2 text-sm text-stone line-clamp-3">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Faq items={SITE.faq} />

      <section className="wrap mt-16 grid lg:grid-cols-2 gap-8 items-start">
        <div><h2>Заказать или спросить</h2><p className="mt-3 text-stone text-lg">{BRAND.manager} отвечает за заказы и доставку: {BRAND.hours.toLowerCase()}. Быстрее всего — позвонить.</p><a href={`tel:${BRAND.phoneRaw}`} className="mt-4 inline-block font-display text-4xl text-caviar2">{BRAND.phone}</a></div>
        <LeadForm />
      </section>
    </>
  );
}
