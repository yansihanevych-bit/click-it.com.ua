# Click IT — сайт веб-студии

Новый сайт [click-it.com.ua](https://click-it.com.ua): React 19 + TypeScript + Vite, статическая генерация (SSG) всех страниц на трёх языках (UA / PL / EN), serverless-функция для формы. Бренд (логотип, цвета) сохранён 1:1 с текущего сайта.

## Стек

| Задача | Решение |
|---|---|
| UI | React 19, TypeScript |
| Сборка | Vite 8 |
| Роутинг | React Router 7 (library mode), языковой префикс `/:lang/` |
| i18n | i18next + react-i18next, JSON-словари, lazy-загрузка языка |
| Стили | CSS Modules + глобальные design tokens (`src/styles/tokens.css`) |
| Анимации | CSS + IntersectionObserver (reveal, marquee, hero), Motion — только для scroll-linked таймлайна (отдельный чанк) |
| SEO | Пререндер каждой страницы в HTML, `<head>` с canonical / hreflang / OG / Twitter / JSON-LD, sitemap.xml, robots.txt |
| Форма | Vercel Function `api/contact.ts` → Resend (email) и/или Telegram |
| Хостинг | Vercel (Git-интеграция) |

## Установка и разработка

```bash
npm ci
cp .env.example .env.local   # по желанию
npm run dev                  # http://localhost:5173 → редирект на /ua/
```

В dev-режиме `/api/contact` обслуживается прямо Vite-плагином (`vite.config.ts`). Если каналы доставки не настроены, заявка просто логируется в консоль и форма показывает success.

## Production build

```bash
npm run build     # client build → SSR build → пререндер 84 страниц + sitemap/robots/404
npm run preview   # http://localhost:4173
node scripts/check-seo.mjs   # аудит: title/description/H1/canonical/hreflang/JSON-LD + паритет ключей переводов
npm run typecheck
```

## Переменные окружения

| Переменная | Где | Назначение |
|---|---|---|
| `VITE_SITE_URL` | build | Боевой домен для canonical, hreflang, sitemap, OG (по умолчанию `https://click-it.com.ua`) |
| `RESEND_API_KEY` | server | Ключ [Resend](https://resend.com) для отправки заявок на email |
| `CONTACT_TO_EMAIL` | server | Куда слать заявки (можно несколько через запятую) |
| `CONTACT_FROM_EMAIL` | server | Отправитель (домен должен быть подтверждён в Resend) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | server | Дублирование заявок в Telegram |
| `ALLOWED_ORIGINS` | server | Разрешённые Origin для POST (по умолчанию домены click-it.com.ua; превью `*.vercel.app` разрешены) |

Нужен хотя бы один канал: Resend **или** Telegram. Секреты хранятся только в Vercel → Settings → Environment Variables, в Git не попадают (`.env*` в `.gitignore`).

## Деплой (Git + Vercel)

1. Создайте репозиторий на GitHub и запушьте проект:
   ```bash
   git remote add origin git@github.com:<owner>/click-it-web.git
   git push -u origin main
   ```
2. Vercel → **Add New → Project** → импортируйте репозиторий. Настройки подтянутся из `vercel.json` (Framework: Other, Build: `npm run build`, Output: `dist`).
3. Добавьте переменные окружения (см. таблицу выше) для Production и Preview.
4. Подключите домен `click-it.com.ua` (и `www` с редиректом на apex).
5. Каждый push в `main` → production, каждый PR → preview-деплой.

`vercel.json` содержит:
- 301-редиректы со всех старых URL Tilda (`/zakazat-internet-magazin/` → `/ua/services/ecommerce/` и т.д.) — сохраняет накопленный SEO-вес;
- `/` → `/ua/`, `trailingSlash: true`;
- заголовки безопасности (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) и долгий кеш для `/assets`.

## Структура проекта

```
api/contact.ts            serverless-функция формы (валидация, honeypot, rate limit, Resend/Telegram)
public/                   статика: images/projects (AVIF+WebP 640/1200), images/clients (SVG), og/, favicon
scripts/
  prerender.mjs           SSG: рендер всех маршрутов + sitemap.xml + robots.txt + 404.html
  check-seo.mjs           пост-билд аудит SEO и переводов
  generate-og.mjs         генерация OG-картинок (npm run assets:og)
  tools/                  одноразовые скрипты миграции ассетов со старого сайта
src/
  config/                 languages.ts (языки), site.ts (контакты, адрес, соцсети)
  data/                   services.ts, projects.ts, clients.ts, stats.ts, blog.ts — структура контента
  locales/{uk,pl,en}/     common / home / services / projects / pages .json — весь текст
  i18n/                   инициализация i18next и lazy-загрузка локалей
  seo/                    Seo.tsx (head-менеджер), head.ts, schema.ts (JSON-LD)
  hooks/                  useLang/useT/href, useMagnetic, useRevealObserver
  components/             Header (mega menu, mobile menu, язык), Hero, Trust, Services, About/Approach,
                          Projects, Value, Process, Stats, Faq, CTA, ContactForm, Footer, Cursor, ui/
  pages/                  Home, Services (+ ServicePage), Projects (+ ProjectPage), About, Blog,
                          Contacts, Privacy, NotFound
  styles/                 tokens.css (design tokens), global.css
```

Контент отделён от UI: компоненты берут текст только через `t('...')`, структура — из `src/data`. Это делает проект CMS-ready: достаточно заменить JSON/TS-источники на запросы к headless CMS при пререндере.

## Как добавить язык

1. `src/config/languages.ts` — добавьте запись (`code` для URL, `locale` для папки, `hreflang`, `ogLocale`).
2. Скопируйте `src/locales/en` → `src/locales/<locale>` и переведите.
3. В `scripts/prerender.mjs` добавьте hreflang в объект `HREFLANG`.
4. `npm run build && node scripts/check-seo.mjs` — скрипт покажет недостающие ключи.

## Как редактировать услуги

- Список, группа и показ в mega menu — `src/data/services.ts`.
- Тексты (название, meta, H1, лид, «Що входить», «Для кого», FAQ) — `src/locales/<locale>/services.json → items.<slug>` в каждом языке.
- Новая услуга: запись в `services.ts` + блок `items.<slug>` во всех трёх `services.json`. Страница `/{lang}/services/<slug>/`, sitemap и меню появятся автоматически.

## Как редактировать проекты

1. Положите обложку в `public/images/projects/`: `<name>-640.{avif,webp}` и `<name>-1200.{avif,webp}` (удобно через `sharp`, см. `scripts/tools/extract-assets.mjs`).
2. Добавьте запись в `src/data/projects.ts` (slug, image, gallery, industry, work, featured, ratio).
3. Тексты — `src/locales/<locale>/projects.json → items.<slug>`.
4. `npm run assets:og` — сгенерирует OG-картинку проекта (добавьте имя в `scripts/og-projects.mjs`).

`featured: true` — проект показывается на главной (рекомендуется 4).

## Цифры в блоке статистики

`src/data/stats.ts` — только проверяемые факты с текущего сайта (6+ лет, 15 брендов в кейсах/логотипах, 14 услуг, поддержка 24/7). Замените/добавьте реальные значения (например, общее число проектов), когда они будут подтверждены.

## Что нужно заполнить (TODO)

- [ ] Ссылки на соцсети — `src/config/site.ts → socials` (футер покажет только заполненные).
- [ ] Перенос статей блога: сейчас страница блога показывает список статей со старого сайта без тел; старые URL временно (302) ведут на `/ua/blog/`.
- [ ] Подтвердить, какие работы выполнялись для MCORP, Whitewood, Crazybox, КРАТОС, Qoopiqoopi, Пікнік-меню (сейчас указано нейтрально «Сайт»).
- [ ] Юридическое название компании для schema.org (`SITE.legalName`) и текст политики конфиденциальности — проверить юристом.
- [ ] Логотипы клиентов в PNG со старого сайта были пустыми заглушками Tilda — при желании добавьте их в `src/data/clients.ts`.

## Производительность и доступность

Локально (vite preview, без сжатия): Lighthouse mobile 92–95 Performance, 100 Accessibility / Best Practices / SEO; desktop — 100. CLS ≈ 0. Главный JS ~91 КБ gzip, Motion вынесен в отдельный чанк.

- Все страницы отдаются готовым HTML (контент виден без JS); анимации появления активируются только при наличии JS.
- `prefers-reduced-motion` отключает анимации, marquee и кастомный курсор.
- Кастомный курсор только на устройствах с `pointer: fine`.
- Шрифт Manrope Variable self-hosted (латиница, latin-ext для польского, кириллица), без запросов к Google Fonts.
