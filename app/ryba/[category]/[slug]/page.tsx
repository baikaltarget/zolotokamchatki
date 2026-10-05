import ProductPage from "@/components/ProductPage";
import { productMeta } from "@/lib/seo";
import { products, cat } from "@/lib/site";
import { notFound } from "next/navigation";
type P = Promise<{ slug: string; category: string }>;
const ryba = products.filter((p) => cat(p.category).path.startsWith("/ryba/"));
const find = (c: string, s: string) => ryba.find((x) => x.category === c && x.slug === s);
export function generateStaticParams() { return ryba.map((p) => ({ category: p.category, slug: p.slug })); }
export async function generateMetadata({ params }: { params: P }) {
  const pr = await params; const p = find(pr.category, pr.slug); return p ? productMeta(p) : {};
}
export default async function Page({ params }: { params: P }) {
  const pr = await params; const p = find(pr.category, pr.slug); if (!p) notFound();
  return <ProductPage p={p} />;
}
