import Link from "next/link";
import Image from "next/image";
import { BRAND, SITE } from "@/lib/site";
import CartLink from "./CartLink";

export default function Header() {
  return (
    <header className="bg-white text-ink sticky top-0 z-40 border-b border-ivory2 shadow-sm">
      <div className="wrap flex items-center gap-4 py-2.5">
        <Link href="/" className="flex items-center gap-3 min-w-0" aria-label="На главную">
          <Image src="/img/logo.webp" alt="" width={44} height={44} className="rounded-full" />
          <span className="leading-none">
            <span className="block font-display font-bold text-lg text-ink">{BRAND.name}</span>
            <span className="hidden sm:block text-[11px] text-stone">{BRAND.tagline} · Иркутск</span>
          </span>
        </Link>
        <nav className="hidden xl:flex gap-4 2xl:gap-5 ml-4 text-[13px] 2xl:text-sm font-medium whitespace-nowrap" aria-label="Разделы">
          {SITE.nav.map((n) => <Link key={n.href} href={n.href} className="text-ink/80 hover:text-caviar">{n.label}</Link>)}
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
