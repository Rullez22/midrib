# Pagination — компонент DS

**Источник:** Figma «UI Контролы» / Pagination (node 928:29174).
**Цель:** постраничная навигация MIDHUB DS — компонент `<Pagination>` 1:1 с дизайном.

## Матрица дизайна

- **View:**
  - `full`    — `[Первая] [‹] [N из M] [›] [Последняя]`
  - `medium`  — `[‹] [N из M] [›]`
  - `basic`   — `[‹] [›]`
  - `compact` — `[‹ Назад] [Далее ›]` (в Figma — «full (without input)»)
- **Size:** `l` (48) · `m` (40) · `s` (32) · `xs` (24). Между элементами gap 16px (по макету).
- **Кнопки** (ghost): фон `grey-20`, рамка `grey-90`, радиус 4, текст `dark-800` Medium, hover → `grey-90`.
  - иконочная (квадрат): padding L/M 12 · S 8 · XS 4, иконка 24 (L) / 16 (M/S/XS) — шеврон.
  - лейбловая (Первая/Последняя): padding-x 32/24/16/8.
  - compact: стрелка + текст, padding-x 8.
- **Поле «N из M»:** белый фон, рамка `grey-90`, inset-тень `inset 0 1px 3px rgba(90,100,111,.3)`,
  текст `dark-900` Regular. Номер страницы — редактируемый `<input inputmode=numeric>`.
- Текст по размеру: L 16/24 · M 14/22 · S 12/20 · XS 12/20.
- Поведение: кнопки гаснут на границах (страница 1 / последняя), смена → `onChange(clamp)`.

## Фазы

### [x] Фаза 1. Компонент и стили
- `src/components/ds/pagination.tsx` — `<Pagination>` (`forwardRef<HTMLElement>`, рендерит `<nav>`,
  `aria-label`, `HTMLAttributes` без `onChange`). Пропсы: `page`, `total`, `onChange`, `view`, `size`,
  лейблы (`firstLabel`/`lastLabel`/`backLabel`/`nextLabel`/`ofLabel`). Инлайн-SVG `ChevronLeft`/`ChevronRight`.
- `src/components/ds/pagination.css` — классы `.ds-pagination*` в `@layer components` на токенах MIDHUB
  (`--color-grey-20/90`, `--color-white`, `--color-dark-800/900`, `--font-sans`/`--weight-*`, `--radius-xs`).
  Размерные переменные `--pg-*` на классах `--l/--m/--s/--xs`.

### [x] Фаза 2. Подключение в DS
- `src/styles/globals.css` — `@import "../components/ds/pagination.css"`.
- `src/components/ds/index.ts` — экспорт `Pagination`, типов `PaginationProps`, `PaginationSize`, `PaginationView`.

### [x] Фаза 3. Витрина и проверка
- `src/app/ds/pagination-demos.tsx` — клиентская витрина (интерактивное состояние страницы),
  матрица View × Size, total = 200.
- `src/app/ds/page.tsx` — секция «Pagination» подключает `<PaginationDemos />`.
- `tsc --noEmit` — чисто.

## Итог

Реализован **целиком**. Компонент `<Pagination>` со всеми view и size из Figma,
редактируемым полем страницы и гашением кнопок на границах; подключён в DS, добавлен в витрину `/ds`.
Не осталось ничего.

Использованные компоненты/токены DS: палитра `grey-20/90`, `white`, `dark-800/900`, `blue-midhub-500` (focus),
`--font-sans`/`--weight-medium`/`--weight-regular`, `--radius-xs`, утилита `cn`.
Иконки — собственные инлайн-SVG (шевроны), не remote-ассеты Figma.
