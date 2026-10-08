import { NextResponse } from "next/server";
import { products, fmt } from "@/lib/site";

/** Заказ из корзины → Telegram (те же TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID, что и для заявок).
 *  Цены пересчитываем по site.json: клиенту не доверяем. */
const clean = (v: unknown, max = 300) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  list.push(now); hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return list.length > 5;
}
type InItem = { slug?: string; variant?: string; qty?: number };

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (clean(b.trap)) return NextResponse.json({ ok: true, id: "ZK-0" });
  const name = clean(b.name, 80), phone = clean(b.phone, 30), address = clean(b.address, 200), comment = clean(b.comment, 500);
  const way = b.way === "delivery" ? "delivery" : "pickup";
  if (!/\d{10,}/.test(phone.replace(/\D/g, ""))) return NextResponse.json({ ok: false, error: "phone" }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  const lines: string[] = []; let total = 0;
  for (const it of (Array.isArray(b.items) ? (b.items as InItem[]) : []).slice(0, 40)) {
    const p = products.find((x) => x.slug === it.slug); const qty = Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 1)));
    if (!p || !p.price) continue;
    const label = clean(it.variant, 30);
    const tier = (p.tiers ?? []).find(([l]) => l === label);
    const price = tier && !/кг/.test(tier[0]) ? tier[1] : label === "0,5 кг" ? Math.round(p.price / 2) : p.price;
    total += price * qty;
    lines.push(`• ${p.seoName ?? p.name} — ${label} × ${qty} = ${fmt(price * qty)} ₽`);
  }
  if (!lines.length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  const id = "ZK-" + Date.now().toString(36).toUpperCase().slice(-6);

  const msg = [
    `🛒 Заказ ${id} с сайта`,
    ...lines,
    `Итого: ${fmt(total)} ₽ (весовые — по факту взвешивания)`,
    way === "delivery" ? `Доставка: ${address || "адрес не указан"}` : "Самовывоз: ТЦ «Кедр», Волжская, 3",
    `Имя: ${name || "—"}`,
    `Телефон: ${phone}`,
    comment ? `Комментарий: ${comment}` : "",
    "Оплата: наличными. Подтвердить заказ звонком.",
  ].filter(Boolean).join("\n");

  console.log("[order]", JSON.stringify({ id, name, phone, way, address, total, lines }));
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return NextResponse.json({ ok: false, fallback: true, id });
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: msg, disable_web_page_preview: true }),
  });
  return NextResponse.json({ ok: r.ok, fallback: !r.ok, id });
}
