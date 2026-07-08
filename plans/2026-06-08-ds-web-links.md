# Web Links — компонент DS

**Источник:** Figma «UI Контролы» / Web-Links (node 759:0).
**Цель:** текстовая веб-ссылка MIDHUB DS — компонент `<Link>` 1:1 с дизайном.

## Матрица дизайна

- **Size:** `p1` (18/26) · `p2` (16/24) · `p3` (14/22) · `caption` (12/20) · `caption-button` (caption в рамке-кнопке, border blue, r-4)
- **Type:** `internal` (только текст) · `external` (текст + иконка «open», открытие в новой вкладке)
- **State:** default / hover (blue-600) / active (blue-800) / focus — нативные CSS-состояния
- Цвет: `blue-midhub-500`. Иконка масштабируется: 24px для P1/P2, 16px для P3/Caption/button.

## Фазы

### [x] Фаза 1. Компонент и стили
- `src/components/ds/link.tsx` — `<Link>` (рендерит `<a>`, `forwardRef`, `AnchorHTMLAttributes`).
  Пропсы: `size`, `external`, плюс нативные атрибуты якоря. Иконка `ExternalIcon` (inline SVG).
- `src/components/ds/link.css` — классы `.ds-link*` на токенах MIDHUB (`--color-blue-midhub-*`, `--type-*`/`--weight-*`, `--radius-xs`).

### [x] Фаза 2. Подключение в DS
- `src/styles/globals.css` — `@import "../components/ds/link.css"`.
- `src/components/ds/index.ts` — экспорт `Link`, типов `LinkProps`, `LinkSize`.

### [x] Фаза 3. Витрина и проверка
- `src/app/ds/page.tsx` — секция «Web-ссылки» (таблица Size × External/Internal).
- `tsc --noEmit` — чисто. Скриншот `/ds` в Chrome — совпадает с макетом 1:1.

## Итог

Реализован **целиком**. Компонент `<Link>` со всеми размерами и типами из Figma,
подключён в DS, добавлен в витрину `/ds`, визуально сверен с дизайном. Не осталось ничего.

Использованные компоненты/токены DS: цвета `blue-midhub-*`, типографика `--type-*`/`--weight-*`,
`--radius-xs`, утилита `cn`. Новых примитивов не вводилось.
