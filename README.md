# ППУ Альянс — сайт на Astro + Keystatic

Маркетинговый сайт «ППУ Альянс» (утепление пенополиуретаном и гидроизоляция в Москве
и области). Перенесён 1‑в‑1 с исходных статических HTML (`new/`) на **Astro 6** с
управлением контентом через **Keystatic CMS**. Деплой — **Vercel** (SSR-режим для админки
Keystatic, контентные страницы пререндерятся в статику).

## Стек

- **Astro 6** (`output: 'server'`, адаптер `@astrojs/vercel`)
- **Keystatic** (`@keystatic/core`, `@keystatic/astro`) + **React** (требуется Keystatic)
- Стили — «родной» CSS, перенесённый из исходных HTML (без Tailwind), 1‑в‑1

## Команды

```bash
npm install
npm run dev       # http://localhost:4321  (сайт + /keystatic — админка)
npm run build     # сборка под Vercel (.vercel/output)
npm run preview
```

## Структура

```
src/
  layouts/Layout.astro        # <head>, общий chrome (Topbar/Header/Footer/мобильное меню)
  components/
    Topbar.astro              # верхняя полоса + выпадающие меню
    Header.astro              # лого + мега-меню услуг (сложная навигация — в коде)
    Footer.astro              # подвал (контакты из singleton `site`)
  pages/
    index.astro               # Главная        (prerender)
    price.astro               # /price          (prerender)
    promotions.astro          # /promotions     (prerender)
    service.astro             # /service        (prerender)
    keystatic/ + api/keystatic/  # админка Keystatic — инжектится интеграцией, SSR
  lib/keystatic.ts            # reader контента
  styles/                     # global.css (база+chrome+главная) + price/promotions/service.css
content/                      # контент Keystatic (yaml, в git)
  site.yaml                   # контакты, регион, адрес, мин. заказ
  pages/*.yaml                # hero + SEO каждой страницы (singletons)
  services/, advantages/, reviews/, faq/, promotions/   # коллекции
keystatic.config.ts           # схема CMS
new/                          # ИСХОДНЫЕ HTML (референс), не участвуют в сборке
```

## Что управляется через Keystatic

- **Singleton `site`** — телефон, email, регион, адрес, минимальный заказ (выводятся в подвале).
- **Singletons страниц** (`homePage`, `pricePage`, `promotionsPage`, `servicePage`) —
  SEO `title`/`description`, hero: кикер, заголовок, лид (лид рендерится через `set:html`,
  поэтому в нём можно использовать `<b>`).
- **Коллекции:** `services` (карточки услуг на главной), `advantages` (преимущества),
  `reviews` (отзывы), `faq` (вопросы, поле `page` разделяет страницы), `promotions`
  (карточки акций — теги, цена, условия, кнопка, категория для фильтра).

### Пока статичны (в разметке, не в CMS) — кандидаты на следующий шаг
- Секция «Кейсы/портфолио» на главной (сложная многослойная вёрстка: главный кейс +
  боковые + карусель — не однородный список).
- Прайс-таблицы на `/price` (4 вкладки с разными колонками — табличные данные,
  требуют отдельной схемы под каждую вкладку).
- Мега-меню услуг в шапке (глубоко вложенная навигация — оставлена в `Header.astro`).

## Деплой на Vercel

1. Запушить репозиторий на GitHub.
2. В Vercel импортировать проект — Astro определяется автоматически (`@astrojs/vercel`).
3. Контентные страницы отдаются как статика, `/keystatic` и `/api/keystatic` — как
   serverless-функция.

## Переключение Keystatic в GitHub-режим (онлайн-редактирование)

Сейчас `storage.kind = 'local'` в `keystatic.config.ts` — правки делаются локально
(`/keystatic`) и коммитятся в репозиторий через git.

Для редактирования прямо с задеплоенного сайта:

1. В `keystatic.config.ts` заменить `storage: { kind: 'local' }` на
   `storage: { kind: 'github', repo: 'OWNER/REPO' }`.
2. Создать Keystatic GitHub App: https://keystatic.com/docs/github-mode
3. Прописать переменные окружения в Vercel (см. `.env.example`):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`,
   `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.

## Заметки

- Форма заявки («Получить расчёт») перенесена как в оригинале — сейчас статична, без
  бэкенда. Подключение отправки (API-роут/почта) — отдельная задача.
- Топбар-меню в исходном HTML содержало синтаксическую ошибку в JS (выпадающие списки
  не работали). В переносе JS исправлен — меню работает по клику.
- Hero-изображение главной (было встроено в HTML как base64) вынесено в `public/hero-ppu.jpg`.
