# Launcher (авторизация / выбор организации) — DS-компоненты

**Источник:** Figma «UI фичи» / launcher (обзор 2086:272867; 2086:272686 — авторизация;
2086:272858 — выбор организации).
**Цель:** карточки-лаунчеры в DS (правило 1.1).

## Аудит (3 ноды)

| Часть | Решение |
|---|---|
| Карточка-шелл (центр. заголовок+подзаголовок + футер) | новый **`LauncherCard`** (reuse `SectionHeader`) |
| Разделитель с подписью («Или» / «Кооперативы» / «ООО») | новый **`LabeledDivider`** |
| Поле / кнопки | **reuse `Input` / `Button`** |
| Строки организаций (лого + имя + роль) | **reuse `Item`** (leading + 2-строчный контент) |
| QR | декоративная заглушка (SVG) |

## Фазы

### [x] Фаза 1. Реализация
- `src/components/ds/labeled-divider.tsx` — `<LabeledDivider>` (hairline + центр. подпись).
- `src/components/ds/composite/launcher-card.tsx` — `<LauncherCard>` (`title`, `subtitle`,
  `footer`, `children`).
- Экспорт в `index.ts`; демо `src/app/ds/launcher-demos.tsx` (авторизация + выбор
  организации) + секция в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено (2086:272686 / 272858 — 1:1).

## Итог

Новые: `LabeledDivider`, `LauncherCard`. Reuse `SectionHeader`/`Input`/`Button`/`Item`.
Обе карточки-лаунчера 1:1 (QR — заглушка, генерится динамически).
