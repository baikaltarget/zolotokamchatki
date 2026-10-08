"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const n = useCart().reduce((s, i) => s + i.qty, 0);
  return (
    <Link href="/korzina/" className="relative inline-flex items-center justify-center w-10 h-10 rounded-tag border border-ink/15 hover:border-ink" aria-label={`Корзина${n ? `, товаров: ${n}` : ""}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>
      {n > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-caviar text-white text-[11px] font-semibold flex items-center justify-center">{n}</span>}
    </Link>
  );
}
