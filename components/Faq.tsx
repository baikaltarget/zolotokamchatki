import JsonLd from "./JsonLd";
import { faqLd } from "@/lib/seo";
export default function Faq({ items, title = "Вопросы и ответы" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="wrap mt-16">
      <JsonLd data={faqLd(items)} />
      <h2 className="mb-6">{title}</h2>
      <div className="divide-y divide-ivory2 border-y border-ivory2">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer list-none flex justify-between gap-4 font-semibold text-lg">{f.q}<span className="text-caviar transition-transform group-open:rotate-45 text-2xl leading-none">+</span></summary>
            <p className="mt-3 text-stone max-w-3xl">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
