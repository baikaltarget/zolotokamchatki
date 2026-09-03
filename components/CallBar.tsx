import { BRAND } from "@/lib/site";

/** Компактная закреплённая панель связи на мобильном */
export default function CallBar() {
  const tg = (BRAND as unknown as { telegramPersonal?: string }).telegramPersonal || "https://t.me/Svetlana_irk";
  const max = BRAND.max;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-ink/95 backdrop-blur border-t border-gold/30 px-2 py-1.5 flex gap-2 items-stretch pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <a href={`tel:${BRAND.phoneRaw}`} className="flex-1 flex items-center justify-center gap-2 rounded-tag bg-caviar text-white font-semibold text-sm py-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z"/></svg>
        Позвонить
      </a>
      <a href={tg} rel="noopener" aria-label="Написать в Telegram" className="w-12 flex items-center justify-center rounded-tag border border-ivory/40 text-ivory">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.8 19c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.9L18 5.9c.4-.3-.1-.5-.6-.2L7.3 12.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 2.5c.9-.3 1.6.2 1.3 1.8Z"/></svg>
      </a>
      <a href={max} rel="noopener" aria-label="Написать в MAX" className="w-12 flex items-center justify-center rounded-tag border border-ivory/40 text-ivory font-semibold text-xs">MAX</a>
    </div>
  );
}
