"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "../checkbox";

/**
 * CheckMatrix — матрица чекбоксов (строки × колонки) (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Требование — «уровень верификации» (nodes 120:0,
 * 638:62786 …). Стили 1:1.
 *
 * Бордерная таблица: шапка (grey-10) — угловая подпись + заголовки колонок (могут
 * быть Badge) · строки — подпись + чекбоксы на пересечениях. Reuse DS Checkbox.
 *
 * @example
 *   <CheckMatrix
 *     rowHeader="Тип требований"
 *     columns={[<Badge color="orange">Жёлтый</Badge>, <Badge color="green">Зелёный</Badge>]}
 *     rows={[{ label: "Международный" }, { label: "Локальный" }]}
 *     checked={[[true,false],[false,false]]}
 *     onToggle={(r,c) => …}
 *   />
 */

export interface CheckMatrixRow {
  label: ReactNode;
}

export interface CheckMatrixProps {
  /** Подпись в левом верхнем углу. */
  rowHeader?: ReactNode;
  /** Заголовки колонок (например, Badge). */
  columns: ReactNode[];
  rows: CheckMatrixRow[];
  /** Состояние чекбоксов [строка][колонка]. */
  checked?: boolean[][];
  onToggle?: (row: number, col: number) => void;
  className?: string;
}

export function CheckMatrix({
  rowHeader,
  columns,
  rows,
  checked,
  onToggle,
  className,
}: CheckMatrixProps) {
  const cols = columns.length;
  return (
    <div
      className={cn("overflow-hidden rounded-[4px] border border-border", className)}
      style={{ display: "grid", gridTemplateColumns: `minmax(160px,1fr) repeat(${cols}, minmax(96px,1fr))` }}
    >
      {/* header */}
      <div className="ds-caption-medium flex items-center bg-surface-sunken px-4 py-3 text-foreground-muted">{rowHeader}</div>
      {columns.map((c, i) => (
        <div key={i} className="flex items-center justify-center border-l border-border bg-surface-sunken px-4 py-3">{c}</div>
      ))}
      {/* rows */}
      {rows.map((row, r) => (
        <div key={r} className="contents">
          <div className="ds-p3 flex items-center border-t border-border px-4 py-3 text-foreground-muted">{row.label}</div>
          {columns.map((_, c) => (
            <div key={c} className="flex items-center justify-center border-l border-t border-border px-4 py-3">
              <Checkbox size="xs" checked={checked?.[r]?.[c] ?? false} onChange={() => onToggle?.(r, c)} aria-label="Выбрать" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
