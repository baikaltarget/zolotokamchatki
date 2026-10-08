"use client";
/** Электронная коммерция Яндекс Метрики: события в window.dataLayer
 *  (счётчик инициализирован с ecommerce: "dataLayer"). */
export type EcomProduct = { id: string; name: string; price: number; quantity?: number; variant?: string; category?: string; brand?: string };
type Action = "detail" | "add" | "remove" | "purchase";

export function ecom(action: Action, products: EcomProduct[], actionField?: { id: string; revenue?: number }) {
  if (typeof window === "undefined" || !products.length) return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const body: Record<string, unknown> = { products: products.map((p) => ({ brand: "Золото Камчатки", ...p })) };
  if (actionField) body.actionField = actionField;
  w.dataLayer.push({ ecommerce: { currencyCode: "RUB", [action]: body } });
}
