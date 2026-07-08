# IncrimentField — строка «подпись + степпер» (композит DS)

**Источник:** Figma «UI фичи» / Incriment (node `1470:204348`).
**Цель:** бордерная строка с подписью и степпером — `<IncrimentField>` 1:1 с дизайном.

## Аудит DS (правило 1.1)

Нода = подпись слева + контрол `[+|0|-]` справа. Контрол уже есть в DS —
`<Incriment>` (size l/m/s, blue ±, dividers, значение). **Переиспользован 1:1**,
новый только обёрточный composite (бордерная строка + подпись).

## Матрица дизайна

- **Строка:** бордер `grey-90`, радиус 4, фон white, padding 16, `justify-content: space-between`.
- **Подпись:** Medium `dark-900`; размер от `size` — l 16/24 · m 14/22 · s 12/20.
- **Степпер:** DS `<Incriment size>` (48/40/32), `suffix=""` (без единицы).

## Использованные DS-компоненты

- `<Incriment>` — контрол `[+|0|-]`. Токены MIDHUB: `grey-90`, `dark-900`,
  `--radius-xs`, `--font-sans`, `--weight-medium`.

## Фазы

### [x] Фаза 1. Композит и стили
- `src/components/ds/composite/incriment-field.tsx` — `<IncrimentField>` (`label`,
  `size` + прокидка пропсов Incriment: `value`/`defaultValue`/`onValueChange`/`min`/…).
- `src/components/ds/composite/incriment-field.css` — `.ds-incriment-field*`.
- Регистрация CSS в `globals.css`; экспорт в `index.ts`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/incriment-field-demos.tsx` (L/M/S) + секция в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (1:1).

## Итог

Реализован целиком. `<IncrimentField>` повторяет node 1470:204348 1:1. Степпер —
переиспованный DS `<Incriment>`; новых базовых атомов не вводилось.
