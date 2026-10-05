import Link from "next/link";
import Image from "next/image";
import { meta } from "@/lib/seo";
import { BRAND, products, productPath, fmt, byCat, type Product } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import Vitrina from "@/components/Vitrina";

export const metadata = meta({
  title: "Икра и рыба на Новый год в Иркутске — наборы к столу, в подарок, корпоративные заказы",
  description: "Красная икра, копчёная и слабосолёная рыба к новогоднему столу: сколько брать на компанию, примеры заказов с ценами, подарки и заказы для офиса. Магазин в ТЦ «Кедр», доставка по Иркутску.",
  path: "/novyj-god/", image: "/img/blog-ikra-k-novomu-godu.webp",
});

const P = (slug: string) => products.find((p) => p.slug === slug) as Product;
/** Пример заказа: [товар, количество в единицах прайса (банка/упаковка) или в кг для весовых] */
type Line = [string, number];
const sets: { name: string; who: string; lines: Line[] }[] = [
  { name: "Семейный стол", who: "на 4–6 человек", lines: [["ikra-kety-kamchatka", 1], ["file-semgi", 1], ["tushka-foreli-hk", 1], ["maslo-slivochnoe", 1]] },
  { name: "Большая компания", who: "на 8–12 человек", lines: [["ikra-kety-kamchatka", 2], ["file-semgi", 2], ["file-nerki", 1], ["file-muksuna", 1], ["file-foreli-hk", 0.5], ["steyki-semgi", 1.5]] },
  { name: "Подарок знатоку", who: "икра и рыба в подарок", lines: [["ikra-chavychi", 1], ["ikra-kizhucha", 1], ["file-semgi-hk", 0.5]] },
];
const qty = (p: Product, n: number) => (p.unit === "кг" ? `${String(n).replace(".", ",")} кг` : `${n} × ${p.unit}`);
const sum = (lines: Line[]) => lines.reduce((s, [slug, n]) => s + (P(slug).price ?? 0) * n, 0);

const faq = [
  { q: "Когда лучше покупать икру к Новому году?", a: "С середины ноября до 15 декабря: ассортимент максимальный, а предновогодний рост цен ещё не начался. В закрытой банке при 0…+4 °C икра спокойно доживёт до праздника." },
  { q: "Сколько икры нужно на новогодний стол?", a: "40–50 г на человека, если икра — главная закуска, и 20–25 г, если одна из нескольких. На 8 человек — 250–400 г, на 10 — 300–500 г." },
  { q: "Можно ли заказать заранее и забрать в конце декабря?", a: "Да. Позвоните или оставьте заявку — соберём заказ и отложим. Икра в закрытой банке хранится до даты на этикетке, копчёную рыбу лучше забирать ближе к празднику: свежая партия форели — каждую пятницу." },
  { q: "Делаете ли заказы для офиса и корпоративов?", a: "Да. Перед праздниками офисы в центре часто заказывают икру и нарезку к корпоративу. Соберём одинаковые наборы для сотрудников или стол на фуршет, привезём в один день. От куба икры 13 кг — оптовые цены." },
  { q: "Работаете ли вы 31 декабря?", a: "Да, до 18:00. Но 31-го — самый загруженный день и выбор минимальный, лучше прийти раньше." },
  { q: "Как оплатить?", a: "Наличными — в магазине и курьеру." },
];

