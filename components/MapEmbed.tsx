import { BRAND } from "@/lib/site";
/** Карта Яндекса по карточке организации + кнопки 2ГИС / Яндекс */
export default function MapEmbed() {
  return (
    <div>
      <div className="rounded-tag overflow-hidden border border-ivory2 aspect-[16/10] sm:aspect-[16/9]">
        <iframe
          src={`https://yandex.ru/map-widget/v1/?ol=biz&oid=${(BRAND as unknown as { yandexOid: string }).yandexOid}&z=16`}
          className="w-full h-full" loading="lazy" title={`${BRAND.name} на карте — ${BRAND.addressShort}`}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className="btn btn-ghost" href="https://go.2gis.com/NE8bO" rel="noopener">Открыть в 2ГИС</a>
        <a className="btn btn-ghost" href="https://yandex.ru/profile/30908620746" rel="noopener">Мы в Яндексе</a>
      </div>
    </div>
  );
}
