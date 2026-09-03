# Золото Камчатки — сайт магазина икры и рыбы (Иркутск)

Next.js 15 + Tailwind, статика. 64 страницы, sitemap и robots генерируются сами.
Дизайн — в `app/globals.css`, `tailwind.config.ts`, `components/`. Контент — только в `content/site.json` и `content/blog/*.md`. Код для правки цен и телефона трогать не нужно.

## 1. Как выложить (10 минут)

1. github.com → **New repository** → имя любое, Public, Create.
2. На странице репозитория: **uploading an existing file** → перетащить **всё содержимое** этой папки (не саму папку: в корне репозитория должен лежать `package.json`) → Commit.
3. vercel.com → **Add New → Project** → Import этого репозитория → ничего не менять → **Deploy**. Через 2–3 минуты сайт на `https://<имя>.vercel.app`.
4. В `content/site.json` проверить `brand.siteUrl` — уже стоит https://золото-камчатки.рф → Commit. Vercel пересоберёт сам.

Домен подключать только после проверки сайта на адресе vercel.app: Vercel → Settings → Domains.

## 2. Заявки в Telegram

Vercel → Settings → Environment Variables:
- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
- `TELEGRAM_CHAT_ID` — свой id (узнать у @userinfobot); бота нужно один раз запустить (Start)

Затем Deployments → Redeploy. Пока ключей нет, форма честно пишет «не настроено» и показывает телефон; заявки видны в логах Vercel (Deployments → Functions → /api/lead).

## 3. Где что править

| Что | Где |
|---|---|
| Телефон, адрес, часы, ИНН | `content/site.json` → `brand` |
| Цены и товары | `content/site.json` → `products` (цена `null` = «по телефону») |
| Районы и условия доставки | `content/site.json` → `delivery.zones` |
| Сборы, FAQ, отзывы | `content/site.json` → `sbory`, `faq`, `reviews` |
| Статьи | `content/blog/*.md` (заголовок в шапке файла) |
| Фото | `public/img/` — загрузка: `github.com/<user>/<repo>/upload/main/public/img` |
| Красные рамки «нужны данные» | `content/site.json` → `todo.showTodoFrames: false` — выключить, когда всё заполнено |

Правка на GitHub: открыть файл → карандаш → изменить → Commit changes. Через 2 минуты сайт обновится. Если не видно — Ctrl+Shift+R.

### Добавить товар
Скопировать любой объект в `products`, поменять `slug` (латиница, уникальный), `name`, `price`, `unit`, `category` (`ikra` / `slabosolenaya` / `kholodnoe-kopchenie` / `zamorozka`), `image`. Страница, карточка на витрине и sitemap появятся сами.

### Добавить район доставки
Скопировать объект в `delivery.zones`: `slug`, `name`, `free` (true/false), `minOrder`, `km`, `landmarks`, `text`. Гео-страница `/dostavka/<slug>/` создастся сама.

### Добавить статью
Файл `content/blog/<slug>.md` с шапкой как у соседних (`title`, `description`, `date`, `image`) и текстом в Markdown.

## 4. Фото
Живые фото с телефона работают лучше стока. Перед загрузкой: squoosh.app → WebP → ширина 1600 px. Сейчас использованы фото из Telegram-канала; заменить на свежие — витрина без розовой подсветки, икра крупно, магазин снаружи, люди.

## 5. Что заполнить (обведено красной рамкой на сайте)
- Цена икры горбуши (`products` → `ikra-gorbushi`)
- Цены кальмара и тунца с/с, когда определитесь
- Сертификаты/декларации на икру — фото документов
- Обновить телефон на +7 950 121-90-66 в Яндекс.Бизнесе и 2ГИС — чтобы совпадал с сайтом до символа

## 6. После публикации (эффект больше любого кода)
1. Яндекс.Вебмастер → добавить сайт → указать `/sitemap.xml`
2. Google Search Console → то же
3. Яндекс.Метрика уже стоит (счётчик 112026044) вместе с целями. В интерфейсе Метрики создайте цели типа «JavaScript-событие» с идентификаторами: phone_click, tg_click, max_click, lead_submit, route_click, opt_lead
4. Яндекс.Бизнес и 2ГИС: телефон, адрес и часы — **до символа как на сайте** (ежедневно 09:00–20:00), ссылка на сайт, просить довольных клиентов об отзывах
5. В Telegram-канале в описании — ссылка на сайт

## Ожидания
Индексация — 2–4 недели. Запросы вида «икра нерки иркутск», «доставка икры шелехов» — топ-10 через 2–4 месяца. «Красная икра иркутск» — борьба на месяцы с маркетплейсами и старыми доменами, топ-1 не обещать.

## Локальный запуск
```
npm install
npm run dev     # http://localhost:3000
npm run build   # проверка сборки
```
