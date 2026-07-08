# MIDHUB Design System — инвентарь

Полный перечень того, что есть в дизайн-системе MIDHUB: токены, базовые компоненты и композитные компоненты.

- Корень DS: `src/components/ds/`
- Единая точка экспорта: `src/components/ds/index.ts`
- Токены: `src/tokens/`
- Семантический слой: `src/styles/globals.css` (`@theme inline`)
- Правила работы: `docs/MIDHUB_WORKFLOW_RULES.md`

Дата среза: 2026-06-11.

---

## 1. Токены (`src/tokens/`)

### 1.1 Цвет — `color.css`

Два слоя: **primitives** (вся палитра в `:root`) и **semantic** (смысловые алиасы в `globals.css`). В UI использовать семантические токены; primitives — только для графиков/иллюстраций.

**Primitives**

| Семейство | Шаги | Ключевой |
|---|---|---|
| Neutrals | `white #ffffff`, `black #000000` | — |
| Dark (текст) | `dark-900 #242b32`, `dark-800 #5a646e` | dark-900 — основной текст |
| Grey | 10 `#f9fafc`, 20 `#f3f6f9`, 90 `#dee5ec`, 100 `#c9d3de`, 200 `#b1becb`, 300 `#93a3b4` | — |
| Blue-midhub (бренд) | 50→900 | `500 #3996fc` |
| Blue-ruswan (2-я марка) | 50→900 | `500 #003cfb` |
| Red | 50→900 | `500 #e92a34` |
| Green | 50→900 | `500 #35b23e` |
| Orange | 50→900 | `500 #f18000` |
| Yellow | 50→900 | `500 #e9c12b` |
| Cyan | 50→900 (без 500) | `400 #68bdc8` |
| Purple | 50→900 | `500 #673ab7` |

**Semantic (используется в UI)**

| Токен | → primitive | Утилита |
|---|---|---|
| `background` / `surface` | white | `bg-background` |
| `surface-muted` | grey-20 | `bg-surface-muted` |
| `surface-sunken` | grey-10 | |
| `foreground` | dark-900 | `text-foreground` |
| `foreground-muted` | dark-800 | |
| `foreground-subtle` | grey-300 | |
| `on-primary` | white | |
| `border` / `border-strong` | grey-90 / grey-100 | `border-border` |
| `ring` | blue-midhub-500 | |
| `primary` / `primary-hover` / `primary-soft` | blue-midhub 500 / 600 / 50 | `bg-primary` |
| `link` | blue-midhub-500 | |
| `success` / `warning` / `error` / `info` | green-500 / orange-500 / red-500 / blue-midhub-500 | `text-error` … |

### 1.2 Типографика — `typography.css`

- Шрифт: **Articulat CF** (`--font-sans`), начертания **Regular 400** и **Medium 500** (с кириллицей).
- Шкала (px, 1:1 с Figma): size / line-height / paragraph-gap
  - h1 48/56/28 · h2 40/48/24 · h3 32/40/20 · h4 24/32/16 · h5 20/28/14
  - p1 18/26/12 · p2 16/24/12 · p3 14/22/10
  - caption 12/20/8 (uppercase tracking 0.5px)
- Классы: `.ds-h1…h5`, `.ds-p1…p3` (+ `-medium`), `.ds-caption` (в `globals.css`).

### 1.3 Отступы и размеры — `spacing.css`

- База 4px: `--space-0…24` (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96).
- Layout: `--container-max: 1200px`, `--gutter: 24px`.

### 1.4 Радиусы и тени — `radius.css`

- Радиусы: `none`, `xs 4`, `sm 6`, `md 8`, `lg 12`, `xl 16`, `2xl 24`, `pill 9999px`.
- Тени (light): `--shadow-xs / sm / md / lg`.

### 1.5 Градиенты — `gradient.css`

