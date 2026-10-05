import ProductPage from "@/components/ProductPage";
import { productMeta } from "@/lib/seo";
import { byCat } from "@/lib/site";
import { notFound } from "next/navigation";
type P = Promise<{ slug: string }>;
const find = (slug: string) => byCat("ikra").find((x) => x.slug === slug);
export function generateStaticParams() { return byCat("ikra").map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: P }) {
  const p = find((await params).slug); return p ? productMeta(p) : {};
}
export default async function Page({ params }: { params: P }) {
  const p = find((await params).slug); if (!p) notFound();
  return <ProductPage p={p} />;
}
