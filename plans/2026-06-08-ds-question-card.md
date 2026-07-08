# QuestionCard — композитный компонент DS

**Источник:** Figma «UI фичи» / Questions — nodes `903:85344` (state=close),
`903:85253` (state=open), `1991:201794` (open small); кадры-обзоры `903:85167`,
`296:0` (а также дубли состояний `296:1`, `296:70`).
**Цель:** раскрывающаяся карточка вопроса для голосования — композит
`<QuestionCard>` 1:1 с дизайном.

Композит в `src/components/ds/composite/` (см. правило 9 в
`docs/MIDHUB_WORKFLOW_RULES.md`).

## Матрица дизайна

- **Карточка:** бордер `grey-90`, радиус 4 (`--radius-xs`), фон white, `overflow: hidden`.
- **Шапка (кнопка-раскрытие):** заголовок слева (`dark-900`), правый кластер
  `[статус-иконка · разделитель 1px grey-90 · шеврон]`. Иконки `grey-300`.
  При открытии шапка → фон `grey-10` + нижняя граница `grey-90`. Шеврон ↻180°.
- **Size:**
  - `l` — шапка 66, паддинг 24 (шапка) / 23 (тело), текст `P3` 14/22, иконки 24.
  - `s` — шапка 44, паддинг 11, текст `Caption` 12/20, шеврон 16, без статус-иконки.
- **Статус-иконка** (`icon`): `lock` (заблокирован) · `share` (можно отправить) ·
  своя нода · нет. Инлайн-SVG (растровые ассеты Figma не тащим).
- **Панель:** тело (`dark-800`) + опциональный футер. Футер «Подробнее» —
  переиспользуем `<Button variant="secondary" size="s">` (контур blue-500).
- **Поведение:** управляемый (`open`/`onOpenChange`) или неуправляемый
  (`defaultOpen`); шапка — `<button aria-expanded aria-controls>`, панель `role=region`.

## Использованные DS-компоненты

- `<Button>` (variant=secondary, size=s) — кнопка «Подробнее».
- Токены MIDHUB: `grey-10/90/300`, `dark-800/900`, `white`, `blue-midhub-500`,
  `--radius-xs`, `--font-sans`, `--weight-regular`. Новых базовых атомов не вводилось
  (иконки lock/share/chevron — локальные SVG внутри композита).

## Фазы

### [x] Фаза 1. Композит и стили
- `src/components/ds/composite/question-card.tsx` — `<QuestionCard>` (`title`, `size`,
  `icon`, `open`/`defaultOpen`/`onOpenChange`, `disabled`, `footer`, `children`).
- `src/components/ds/composite/question-card.css` — `.ds-qcard*` в `@layer components`.
- Регистрация CSS в `globals.css`; экспорт в `index.ts`.

### [x] Фаза 2. Витрина и проверка
- `src/app/ds/question-card-demos.tsx` + секция «QuestionCard» в `src/app/ds/page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено с Figma (L close/open + S small — 1:1).

## Итог

Реализован целиком. `<QuestionCard>` повторяет состояния close/open/open-small
(903:85344, 903:85253, 1991:201794) и их обзорные кадры 1:1. Собран из `<Button>`
и токенов MIDHUB; статус-иконки — локальные SVG.
