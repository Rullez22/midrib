# AchievementCard — карточка достижения (композит DS)

**Источник:** Figma «UI фичи» / достижение (node `759:69583`).
**Цель:** карточка достижения — композит `<AchievementCard>` 1:1 с дизайном.

Композит в `src/components/ds/composite/` (см. правило 9 в `docs/MIDHUB_WORKFLOW_RULES.md`).

## Матрица дизайна

- **Карточка:** бордер `grey-90`, радиус 4, фон white, padding 8, gap 8, inline-flex.
- **Аватар:** 82×82, рамка `grey-90`, радиус 4, `object-fit: cover`.
- **Текст:** заголовок Medium 14/22 `dark-900` + описание Regular 12/20 `dark-800`, gap 4.

## Фазы

### [x] Фаза 1. Композит и стили
- `src/components/ds/composite/achievement-card.tsx` — `<AchievementCard>`
  (`image`, `alt`, `title`, `description`). `title` исключён из `HTMLAttributes` (конфликт с DOM).
- `src/components/ds/composite/achievement-card.css` — `.ds-achievement*` в `@layer components`.
- Регистрация CSS в `globals.css`; экспорт в `index.ts`.
- Демо-картинка: `public/demo/achievement-rhino.jpg`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/achievement-card-demos.tsx` + секция «AchievementCard» в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (1:1).
- Примечание: после добавления нового `@import` Turbopack кэширует граф — потребовалось
  изменить содержимое `globals.css` (не просто touch), чтобы CSS пересобрался.

## Итог

Реализован целиком. `<AchievementCard>` повторяет node 759:69583 1:1. Только токены MIDHUB.
