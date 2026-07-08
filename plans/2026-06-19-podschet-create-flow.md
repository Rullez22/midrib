# Флоу «Создание подсчёта» целевого счёта

**Источник:** Figma 2493:286303 (интро) · 2493:286557/2494:290721 (форма) ·
2494:364692/364699 (голосование) · 2494:362085 (вопрос) · 2496:290737 (счета + баннер).
**Цель:** создать подсчёт целевого счёта через голосование (по схеме распределения %).

## Reuse-аудит — новых базовых компонентов нет

| Часть | Решение |
|---|---|
| Форма (название, тип, ОКВЭД, назначение) | `Input` · `Radio` · `Textarea` · `DeleteButton` (как в demo `PodschetDemos`) |
| Редактор распределения | `IncrimentField` + `ProgressRing` + `Checkbox` (буфер = доля нового подсчёта) |
| Сводка на голосовании | `MemberCard` + `Badge` + `IncrimentField` (read-only) |
| Голосование / история | `QuestionCard` + `ProgressRing` + `Button` + `TableHeader` + `Tooltip` |
| Вопрос в списке / баннер | `QuestionRow` (существующий) · `Banner` |

## Фазы

### [x] Фаза 1. Состояние
- `reg-flow`: `PodschetDraft` · `podschetDraft` · `extraPodscheta[]` ·
  `podschetVoteStarted/Done` · `startPodschetVote(draft)` · `finishPodschetVote()`
  (добавляет подсчёт на счета по буферу, фиксирует распределение).

### [x] Фаза 2. Экраны
- `podschet-intro-screen.tsx` (шаг 24) — интро + «Продолжить создание».
- `podschet-create-screen.tsx` (шаг 25) — форма + редактор распределения; буфер
  (100 − целевой − подсчёта) = доля нового подсчёта (кольцо). «Запустить голосование».
- `podschet-voting-screen.tsx` (шаг 26) — сводка (read-only) + голосование + история.

### [x] Фаза 3. Связи
- `accounts-screen.tsx`: дропдаун «Создать подсчет» → интро (`createPodschetHref`);
  созданные подсчёта в списке (`extraPodscheta`); баннер «Отправка уставных
  документов…» после `podschetVoteDone`.
- `voting-questions-screen.tsx`: вопрос «Создание нового подсчета» (активен, шаг 26).
- `coop-sidebar.tsx`: оранжевая иконка и при `podschetVoteStarted`.
- `[step]/page.tsx`: `TOTAL` 23→26, маршруты 24/25/26.

## Итог

Реализован целиком, по схеме распределения % (§10 правил). Новых DS-компонентов
нет — композиция существующих (см. demo `PodschetDemos`) + общее состояние `RegFlow`.
`tsc` чисто.
