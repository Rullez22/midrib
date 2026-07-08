# MIDHUB

Web-first продукт. **Новый отдельный проект** — не смешивать с Vector / Ubuntu
(они лежат в `../source` как референсы). Правила работы: [docs/MIDHUB_WORKFLOW_RULES.md](docs/MIDHUB_WORKFLOW_RULES.md).

## Стек

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (токены через `@theme` в `src/styles/globals.css`)
- **TypeScript**
- Шрифт: **Articulat CF** (self-hosted, `src/fonts/`)

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000  (/ds — витрина Foundations)
```

## Структура

```
src/
├── app/            # роуты (App Router): /, /ds
├── components/ds/  # MIDHUB Design System (компоненты)
├── tokens/         # color · typography · spacing · radius (CSS-переменные)
├── styles/         # globals.css (Tailwind + @theme)
├── fonts/          # Articulat CF (только кириллические веса)
├── lib/            # cn(), fonts
└── assets/
```

## Foundations: важные ограничения

- **Шрифт:** кириллица только в весах **400 / 600 / 700**. `font-weight: 500`
  для кириллицы **не использовать** (нет глифов → системный фолбэк).
- **Тема:** light-first. Dark — позже.
- **Цвета:** текущая палитра — **плейсхолдер**. Заменить primitives `--c-*`
  в `src/tokens/color.css` на брендовые цвета MIDHUB.
- **Git:** пока не инициализирован (этап вёрстки).
