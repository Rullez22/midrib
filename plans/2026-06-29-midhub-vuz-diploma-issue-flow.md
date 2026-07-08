# Флоу «Выдача диплома» (кабинет №7 — ВУЗы / Направление)

Экран «Направление» (`/cabinet/vuz/direction`) — развилка из 3 карточек. По кнопке
«Выдать диплом» открывается флоу создания **Пользовательского соглашения (ПП)** —
полная копия флоу из создания кооператива (`company-create`), но в обвязке кабинета
ВУЗов (CompanySidebar, активный пункт «Направление»). Завершается экраном «Цикл
выдачи диплома».

Источник Figma: 6970:552030 (Направление), 6970:552156 (интро ПП), 6970:556018
(Цикл выдачи диплома). Экраны ПП — те же ноды, что в company-create (2671:398098 …).

## Принцип: ничего не верстаем заново — реюз экранов company-create [x]
Подход согласован с пользователем: **параметризовать сайдбар**, а не дублировать экраны.

- Экранам флоу ПП добавлен АДДИТИВНЫЙ опц. проп `sidebar?: ReactNode`
  (по умолчанию — `CoopSidebar`, существующее использование в company-create не
  затронуто). Затронуты: `agreement-intro-screen`, `registration-setup-screen`,
  `registration-form-screen`, `basis-editor-screen`, `documents-screen`,
  `balance-screen`. Рендер: `{sidebar ?? <CoopSidebar routes={routes} />}`.
- VUZ-флоу проставляет `sidebar={<CompanySidebar cabinet current="direction" />}`.
- Общее состояние формы — переиспользован `RegFlowProvider` из company-create
  (новый layout оборачивает шаги в него).

## Реализация [x]
- `cabinets.tsx`: «Направление» переставлено на 1-е место меню ВУЗов.
- `cabinet-direction-screen.tsx` (`[company]/_components`): экран-развилка (3×
  `OptionCard` + `Button`). Кнопка «Выдать диплом» → `/cabinet/[company]/direction/issue/1`.
  Иконки: public/images/cabinet/vuz-diploma|additions|request.svg.
- `direction/issue/layout.tsx`: `RegFlowProvider`.
- `direction/issue/[step]/page.tsx`: шаги 1..7 →
  1 AgreementIntro · 2 RegistrationSetup · 3 RegistrationForm (→ 4 BasisEditor /
  5 Documents / 6 Balance) · 6 Balance · 7 DiplomaCycle. Все с пробросом VUZ-сайдбара.
- `direction/issue/_components/diploma-cycle-screen.tsx`: новый экран «Цикл выдачи
  диплома» (4 шага + примечание + ссылки + кнопка «Начать»). Собран из DS: Text,
  Button, Link, HeaderArrowLeftIcon.

## Проверка [x]
- `tsc --noEmit` — 0 ошибок.
- Роуты 200 (dev): /cabinet/vuz/direction, …/issue/1 (интро), /3 (форма),
  /6 (баланс), /7 (цикл выдачи). Сайдбар ВУЗа («ВУЗы/Департамент/Направление»)
  рендерится на всех экранах флоу. Ошибок компиляции нет.

## Флоу «Внести дополнения» (kind="additions") [x]
- Та же цепочка экранов, что «Выдача диплома», но на форме регистрации доступно
  только ОДНО основание. RegistrationFormScreen получил аддитивный проп
  `singleBasis?: boolean` (BASES.slice(0,1)).
- Маппинг шагов вынесен в общий `issue/_components/issue-flow.tsx` (`renderIssueStep`,
  вид `diploma | additions`); оба роута тонкие: `issue/[step]` (diploma) и
  `issue/additions/[step]` (additions, под тем же issue/layout → общий RegFlowProvider).
- Кнопка «Внести дополнения» → `/cabinet/[company]/direction/issue/additions/1`.
- DiplomaCycleScreen: шаги и примечание центрированы (по просьбе).

## Страницы выдачи/дополнений + разблокировка меню [x]
- По умолчанию в сайдбаре ВУЗов видны только «Направление» и «История операций».
  «Выдача диплома»/«Дополнения» скрыты до прохождения своего флоу.
- Новый контекст `CabinetUnlockProvider` (in-memory, в `[company]/layout` ВЫШЕ
  RegFlowProvider). `CabinetMenuItem.lockedUntil` помечает пункты ВУЗа; CompanySidebar
  фильтрует меню по `useCabinetUnlock()`.
- `DiplomaCycleScreen` «Начать» → `unlock(kind)` + переход на страницу пункта.
- Страницы «Выдача диплома» (6970:556049) и «Дополнения» (6970:556185) — один общий
  `QrScanScreen` (Tabs «…|В обработке», заголовок «Считывание QR-кода», QR, тексты,
  Link). Реюз DS: Tabs/Tab, Text, Link, Button, EmptyState. QR: public/images/cabinet/vuz-qr.png.
- «История операций» (6970:551336 / 551560) — `HistoryOperationsScreen`: реюз паттерна
  валидаторского «Обработанные». Вкладка «Обработано вами»: StatCounter + период
  («Выбрать период» — ReportPeriodBar + Calendar range со стрелками) + TableHeader+DocumentRow.
  Вкладка «Обработано вашими сотрудниками»: сегмент Tabs solid «Лицензии/Сотрудники»
  (6970:551439 / 551681), Combobox + период (справа); сегмент «Лицензии» — таблица
  документов (DocumentRow), «Сотрудники» — таблица Ф.И.О.→число лицензий (DS Item).
  Дропдаун «Сотрудники» группирует/фильтрует таблицу по выбранному Ф.И.О.
  Клик по транзакции/строке документа → деталь `HistoryDocDetail` (6970:550963):
  сверху ПП (Item: форма+лицензия+дата), снизу поля (DefTable) + BlockchainCard —
  реюз document-shared. Без новых компонентов.

## Открытые вопросы
- Вкладка «В обработке» на страницах Выдача/Дополнения — макета нет, пока EmptyState.
- Кнопка «Начать» на «Цикле выдачи диплома» и «Сделать запрос» на развилке —
  целевые экраны в Figma пока не заданы (прототип-реакции). «Начать» временно
  ведёт назад на «Направление».

## Итог
Реализовано целиком. Флоу ПП переиспользован из company-create через аддитивный
проп `sidebar` (без дублирования экранов); добавлен финальный экран «Цикл выдачи
диплома». Новых DS-компонентов не создавалось.