export default function Page() {
  return (
    <>
      <section className="bg-ink text-ivory">
        <div className="wrap py-8 sm:py-12 grid lg:grid-cols-[1fr_420px] gap-8 items-end">
          <div>
            <Breadcrumbs dark items={[{ name: "Икра на Новый год", path: "/novyj-god/" }]} />
            <h1 className="mt-4 text-gold2">Икра и рыба на Новый год в Иркутске</h1>
            <p className="mt-4 text-ivory/75 text-lg max-w-2xl">Красная икра с Камчатки, рыба холодного копчения из нашей коптильни, слабосолёное филе и горячее для духовки — всё, что нужно новогоднему столу, на одной витрине в ТЦ «Кедр». Ниже — сколько брать, примеры заказов с ценами и когда покупать, чтобы не переплатить.</p>
            <div className="mt-6 flex flex-wrap gap-3"><a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar">Заказать: {BRAND.phone}</a><a href="#zakaz" className="btn btn-ghost-light">Оставить заявку</a></div>
          </div>
          <div className="relative aspect-[4/3] rounded-tag overflow-hidden"><Image src="/img/blog-ikra-k-novomu-godu.webp" alt="Красная икра к новогоднему столу" fill priority sizes="(max-width:1024px) 92vw, 420px" className="object-cover" /></div>
        </div>
      </section>

      <section className="wrap mt-12 prose max-w-3xl">
        <h2>Когда покупать, чтобы не переплатить</h2>
        <p><strong>Лучшее время — с середины ноября до 15 декабря.</strong> Икра нового улова к этому моменту уже в Иркутске, выбор максимальный, а предновогодний рост цен ещё не начался. С 20 декабря икра обычно дорожает на 20–40%, а крупную кету и нерку разбирают. В закрытой банке икра спокойно лежит в холодильнике до даты на этикетке — подробнее в статье <Link href="/blog/kak-khranit-ikru/">«Как хранить красную икру»</Link>.</p>
        <p>Копчёную рыбу, наоборот, берите ближе к празднику: свежая партия форели холодного копчения выходит из коптильни каждую пятницу. Слабосолёное филе в вакууме хранится 7 дней — покупайте за неделю.</p>
        <h2>Сколько брать</h2>
        <table>
          <thead><tr><th>Гостей</th><th>Икра</th><th>Слабосолёная рыба</th><th>Копчёная рыба</th></tr></thead>
          <tbody>
            <tr><td>4</td><td>140–250 г</td><td>250 г</td><td>300–400 г</td></tr>
            <tr><td>6</td><td>250 г</td><td>500 г (2 вида)</td><td>1 тушка форели</td></tr>
            <tr><td>10</td><td>300–500 г</td><td>750 г (3 вида)</td><td>0,8–1 кг</td></tr>
            <tr><td>20, фуршет</td><td>400–600 г</td><td>1–1,5 кг</td><td>1,5–2 кг</td></tr>
          </tbody>
        </table>
        <p>Икры — 40–50 г на человека, если она главная закуска, и 20–25 г, если одна из нескольких. Рыбы — 60–80 г на гостя. Подробный расчёт по бутербродам, тарталеткам и канапе — в статье <Link href="/blog/skolko-ikry-na-stol/">«Сколько икры нужно на стол»</Link>. И заложите отдельную банку на блины 1 января — её обычно забывают.</p>
      </section>

      <section className="wrap mt-12">
        <h2>Примеры заказов</h2>
        <p className="mt-2 text-stone max-w-2xl">Сумма — по ценам витрины на сегодня. Состав меняйте как удобно: позвоните, и {BRAND.manager} соберёт заказ под ваш бюджет.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {sets.map((s) => (
            <article key={s.name} className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6 flex flex-col">
              <h3 className="text-xl">{s.name}</h3>
              <p className="text-sm text-stone">{s.who}</p>
              <ul className="mt-4 space-y-2 text-[15px] flex-1">
                {s.lines.map(([slug, n]) => { const p = P(slug); return (
                  <li key={slug} className="flex justify-between gap-3 border-b border-ivory2 pb-2"><Link href={productPath(p)} className="hover:text-caviar2 underline decoration-ivory2">{p.seoName ?? p.name}</Link><span className="whitespace-nowrap text-stone">{qty(p, n)}</span></li>
                ); })}
              </ul>
              <p className="mt-4 font-display text-2xl text-caviar2">≈ {fmt(Math.round(sum(s.lines) / 10) * 10)} ₽</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap mt-12 prose max-w-3xl">
        <h2>Икра в подарок</h2>
        <p>Банка хорошей икры — подарок, который точно съедят. Знатоку — <Link href="/ikra/ikra-chavychi/">чавыча</Link> с самой крупной икринкой или <Link href="/ikra/ikra-kizhucha/">кижуч</Link> с ярким вкусом. Тем, кто любит классику, — <Link href="/ikra/ikra-kety-kamchatka/">камчатская кета</Link>. На каждой банке — этикетка рыбокомбината с датой выработки, так что подарок не стыдно вручить. К икре хорошо добавить <Link href="/ryba/kholodnoe-kopchenie/file-semgi-hk/">сёмгу холодного копчения</Link> или <Link href="/zamorozka/maslo-slivochnoe/">сливочное масло 72,5 %</Link>.</p>
        <h2>Заказы для офиса и корпоративов</h2>
        <p>Перед праздниками мы собираем одинаковые наборы для сотрудников и столы на корпоратив: икра, нарезка слабосолёной рыбы, копчёная форель. Привезём в один день по адресу офиса, по Октябрьскому и Кировскому районам — бесплатно. Если нужно больше 13 кг икры — посмотрите <Link href="/opt/">оптовые условия</Link>. В декабре курьеров на всех не хватает, поэтому корпоративные заказы просим согласовать заранее.</p>
        <h2>Что ещё на стол</h2>
        <p>Горячее без хлопот — <Link href="/zamorozka/steyki-semgi/">стейки сёмги</Link> в фольге за 18 минут или <Link href="/zamorozka/rulet-iz-semgi/">рулет из сёмги с моцареллой</Link>. Для салатов — <Link href="/moreprodukty/krevetki-tigrovye-ochishchennye/">очищенные тигровые креветки</Link> и <Link href="/moreprodukty/kalmar/">командорский кальмар</Link>. Под шубу — <Link href="/ryba/slabosolenaya/file-seldi/">филе сельди слабой соли</Link>. Идеи закусок — в статье <Link href="/blog/zakuski-s-ikroj-na-novyj-god/">«Закуски с красной икрой на Новый год»</Link>.</p>
      </section>

      <section className="wrap mt-12 grid lg:grid-cols-2 gap-6"><Vitrina title="Красная икра" items={byCat("ikra")} href="/ikra/" /><Vitrina title="Холодное копчение" items={byCat("kholodnoe-kopchenie")} href="/ryba/kholodnoe-kopchenie/" /></section>
      <Faq items={faq} />
      <section id="zakaz" className="wrap mt-14 grid lg:grid-cols-2 gap-8"><div><h2>Заказать к празднику</h2><p className="mt-2 text-stone">Напишите, на сколько человек и к какой дате. Перезвоним, предложим состав и отложим.</p></div><LeadForm compact product="Новый год" /></section>
    </>
  );
}
