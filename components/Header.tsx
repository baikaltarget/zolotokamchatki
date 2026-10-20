import Link from "next/link";
import Image from "next/image";
import { BRAND, SITE } from "@/lib/site";
import CartLink from "./CartLink";

type Item = { label: string; href: string };
const MENU: (Item | { label: string; items: Item[] })[] = [
  { label: "Икра", href: "/ikra/" },
  { label: "Рыба", items: [{ label: "Слабая соль", href: "/ryba/slabosolenaya/" }, { label: "Холодное копчение", href: "/ryba/kholodnoe-kopchenie/" }, { label: "Заморозка", href: "/zamorozka/" }] },
  { label: "Морепродукты", href: "/moreprodukty/" },
  { label: "Новый год", href: "/novyj-god/" },
  { label: "Цены", href: "/tseny/" },
  { label: "Опт", href: "/opt/" },
  { label: "Покупателям", items: [{ label: "Доставка", href: "/dostavka/" }, { label: "Сборы — дешевле витрины", href: "/sbory/" }, { label: "Блог", href: "/blog/" }, { label: "О магазине", href: "/o-magazine/" }] },
  { label: "Контакты", href: "/kontakty/" },
];

export default function Header() {
  return (
    <header className="bg-white text-ink sticky top-0 z-40 border-b border-ivory2 shadow-sm">
      <div className="wrap flex items-center gap-4 py-2.5">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="На главную">
          <Image src="/img/logo.webp" alt="" width={44} height={44} className="rounded-full" />
          <span className="leading-none">
            <span className="block font-display font-bold text-lg text-ink whitespace-nowrap">{BRAND.name}</span>
            <span className="hidden sm:block text-[11px] text-stone whitespace-nowrap">{BRAND.tagline} · Иркутск</span>
          </span>
        </Link>
        <nav className="hidden xl:flex items-center gap-5 ml-6 text-sm font-medium whitespace-nowrap" aria-label="Разделы">
          {MENU.map((m) =>
            "items" in m ? (
              <div key={m.label} className="relative group">
                <button type="button" className="flex items-center gap-1 text-ink/80 hover:text-caviar group-focus-within:text-caviar" aria-haspopup="true">
                  {m.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <div className="absolute left-0 top-full pt-3 hidden group-hover:block group-focus-within:block">
                  <ul className="min-w-[210px] bg-white border border-ivory2 rounded-tag shadow-lg py-2">
                    {m.items.map((i) => <li key={i.href}><Link href={i.href} className="block px-4 py-2 text-ink/85 hover:bg-ivory2/60 hover:text-caviar">{i.label}</Link></li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={m.href} href={m.href} className="text-ink/80 hover:text-caviar">{m.label}</Link>
            )
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden 2xl:block text-right leading-tight whitespace-nowrap">
            <span className="block text-[11px] text-stone">{BRAND.hours}</span>
            <span className="block text-[11px] text-stone">ТЦ «Кедр», пав. 4 и 4А</span>
          </span>
          <CartLink />
          <a href={`tel:${BRAND.phoneRaw}`} className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-tag border border-ink/15 hover:border-ink" aria-label={`Позвонить: ${BRAND.phone}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></svg>
          </a>
          <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar !hidden sm:!inline-flex !py-2 !px-4 text-sm whitespace-nowrap">{BRAND.phone}</a>
        </div>
      </div>
      <nav className="xl:hidden overflow-x-auto border-t border-ivory2" aria-label="Разделы">
        <div className="wrap flex gap-4 py-2 text-[13px] whitespace-nowrap">
          {SITE.nav.map((n) => <Link key={n.href} href={n.href} className="text-ink/80 hover:text-caviar">{n.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}
