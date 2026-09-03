import Link from "next/link";
import Image from "next/image";
import { BRAND, SITE } from "@/lib/site";

export default function Header() {
  return (
    <header className="bg-white text-ink sticky top-0 z-40 border-b border-ivory2 shadow-sm">
      <div className="wrap flex items-center gap-4 py-2.5">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="На главную">
          <Image src="/img/logo.webp" alt="" width={44} height={44} className="rounded-full" />
          <span className="leading-none">
            <span className="block font-display font-bold text-lg text-ink">{BRAND.name}</span>
            <span className="hidden sm:block text-[11px] text-stone">{BRAND.tagline} · Иркутск</span>
          </span>
        </Link>
        <nav className="hidden xl:flex gap-4 2xl:gap-5 ml-4 text-[13px] 2xl:text-sm font-medium whitespace-nowrap" aria-label="Разделы">
          {SITE.nav.map((n) => <Link key={n.href} href={n.href} className="text-ink/80 hover:text-caviar">{n.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden 2xl:block text-right leading-tight whitespace-nowrap">
            <span className="block text-[11px] text-stone">{BRAND.hours}</span>
            <span className="block text-[11px] text-stone">ТЦ «Кедр», пав. 4 и 4А</span>
          </span>
          <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-caviar !py-2 !px-4 text-sm whitespace-nowrap">{BRAND.phone}</a>
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
