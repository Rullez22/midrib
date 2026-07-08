"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";

/**
 * ReportFooter — футер отчёта: период + сумма + кнопка «Создать отчёт» (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / footer (684:16). Стили 1:1.
 *
 * Сборка из DS: бордерная карточка (синий контур) — строка «Период отчёта: <даты>»
 * + иконка календаря + итоговая сумма справа, под ней — Button «Создать отчёт».
 *
 * @example
 *   <ReportFooter period="15 декабря 2019 - 22 декабря 2019" total="1 120" onCreate={create} />
 */

export interface ReportFooterProps {
  period: ReactNode;
  total: ReactNode;
  periodLabel?: ReactNode;
  createLabel?: ReactNode;
  /** Встроен как нижняя секция монолита — без своих боковых/нижних границ и
   *  скругления (рамку даёт монолит), только синяя верхняя граница. */
  embedded?: boolean;
  onPickPeriod?: () => void;
  onCreate?: () => void;
  className?: string;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[18px]">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ReportFooter({
  period,
  total,
  periodLabel = "Период отчёта:",
  createLabel = "Создать отчёт",
  embedded = false,
  onPickPeriod,
  onCreate,
  className,
}: ReportFooterProps) {
  // Figma 2616:354433: белая верхняя строка (период + итог) → синяя рамка →
  // нижняя секция bg blue-midhub-50 с ЦЕНТРИРОВАННОЙ кнопкой «Создать отчёт».
  // embedded — нижняя секция монолита: только синяя верхняя граница.
  const blue = "var(--color-blue-midhub-500)";
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden border",
        // embedded — низ монолита: полная синяя рамка + скруглён только низ,
        // приподнят на 1px, чтобы перекрыть нижнюю серую линию таблицы.
        embedded ? "-mt-px rounded-b-[8px]" : "rounded-[4px]",
        className,
      )}
      style={{ borderColor: blue }}
    >
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="ds-p2-medium text-[#5a646e]">{periodLabel}</span>
          <span className="ds-p2-medium text-[#5a646e]">{period}</span>
          <button
            type="button"
            onClick={onPickPeriod}
            aria-label="Выбрать период"
            className="inline-flex items-center text-foreground-subtle transition-colors hover:text-foreground"
          >
            <CalendarIcon />
          </button>
        </div>
        <span className="ds-p2-medium pr-[18%] text-foreground">{total}</span>
      </div>
      <div className="flex justify-center border-t bg-[#e4f2ff] px-6 py-4" style={{ borderColor: blue }}>
        <Button variant="primary" size="l" onClick={onCreate}>
          {createLabel}
        </Button>
      </div>
    </div>
  );
}