- `--gradient-blue` (180°, #5900ff→#04d4ff)
- `--gradient-green` (90°, #a9e3ab→#75ca78)
- `--gradient-orange` (270°, #ff6f00→#ffe27a)
- `--gradient-grey` (270°, fade с альфой — для overlay)
- `--gradient-dark` (0°, #000→#fff)

---

## 2. Базовые компоненты (`src/components/ds/`)

### Типографика и текст
- `Text` — `text.tsx` (варианты, тон)
- `TextBlock`, `TextList`, `Note`, `Quote`, `Overline` — `text-patterns.tsx`
- `Link` — `link.tsx`

### Формы и ввод
- `Input` — `input.tsx`
- `Textarea` — `textarea.tsx`
- `Checkbox` — `checkbox.tsx`
- `Radio` — `radio.tsx`
- `Toggle` — `toggle.tsx`
- `Combobox` — `combobox.tsx`
- `Dropdown`, `DropdownChevron` — `dropdown.tsx`
- `Incriment` — `incriment.tsx`
- `TagInput` — `tag-input.tsx`
- `Calendar` — `calendar.tsx`
- `Datepicker` — `datepicker.tsx`

### Кнопки и действия
- `Button` — `button.tsx`
- `ToggleButton` — `toggle-button.tsx`
- `DeleteButton` — `delete.tsx`

### Загрузка файлов
- `UploadV1` — `upload-v1.tsx`
- `UploadV2`, `UploadFile` — `upload-v2.tsx`
- Иконки загрузки — `upload-icons.tsx` (`UploadArrowIcon`, `UploadPlusIcon`, `UploadEditIcon`, `UploadDeleteIcon`, `UploadPauseIcon`, `UploadLoaderIcon`)

### Навигация и вкладки
- `Tabs`, `Tab` — `tabs.tsx`
- `Pagination` — `pagination.tsx`
- `Accordion` — `accordion.tsx`

### Отображение данных
- `Item`, `ItemDivider` — `item.tsx`
- `TableHeader` — `table-header.tsx` (с сортировкой)
- `Tag`, `AddTag` — `tag.tsx`
- `Badge` — `badge.tsx`
- `Flag` — `flag.tsx`
- `ProgressRing` — `progress-ring.tsx`
- `LabeledDivider` — `labeled-divider.tsx`

### Обратная связь / оверлеи
- `Modal` — `modal.tsx`
- `Toast` — `toast.tsx`
- `Tooltip` — `tooltip.tsx`
- `Banner` — `banner.tsx` + иконки `banner-icons.tsx` (`BannerRouteIcon`, `BannerHourglassIcon`, `BannerTapIcon`, `BannerWaitingIcon`, `BannerReturnIcon`, `BannerInformationIcon`)
- `EmptyState` — `empty-state.tsx`

---

## 3. Композитные компоненты (`src/components/ds/composite/`)

### Карточки
- `AccountCard` — `account-card.tsx`
- `AchievementCard` — `achievement-card.tsx`
- `BasisCard` — `basis-card.tsx` · `BasisEditor` — `basis-editor.tsx`
- `CKPCard` — `ckp-card.tsx`
- `DomainCard` — `domain-card.tsx`
- `InfoCard` — `info-card.tsx`
- `LauncherCard` — `launcher-card.tsx`
- `MemberCard` — `member-card.tsx`
- `ProfileCard` — `profile-card.tsx`
- `QuestionCard` — `question-card.tsx`
- `RoleCard` — `role-card.tsx`
- `TeamMemberCard` — `team-member-card.tsx`
- `VerificationCard` — `verification-card.tsx`

### Формы
- `QuestionForm` — `question-form.tsx`
- `PropertyForm` — `property-form.tsx`
- `RequirementForm` — `requirement-form.tsx`
- `RoleForm` — `role-form.tsx`
- `InviteForm` — `invite-form.tsx`
- `RegistrationForm` — `registration-form.tsx`
- `IncrimentField` — `incriment-field.tsx`
- `WalletField` — `wallet-field.tsx`

### Навигация и каркас
- `Header`, `HeaderIconButton` — `header.tsx` + иконки `header-icons.tsx` (`MidhubLogo`, `HeaderArrowLeftIcon`, `HeaderHomeIcon`, `HeaderGridIcon`, `HeaderChatIcon`, `HeaderExitIcon`)
- `LeftMenu` и части — `left-menu.tsx` (`MenuRail`, `MenuBadge`, `MenuPanel`, `MenuProfileCard`, `MenuButton`, `MenuButtonRow`, `MenuNavItem`, `MenuDivider`, `MenuFooter`, `MenuIcon`)
- `Sidemenu` — `sidemenu.tsx`
- `SidebarPanel` — `sidebar-panel.tsx` · `Panel` — `panel.tsx`
- `Footer` — `footer.tsx`
- `Toolbar` — `toolbar.tsx`
- `SectionHeader` — `section-header.tsx`
- `SearchBar` — `search-bar.tsx`
- `NavHub` и части — `nav-hub.tsx` (`NavHubPage`, `NavHubCard`, `NavHubLinkList`, `NavHubChoiceCard`) — каркас навигационных хаб-экранов / карта переходов

### Лента и чат
- `chat.tsx` — `ChatBubble`, `ChatTopBar`, `ChatSheetHeader`, `ChatThread`, `ChatWindow`, `ContactChip`, `ContactCard`
- `MessageComposer` — `message-composer.tsx`
- `feed-composer.tsx` — `FeedComposer`, `FeedComposerBar`
- `FeedPost` — `feed-post.tsx` + иконки `feed-icons.tsx`
- `profile.tsx` — `ProfileHeader`, `SectionCard`, `ProfileInfoCard`, `AchievementsCard`, `RoleHistoryCard`, `RequirementsCard`

### Таблицы, данные, отчёты
- `TransactionsTable` — `transactions-table.tsx`
- `ArticlesTable` — `articles-table.tsx`
- `AccountCharacteristics` — `account-characteristics.tsx`
- `IncomeSources` — `income-sources.tsx`
- `CheckMatrix` — `check-matrix.tsx`
- `OrgColumns` — `org-columns.tsx`
- `DistributionRow` — `distribution-row.tsx`
- `ReportPeriodBar` — `report-period-bar.tsx` · `ReportFooter` — `report-footer.tsx`
- `StatSummary` — `stat-summary.tsx`

### Графики
- `LineChart` — `line-chart.tsx`
- `stat-charts.tsx` — `BarChart`, `DonutChart`, `GeoBars`

### Прочее
- `SettingRow` — `setting-row.tsx`
- `SelectOption` — `select-option.tsx`
- `DomainNotifications` — `domain-notifications.tsx`
- `WebResourceFilter` — `web-resource-filter.tsx`

---

## Сводка

- Токенов: 5 файлов (цвет, типографика, отступы, радиусы, градиенты).
- Базовых компонентов: ~35 файлов / ~50 экспортируемых единиц.
- Композитных компонентов: ~55 файлов / ~80 экспортируемых единиц.
- Все публичные компоненты реэкспортируются из `src/components/ds/index.ts`.
