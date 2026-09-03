import Link from "next/link";
import Image from "next/image";
import { Product, productPath } from "@/lib/site";
import PriceTag from "./PriceTag";
import Todo from "./Todo";

export default function ProductCard({ p, withImage = true }: { p: Product; withImage?: boolean }) {
  const card = (
    <Link href={productPath(p)} className="group block bg-white rounded-tag border border-ivory2 hover:border-ink/40 transition-colors overflow-hidden h-full">
      {withImage && (
        <div className="relative aspect-[4/3] bg-ink2">
          <Image src={p.image} alt={p.name} fill sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, 380px" className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          {p.origin && <span className="seal absolute left-3 top-3 bg-ink/80">{p.origin}</span>}
          {p.hit && <span className="absolute right-3 top-3 bg-caviar text-white font-display uppercase text-[11px] tracking-wider px-2 py-1 rounded-tag">Хит</span>}
        </div>
      )}
      <div className="p-4">
        <h3 className="tag-name text-lg group-hover:text-caviar2">{p.name}</h3>
        <p className="mt-1 text-sm text-stone leading-snug min-h-[2.5rem]">{p.short}</p>
        <div className="mt-3"><PriceTag p={p} /></div>
      </div>
    </Link>
  );
  return p.todo ? <Todo k={p.todo}>{card}</Todo> : card;
}
