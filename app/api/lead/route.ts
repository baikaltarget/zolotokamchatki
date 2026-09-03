import { NextResponse } from "next/server";

/**
 * Заявка с сайта → Telegram. Нужны переменные окружения в Vercel:
 * TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 * TELEGRAM_CHAT_ID  — id чата (для группы отрицательный), бота предварительно запустить
 * Пока их нет — заявка пишется в лог Vercel и форма показывает телефон.
 */

type Src = Record<string, string | undefined>;
const clean = (v: unknown, max = 500) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);

// простой лимит: не больше 5 заявок с одного IP за 10 минут
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return list.length > 5;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(body.name, 80), phone = clean(body.phone, 30), text = clean(body.text, 800), page = clean(body.page, 120);
  const src = (body.src || {}) as Src;
  const elapsed = Number(body.elapsed) || 0;

  // honeypot и слишком быстрая отправка — отвечаем «ок», чтобы бот не подбирал обход
  if (clean(body.trap) || (elapsed > 0 && elapsed < 2000)) {
    console.log("[lead:spam]", JSON.stringify({ phone, trap: !!body.trap, elapsed }));
    return NextResponse.json({ ok: true });
  }
  if (!phone || !/\d{6,}/.test(phone.replace(/\D/g, ""))) {
    return NextResponse.json({ ok: false, error: "no phone" }, { status: 400 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid"]
    .filter((k) => src[k]).map((k) => `${k}=${clean(src[k], 100)}`).join(" · ");
  const from = utm || (src.referrer ? `переход с ${clean(src.referrer, 60)}` : "прямой заход или поиск");

  const msg = [
    "🐟 Заявка с сайта",
    `Имя: ${name || "—"}`,
    `Телефон: ${phone}`,
    text ? `Текст: ${text}` : "",
    `Страница: ${page}`,
    src.landing && src.landing !== page ? `Вошёл на: ${clean(src.landing, 120)}` : "",
    `Источник: ${from}`,
  ].filter(Boolean).join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  console.log("[lead]", JSON.stringify({ name, phone, text, page, src }));
  if (!token || !chat) return NextResponse.json({ ok: false, fallback: true });

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: msg, disable_web_page_preview: true }),
  });
  return NextResponse.json({ ok: r.ok, fallback: !r.ok });
}
