import Link from "next/link";
import { BRAND, SITE, categories } from "@/lib/site";
import Todo from "./Todo";

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/80 mt-20 pb-24 lg:pb-10">
      <div className="wrap grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="font-display uppercase text-gold2 text-xl">{BRAND.name}</div>
          <p className="mt-2 text-sm text-ivory/60">{BRAND.tagline}. Красная икра и рыба с Камчатки и Дальнего Востока в Иркутске с {BRAND.founded} года.</p>
          <p className="mt-4 text-xs text-ivory/50">{BRAND.legalName}<br />ИНН {BRAND.inn} · ОГРНИП {(BRAND as unknown as { ogrnip: string }).ogrnip}</p>
        </div>
        <div>
          <div className="font-display uppercase text-sm tracking-wider text-ivory/50 mb-3">Каталог</div>
          <ul className="space-y-2 text-sm">{categories.map((c) => <li key={c.slug}><Link href={c.path} className="hover:text-gold2">{c.name}</Link></li>)}<li><Link href="/tseny" className="hover:text-gold2">Все цены</Link></li><li><Link href="/sbory" className="hover:text-gold2">Сборы</Link></li><li><Link href="/opt" className="hover:text-gold2">Икра оптом</Link></li></ul>
        </div>
        <div>
          <div className="font-display uppercase text-sm tracking-wider text-ivory/50 mb-3">Доставка</div>
          <ul className="space-y-2 text-sm">{SITE.delivery.zones.map((z) => <li key={z.slug}><Link href={`/dostavka/${z.slug}`} className="hover:text-gold2">{z.name}</Link></li>)}</ul>
        </div>
        <div>
          <div className="font-display uppercase text-sm tracking-wider text-ivory/50 mb-3">Магазин</div>
          <address className="not-italic text-sm space-y-2">
            <p>{BRAND.addressShort}</p>
            <p>{BRAND.hours}</p>
            <p><a href={`tel:${BRAND.phoneRaw}`} className="text-gold2 font-display text-lg">{BRAND.phone}</a><br /><span className="text-ivory/60">{BRAND.manager} — заказы и доставка</span></p>
            <p className="text-ivory/60">{BRAND.payment}</p>
            <p className="flex flex-wrap gap-3"><a href={(BRAND as unknown as { telegramPersonal: string }).telegramPersonal} className="hover:text-gold2" rel="noopener">Telegram (заказы)</a><a href={BRAND.telegram} className="hover:text-gold2" rel="noopener">Канал</a><a href={BRAND.max} className="hover:text-gold2" rel="noopener">MAX</a></p>
          </address>
        </div>
      </div>
      <div className="wrap border-t border-ivory/10 pt-5 text-xs text-ivory/40 flex flex-wrap gap-4 justify-between">
        <span>© {new Date().getFullYear()} {BRAND.name}, Иркутск</span>
        <span className="flex flex-wrap gap-4"><Link href="/o-magazine" className="hover:text-gold2">О магазине</Link><Link href="/politika" className="hover:text-gold2">Политика конфиденциальности</Link><a href="https://baikal-target.ru/" rel="noopener" className="hover:text-gold2">Разработка сайта — Байкал Таргет</a></span>
      </div>
    </footer>
  );
}
