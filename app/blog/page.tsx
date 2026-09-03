import Link from "next/link";
import Image from "next/image";
import { meta } from "@/lib/seo";
import { getPosts } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
export const metadata = meta({ title: "Блог об икре и рыбе — как выбрать, хранить, готовить | Золото Камчатки", description: "Статьи магазина «Золото Камчатки»: как отличить настоящую икру, чем кета отличается от нерки, как хранить икру дома, рецепты из красной рыбы.", path: "/blog" });
export default function Page() {
  const posts = getPosts();
  return (
    <section className="wrap pt-6">
      <Breadcrumbs items={[{ name: "Блог", path: "/blog" }]} />
      <h1 className="mt-4">Блог: икра, рыба, рецепты</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white border border-ivory2 rounded-tag overflow-hidden hover:border-ink/40">
            <div className="relative aspect-[16/9]"><Image src={p.image} alt="" fill sizes="50vw" className="object-cover group-hover:scale-[1.02] transition duration-500" /></div>
            <div className="p-5"><time className="text-xs text-stone">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</time><h2 className="text-xl mt-1 group-hover:text-caviar2">{p.title}</h2><p className="text-stone text-sm mt-2">{p.description}</p></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
