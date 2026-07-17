"use client";

import { useRouter } from "next/navigation";
import { MidhubLogo, HeaderExitIcon, Dropdown } from "@/components/ds";
import { cn } from "@/lib/cn";

/**
 * GlobeScreen — «Общая цель планеты Земля» глобального кооператива
 * (Figma 7021-572169). Открывается по кнопке-глобусу на экране «Пространства».
 * Матрица КОБ-уровней (7→1) × 7 колонок; клик по ячейке ведёт к категориям.
 * Собрано из DS: Header-примитивы (лого/выход), Dropdown.
 */

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M4 11 12 4l8 7M6 9.5V19h12V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── КОБ-строки: цвет, подпись, число (1:1 из Figma) ───────────────────────────
const KOB_ROWS = [
  { n: 7, color: "#a58cd2", value: "1" },
  { n: 6, color: "#6cb3f8", value: "10" },
  { n: 5, color: "#90c4f6", value: "100" },
  { n: 4, color: "#9ed89f", value: "1 000" },
  { n: 3, color: "#edd65d", value: "10 000" },
  { n: 2, color: "#fac06c", value: "100 000" },
  { n: 1, color: "#e89297", value: "1 000 000" },
];
const COLS = 7;

export function GlobeScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Полоса 1 — приложение: лого слева, выход справа. */}
      <header className="sticky top-0 z-20 flex h-[60px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
        <button type="button" aria-label="На главную" onClick={() => router.push("/cabinet/about")} className="flex items-center">
          <MidhubLogo className="size-8" />
        </button>
        <button
          type="button"
          aria-label="Выход"
          onClick={() => router.push("/cabinet/about")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <HeaderExitIcon className="size-4" />
        </button>
      </header>

      {/* Полоса 2 — навигация: домой + регион · синяя плашка цели. */}
      <div className="sticky top-[60px] z-10 flex h-[64px] w-full items-center justify-between gap-4 border-b border-border bg-surface px-5 md:px-[50px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Домой"
            onClick={() => router.push("/cabinet/spaces")}
            className="flex size-9 items-center justify-center rounded-[6px] bg-[color:var(--color-blue-midhub-500)] text-[#fff] transition-colors hover:bg-[color:var(--color-blue-midhub-600)]"
          >
            <HomeIcon className="size-4" />
          </button>
          <Dropdown
            align="start"
            items={[
              { value: "earth", label: "Земля" },
              { value: "ru", label: "Россия" },
            ]}
            /* Триггер отзывается на курсор так же, как поля DS (.ds-field): подсветка рамки. */
            trigger={({ open }) => (
              <span className={cn(
                "flex h-9 min-w-[200px] cursor-pointer items-center justify-between gap-2 rounded-[6px] border border-border bg-[#fff] px-3",
                "transition-colors hover:border-[color:var(--color-grey-200)]",
                open && "border-[color:var(--color-grey-200)]",
              )}>
                <span className="flex flex-col gap-0 leading-[1.15]">
                  <span className="ds-caption text-foreground-subtle leading-[1.15]">Глобальный кооператив</span>
                  <span className="ds-p3 text-foreground leading-[1.15]">Земля</span>
                </span>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" className={cn("shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
                  <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          />
        </div>

        <span className="-translate-x-1/2 absolute left-1/2 flex h-9 items-center rounded-[6px] bg-[color:var(--color-blue-midhub-500)] px-5 text-[#fff]">
          <span className="ds-p3-medium">Общая цель планеты земля и ее идеология</span>
        </span>
      </div>

      {/* Матрица КОБ */}
      <div className="w-full overflow-x-auto px-5 py-8 md:px-[50px]">
        <div className="min-w-[900px] overflow-hidden rounded-[8px] border border-border">
          <div className="grid grid-cols-7 gap-px bg-border">
            {KOB_ROWS.map((row) =>
              Array.from({ length: COLS }).map((_, ci) => (
                <button
                  key={`${row.n}-${ci}`}
                  type="button"
                  onClick={() => router.push("/cabinet/spaces/categories")}
                  className="flex min-h-[68px] flex-col items-center justify-center gap-0.5 text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: row.color }}
                >
                  <span className="ds-p3-medium text-[#fff]">КОБ - {row.n}</span>
                  <span className="ds-caption text-[rgba(255,255,255,0.9)]">{row.value}</span>
                </button>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
