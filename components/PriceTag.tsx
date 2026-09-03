import { Product, fmt } from "@/lib/site";
/** Ценник в стиле прайс-листа магазина */
export default function PriceTag({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`tag-price ${big ? "text-5xl sm:text-6xl" : "text-2xl"}`}>{p.price ? fmt(p.price) : "—"}</span>
      {p.price && <span className={`tag-price ${big ? "text-3xl" : "text-lg"}`}>₽</span>}
      <span className={`tag-unit ${big ? "text-base" : ""}`}>{p.price ? `/ ${p.unit}` : "цена по телефону"}</span>
    </span>
  );
}
