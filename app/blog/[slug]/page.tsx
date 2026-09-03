import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { meta } from "@/lib/seo";
import { getPosts, renderPost } from "@/lib/blog";
import { BRAND, abs, byCat } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Vitrina from "@/components/Vitrina";
type P = Promise<{ slug: string }>;
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: P }) {
  const { slug } = await params; const p = getPosts().find((x) => x.slug === slug); if (!p) return {};
  return meta({ title: p.title, description: p.description, path: `/blog/${p.slug}`, image: p.image, type: "article" });
}
export default async function Page({ params }: { params: P }) {
  const post = await renderPost((await params).slug); if (!post) notFound();
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, image: abs(post.image), datePublished: post.date, author: { "@type": "Organization", name: BRAND.name }, publisher: { "@type": "Organization", name: BRAND.name, logo: { "@type": "ImageObject", url: abs("/img/logo.webp") } }, mainEntityOfPage: abs(`/blog/${post.slug}`) };
  return (
    <>
      <JsonLd data={ld} />
      <article className="wrap pt-6">
        <Breadcrumbs items={[{ name: "Блог", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
        <div className="mt-4 grid lg:grid-cols-[1fr_340px] gap-10">
          <div>
            <h1>{post.title}</h1>
            <time className="block mt-2 text-sm text-stone">{new Date(post.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</time>
            <div className="relative aspect-[16/9] rounded-tag overflow-hidden mt-6"><Image src={post.image} alt={post.title} fill priority sizes="(max-width:1024px) 100vw, 800px" className="object-cover" /></div>
            <div className="prose mt-6 max-w-3xl" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <Vitrina title="Икра сегодня" items={byCat("ikra").slice(0, 4)} href="/ikra" />
            <div className="bg-white border border-ivory2 rounded-tag p-5"><p className="font-display uppercase">Заказать</p><a href={`tel:${BRAND.phoneRaw}`} className="block font-display text-2xl text-caviar2 mt-1">{BRAND.phone}</a><p className="text-sm text-stone mt-1">{BRAND.addressShort}</p><Link href="/dostavka" className="text-sm underline mt-2 inline-block">Доставка по Иркутску</Link></div>
          </aside>
        </div>
      </article>
    </>
  );
}
