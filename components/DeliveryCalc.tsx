"use client";
import { useState } from "react";
import { SITE, fmt } from "@/lib/site";

const D = SITE.delivery;
export default function DeliveryCalc({ defaultZone }: { defaultZone?: string }) {
  const [zone, setZone] = useState(defaultZone ?? D.zones[0].slug);
  const [km, setKm] = useState<number>(D.zones.find((z) => z.slug === (defaultZone ?? D.zones[0].slug))?.km ?? 5);
  const [sum, setSum] = useState<number>(3000);
  const z = D.zones.find((x) => x.slug === zone)!;
  const min = z.minOrder;
  const ok = sum >= min;
  const cost = z.free ? 0 : km * D.perKm;

  return (
    <div className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6">
      <p className="font-display uppercase text-xl">Калькулятор доставки</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">Район<select className="mt-1 w-full border border-ivory2 rounded-tag px-3 py-2.5" value={zone} onChange={(e) => { setZone(e.target.value); setKm(D.zones.find((x) => x.slug === e.target.value)?.km ?? 5); }}>{D.zones.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select></label>
        <label className="text-sm">Километров по 2ГИС от ул. Волжская, 3<input type="number" min={0} className="mt-1 w-full border border-ivory2 rounded-tag px-3 py-2.5" value={km} onChange={(e) => setKm(Number(e.target.value))} disabled={z.free} /></label>
        <label className="text-sm">Сумма заказа, ₽<input type="number" min={0} step={100} className="mt-1 w-full border border-ivory2 rounded-tag px-3 py-2.5" value={sum} onChange={(e) => setSum(Number(e.target.value))} /></label>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {ok ? <>
          <span className="font-display uppercase text-stone">Доставка</span>
          <span className="tag-price text-5xl">{cost === 0 ? "0 ₽" : `${fmt(cost)} ₽`}</span>
          <span className="text-sm text-stone">{z.free ? "бесплатно в этом районе" : `${km} км × ${D.perKm} ₽`}</span>
        </> : <span className="text-nerka">Минимальный заказ для «{z.name}» — {fmt(min)} ₽. Добавьте ещё {fmt(min - sum)} ₽.</span>}
      </div>
      <p className="mt-3 text-xs text-stone">{D.note}</p>
    </div>
  );
}
