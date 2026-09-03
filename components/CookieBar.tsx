"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/** Плашка согласия на cookie и Метрику. Согласие хранится в localStorage. */
export default function CookieBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem("cookie_ok")) setShow(true); } catch { setShow(true); }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 z-50 p-3 sm:p-4 bottom-[68px] lg:bottom-0">
      <div className="wrap bg-ink text-ivory/90 border border-gold/40 rounded-tag shadow-2xl px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-sm leading-relaxed">
          Сайт использует файлы cookie и сервисы статистики. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <Link href="/politika" className="text-gold2 underline">политикой обработки персональных данных</Link>.
        </p>
        <button
          onClick={() => { try { localStorage.setItem("cookie_ok", "1"); } catch {} setShow(false); }}
          className="btn btn-caviar shrink-0 !py-2.5"
        >Принять</button>
      </div>
    </div>
  );
}
