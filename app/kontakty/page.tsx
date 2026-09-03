import { meta } from "@/lib/seo";
import { BRAND } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import MapEmbed from "@/components/MapEmbed";
import LeadForm from "@/components/LeadForm";
export const metadata = meta({ title: "Контакты магазина «Золото Камчатки» — ТЦ «Кедр», ул. Волжская, 3, Иркутск", description: `Магазин красной икры и рыбы в Иркутске: ТЦ «Кедр», ул. Волжская, 3, павильоны 4 и 4А. ${BRAND.hours}. Телефон ${BRAND.phone}.`, path: "/kontakty" });
export default function Page() {
  return (
    <section className="wrap pt-6">
      <Breadcrumbs items={[{ name: "Контакты", path: "/kontakty" }]} />
      <h1 className="mt-4">Контакты</h1>
      <div className="mt-6 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="space-y-5">
          <div><p className="text-stone text-xs uppercase tracking-wider font-display">Телефон, заказы и доставка</p><a href={`tel:${BRAND.phoneRaw}`} className="font-display text-4xl text-caviar2">{BRAND.phone}</a><p className="text-stone">{BRAND.manager} — заказы, доставка, опт</p></div>
          <div><p className="text-stone text-xs uppercase tracking-wider font-display">Адрес</p><p className="text-lg">{BRAND.address}</p><p className="text-stone text-sm">Вход в ТЦ «Кедр», павильоны 4 и 4А — рядом друг с другом.</p></div>
          <div><p className="text-stone text-xs uppercase tracking-wider font-display">Часы работы</p><p className="text-lg">{BRAND.hours}</p></div>
          <div><p className="text-stone text-xs uppercase tracking-wider font-display">Оплата</p><p>{BRAND.payment}</p></div>
          <div><p className="text-stone text-xs uppercase tracking-wider font-display">Мы в мессенджерах</p><p className="flex gap-4"><a href={(BRAND as unknown as { telegramPersonal: string }).telegramPersonal} className="underline" rel="noopener">Написать Светлане в Telegram</a><a href={BRAND.telegram} className="underline" rel="noopener">Telegram-канал</a><a href={BRAND.max} className="underline" rel="noopener">Канал в MAX</a></p></div>
        </div>
        <div className="space-y-6"><MapEmbed /><LeadForm /></div>
      </div>
    </section>
  );
}
