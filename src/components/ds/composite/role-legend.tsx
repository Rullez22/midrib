"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * RoleLegend — легенда цветовой кодировки ролей (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / «Dropdown роли» (1380:163064, строка 1187:106140).
 * Стили 1:1.
 *
 * Белая карточка-поповер: список строк «цветная точка 8px + подпись роли»
 * (P3 Regular, dark-800). Цвет точки — токен палитры MIDHUB (red-200 / orange-200
 * / yellow-300 / green-200 …). Используется как легенда групп ролей на экранах
 * структуры и коллектива подразделения. Вариант `plain` — без рамки/тени
 * (встраиваемая легенда).
 *
 * @example
 *   <RoleLegend items={[
 *     { color: "red-200",    label: "Пайщик кооператива Immatra" },
 *     { color: "orange-200", label: "Пайщик HR отделения" },
 *   ]} />
 */

export interface RoleLegendItem {
  /** Суффикс токена цвета точки, напр. "red-200", "green-200". */
  color: string;
  label: ReactNode;
}

export interface RoleLegendProps {
  items: RoleLegendItem[];
  /** Без рамки и тени — встраиваемая легенда. По умолчанию false. */
  plain?: boolean;
  className?: string;
}

export function RoleLegend({ items, plain = false, className }: RoleLegendProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[4px] p-2",
        !plain &&
          "border border-border bg-white shadow-[0px_7px_12px_0px_rgba(147,163,180,0.15)]",
        className,
      )}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-[4px] p-2 transition-colors hover:bg-surface-muted"
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: `var(--color-${it.color})` }}
          />
          <span className="ds-p3 text-foreground-muted">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
