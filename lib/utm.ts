/** Метки перехода: ловим при первом визите и держим до конца сессии */
const KEY = "zk_src";
const FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid"] as const;

export type Source = Partial<Record<(typeof FIELDS)[number], string>> & { referrer?: string; landing?: string };

export function captureSource(): void {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Source = {};
    FIELDS.forEach((f) => { const v = q.get(f); if (v) found[f] = v.slice(0, 100); });
    const saved = sessionStorage.getItem(KEY);
    // не перезатираем метки первого захода, если их нет в текущем URL
    if (!Object.keys(found).length && saved) return;
    found.referrer = document.referrer ? new URL(document.referrer).hostname : "";
    found.landing = window.location.pathname;
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch { /* приватный режим — просто пропускаем */ }
}

export function getSource(): Source {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Source; } catch { return {}; }
}
