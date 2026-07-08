# Фильтр веб-ресурса — DS (новый композит WebResourceFilter)

**Источник:** Figma «UI фичи» / фильтр веб-ресурс:
- пусто (1939:312194)
- заполнено (1939:312378)
- ручной фильтр, выбор сохранённого отключён (1939:312555)
- открытый список сохранённых фильтров (1940:344107)

**Цель:** карточка фильтра как переиспользуемый композит MIDHUB DS (правило 1.1, 9).

## Аудит (4 ноды) — 100% reuse, новый только композит-обёртка

| Часть | DS-компонент | reuse |
|---|---|---|
| Сохранённые фильтры / Возраст (select + плавающий лейбл + меню с галкой) | `Combobox` size=m | ✅ есть |
| Идентификатор / Содержит слово (плавающий лейбл) | `Input` size=m | ✅ есть |
| Пол (Мужской/Женский) | `Radio` size=xs + label | ✅ есть |
| Поиск (disabled = blue-100 #bedffe) | `Button` primary | ✅ есть |
| Создать фильтр (disabled = blue-100) | `Button` tertiary link | ✅ есть |
| Лейбл «Пол» (Medium 14/22) | `ds-p3-medium` | ✅ токен |
| Карточка (white, рамка, тень) + раскладка + логика футера | — | 🆕 `WebResourceFilter` |

Открытый список (1940:344107) — штатное поведение `Combobox` (`ds-combo__menu`,
галка на выбранном, hover). Отдельный компонент не нужен.

Цвета совпали 1:1 с токенами: primary-disabled и tertiary-disabled = blue-midhub-100
(#bedffe), поля h40 = `ds-field--m`.

## Фазы

### [x] Фаза 1. Композит WebResourceFilter
- `src/components/ds/composite/web-resource-filter.tsx` — управляемый, props:
  `value`/`onChange` (объект `WebResourceFilterValue`), `savedFilterOptions`,
  `ageOptions`, `savedFilterDisabled`, `canSearch`, `onSearch`, `onCreateFilter`.
- Combobox (лейбл всплывает при выборе) + Input (лейбл при заполнении) + Radio +
  футер. Кнопки активны при заданном критерии (или `canSearch`).
- Имя радиогруппы — `useId()` (несколько фильтров на странице не делят группу).
- Экспорт в `src/components/ds/index.ts`.

### [x] Фаза 2. Витрина
- `src/app/ds/web-resource-filter-demos.tsx` — 3 состояния (пусто / заполнено /
  ручной фильтр), управляемые через `useState`.
- Секция «WebResourceFilter» в `src/app/ds/page.tsx` (после Header).
- `tsc --noEmit` — чисто, lint — чисто, визуальная проверка /ds — все 4 состояния
  (вкл. открытый список) совпадают с Figma.

## Итог

Реализован целиком. Новый DS-компонент один — композит `WebResourceFilter`;
остальное собрано из готовых DS (`Combobox`/`Input`/`Radio`/`Button`). Только
токены MIDHUB; хардкод — лишь размеры/тень 1:1 с Figma (`max-w-[955px]`,
`max-w-[298px]`, `rounded-[4px]`, `shadow-[...]`). Исправлен баг коллизии
радиогрупп между инстансами (`useId`).
