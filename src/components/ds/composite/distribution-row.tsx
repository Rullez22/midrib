"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Incriment } from "../incriment";
import { Checkbox } from "../checkbox";

/**
 * DistributionRow — строка распределения счёта (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / редактирование счёта — «Счет … токенов» (nodes
 * 1503:177626, 1504:178668). Стили 1:1.
 *
 * Бордерная карточка: шапка (заголовок + DS Incriment, %) + строки-опции
 * (подпись + Checkbox), разделённые hairline. Reuse DS Incriment + Checkbox.
 *
 * @example
 *   <DistributionRow title="Счет инвестиционных токенов" defaultValue={0}
 *     options={[{ label: "Зафиксировать % …" }]} />
 */

export interface DistributionOption {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface DistributionRowProps {
  title: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Единица у значения. По умолчанию "%". */
  suffix?: string;
  /** Опции-чекбоксы под шапкой. */
  options?: DistributionOption[];
  /** Только просмотр: значение в рамке без кнопок, чекбоксы неактивны. */
  readOnly?: boolean;
  className?: string;
}

export function DistributionRow({
  title,
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "%",
  options,
  readOnly = false,
  className,
}: DistributionRowProps) {
  return (
    <div className={cn("ds-row overflow-hidden rounded-[4px] border border-border bg-surface shadow-[var(--shadow-sm)] transition-colors", className)}>
      <div className="flex items-center justify-between gap-4 p-4">
        <span className="ds-p3-medium text-foreground">{title}</span>
        <Incriment size="m" suffix={suffix} value={value} defaultValue={defaultValue} onValueChange={onValueChange} min={min} max={max} step={step} readOnly={readOnly} />
      </div>
      {options?.map((o, i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-t border-border p-4">
          <span className="ds-p3 text-foreground-muted">{o.label}</span>
          <Checkbox size="xs" checked={o.checked} defaultChecked={o.defaultChecked} disabled={readOnly} onChange={(e) => o.onChange?.(e.target.checked)} aria-label="Отметить" />
        </div>
      ))}
    </div>
  );
}
