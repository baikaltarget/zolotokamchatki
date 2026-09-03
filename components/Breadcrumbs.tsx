import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";
export type Crumb = { name: string; path: string };
export default function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const all = [{ name: "Главная", path: "/" }, ...items];
  return (
    <nav aria-label="Хлебные крошки" className={`text-xs sm:text-sm ${dark ? "text-ivory/60" : "text-stone"}`}>
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={c.path} className="flex gap-2">
            {i < all.length - 1 ? <Link href={c.path} className="hover:underline">{c.name}</Link> : <span aria-current="page" className={dark ? "text-ivory" : "text-ink"}>{c.name}</span>}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
