import { Product, fmt, showPrice } from "@/lib/site";
/** Ценник в стиле прайс-листа магазина */
export default function PriceTag({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  const big = size === "lg";
  const s = showPrice(p);
  return (
    <span className="inline-block">
      <span className="inline-flex items-baseline gap-1.5">
        <span className={`tag-price ${big ? "text-5xl sm:text-6xl" : "text-2xl"}`}>{s ? fmt(s.value) : "—"}</span>
        {s && <span className={`tag-price ${big ? "text-3xl" : "text-lg"}`}>₽</span>}
        <span className={`tag-unit ${big ? "text-base" : ""}`}>{s ? `/ ${s.unit}` : p.preorder ? "под заказ · цена по телефону" : "цена по телефону"}</span>
      </span>
      {s?.note && <span className={`block text-stone ${big ? "text-base mt-1" : "text-sm"}`}>{s.note}</span>}
    </span>
  );
}
