"use client";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/site";
import { captureSource, getSource } from "@/lib/utm";
import { formatPhone, isPhoneValid } from "@/lib/phone";

export default function LeadForm({ product, compact = false }: { product?: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fallback" | "err">("idle");
  const [form, setForm] = useState({ name: "", phone: "", text: product ? `Хочу заказать: ${product}` : "" });
  const [touched, setTouched] = useState(false);
  const [trap, setTrap] = useState(""); // honeypot: люди это поле не видят
  const openedAt = useRef(Date.now());
  useEffect(() => { captureSource(); }, []);

  async function submit() {
    if (!isPhoneValid(form.phone)) { setTouched(true); return; }
    // бот заполнил скрытое поле или отправил быстрее двух секунд — молча делаем вид, что всё ушло
    if (trap || Date.now() - openedAt.current < 2000) { setState("ok"); return; }
    setState("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, page: typeof window !== "undefined" ? window.location.pathname : "", src: getSource(), trap, elapsed: Date.now() - openedAt.current }) });
      const j = await r.json();
      setState(j.ok ? "ok" : j.fallback ? "fallback" : "err");
      try { (window as unknown as { ym?: (id: number, a: string, g: string) => void }).ym?.(112026044, "reachGoal", "lead_submit"); } catch {}
    } catch { setState("err"); }
  }
  const tgText = encodeURIComponent(`Здравствуйте! ${form.text || "Хочу сделать заказ"}. Меня зовут ${form.name || "—"}, телефон ${form.phone}`);

  if (state === "ok") return <div className="bg-white border border-ivory2 rounded-tag p-6"><p className="font-display uppercase text-xl">Заявка отправлена</p><p className="text-stone mt-1">{BRAND.manager} перезвонит в рабочее время: {BRAND.hours.toLowerCase()}.</p></div>;

  return (
    <div className="bg-white border border-ivory2 rounded-tag p-5 sm:p-6">
      {!compact && <p className="font-display uppercase text-xl">Заказать звонок</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 items-start">
        <input className="border border-ivory2 rounded-tag px-3 py-2.5 h-[46px] self-start" placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Имя" />
        <div className="relative">
          <input
            className={`w-full border rounded-tag px-3 py-2.5 h-[46px] ${touched && !isPhoneValid(form.phone) ? "border-nerka" : "border-ivory2"}`}
            placeholder="+7 950 121-90-66" type="tel" inputMode="tel" autoComplete="tel" required aria-label="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            onBlur={() => setTouched(true)}
          />
          {touched && !isPhoneValid(form.phone) && <p className="absolute mt-1 text-xs text-nerka">Проверьте номер — не хватает цифр</p>}
        </div>
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} className="hp-field" />
        <textarea className="border border-ivory2 rounded-tag px-3 py-2.5 sm:col-span-2" rows={2} placeholder="Что нужно и куда доставить" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} aria-label="Комментарий" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <button onClick={submit} disabled={state === "sending"} className="btn btn-caviar">{state === "sending" ? "Отправляем…" : "Отправить"}</button>
        <a className="btn btn-ghost" href={`${(BRAND as unknown as { telegramPersonal: string }).telegramPersonal}?text=${tgText}`} rel="noopener">Написать в Telegram</a>
        <span className="text-xs text-stone">Нажимая, вы соглашаетесь с <a href="/politika" className="underline">политикой</a>.</span>
      </div>
      {state === "fallback" && <p className="mt-3 text-sm text-nerka">Отправка заявок с сайта ещё не настроена. Позвоните: <a href={`tel:${BRAND.phoneRaw}`} className="font-semibold">{BRAND.phone}</a> — или нажмите «Написать в Telegram».</p>}
      {state === "err" && <p className="mt-3 text-sm text-nerka">Не получилось отправить. Позвоните: <a href={`tel:${BRAND.phoneRaw}`} className="font-semibold">{BRAND.phone}</a>.</p>}
    </div>
  );
}
