# Отправка устава на валидацию — баннер-стейт-машина

**Источник:** Figma 2507:298914 (voting) · 2537:305144 (searching) · 2537:308718
(попап-скелетон) · 2537:311986 (попап-валидатор) · 2537:312156 (processing) ·
2512:299222/302007 (вопрос/голосование).
**Цель:** баннер на счетах ведёт документ устава через голосование → поиск
валидатора → подтверждение → обработку.

## Reuse-аудит — новых базовых компонентов нет
| Часть | Решение |
|---|---|
| Баннеры всех тонов | DS `Banner` (info/warning/neutral+spinner/caution) |
| Попап валидатора | DS `Modal` + `Badge` + `Button` (скелетон — animate-pulse) |
| Вопрос в списке | существующий `QuestionRow` |
| Экран голосования | `QuestionCard` + `Badge` + `ProgressRing` + `TableHeader` + `Tooltip` |

## Фазы
### [x] Фаза 1. Стейт-машина (reg-flow)
`validationStage`: idle → voting → searching → found → processing.
`startValidationVote` / `finishValidationVote` / `confirmValidator`; таймер
`searching → found` (`VALIDATION_SEARCH_MS`, в провайдере).

### [x] Фаза 2. Баннер + попап (accounts-screen)
Баннер по стадии: idle (info, «Запустить голосование») · voting (warning,
«Проголосовать» → /19) · searching (neutral+spinner, клик → попап-скелетон) ·
found (warning, клик → попап-валидатор) · processing (caution, «Перейти к
документам» → таб Документооборот). `ValidatorModal` (скелетон/готовый).

### [x] Фаза 3. Вопрос + экран голосования
`voting-questions`: вопрос «Отправка уставных документов на валидацию» (активен
при stage=voting) → /27. `validation-voting-screen.tsx` (шаг 27): инфо о
кооперативе + пайщики + голосование + история. «Завершить» → searching.
`coop-sidebar`: оранжевая иконка при stage=voting. `[step]/page.tsx`: TOTAL 26→27.

## Итог
Реализован целиком, по схеме §10. Проверено e2e (Playwright): все 5 состояний
баннера + оба попапа + таймер + жёлтый processing — 1:1 с макетами. `tsc` чисто.
Новых DS-компонентов нет.
