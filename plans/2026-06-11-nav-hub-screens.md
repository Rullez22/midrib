# NavHub — навигационные хаб-экраны (карта переходов)

Дата: 2026-06-11.
Источник Figma: «Midhub ERP» — Navigation (3501:453400), menu 1 / «Компания не создана» (2570:334921), «Компания создана» (1857:650053).

## Что делаем

Первый экран флоу + две карты переходов. Navigation — точка входа; с неё переход на «Компания не создана» и «Компания создана». Внутри подэкранов — списки ссылок на будущие экраны (пока заглушки `#`).

Реализовано responsive-first (mobile/tablet/desktop/large) — в Figma только Desktop.

## Компоненты DS

Новый композит `src/components/ds/composite/nav-hub.tsx`:
- `NavHubPage` — каркас: floating back-кнопка (grey-20, rounded-4) + центрированный H1 (grid, без overlay) + контейнер `max-w-[1200px]`.
- `NavHubCard` — sunken-панель (grey-10, rounded-16) с заголовком H4.
- `NavHubLinkList` — маркированный список подчёркнутых ссылок (DS `Link`, P1 medium underline).
- `NavHubChoiceCard` — кликабельная карточка выбора (описание + «Продолжить» secondary + декор-иллюстрация), проп `align`.

Переиспользовано из DS: `Text` (h1/h4/p2), `Button` (secondary), `Link`, `HeaderArrowLeftIcon`, токены (surface-sunken, border, radius-xl). Новых variants не потребовалось.

Иллюстрации: `public/illustrations/warning-triangle.svg`, `check-circle.svg` (из Figma).

## Экраны (роуты)

- `/` → `src/app/page.tsx` — Navigation (root, первый экран).
- `/company-not-created` → карта «Компания не создана» (2 панели).
- `/company-created` → карта «Компания создана» (3 колонки + 2 снизу).

## Фазы

- [x] Анализ Figma (3 экрана), Reuse + Responsive Analysis.
- [x] Композит `nav-hub.tsx` + регистрация/экспорт в `ds/index.ts`.
- [x] Экраны: `/`, `/company-not-created`, `/company-created`.
- [x] Responsive (grid 1→2→3 кол., контейнер 1200, без горизонтального скролла).
- [x] Фикс: grid-шапка вместо absolute (back-кнопка не перехватывалась).
- [x] Подчёркивание ссылок (Figma «P1 underline»).
- [x] Demo `ds/nav-hub-demos.tsx` + секция в `/ds`.
- [x] Проверка: typecheck чистый; навигация (карточки + back) OK на desktop и mobile (Playwright); скриншоты сверены с Figma 1:1.

## Итог

Реализован целиком. Навигация: Navigation → карты переходов → back. Ссылки внутри подэкранов — заглушки `#`; целевые экраны появятся по мере реализации флоу (каждый — отдельным планом).
