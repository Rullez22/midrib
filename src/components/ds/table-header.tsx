"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "./checkbox";

/**
 * TableHeader — шапка таблицы (навигация) MIDHUB DS.
 * Источник: Figma «UI фичи» / Navigation (node 155:0; атом «столбец» 968:90300,
 * вариант 6203:163486). Стили 1:1.
 *
 * Ряд заголовков колонок: подпись (`dark-800` 12/20) + опциональная стрелка
 * сортировки (8px). Опционально — чекбокс «выбрать всё» слева и muted-фон.
 *
 *   size : "s" (30) · "m" (46)
 *   tone : "default" (прозрачный) · "muted" (grey-10 + рамка grey-20)
 *
 * @example
 *   <TableHeader
 *     selectable
 *     tone="muted"
 *     sortKey="date" sortDir="desc" onSort={setSort}
 *     columns={[
 *       { key: "name", label: "Имя" },
 *       { key: "addr", label: "Адрес", align: "center" },
 *       { key: "date", label: "Дата заявки", align: "right", sortable: true },
 *     ]}
 *   />
 */

export type TableHeaderSize = "s" | "m";
export type TableHeaderTone = "default" | "muted";
export type SortDir = "asc" | "desc";

export interface TableColumn {
  /** Идентификатор колонки (для сортировки). */
  key: string;
  /** Подпись колонки. */
  label: ReactNode;
  /** Выравнивание. По умолчанию "left". */
  align?: "left" | "center" | "right";
  /** Сортируемая колонка (показывает стрелку). */
  sortable?: boolean;
  /** Фиксированная ширина (CSS). По умолчанию колонка растягивается (flex). */
  width?: string;
  /** Коэффициент растяжения (flex-grow). По умолчанию 1. */
  flex?: number;
}

export interface TableHeaderProps {
  columns: TableColumn[];
  size?: TableHeaderSize;
  tone?: TableHeaderTone;
  /** Чекбокс «выбрать всё» слева. */
  selectable?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Текущая отсортированная колонка. */
  sortKey?: string;
  /** Направление сортировки. По умолчанию "asc". */
  sortDir?: SortDir;
  /** Клик по сортируемой колонке. */
  onSort?: (key: string) => void;
  className?: string;
}

const SIZE_CLASS: Record<TableHeaderSize, string> = {
  s: "ds-thead--s",
  m: "ds-thead--m",
};

const TONE_CLASS: Record<TableHeaderTone, string> = {
  default: "ds-thead--default",
  muted: "ds-thead--muted",
};

const ALIGN_CLASS = {
  left: "ds-thead__cell--left",
  center: "ds-thead__cell--center",
  right: "ds-thead__cell--right",
} as const;

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={cn("ds-thead__sort", active && "ds-thead__sort--active", dir === "asc" && "ds-thead__sort--asc")}
      aria-hidden="true"
    >
      <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m1 3 3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function TableHeader({
  columns,
  size = "s",
  tone = "default",
  selectable = false,
  checked,
  indeterminate,
  onCheckedChange,
  sortKey,
  sortDir = "asc",
  onSort,
  className,
}: TableHeaderProps) {
  return (
    <div
      role="row"
      className={cn("ds-thead", SIZE_CLASS[size], TONE_CLASS[tone], className)}
    >
      {selectable && (
        <span className="ds-thead__check">
          <Checkbox
            size="xs"
            checked={checked}
            indeterminate={indeterminate}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            aria-label="Выбрать всё"
          />
        </span>
      )}
      {columns.map((col) => {
        const active = sortKey === col.key;
        const style = {
          ...(col.width ? { flex: `0 0 ${col.width}`, width: col.width } : { flex: col.flex ?? 1 }),
        };
        const content = (
          <>
            <span className="ds-thead__label">{col.label}</span>
            {col.sortable && <SortArrow active={active} dir={active ? sortDir : "desc"} />}
          </>
        );
        return (
          <div
            key={col.key}
            role="columnheader"
            aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
            className={cn("ds-thead__cell", ALIGN_CLASS[col.align ?? "left"])}
            style={style}
          >
            {col.sortable ? (
              <button type="button" className="ds-thead__sortbtn" onClick={() => onSort?.(col.key)}>
                {content}
              </button>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}
