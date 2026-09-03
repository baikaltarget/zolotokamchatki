import Link from "next/link";
import { meta } from "@/lib/seo";
import { categories, byCat, productPath, fmt, BRAND } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import Todo from "@/components/Todo";
export const metadata = meta({ title: "Цены на красную икру и рыбу в Иркутске — прайс-лист Золото Камчатки", description: "Полный прайс магазина: икра кеты от 2125 ₽/250 г, нерка, филе слабой соли от 225 ₽, холодное копчение от 1250 ₽/кг, заморозка и морепродукты. Обновляется в магазине.", path: "/tseny" });
export default function Page() {
  return (
    <section className="wrap pt-6">
      <Breadcrumbs items={[{ name: "Цены", path: "/tseny" }]} />
      <h1 className="mt-4">Прайс-лист</h1>
      <p className="mt-3 text-stone max-w-2xl">Цены магазина в ТЦ «Кедр» на сегодня. Икра меняется в цене с новым выловом — если сомневаетесь, позвоните: <a href={`tel:${BRAND.phoneRaw}`} className="text-caviar2 font-semibold">{BRAND.phone}</a>. Оплата наличными.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {categories.map((c) => (
          <div key={c.slug} className="bg-ink text-ivory rounded-tag p-5 sm:p-6">
            <h2 className="text-gold2 text-xl sm:text-2xl border-b border-gold/30 pb-3 mb-2"><Link href={c.path} className="hover:text-ivory">{c.name}</Link></h2>
            <table className="w-full text-[15px]"><tbody>
              {byCat(c.slug).map((p) => (
                <tr key={p.slug} className="border-b border-ivory/10 last:border-0">
                  <td className="py-2 pr-3"><Link href={productPath(p)} className="tag-name hover:text-gold2">{p.name}</Link>{p.origin && <span className="ml-2 text-[10px] text-gold tracking-widest uppercase">{p.origin}</span>}</td>
                  <td className="py-2 text-right whitespace-nowrap font-display">{p.todo ? <Todo k={p.todo} className="inline-block"><span className="text-caviar text-lg">{p.price ? fmt(p.price) + " ₽" : "по тел."}</span></Todo> : <span className="text-caviar text-lg">{p.price ? fmt(p.price) + " ₽" : "по тел."}</span>}<span className="text-ivory/50 text-xs uppercase ml-1">{p.price ? `/ ${p.unit}` : ""}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        ))}
      </div>
    </section>
  );
}
