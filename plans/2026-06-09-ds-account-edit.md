# Редактирование счёта — DS-компоненты

**Источник:** Figma «UI фичи» / редактирование счёта (1503:177626 редактор;
1504:178668 строка распределения).
**Цель:** редактор распределения средств целевого счёта в DS (правило 1.1).

## Аудит (2 ноды)

| Часть | Решение |
|---|---|
| Строка распределения (заголовок + Incriment % + чекбоксы-опции) | новый **`DistributionRow`** (reuse Incriment + Checkbox) |
| «Целевой счет» (label + Incriment) | **reuse `IncrimentField`** |
| «Буферная область» — донат % | **reuse `ProgressRing`** |

## Фазы

### [x] Фаза 1. Реализация
- `src/components/ds/composite/distribution-row.tsx` — `<DistributionRow>` (title, value/…,
  suffix, options[]). Reuse `Incriment` + `Checkbox`.
- Редактор — `IncrimentField` (Целевой счёт) + `DistributionRow`×3 + `ProgressRing`.
- Экспорт в `index.ts`; демо `src/app/ds/account-edit-demos.tsx` + секция в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено (1503:177626 / 1504:178668 — 1:1).

### [x] Фаза 2. Страница «Настройка счета» во флоу
**Источник:** Figma 2489:279890 (пустое) / 2489:285220 (распределено вручную).
- `src/app/flow/company-create/_components/account-settings-screen.tsx` —
  `<AccountSettingsScreen backHref submitHref>`: шапка «Настройка счета» (H5) +
  закрытие × (`Button negative-sec`), карточка-редактор (левая колонка
  `IncrimentField` «Целевой счет» + `DistributionRow`×3 с 2 опциями; правая —
  `ProgressRing` «Буфферная область», буфер 0%), футер `Checkbox` «Правила
  редактирования счета» + `Button` «Запустить голосование» (disabled, пока
  правила не приняты). Reuse-only, новых компонентов нет.
- Роут: шаг 22 в `[step]/page.tsx` (`TOTAL` 21→22). Открывается из карточки счёта
  (`AccountsScreen settingsHref` → кнопка «Редактировать % по распределению» и
  пункт дропдауна «Создать подсчет»). × → назад на шаг 21.

## Итог

Реализован целиком. Новый: `DistributionRow` (Фаза 1). Reuse
`IncrimentField`/`Incriment`/`Checkbox`/`ProgressRing`/`Button`/`CoopRail`.
Страница «Настройка счета» (Фаза 2) собрана из готовых DS без новых компонентов.
