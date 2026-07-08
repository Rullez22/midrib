# TableHeader — шапка таблицы / навигация (компонент DS)

**Источник:** Figma «UI фичи» / Navigation (node `155:0`). Атом «столбец» `968:90300`;
канонический вариант с чекбоксом `6203:163486` («navigation пайщикки»). В кадре ~23
варианта navigation-рядов (транзакции, документы, пайщики, основания, артефакты…).
**Цель:** ряд заголовков колонок таблицы — `<TableHeader>` 1:1 с дизайном.

Базовый примитив (table chrome). Конкретные наборы колонок — композиция через проп `columns`.

## Матрица дизайна

- **Колонка (столбец):** подпись `dark-800` Regular 12/20 + опц. стрелка сортировки
  (8px, `Arrow-up-24`). gap 4 между подписью и стрелкой.
- **Ряд:** flex, высота `s` (30) / `m` (46), padding-x 24, рамка/радиус 4.
- **Tone:** `default` (прозрачный, без рамки) · `muted` (`grey-10` фон + рамка `grey-20`).
- **Чекбокс «выбрать всё»:** опц. слева (DS `<Checkbox size="xs">`).
- **Сортировка:** `sortable` колонка кликабельна (`<button>`); активная — стрелка
  `dark-800` + направление (asc ↑ / desc ↓), `aria-sort`. Неактивная sortable — `grey-300` ↓.
- **Колонки:** `align` (left/center/right), `width` (фикс) или `flex` (растяжение, по умолч. 1).

## Использованные DS-компоненты

- `<Checkbox size="xs">` — «выбрать всё».
- Токены MIDHUB: `dark-800/900`, `grey-10/20/300`, `blue-midhub-500`, `--radius-xs`,
  `--font-sans`, `--weight-regular`. Стрелка сортировки — локальный SVG (8px).

## Фазы

### [x] Фаза 1. Компонент и стили
- `src/components/ds/table-header.tsx` — `<TableHeader>` (`columns`, `size`, `tone`,
  `selectable`/`checked`/`onCheckedChange`, `sortKey`/`sortDir`/`onSort`) + тип `TableColumn`.
- `src/components/ds/table-header.css` — `.ds-thead*` в `@layer components`.
- Регистрация CSS в `globals.css`; экспорт в `index.ts`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/table-header-demos.tsx` — варианты default / muted+чекбокс / muted /
  size m + интерактивная сортировка; секция «TableHeader» в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (`6203:163486` и ряд вариантов — 1:1).

## Итог

Реализован целиком. `<TableHeader>` + проп `columns` воспроизводят navigation-ряды
(155:0, 6203:163486) 1:1. Собран из `<Checkbox>` и токенов MIDHUB; новых базовых
атомов не вводилось. Не входят: page-headers «header пп/создание пп» и таб-бар
«Страны/Характеристики…» из того же кадра — это отдельные компоненты (Tabs и т.п.).
