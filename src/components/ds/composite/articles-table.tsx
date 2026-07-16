"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "../link";
import { TableHeader, type TableColumn } from "../table-header";

/**
 * ArticlesTable — таблица статей доходов/расходов с итоговой строкой (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Статьи (680:49), Статьи расходов (2174:230335),
 * footer для статьи (2174:230328). Стили 1:1.
 *
 * Сборка из DS: TableHeader (колонки) + строки (имя + числовые колонки +
 * опц. ссылка «Подробнее») + выделенная строка «Итого» (фон grey-10).
 *
 * @example
 *   <ArticlesTable
 *     columns={[
 *       { key: "name", label: "Статья", flex: 2 },
 *       { key: "code", label: "Код", align: "center" },
 *       { key: "count", label: "Кол-во", align: "center" },
 *       { key: "sum", label: "Сумма", align: "center" },
 *       { key: "total", label: "Итого", align: "center" },
 *     ]}
 *     rows={[{ cells: ["Счёт инвестиционных токенов", "214", "20", "400", "400"], onDetail: () => {} }]}
 *     total={{ label: "Итого", cells: ["", "70", "1 000", "230"] }}
 *   />
 */

export interface ArticlesRow {
  /** Значения ячеек (по числу колонок; первая — имя статьи). */
  cells: ReactNode[];
  /** Показать ссылку «Подробнее» в конце строки. */
  onDetail?: () => void;
  detailLabel?: ReactNode;
}

export interface ArticlesTotal {
  /** Текст в колонке имени (например «Итого»). */
  label: ReactNode;
  /** Значения остальных колонок (выровнены к колонкам после имени). */
  cells: ReactNode[];
}

export interface ArticlesTableProps {
  columns: TableColumn[];
  rows: ArticlesRow[];
  total?: ArticlesTotal;
  className?: string;
}

function colStyle(col: TableColumn): CSSProperties {
  return col.width ? { flex: `0 0 ${col.width}`, width: col.width } : { flex: col.flex ?? 1 };
}
function alignClass(align?: TableColumn["align"]) {
  return align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
}

export function ArticlesTable({ columns, rows, total, className }: ArticlesTableProps) {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <TableHeader columns={columns} size="m" tone="muted" />

      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center border-b border-border px-4 py-4 transition-colors hover:bg-[color:var(--color-grey-10)]">
          {columns.map((col, ci) => (
            <div
              key={col.key}
              className={cn("ds-p3 text-foreground", alignClass(col.align))}
              style={colStyle(col)}
            >
              {row.cells[ci]}
            </div>
          ))}
          {row.onDetail && (
            <div className="shrink-0 pl-2 text-right">
              <Link href="#" size="p3" onClick={(e) => { e.preventDefault(); row.onDetail?.(); }}>
                {row.detailLabel ?? "Подробнее"}
              </Link>
            </div>
          )}
        </div>
      ))}

      {total && (
        <div className="flex items-center rounded-[6px] bg-[var(--color-grey-10)] px-4 py-4">
          <div className={cn("ds-p3-medium text-foreground", alignClass(columns[0]?.align))} style={colStyle(columns[0])}>
            {total.label}
          </div>
          {columns.slice(1).map((col, i) => (
            <div
              key={col.key}
              className={cn("ds-p3-medium text-foreground", alignClass(col.align))}
              style={colStyle(col)}
            >
              {total.cells[i]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
