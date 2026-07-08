"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SelectOption — вариант выбора с цветным CTA (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / select part — «Желтый тип / Выбрать» (nodes 2233:231188,
 * 2233:231062, 2233:231211). Стили 1:1.
 *
 * По центру: заголовок (Medium 16/24) + описание (grey-300 14/22) + цветная кнопка
 * «Выбрать» (orange / green / blue / red).
 *
 * @example
 *   <SelectOption color="orange" title="Желтая"
 *     description="Дистанционная верификация по международным стандартам" onSelect={…} />
 */

export type SelectOptionColor = "orange" | "green" | "blue" | "red";

export interface SelectOptionProps {
  title: ReactNode;
  description?: ReactNode;
  /** Цвет кнопки. По умолчанию "blue". */
  color?: SelectOptionColor;
  /** Подпись кнопки. По умолчанию «Выбрать». */
  buttonLabel?: ReactNode;
  onSelect?: () => void;
  className?: string;
}

const BTN_BG: Record<SelectOptionColor, string> = {
  orange: "var(--color-orange-300)",
  green: "var(--color-green-400)",
  blue: "var(--color-blue-midhub-500)",
  red: "var(--color-red-400)",
};

export function SelectOption({
  title,
  description,
  color = "blue",
  buttonLabel = "Выбрать",
  onSelect,
  className,
}: SelectOptionProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 px-4 text-center", className)}>
      <div className="flex flex-col gap-2">
        <span className="ds-p2-medium text-foreground">{title}</span>
        {description != null && <span className="ds-p3 text-foreground-subtle">{description}</span>}
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="ds-p3-medium rounded-[4px] px-6 py-[9px] text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: BTN_BG[color] }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
