"use client";
import { useEffect, useState } from "react";
import type { Product } from "./site";

/** Корзина в localStorage. Ничего не отправляет на сервер до оформления заказа. */
export type CartItem = { key: string; slug: string; name: string; path: string; variant: string; price: number; qty: number; byWeight?: boolean };
const KEY = "zk_cart";
const EVT = "zk-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") as CartItem[]; } catch { return []; }
}
function write(items: CartItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* приватный режим */ }
  window.dispatchEvent(new Event(EVT));
}
export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = readCart();
  const ex = items.find((i) => i.key === item.key);
  if (ex) ex.qty += qty; else items.push({ ...item, qty });
  write(items);
}
export function setQty(key: string, qty: number) {
  write(readCart().map((i) => (i.key === key ? { ...i, qty } : i)).filter((i) => i.qty > 0));
}
export function clearCart() { write([]); }
export const cartTotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.qty, 0);

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const upd = () => setItems(readCart());
    upd();
    window.addEventListener(EVT, upd);
    window.addEventListener("storage", upd);
    return () => { window.removeEventListener(EVT, upd); window.removeEventListener("storage", upd); };
  }, []);
  return items;
}

/** Варианты покупки товара: фасовки икры, вес для весовой рыбы, штуки для упаковок */
export function variantsOf(p: Product): { label: string; price: number; byWeight?: boolean }[] {
  if (!p.price) return [];
  const packs = (p.tiers ?? []).filter(([l]) => !/кг/.test(l));
  if (packs.length) return packs.map(([l, v]) => ({ label: l, price: v }));
  if (p.unit === "кг") {
    if (p.tiers?.length) return [{ label: "1 кг", price: p.price, byWeight: true }]; // масло: брусок от 1 кг
    return [{ label: "0,5 кг", price: Math.round(p.price / 2), byWeight: true }, { label: "1 кг", price: p.price, byWeight: true }];
  }
  return [{ label: p.unit, price: p.price }];
}
