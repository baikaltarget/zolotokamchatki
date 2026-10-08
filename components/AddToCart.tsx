"use client";
import { useState } from "react";
import Link from "next/link";
import { addToCart, variantsOf } from "@/lib/cart";
import { fmt, productPath, productTitle, type Product } from "@/lib/site";

export default function AddToCart({ p }: { p: Product }) {
  const vars = variantsOf(p);
  const [v, setV] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!vars.length) return null;
  const cur = vars[v];
  function add() {
    addToCart({ key: `${p.slug}|${cur.label}`, slug: p.slug, name: productTitle(p), path: productPath(p), variant: cur.label, price: cur.price, byWeight: cur.byWeight }, qty);
    setAdded(true);
    try { (window as unknown as { ym?: (id: number, a: string, g: string) => void }).ym?.(112026044, "reachGoal", "add_to_cart"); } catch {}
  }
  return (
    <div className="mt-6 bg-white border border-ivory2 rounded-tag p-4">
      {vars.length > 1 && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Фасовка">
          {vars.map((x, i) => (
            <button key={x.label} type="button" role="radio" aria-checked={i === v} onClick={() => { setV(i); setAdded(false); }}
              className={`rounded-tag border px-3 py-1.5 text-sm ${i === v ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"}`}>
              {x.label} · {fmt(x.price)} ₽
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center border border-ink/20 rounded-tag">
          <button type="button" className="px-3 py-2" aria-label="Меньше" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="w-8 text-center" aria-live="polite">{qty}</span>
          <button type="button" className="px-3 py-2" aria-label="Больше" onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <button type="button" onClick={add} className="btn btn-caviar">В корзину · {fmt(cur.price * qty)} ₽</button>
        {added && <Link href="/korzina/" className="btn btn-ghost">В корзине → оформить</Link>}
      </div>
      {cur.byWeight && <p className="mt-2 text-xs text-stone">Весовой товар: взвешиваем при сборке, точную сумму назовём при подтверждении заказа.</p>}
    </div>
  );
}
