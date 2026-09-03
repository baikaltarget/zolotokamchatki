import CategoryPage from "@/components/CategoryPage";
import { meta } from "@/lib/seo";
import { categories } from "@/lib/site";
import { notFound } from "next/navigation";
const ryba = categories.filter((c) => c.path.startsWith("/ryba/"));
export function generateStaticParams() { return ryba.map((c) => ({ category: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params; const c = ryba.find((x) => x.slug === category); if (!c) return {};
  return meta({ title: c.title, description: c.description, path: c.path, image: c.image });
}
export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params; if (!ryba.find((x) => x.slug === category)) notFound();
  return <CategoryPage slug={category} />;
}
