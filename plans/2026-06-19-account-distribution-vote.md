# Голосование по распределению % целевого счёта

**Источник:** Figma 2492:283045 (голосование до голоса) · 2492:283052 (после) ·
2489:285849 (вопрос в списке) · 2493:283695 (счета с распределёнными %).
**Цель:** «Запустить голосование» на настройке счёта → вопрос на голосовании →
после завершения проценты применяются к счетам.

## Reuse-аудит — новых компонентов нет (только `Incriment.readOnly`)

| Часть | Решение |
|---|---|
| Карточка распределения (read-only) на голосовании | `IncrimentField` + `DistributionRow` с новым `readOnly` |
| Степпер только для просмотра (значение в рамке без кнопок) | **`Incriment` — проп `readOnly`** (DS) |
| Голосование (ID, счётчики, кольцо, За/Против) | `QuestionCard` + `ProgressRing` + `Button` (1:1 с CouncilVotingScreen) |
| История транзакций | `TableHeader` + `Tooltip` |
| Вопрос в списке (оранжевый, замок) | существующий `QuestionRow` (active) |
| Оранжевая иконка в меню | существующий `CoopSidebar` (условие расширено) |

## Фазы

### [x] Фаза 1. DS: read-only степпер
- `Incriment` — проп `readOnly` (значение в рамке без `+`/`−`); CSS
  `.ds-incriment--readonly`. Проброшен в `IncrimentField` и `DistributionRow`
  (в read-only чекбоксы-опции `disabled`).

### [x] Фаза 2. Состояние флоу
- `reg-flow`: `distribution {target, subs}` · `accountsVoteStarted` ·
  `accountsVoteDone` · `startAccountsVote(d)` (сохранить раскладку + `votingStarted`)
  · `finishAccountsVote()` (применить % к счетам).

### [x] Фаза 3. Экраны и связи
- `account-settings-screen.tsx`: «Запустить голосование» → `startAccountsVote` +
  переход на вопросы (шаг 19).
- `account-voting-screen.tsx` (новый, шаг 23): карточка распределения (read-only) +
  голосование + история. «Завершить» → `finishAccountsVote` + счета (шаг 21).
- `voting-questions-screen.tsx`: вопрос «Распределение % по подсчетам целевого
  счета» (активен, пока `accountsVoteStarted`) → шаг 23.
- `coop-sidebar.tsx`: оранжевая иконка вопросов и при `accountsVoteStarted`.
- `accounts-screen.tsx`: подсчёта показывают `distribution.subs[i] %` (после голосования).
- `[step]/page.tsx`: `TOTAL` 22→23, маршруты 22/23.

### [x] Фаза 4. Правило
- `docs/MIDHUB_WORKFLOW_RULES.md` §10 — «Запуск голосования → активный вопрос +
  оранжевая иконка в меню» (единый паттерн).

## Итог

Реализован целиком. Новое в DS — только `Incriment.readOnly` (+ проброс).
Остальное — композиция существующих DS и общего состояния `RegFlow`. `tsc` чисто.
