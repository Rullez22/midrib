# Кликабельный прототип — применение архитектуры (без темы)

Источник: `midhub/CLICKABLE_PROTOTYPE_ARCHITECTURE-2.md` — гайд по архитектуре
кликабельного React-прототипа. Задача: взять из него всё, **кроме темы**
(glassmorphism / тёмная палитра / шрифты — у MIDHUB своя DS и светлая тема),
и закрыть реальные пробелы, не плодя дубли.

## Gap-анализ (дока → MIDHUB)

Большинство разделов доки MIDHUB уже реализует — и лучше (реальное Next-приложение
с DS вместо одного JSX-файла на inline-стилях):

- Структура, состояния, навигация/флоу, анимации, интерактив (кнопки/инпут/табы/
  аккордеон/тоггл/модалка/дропдаун), mock-данные, layout, иконки — **уже есть**.
- Глобальный слой плавности — `src/styles/globals.css` (`prefers-reduced-motion`,
  `.anim-in`, active-отклик, focus-visible, skeleton).
- Тема (разделы 9–11) — **намеренно пропущена**, используем свою DS + `tokens/color.css`.

Реально не хватало (не про тему):

| # | Что | Решение |
|---|-----|---------|
| 3 | JS-responsive хук + брейкпоинты | `src/lib/use-breakpoint.ts` |
| 6.5 | Copy-to-clipboard | `src/lib/use-copy.ts` |
| 6.6 | Show/Hide reveal значения | по требованию экрана (не пре-билдим) |
| 13 | Карусель/слайдер | по требованию экрана (не пре-билдим) |

## Фазы

### [x] Фаза 1 — JS-responsive хук
- `src/lib/use-breakpoint.ts`: `BP` (768/1024/1280, выровнено под Tailwind v4),
  `useBreakpoint()` → `{ w, isMobile, isTablet, isDesktop, isLargeDesktop, mounted }`.
- SSR-safe: дефолт desktop до монтирования, `mounted` для защиты от hydration
  mismatch при рендере разных деревьев.
- Правило: для обычной адаптивности — по-прежнему Tailwind (`md:`/`lg:`/`xl:`),
  хук только когда классов недостаточно (разные деревья компонентов).

### [x] Фаза 2 — Copy-to-clipboard
- `src/lib/use-copy.ts`: `useCopyToClipboard(timeout=2000)` → `{ copied, copy }`.

### [x] Фаза 3 — Плавность и анимации в DS (без темы)
Закрыты реальные motion-пробелы на уровне DS + globals (расходятся на весь проект,
все под `prefers-reduced-motion`, только движение — цвета/тема не тронуты):
- `globals.css`: keyframes `appPop` (scale-in), `appMenu` (slide-in) + утилиты
  `.ds-anim-overlay` / `.ds-anim-pop` / `.ds-anim-menu`.
- Modal: backdrop fade (`ds-anim-overlay`) + карточка scale+fade (`ds-anim-pop`).
- Accordion: плавная высота через `grid-rows 0fr→1fr` + `opacity`, `inert` на
  закрытом; отступ панели схлопывается (без JS-замера scrollHeight).
- Dropdown / Combobox: вход меню `ds-anim-menu` (fade + slide сверху).
- Toast: вход `appMenu` (slide-in).
Уже было и не требовало правок: transitions/hover (глобальный слой), button
active-scale, toggle thumb-slide, tabs active, spinner `spin`.
Sidebar slide — N/A (мобильного drawer в проекте нет, не пре-билдим).

### [x] Фаза 4 — Финальная «живость» (hover / glow / mobile drawer)
- Glow primary-кнопок + focus-кольцо инпутов (прозрачные цветные эффекты).
- Hover на карточках без него: `team-member-card`, `achievement-card`.
- Hover на строках таблиц: `transactions-table`, `articles-table`.
- Icon-button hover: общий `BackHeader` (document-shared).
- **Mobile drawer**: новый `SidebarShell` (`ds/composite/sidebar-shell.tsx`) —
  на <lg плавающий гамбургер + выезжающий слева drawer (backdrop + slide
  `ds-anim-drawer`, закрытие по клику/Escape/смене маршрута, lock скролла).
  Подключён ко всем 5 сайдбарам (Company, Coop-main, CoopRail, Admin, Lk, Partner)
  заменой внешней обёртки — десктоп-вид не меняется (тот же `desktopClassName`).
  До этого на мобилке сайдбар был просто скрыт (`hidden lg:flex`) — навигации не было.

### [ ] Фаза 5 — Reveal / карусель (по требованию)
- Show/Hide reveal и Carousel добавляем, когда конкретный экран их запросит,
  сразу в DS (`src/components/ds/`), а не заранее.

## Итог

Реализовано целенаправленно. Закрыты все **непокрытые непере-темовые** пробелы:
инфраструктура (хук responsive + copy) и motion-полировка DS (modal/accordion/
dropdown/combobox/toast). Остальное из доки уже существовало в DS. Reveal/карусель —
по мере надобности экранов.
