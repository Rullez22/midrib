# SearchBar — строка поиска (композит DS)

**Источник:** Figma «UI фичи» / search with two button (node `975:109067`).
**Цель:** строка поиска с действиями — композит `<SearchBar>` 1:1 с дизайном.

Композит в `src/components/ds/composite/` (см. правило 9 в
`docs/MIDHUB_WORKFLOW_RULES.md`).

## Матрица дизайна

- **Поле:** DS `<Input size="m">` (40) с `leftIcon` — иконка-лупа; плейсхолдер
  `grey-300`, рамка `grey-90`, inset-тень. Поле растягивается (`flex:1`).
- **Действия:** слот `actions` справа — обычно ghost-кнопки фильтров
  (`<Button variant="ghost" size="m" iconLeft={…}>`): фон `grey-20`, текст `dark-800`,
  рамка `grey-90`. В макете — `≡ Button` (меню) и `🌐 Button` (язык).
- **Расположение:** flex, gap 8, кнопки `flex:none` прижаты вправо.

## Использованные DS-компоненты

- `<Input>` (size m, leftIcon) — поисковое поле.
- `<Button variant="ghost" size="m">` — кнопки-действия (в демо).
- Токены MIDHUB: `grey-20/90/300`, `dark-800`. Иконки лупа/меню/глобус — локальные SVG.

## Фазы

### [x] Фаза 1. Композит и стили
- `src/components/ds/composite/search-bar.tsx` — `<SearchBar>` (`size`, `actions`,
  + прокидываемые пропсы Input: `placeholder`/`value`/`onChange`/…). Встроенная иконка-лупа.
- `src/components/ds/composite/search-bar.css` — `.ds-searchbar*` в `@layer components`.
- Регистрация CSS в `globals.css`; экспорт в `index.ts`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/search-bar-demos.tsx` + секция «SearchBar» в `src/app/ds/page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (1:1).

## Доп. вариант (214:2171 — поиск с кнопкой настройки)

Покрыт без нового кода: `<SearchBar size="l" actions={<Button variant="ghost"
size="l" icon={<Gear/>} />}>`. Демка добавлена в `search-bar-demos.tsx`.

## Итог

Реализован целиком. `<SearchBar>` повторяет node 975:109067 (и 214:2171) 1:1. Собран из DS
`<Input>` + `<Button>` и токенов MIDHUB; новых базовых атомов не вводилось.
