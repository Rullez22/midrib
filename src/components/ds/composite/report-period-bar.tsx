"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * ReportPeriodBar — строка периода отчёта + история отчётов (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / header date & history (674:22),
 * header date & history partner (677:9). Стили 1:1.
 *
 * Слева: «Период отчёта: <даты>» + иконка календаря (открывает выбор периода).
 * Справа: триггер «История отчётов ⌄».
 *
 * @example
 *   <ReportPeriodBar
 *     period="15 декабря 2019 - 22 декабря 2019"
 *     onPickPeriod={openCalendar}
 *     onOpenHistory={openHistory}
 *   />
 */

export interface ReportPeriodBarProps {
  /** Текст периода (например «15 декабря 2019 - 22 декабря 2019»). */
  period: ReactNode;
  /** Подпись слева перед периодом. По умолчанию «Период отчёта:». */
  periodLabel?: ReactNode;
  /** Подпись триггера справа. По умолчанию «История отчётов». */
  historyLabel?: ReactNode;
  /** Показывать триггер «История отчётов» справа. По умолчанию true.
   *  При false период центрируется (экран «обработанные заявки»). */
  showHistory?: boolean;
  /** Статус-плашка справа перед «Историей отчётов» (напр. «Отчёт на голосовании»). */
  statusBadge?: ReactNode;
  onPickPeriod?: () => void;
  onOpenHistory?: () => void;
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
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReportPeriodBar({
  period,
  periodLabel = "Период отчёта:",
  historyLabel = "История отчётов",
  showHistory = true,
  statusBadge,
  onPickPeriod,
  onOpenHistory,
  className,
}: ReportPeriodBarProps) {
  return (
    <div
      className={cn(
        // Бордер-плашка (Figma 6760:460060): grey-10/50 фон, grey-90 рамка,
        // радиус 4. Обёртка встроена в компонент → одинаково во всех кабинетах.
        "w-full rounded-[4px] border border-border bg-[rgba(249,250,252,0.5)] px-6 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-4",
          showHistory ? "justify-between" : "justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="ds-p3 text-foreground-muted">{periodLabel}</span>
          <span className="ds-p3 text-foreground">{period}</span>
          <button
            type="button"
            onClick={onPickPeriod}
            aria-label="Выбрать период"
            className="ml-1 inline-flex items-center text-foreground-subtle transition-colors hover:text-foreground"
          >
            <CalendarIcon />
          </button>
        </div>

        {(statusBadge || showHistory) && (
          <div className="flex items-center gap-4">
            {statusBadge}
            {showHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="ds-p3 inline-flex items-center gap-1 text-foreground transition-colors hover:text-foreground-muted"
              >
                {historyLabel}
                <span className="text-foreground-subtle">
                  <ChevronDown />
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
