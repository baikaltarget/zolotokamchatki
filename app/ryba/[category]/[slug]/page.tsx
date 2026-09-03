import ProductPage from "@/components/ProductPage";
import { meta } from "@/lib/seo";
import { products, productPath, cat, fmt } from "@/lib/site";
import { notFound } from "next/navigation";
type P = Promise<{ slug: string; category: string }>;
const pool = (cat: string) => products.filter((p) => p.category === cat);
export function generateStaticParams() { return products.filter((p) => cat(p.category).path.startsWith("/ryba/")).map((p) => ({ category: p.category, slug: p.slug })); }
export async function generateMetadata({ params }: { params: P }) {
  const pr = await params; const p = pool(pr.category).find((x) => x.slug === pr.slug); if (!p) return {};
  const price = p.price ? ` — ${fmt(p.price)} ₽ за ${p.unit}` : "";
  return meta({ title: `${p.name} в Иркутске${price} — Золото Камчатки`, description: `${p.short} Цена ${p.price ? fmt(p.price) + " ₽ / " + p.unit : "по телефону"}. Магазин в ТЦ «Кедр», доставка по Иркутску от 2000 ₽.`, path: productPath(p), image: p.image });
}
export default async function Page({ params }: { params: P }) {
  const pr = await params; const p = pool(pr.category).find((x) => x.slug === pr.slug); if (!p) notFound();
  return <ProductPage p={p} />;
}
