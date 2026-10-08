import { meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CartView from "@/components/CartView";
export const metadata = meta({ title: "Корзина — Золото Камчатки", description: "Оформление заказа: самовывоз из ТЦ «Кедр» или доставка по Иркутску, оплата наличными.", path: "/korzina/", noindex: true });
export default function Page() {
  return (
    <section className="wrap pt-6">
      <Breadcrumbs items={[{ name: "Корзина", path: "/korzina/" }]} />
      <h1 className="mt-4">Корзина</h1>
      <CartView />
    </section>
  );
}
