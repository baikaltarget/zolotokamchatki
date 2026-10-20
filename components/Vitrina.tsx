import Link from "next/link";
import { Product, productPath } from "@/lib/site";
import DarkPrice from "./DarkPrice";
/** Тёмная «витрина» — список цен как на прайс-листах магазина. Фирменный блок. */
export default function Vitrina({ title, items, href, compact = false }: { title?: string; items: Product[]; href?: string; compact?: boolean }) {
  return (
    <div className="bg-ink text-ivory rounded-tag p-5 sm:p-7">
      {title && <div className="flex items-baseline justify-between gap-4 mb-4 border-b border-gold/30 pb-3">
        <h2 className="text-xl sm:text-2xl text-gold2">{title}</h2>
        {href && <Link href={href} className="text-sm text-ivory/60 hover:text-gold2 whitespace-nowrap">все позиции →</Link>}
      </div>}
      <ul className={compact ? "grid sm:grid-cols-2 gap-x-8" : ""}>
        {items.map((p) => (
          <li key={p.slug} className="border-b border-ivory/10 last:border-0">
            <Link href={productPath(p)} className="flex items-baseline justify-between gap-3 py-2.5 hover:text-gold2">
              <span className="tag-name text-base sm:text-lg">{p.name.replace(/ холодного копчения| слабой соли/, "")}{p.origin && <span className="ml-2 text-[10px] text-gold tracking-widest">{p.origin}</span>}</span>
              <DarkPrice p={p} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
