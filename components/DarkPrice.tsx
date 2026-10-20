import { Product, fmt, showPrice, noPriceLabel } from "@/lib/site";
/** Цена для тёмных прайс-листов: крупно цена (у икры — за 250 г), мелко единица и цена за кг */
export default function DarkPrice({ p, className = "text-lg sm:text-xl" }: { p: Product; className?: string }) {
  const s = showPrice(p);
  return (
    <span className="whitespace-nowrap font-display text-right">
      <span className={`text-caviar ${className}`}>{s ? `${fmt(s.value)} ₽` : noPriceLabel(p)}</span>
      {s && <span className="text-ivory/50 text-xs uppercase ml-1">/ {s.unit}</span>}
      {s?.note && <span className="block text-ivory/50 text-xs normal-case">{s.note}</span>}
    </span>
  );
}
