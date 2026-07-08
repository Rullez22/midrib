# Sidemenu — композитный компонент DS

**Источник:** Figma «UI фичи» / sidemenu — nodes `1647:231585` (color),
`1170:101117` (label), `1170:113096` (обе колонки в кадре «left menu question»).
**Цель:** вертикальная навигация-список MIDHUB DS — композит `<Sidemenu>` 1:1 с дизайном.

Первый компонент в `src/components/ds/composite/` (см. правило 9 в
`docs/MIDHUB_WORKFLOW_RULES.md`).

## Матрица дизайна

- **Пункт = чип «Tabs midhub» (Size=S-32, Solid light):** h32, padding 6/16, gap4,
  rounded-4 (`--radius-xs`), Articulat Regular 12/20 — те же значения, что `.ds-tabs--s`.
- **Variant:**
  - `label` — текстовые чипы. default: `grey-20` / рамка `grey-90` / текст `dark-800`;
    hover → `grey-10`; active: white / рамка `grey-90` / текст `blue-midhub-500`.
  - `color` — цветные номер-бейджи. default: заливка `--sm-color`, текст white, без рамки;
    active: white / рамка `--sm-color` / текст `--sm-color`.
- **Палитра color** (токены): red-200, orange-200, yellow-300, green-200,
  blue-midhub-200, blue-midhub-300 (`blue-strong`), purple-200.
- **Расположение:** вертикальный flex, gap настраивается (`gap`, по умолчанию 8px).
- **Поведение:** управляемый (`value`/`onValueChange`) или неуправляемый (`defaultValue`);
  активный пункт — `aria-selected`; `role=tablist` (vertical) / `role=tab`.

## Фазы

### [x] Фаза 1. Композит и стили
- `src/components/ds/composite/sidemenu.tsx` — `<Sidemenu>` (`items`, `variant`,
  `value`/`defaultValue`/`onValueChange`, `gap`). Цвет бейджа → CSS-переменная `--sm-color`.
- `src/components/ds/composite/sidemenu.css` — классы `.ds-sidemenu*` в `@layer components`
  на токенах MIDHUB.
- Регистрация CSS в `src/styles/globals.css`; экспорт в `src/components/ds/index.ts`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/sidemenu-demos.tsx` + секция «Sidemenu» в `src/app/ds/page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (color + label, оба активных пункта 1:1).

## Итог

Реализован целиком. Композит `<Sidemenu>` (variant `label`/`color`) повторяет nodes
1647:231585, 1170:101117 и их совместный кадр 1170:113096 1:1. Собран из существующего
чип-паттерна (Tabs midhub S-32) и токенов MIDHUB, новых базовых атомов не вводилось.
