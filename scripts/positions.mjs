// Снятие позиций: Google Search Console + Яндекс.Вебмастер + Метрика (поисковый трафик) за DAYS дней → reports/positions-<дата>.json (сырые данные)
// и reports/positions-<дата>.md (сводка, сравнение с прошлым снятием). Без секрета соответствующая часть пропускается.
import fs from "node:fs";
import crypto from "node:crypto";

const UNICODE = "золото-камчатки.рф";
const PUNY = "xn----8sbazijcdmpba5cg7e.xn--p1ai";
const SITE = `https://${PUNY}`;
const METRIKA_ID = 112026044;
const PROXY = "https://tourfishing.ru/api/yandex-report.php"; // российский IP, тот же аккаунт Яндекса
const DAYS = Math.max(1, Math.min(90, parseInt(process.env.DAYS || "28", 10) || 28));
const FILTER = (process.env.FILTER || "").trim().toLowerCase();
const now = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const end = new Date(now); end.setUTCDate(end.getUTCDate() - 2); // данные отстают на 2–3 дня
const start = new Date(end); start.setUTCDate(start.getUTCDate() - DAYS + 1);
const log = (s) => console.log(s);
const warn = (t, s) => console.log(`::warning title=${t}::${s}`);
const short = (u) => decodeURI(u).replace(/^https?:\/\/[^/]+/, "") || "/";
const match = (s) => !FILTER || s.toLowerCase().includes(FILTER) || decodeURI(s).toLowerCase().includes(FILTER);

