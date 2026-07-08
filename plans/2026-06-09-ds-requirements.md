# Требования — DS-компоненты

**Источник:** Figma «UI фичи» / Требование (обзор 120:175; 16 нод состояний:
642:63109, 639:63023/62969, 638:62786/62639, 637:199, 625:61951, 163:0, 120:0/103,
123:0/628, 124:25513, 128:55, 127:270, 130:0).
**Цель:** создание/редактирование/просмотр требования валидатора в DS (правило 1.1).

## Аудит (17 нод = состояния редактора требования)

| Часть | Решение |
|---|---|
| Просмотр требования (заголовок+бейдж + label/value) | **reuse `MemberCard` + `Badge`** |
| Матрица «уровень верификации» (строки × бейдж-колонки + чекбоксы) | новый **`CheckMatrix`** |
| Форма (название/раздел/описание/тип/матрица/документы/кнопки) | новый **`RequirementForm`** (сборка) |
| Поля | **reuse `Input` / `Textarea` / select(Input)** |
| Тип верификации | **reuse `Radio` + `Badge`** |
| Документы / кнопки | **reuse `Button`** (Добавить/Создать/Отменить) |

## Фазы

### [x] Фаза 1. Реализация
- `src/components/ds/composite/check-matrix.tsx` — `<CheckMatrix>` (rowHeader, columns,
  rows, checked[][], onToggle). Reuse `Checkbox`. Переиспользуемая матрица чекбоксов.
- `src/components/ds/composite/requirement-form.tsx` — `<RequirementForm>` (сборка из
  Input/Textarea/Radio+Badge/CheckMatrix/Button).
- Просмотр — через `<MemberCard>` + `<Badge>` (reuse).
- Экспорт в `index.ts`; демо `src/app/ds/requirement-demos.tsx` + секция в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено (120:0 форма + матрица — 1:1).

## Итог

Новые: `CheckMatrix` (переиспользуемая), `RequirementForm` (сборка). Reuse `MemberCard`,
`Badge`, `Input`, `Textarea`, `Radio`, `Checkbox`, `Button`. Набор покрывает состояния
редактора требования. Полный tree-picker документов — представлен кнопкой «Добавить
документ» (древо-выбор — отдельный компонент при необходимости).
