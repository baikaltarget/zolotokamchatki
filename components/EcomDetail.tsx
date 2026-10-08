"use client";
import { useEffect } from "react";
import { ecom } from "@/lib/ecom";
/** Просмотр карточки товара → событие detail */
export default function EcomDetail({ id, name, price, category }: { id: string; name: string; price: number | null; category: string }) {
  useEffect(() => { if (price) ecom("detail", [{ id, name, price, category }]); }, [id, name, price, category]);
  return null;
}
