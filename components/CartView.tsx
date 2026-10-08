"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useCart, setQty, clearCart, cartTotal } from "@/lib/cart";
import { BRAND, SITE, fmt } from "@/lib/site";
import { formatPhone, isPhoneValid } from "@/lib/phone";
import { getSource } from "@/lib/utm";
import { ecom } from "@/lib/ecom";

export default function CartView() {
  const items = useCart();
  const total = cartTotal(items);
  const minOrder = SITE.delivery.minOrder;
  const [way, setWay] = useState<"pickup" | "delivery">("pickup");
  const [f, setF] = useState({ name: "", phone: "", address: "", comment: "" });
  const [touched, setTouched] = useState(false);
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<{ s: "idle" | "sending" | "ok" | "fallback" | "err"; id?: string }>({ s: "idle" });
  const opened = useRef(Date.now());
  const weight = items.some((i) => i.byWeight);
  const lowForDelivery = way === "delivery" && total < minOrder;

  async function submit() {
    if (!isPhoneValid(f.phone)) { setTouched(true); return; }
    if (way === "delivery" && !f.address.trim()) { setTouched(true); return; }
    setState({ s: "sending" });
    try {
      const r = await fetch("/api/order/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, way, trap, items: items.map(({ slug, variant, qty }) => ({ slug, variant, qty })), src: getSource(), elapsed: Date.now() - opened.current }) });
      const j = await r.json();
      if (j.ok) {
        ecom("purchase", items.map((i) => ({ id: i.slug, name: i.name, price: i.price, quantity: i.qty, variant: i.variant })), { id: j.id, revenue: total });
        clearCart(); setState({ s: "ok", id: j.id });
      } else setState({ s: j.fallback ? "fallback" : "err", id: j.id });
    } catch { setState({ s: "err" }); }
  }

  if (state.s === "ok") return (
    <div className="mt-8 bg-white border border-ivory2 rounded-tag p-6 sm:p-8 max-w-2xl">
      <p className="font-display uppercase text-2xl">Заказ {state.id} принят</p>
      <p className="mt-3 text-lg">{BRAND.manager} перезвонит, чтобы подтвердить состав, сумму и время. Мы работаем {BRAND.hours.toLowerCase()}.</p>
      <p className="mt-2 text-stone">Оплата наличными — {way === "pickup" ? "в магазине при получении" : "курьеру"}. Вопросы: <a href={`tel:${BRAND.phoneRaw}`} className="text-caviar2 font-semibold">{BRAND.phone}</a></p>
      <Link href="/ikra/" className="btn btn-ghost mt-5">Вернуться в каталог</Link>
    </div>
  );

  if (!items.length) return (
    <div className="mt-8 bg-white border border-ivory2 rounded-tag p-6 max-w-2xl">
      <p className="text-lg">Корзина пока пустая.</p>
      <div className="mt-4 flex flex-wrap gap-2"><Link href="/ikra/" className="btn btn-caviar">Красная икра</Link><Link href="/ryba/kholodnoe-kopchenie/" className="btn btn-ghost">Копчёная рыба</Link><Link href="/tseny/" className="btn btn-ghost">Все цены</Link></div>
    </div>
  );

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_420px] gap-8 items-start">
      <div>
        <ul className="divide-y divide-ivory2 border-y border-ivory2">
          {items.map((i) => (
            <li key={i.key} className="py-4 flex flex-wrap items-center gap-3 justify-between">
              <div className="min-w-0"><Link href={i.path} className="font-semibold hover:text-caviar2">{i.name}</Link><p className="text-sm text-stone">{i.variant} · {fmt(i.price)} ₽</p></div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-ink/20 rounded-tag">
                  <button type="button" className="px-3 py-1.5" aria-label="Меньше" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                  <span className="w-8 text-center">{i.qty}</span>
                  <button type="button" className="px-3 py-1.5" aria-label="Больше" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                </div>
                <span className="w-24 text-right font-display text-lg">{fmt(i.price * i.qty)} ₽</span>
                <button type="button" className="text-stone hover:text-nerka text-sm" onClick={() => setQty(i.key, 0)} aria-label={`Удалить ${i.name}`}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right font-display text-2xl">Итого: {fmt(total)} ₽</p>
        {weight && <p className="mt-1 text-right text-sm text-stone">Весовые товары взвешиваем при сборке — точную сумму назовём при подтверждении.</p>}
      </div>

      <div className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6">
        <p className="font-display uppercase text-xl">Оформление</p>
        <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Способ получения">
          {([["pickup", "Самовывоз", "ТЦ «Кедр», Волжская, 3"], ["delivery", "Доставка", `по Иркутску от ${fmt(minOrder)} ₽`]] as const).map(([k, t, s]) => (
            <button key={k} type="button" role="radio" aria-checked={way === k} onClick={() => setWay(k)} className={`text-left rounded-tag border p-3 ${way === k ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"}`}>
              <span className="block font-semibold">{t}</span><span className={`text-xs ${way === k ? "text-ivory/70" : "text-stone"}`}>{s}</span>
            </button>
          ))}
        </div>
        {way === "delivery" && <p className="mt-2 text-xs text-stone">Октябрьский и Кировский районы — бесплатно, остальной город — 25 ₽/км. <Link href="/dostavka/" className="underline">Условия доставки</Link></p>}
        {lowForDelivery && <p className="mt-2 text-sm text-nerka">Для доставки минимальный заказ {fmt(minOrder)} ₽ — добавьте ещё {fmt(minOrder - total)} ₽ или выберите самовывоз.</p>}
        <div className="mt-4 grid gap-3">
          <input className="border border-ivory2 rounded-tag px-3 py-2.5" placeholder="Имя" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Имя" />
          <input className={`border rounded-tag px-3 py-2.5 ${touched && !isPhoneValid(f.phone) ? "border-nerka" : "border-ivory2"}`} placeholder="Телефон" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: formatPhone(e.target.value) })} aria-label="Телефон" />
          {way === "delivery" && <input className={`border rounded-tag px-3 py-2.5 ${touched && !f.address.trim() ? "border-nerka" : "border-ivory2"}`} placeholder="Адрес доставки" autoComplete="street-address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} aria-label="Адрес доставки" />}
          <textarea className="border border-ivory2 rounded-tag px-3 py-2.5" rows={2} placeholder="Комментарий: удобное время, пожелания" value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} aria-label="Комментарий" />
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} className="hp-field" />
        </div>
        <button type="button" onClick={submit} disabled={state.s === "sending" || lowForDelivery} className="btn btn-caviar w-full mt-4 disabled:opacity-50">{state.s === "sending" ? "Отправляем…" : `Оформить заказ · ${fmt(total)} ₽`}</button>
        <p className="mt-3 text-xs text-stone">Оплата наличными при получении. После оформления {BRAND.manager} перезвонит и подтвердит заказ. Нажимая кнопку, вы соглашаетесь с <a href="/politika/" className="underline">политикой конфиденциальности</a>.</p>
        {state.s === "fallback" && <p className="mt-3 text-sm text-nerka">Не удалось отправить заказ автоматически. Позвоните, пожалуйста: <a href={`tel:${BRAND.phoneRaw}`} className="font-semibold">{BRAND.phone}</a> — корзина сохранена.</p>}
        {state.s === "err" && <p className="mt-3 text-sm text-nerka">Ошибка отправки. Позвоните: <a href={`tel:${BRAND.phoneRaw}`} className="font-semibold">{BRAND.phone}</a>.</p>}
      </div>
    </div>
  );
}
