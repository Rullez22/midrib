"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Incriment — числовой степпер MIDHUB DS.
 * Источник: Figma «UI Контролы» / Incriment (node 928:21). Стили 1:1.
 *
 *   size   : "l" (48) · "m" (40) · "s" (32)
 *   suffix : единица после значения ("%" по умолч., "" — без неё)
 *
 * Бокс «[ + | значение | − ]»: «+» увеличивает, «−» уменьшает на `step`.
 * Управляемый (`value` + `onValueChange`) или неуправляемый (`defaultValue`).
 * Кнопки гаснут при достижении `min` / `max`.
 *
 * @example
 *   <Incriment defaultValue={0} suffix="%" />
 *   <Incriment value={n} onValueChange={setN} min={0} max={100} step={5} size="m" />
 */

export type IncrimentSize = "l" | "m" | "s";

export interface IncrimentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  size?: IncrimentSize;
  /** Значение (управляемый режим). */
  value?: number;
  /** Значение по умолчанию (неуправляемый режим). */
  defaultValue?: number;
  /** Колбэк смены значения. */
  onValueChange?: (value: number) => void;
  /** Шаг изменения. */
  step?: number;
  /** Минимум. */
  min?: number;
  /** Максимум. */
  max?: number;
  /** Единица после значения. */
  suffix?: string;
  /** Форматирование числа для вывода. */
  format?: (value: number) => string;
  /** Контрол выключен целиком. */
  disabled?: boolean;
  /** Только просмотр: показывает значение в рамке без кнопок «+»/«−». */
  readOnly?: boolean;
}

const SIZE_CLASS: Record<IncrimentSize, string> = {
  l: "ds-incriment--l",
  m: "ds-incriment--m",
  s: "ds-incriment--s",
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const Incriment = forwardRef<HTMLDivElement, IncrimentProps>(
  function Incriment(
    {
      size = "l",
      value,
      defaultValue = 0,
      onValueChange,
      step = 1,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      suffix = "%",
      format,
      disabled = false,
      readOnly = false,
      className,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = useState(defaultValue);
    const current = value !== undefined ? value : internal;

    const set = (next: number) => {
      const clamped = clamp(next, min, max);
      if (clamped === current) return;
      if (value === undefined) setInternal(clamped);
      onValueChange?.(clamped);
    };

    const display = format ? format(current) : String(current);
    const label = suffix ? `${display} ${suffix}` : display;

    // Только просмотр (напр. карточка распределения на голосовании): значение в
    // рамке без кнопок.
    if (readOnly) {
      return (
        <div ref={ref} className={cn("ds-incriment ds-incriment--readonly", SIZE_CLASS[size], className)} {...rest}>
          <span className="ds-incriment__value">{label}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("ds-incriment", SIZE_CLASS[size], disabled && "ds-incriment--disabled", className)}
        {...rest}
      >
        <button
          type="button"
          className="ds-incriment__btn ds-incriment__btn--inc"
          onClick={() => set(current + step)}
          disabled={disabled || current >= max}
          aria-label="Увеличить"
        >
          +
        </button>
        <span className="ds-incriment__value" aria-live="polite">
          {label}
        </span>
        <button
          type="button"
          className="ds-incriment__btn ds-incriment__btn--dec"
          onClick={() => set(current - step)}
          disabled={disabled || current <= min}
          aria-label="Уменьшить"
        >
          −
        </button>
      </div>
    );
  },
);
