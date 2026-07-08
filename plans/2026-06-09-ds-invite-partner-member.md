# Приглашение партнёра и пайщика — DS-компоненты фичи

**Источник:** Figma «UI фичи» — кадры «Управление пайщиками / приглашение»
(111:206, 419:57667 — обзоры) и 22 ноды-компонента/состояния.
**Цель:** разнести фичу на переиспользуемые DS-компоненты (правило 1.1), не верстать
лишнее.

## Аудит и разбивка (24 ноды → ~7 компонентов)

| Компонент | Ноды | Переиспользует |
|---|---|---|
| **SectionHeader** | 111:205, 766:75462 | Text, Button(tertiary) |
| **WalletField** | 418:5, 915:84715, 915:85000 | Input |
| **MemberCard** | 414:1, 915:84998, 917:84920, 915:85200/85301/85361/85421, 937:89378 | Button(negative-sec) |
| **VerificationCard** | 1942:303390, 1942:305217 | Checkbox, Item |
| **Toolbar** | 558:85340 | Checkbox, Button, Pagination |
| **FilterBar** | 558:85148, 1815:413800 | SearchBar, Dropdown, ToggleButton |
| **InviteForm** | 2044:222440, 2076:225357/226224/229279 | Tabs, Banner, Input, Button, Checkbox |
| (обзоры) | 111:206, 419:57667 | — (сборка из компонентов) |

## Фазы

### [x] Фаза 1. Базовые карточки фичи
- `src/components/ds/composite/section-header.tsx` — `<SectionHeader>` (title/subtitle/action/align).
- `src/components/ds/composite/wallet-field.tsx` — `<WalletField>` (шапка «Пайщик №N» +
  DS Input; состояния: пусто/заполнено/с действиями).
- `src/components/ds/composite/member-card.tsx` — `<MemberCard>` (аккордеон-шапка +
  строки label/value паспорта + футер: status `loading`/`success` + «Отменить выбор»).
- Реализованы на Tailwind-утилитах с токен-классами (text-foreground, border-border,
  bg-surface-sunken…) — без новых CSS-файлов (минус Turbopack-кэш `@import`).
- Экспорт в `index.ts`; демо `src/app/ds/invite-demos.tsx` + секция в `page.tsx`.
- `tsc --noEmit` — чисто; визуально сверено (SectionHeader, WalletField ×3, MemberCard ×4).
- Покрыто нод: 02,03,12,13,14,15,16,17,20,21,22,23,24 (13/24).

### [x] Фаза 2. Остальные компоненты
- **VerificationCard** (`src/components/ds/composite/verification-card.tsx`) — чек-лист
  реквизитов: шапка (Checkbox + Medium-заголовок) + строки «Checkbox · лейбл · значение».
  Reuse `Checkbox`. Ноды 1942:303390, 1942:305217.
- **Toolbar** (`src/components/ds/composite/toolbar.tsx`) — полоса grey-20 со слотами
  left/center/right. Демо: bulk-кнопка + «Отмечено: N» + `Pagination` (xs full) + kebab.
  Нода 558:85340.
- **FilterBar** — без нового кода: `SearchBar actions={<Dropdown/> + <ToggleButton/>×2}`.
  Ноды 558:85148, 1815:413800.
- **InviteForm** (`src/components/ds/composite/invite-form.tsx`) — сборка из `SectionHeader`
  + `Tabs` (solid-light, физ/юр) + `Item` + `Input` + `Button` + `Checkbox`. Нода 2044:222440.
- Демо `src/app/ds/invite-phase2-demos.tsx`; экспорт в `index.ts`. `tsc` чисто; сверено 1:1.

## Итог

Реализовано целиком (фазы 1 + 2). Новые композиты: SectionHeader, WalletField, MemberCard,
VerificationCard, Toolbar, InviteForm. FilterBar — reuse SearchBar. Всё из DS-атомов,
новых базовых атомов не вводилось.