/* ---------- Google Search Console ---------- */
async function gscToken(sa) {
  const t = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: t, exp: t + 3600 })}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), sa.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${unsigned}.${sig}` });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Google OAuth: ${JSON.stringify(j).slice(0, 300)}`);
  return j.access_token;
}
async function gsc() {
  const raw = process.env.GSC_SERVICE_ACCOUNT;
  if (!raw) { log("GSC: нет секрета GSC_SERVICE_ACCOUNT — пропуск"); return null; }
  const sa = JSON.parse(raw);
  const token = await gscToken(sa);
  const api = async (url, body) => {
    const r = await fetch(url, { method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json();
    if (j.error) throw new Error(`GSC: ${j.error.message}`);
    return j;
  };
  const sites = (await api("https://www.googleapis.com/webmasters/v3/sites")).siteEntry || [];
  const site = sites.find((s) => s.siteUrl.includes(PUNY) || s.siteUrl.includes(UNICODE));
  if (!site) throw new Error(`сервисному аккаунту ${sa.client_email} не выдан доступ к ${UNICODE} (видит: ${sites.map((s) => s.siteUrl).join(", ") || "ничего"})`);
  const q = async (dimensions) => (await api(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`, { startDate: iso(start), endDate: iso(end), dimensions, rowLimit: 5000 })).rows || [];
  const queries = (await q(["query"])).map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
  const pages = (await q(["page"])).map((r) => ({ page: short(r.keys[0]), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
  const pairs = (await q(["query", "page"])).map((r) => ({ query: r.keys[0], page: short(r.keys[1]), clicks: r.clicks, impressions: r.impressions, position: r.position }));
  return { site: site.siteUrl, queries, pages, pairs };
}

/* ---------- Яндекс.Вебмастер ---------- */
async function yandex() {
  const token = (process.env.YANDEX_WEBMASTER_TOKEN || "").trim(); // при вставке в секрет часто прилипает перенос строки
  if (!token) { log("Вебмастер: нет секрета YANDEX_WEBMASTER_TOKEN — пропуск"); return null; }
  const isOurs = (h) => (h.unicode_host_url || "").includes(UNICODE) || (h.host_id || "").includes(PUNY) || (h.ascii_host_url || "").includes(PUNY);
  const direct = async () => {
    const api = async (p) => {
      const r = await fetch(`https://api.webmaster.yandex.net/v4${p}`, { headers: { Authorization: `OAuth ${token}` }, signal: AbortSignal.timeout(15000) });
      const j = await r.json();
      if (j.error_code) throw new Error(`${p}: ${j.error_message}`);
      return j;
    };
    const { user_id } = await api("/user");
    const host = ((await api(`/user/${user_id}/hosts`)).hosts || []).find(isOurs);
    if (!host) throw new Error(`среди сайтов аккаунта нет ${UNICODE}`);
    const ind = "query_indicator=TOTAL_SHOWS&query_indicator=TOTAL_CLICKS&query_indicator=AVG_SHOW_POSITION";
    const pop = await api(`/user/${user_id}/hosts/${host.host_id}/search-queries/popular?order_by=TOTAL_SHOWS&${ind}&limit=500&date_from=${iso(start)}&date_to=${iso(end)}`);
    let summary = null; try { summary = await api(`/user/${user_id}/hosts/${host.host_id}/summary`); } catch {}
    return { host: host.unicode_host_url, queries: (pop.queries || []).map((x) => ({ query: x.query_text, impressions: x.indicators?.TOTAL_SHOWS || 0, clicks: x.indicators?.TOTAL_CLICKS || 0, position: x.indicators?.AVG_SHOW_POSITION || 0 })), summary };
  };
  const viaProxy = async () => {
    const key = crypto.createHash("sha256").update(token).digest("hex");
    const r = await fetch(`${PROXY}?key=${key}&host=${encodeURIComponent(UNICODE)}&from=${iso(start)}&to=${iso(end)}`, { signal: AbortSignal.timeout(40000) });
    const j = await r.json();
    if (j.error) throw new Error(`через прокси: ${j.error}`);
    if (!String(j.host || "").includes(UNICODE) && !String(j.host || "").includes(PUNY)) throw new Error(`прокси вернул другой сайт (${j.host}) — обновите yandex-report.php на tourfishing.ru`);
    return { host: j.host, queries: j.queries || [], summary: j.summary };
  };
  try { return await direct(); } catch (e) {
    warn("Вебмастер напрямую", e.message);
    try { return await viaProxy(); } catch (e2) {
      const fp = crypto.createHash("sha256").update(token).digest("hex").slice(0, 8);
      throw new Error(`${e2.message} (напрямую: ${e.message}; токен ${token.length} симв., отпечаток ${fp})`);
    }
  }
}

/* ---------- Яндекс.Метрика: поисковый трафик ---------- */
async function metrika() {
  const token = (process.env.YANDEX_WEBMASTER_TOKEN || "").trim(); // тот же OAuth-токен, у приложения есть право «Метрика: чтение»
  if (!token) { log("Метрика: нет токена — пропуск"); return null; }
  const api = async (path, params = {}) => {
    const all = path.startsWith("/stat") ? { ids: String(METRIKA_ID), date1: iso(start), date2: iso(end), accuracy: "full", ...params } : params;
    const qs = new URLSearchParams(Object.entries(all).filter(([, v]) => v != null));
    const r = await fetch(`https://api-metrika.yandex.net${path}?${qs}`, { headers: { Authorization: `OAuth ${token}` }, signal: AbortSignal.timeout(20000) });
    const j = await r.json().catch(() => ({ message: `HTTP ${r.status}` }));
    if (!r.ok || j.errors) throw new Error(`${path}: ${j.message || JSON.stringify(j.errors).slice(0, 200)}`);
    return j;
  };
  const organic = "ym:s:lastTrafficSource=='organic'";
  const rows = (j, names) => (j.data || []).map((d) => Object.fromEntries([...d.dimensions.map((x, i) => [names[i], (names[i] === "source" ? x.id : x.name) ?? x.id ?? null]), ...d.metrics.map((m, i) => [names[d.dimensions.length + i], m])]));
  const sources = rows(await api("/stat/v1/data", { metrics: "ym:s:visits,ym:s:users,ym:s:bounceRate", dimensions: "ym:s:lastTrafficSource", sort: "-ym:s:visits" }), ["source", "visits", "users", "bounce"]);
  const engines = rows(await api("/stat/v1/data", { metrics: "ym:s:visits,ym:s:bounceRate,ym:s:avgVisitDurationSeconds", dimensions: "ym:s:lastSearchEngineRoot", filters: organic, sort: "-ym:s:visits" }), ["engine", "visits", "bounce", "duration"]);
  const weeks = rows(await api("/stat/v1/data", { metrics: "ym:s:visits", dimensions: "ym:s:startOfWeek,ym:s:lastSearchEngineRoot", filters: organic, sort: "ym:s:startOfWeek", limit: "200" }), ["week", "engine", "visits"]);
  const phrases = rows(await api("/stat/v1/data", { metrics: "ym:s:visits,ym:s:bounceRate", dimensions: "ym:s:lastSearchPhrase,ym:s:lastSearchEngineRoot", filters: organic, sort: "-ym:s:visits", limit: "300" }), ["phrase", "engine", "visits", "bounce"]);
  const landings = rows(await api("/stat/v1/data", { metrics: "ym:s:visits,ym:s:bounceRate", dimensions: "ym:s:startURLPath", filters: organic, sort: "-ym:s:visits", limit: "100" }), ["page", "visits", "bounce"]);
  let goals = [];
  try {
    const g = ((await api(`/management/v1/counter/${METRIKA_ID}/goals`, {})).goals || []).slice(0, 10);
    if (g.length) {
      const all = await api("/stat/v1/data", { metrics: g.map((x) => `ym:s:goal${x.id}reaches`).join(","), dimensions: "ym:s:lastTrafficSource" });
      goals = g.map((x, i) => ({ name: x.name, total: (all.data || []).reduce((s, d) => s + d.metrics[i], 0), organic: (all.data || []).filter((d) => d.dimensions[0].id === "organic").reduce((s, d) => s + d.metrics[i], 0) }));
    }
  } catch (e) { warn("Метрика: цели", e.message); }
  return { counter: METRIKA_ID, sources, engines, weeks, phrases, landings, goals };
}

/* ---------- прошлое снятие ---------- */
function previous() {
  if (!fs.existsSync("reports")) return null;
  const files = fs.readdirSync("reports").filter((f) => /^positions-\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== `positions-${iso(now)}.json`).sort();
  return files.length ? JSON.parse(fs.readFileSync(`reports/${files.at(-1)}`, "utf8")) : null;
}

/* ---------- отчёт ---------- */
const data = { date: iso(now), from: iso(start), to: iso(end), days: DAYS, filter: FILTER || null, google: null, yandex: null, metrika: null, errors: {} };
try { data.google = await gsc(); } catch (e) { data.errors.google = e.message; warn("GSC", e.message); }
try { data.yandex = await yandex(); } catch (e) { data.errors.yandex = e.message; warn("Вебмастер", e.message); }
try { data.metrika = await metrika(); } catch (e) { data.errors.metrika = e.message; warn("Метрика", e.message); }
const prev = previous();

const md = [`# Позиции ${UNICODE} — ${iso(now)}`, ``, `Период: ${iso(start)} – ${iso(end)} (${DAYS} дн.)${FILTER ? `, фильтр «${FILTER}»` : ""}. Прошлое снятие: ${prev ? prev.date : "нет"}.`];
const fmt = (x, d = 1) => (x == null ? "—" : Number(x).toFixed(d));
const delta = (cur, old) => (old == null ? "новый" : old - cur >= 0.5 ? `▲ ${fmt(old - cur)}` : cur - old >= 0.5 ? `▼ ${fmt(cur - old)}` : "=");
const table = (rows, oldMap, head = "Запрос") => rows.length ? [`| ${head} | Показы | Клики | Позиция | Было |`, `|---|---|---|---|---|`, ...rows.map((r) => `| ${r.query ?? r.page} | ${r.impressions} | ${r.clicks} | ${fmt(r.position)} | ${delta(r.position, oldMap?.get(r.query ?? r.page))} |`)].join("\n") : "— нет данных.";
const mapOf = (arr, k = "query") => new Map((arr || []).map((r) => [r[k], r.position]));
const section = (name, src, oldSrc) => {
  md.push(``, `## ${name}`, ``);
  if (!src) { md.push(data.errors[name === "Яндекс" ? "yandex" : "google"] ? `Ошибка: ${data.errors[name === "Яндекс" ? "yandex" : "google"]}` : "Не подключено."); return; }
  const q = src.queries.filter((r) => match(r.query));
  const imp = q.reduce((s, r) => s + r.impressions, 0), cl = q.reduce((s, r) => s + r.clicks, 0);
  md.push(`Показов: **${imp}**, кликов: **${cl}**, CTR: ${imp ? ((cl / imp) * 100).toFixed(1) : 0} %, запросов: ${q.length}.`);
  if (oldSrc) { const oi = oldSrc.queries.reduce((s, r) => s + r.impressions, 0), oc = oldSrc.queries.reduce((s, r) => s + r.clicks, 0); md.push(`Прошлое снятие: ${oi} показов, ${oc} кликов.`); }
  if (src.summary) md.push(`Сводка Вебмастера: ${JSON.stringify(src.summary).slice(0, 400)}`);
  const om = mapOf(oldSrc?.queries);
  md.push(``, `### Топ-40 по показам`, ``, table([...q].sort((a, b) => b.impressions - a.impressions).slice(0, 40), om));
  md.push(``, `### Позиции 5–15 (≥ 5 показов) — ближе всего к топу`, ``, table(q.filter((r) => r.position >= 5 && r.position <= 15 && r.impressions >= 5).sort((a, b) => b.impressions - a.impressions).slice(0, 30), om));
  md.push(``, `### CTR < 1 % (≥ 20 показов) — переписать title/description`, ``, table(q.filter((r) => r.impressions >= 20 && r.clicks / r.impressions < 0.01).sort((a, b) => b.impressions - a.impressions).slice(0, 20), om));
  if (src.pages) md.push(``, `### Страницы`, ``, table(src.pages.filter((r) => match(r.page)).sort((a, b) => b.impressions - a.impressions).slice(0, 30), mapOf(oldSrc?.pages, "page"), "Страница"));
};
section("Google", data.google, prev?.google);
section("Яндекс", data.yandex, prev?.yandex);

/* Метрика */
md.push(``, `## Метрика (счётчик ${METRIKA_ID})`, ``);
if (!data.metrika) md.push(data.errors.metrika ? `Ошибка: ${data.errors.metrika}` : "Не подключено.");
else {
  const M = data.metrika, P = prev?.metrika;
  const names = { organic: "Поиск", direct: "Прямые", referral: "Ссылки", social: "Соцсети", ad: "Реклама", internal: "Внутренние", messenger: "Мессенджеры", recommend: "Рекомендации" };
  const pct = (x) => `${Math.round(x)} %`;
  const was = (arr, k, v, f = "visits") => { const o = arr?.find((r) => r[k] === v); return o ? o[f] : "—"; };
  md.push(`### Источники`, ``, `| Источник | Визиты | Было | Отказы |`, `|---|---|---|---|`, ...M.sources.map((r) => `| ${names[r.source] || r.source} | ${r.visits} | ${was(P?.sources, "source", r.source)} | ${pct(r.bounce)} |`));
  md.push(``, `### Поисковые системы`, ``, `| Система | Визиты | Было | Отказы | Время, с |`, `|---|---|---|---|---|`, ...M.engines.map((r) => `| ${r.engine} | ${r.visits} | ${was(P?.engines, "engine", r.engine)} | ${pct(r.bounce)} | ${Math.round(r.duration)} |`));
  const wk = [...new Set(M.weeks.map((r) => r.week))], en = [...new Set(M.weeks.map((r) => r.engine))];
  if (wk.length) md.push(``, `### Поиск по неделям`, ``, `| Неделя с | ${en.join(" | ")} |`, `|${"---|".repeat(en.length + 1)}`, ...wk.map((w) => `| ${w} | ${en.map((e) => M.weeks.find((r) => r.week === w && r.engine === e)?.visits || 0).join(" | ")} |`));
  const ph = M.phrases.filter((r) => r.phrase && match(r.phrase));
  md.push(``, `### Поисковые фразы (топ-50)`, ``, ph.length ? [`| Фраза | Система | Визиты | Отказы |`, `|---|---|---|---|`, ...ph.slice(0, 50).map((r) => `| ${r.phrase} | ${r.engine} | ${r.visits} | ${pct(r.bounce)} |`)].join("\n") : "— фразы скрыты поисковиками или нет данных.");
  md.push(``, `### Страницы входа из поиска`, ``, `| Страница | Визиты | Было | Отказы |`, `|---|---|---|---|`, ...M.landings.filter((r) => match(r.page || "")).slice(0, 30).map((r) => `| ${r.page} | ${r.visits} | ${was(P?.landings, "page", r.page)} | ${pct(r.bounce)} |`));
  if (M.goals.length) md.push(``, `### Цели`, ``, `| Цель | Всего | Из поиска |`, `|---|---|---|`, ...M.goals.map((g) => `| ${g.name} | ${g.total} | ${g.organic} |`));
}

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync(`reports/positions-${iso(now)}.json`, JSON.stringify(data, null, 1));
fs.writeFileSync(`reports/positions-${iso(now)}.md`, md.join("\n") + "\n");
log(md.join("\n"));
if (!data.google && !data.yandex && !data.metrika) { console.log("::error::Ни Google, ни Яндекс, ни Метрика не отдали данные — см. предупреждения выше"); process.exitCode = 1; }
