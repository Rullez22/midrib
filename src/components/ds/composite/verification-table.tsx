"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "../checkbox";
import { Flag } from "../flag";
import { Badge, type BadgeColor } from "../badge";

/**
 * VerificationTable — таблица «страна × уровень верификации» (композит MIDHUB DS).
 * Источник: Figma — ПП / Настройка формы регистрации (node 2671:398104,
 * таблица 1915:338958). Стили 1:1.
 *
 * Двухуровневая шапка: группы (Локальная / Международная) над парами колонок-
 * бейджей (Жёлтая / Зелёная). Тело — строки со страной (Flag) и чекбоксами на
 * пересечениях. Низ — строка «Всего» с количеством отмеченных по каждой колонке.
 *
 * Reuse DS: Checkbox + Flag + Badge. На узких экранах таблица скроллится по
 * горизонтали (min-width), без слома вёрстки.
 *
 * @example
 *   <VerificationTable
 *     countries={[{ code: "at", label: "Австрия" }, { code: "ru", label: "Россия" }]}
 *     groups={[
 *       { label: "Локальная", columns: [{ label: "Жёлтая", color: "orange" }, { label: "Зелёная", color: "green" }] },
 *       { label: "Международная", columns: [{ label: "Жёлтая", color: "orange" }, { label: "Зелёная", color: "green" }] },
 *     ]}
 *   />
 */

export interface VerificationCountry {
  code: string;
  label: ReactNode;
}

export interface VerificationColumn {
  label: ReactNode;
  color: BadgeColor;
}

export interface VerificationGroup {
  label: ReactNode;
  columns: VerificationColumn[];
}

export interface VerificationTableProps {
  countries: VerificationCountry[];
  groups: VerificationGroup[];
  /** Подпись угловой ячейки. По умолчанию «Страны». */
  rowHeader?: ReactNode;
  /** Подпись строки итогов. По умолчанию «Всего». */
  totalsLabel?: ReactNode;
  /** Скрыть строку итогов. */
  hideTotals?: boolean;
  /** Начальное состояние [страна][колонка]. */
  defaultChecked?: boolean[][];
  /** Колбэк при переключении ячейки. */
  onToggle?: (row: number, col: number, checked: boolean) => void;
  className?: string;
}

export function VerificationTable({
  countries,
  groups,
  rowHeader = "Страны",
  totalsLabel = "Всего",
  hideTotals = false,
  defaultChecked,
  onToggle,
  className,
}: VerificationTableProps) {
  // Плоский список колонок с флагом «первая в группе» — только такие колонки
  // получают вертикальный разделитель (после «Страны» и между группами).
  const flatColumns = groups.flatMap((g) =>
    g.columns.map((col, ci) => ({ ...col, groupStart: ci === 0 })),
  );
  const colCount = flatColumns.length;

  const [checked, setChecked] = useState<boolean[][]>(
    () =>
      defaultChecked ??
      countries.map(() => Array.from({ length: colCount }, () => false)),
  );

  const toggle = (r: number, c: number) => {
    setChecked((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = !next[r][c];
      onToggle?.(r, c, next[r][c]);
      return next;
    });
  };

  const totals = flatColumns.map(
    (_, c) => checked.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0),
  );

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div
        className="grid min-w-[760px] overflow-hidden rounded-[4px] border border-border"
        style={{
          gridTemplateColumns: `minmax(180px,1.4fr) repeat(${colCount}, minmax(90px,1fr))`,
        }}
      >
        {/* Шапка, ряд 1: угловая ячейка (на 2 ряда) + группы */}
        <div
          className="ds-caption-medium flex items-center bg-surface-sunken px-6 py-3 text-foreground"
          style={{ gridRow: "1 / span 2" }}
        >
          {rowHeader}
        </div>
        {groups.map((g, gi) => (
          <div
            key={gi}
            className="ds-caption-medium flex items-center justify-center border-l border-border bg-surface-sunken px-4 pt-3 text-foreground"
            style={{ gridColumn: `span ${g.columns.length}` }}
          >
            {g.label}
          </div>
        ))}

        {/* Шапка, ряд 2: бейджи колонок (пилюля -300, фикс. ширина) */}
        {flatColumns.map((c, ci) => (
          <div
            key={ci}
            className={cn(
              "flex items-center justify-center bg-surface-sunken px-4 pb-3 pt-2",
              c.groupStart && "border-l border-border",
            )}
          >
            <Badge
              variant="solid"
              color={c.color}
              className="min-w-[106px] justify-center text-center"
              style={{ "--b-solid-bg": `var(--color-${c.color}-300)` } as React.CSSProperties}
            >
              {c.label}
            </Badge>
          </div>
        ))}

        {/* Тело: строки стран */}
        {countries.map((country, r) => (
          <div key={country.code} className="contents">
            <div className="ds-caption flex items-center gap-2 border-t border-border px-6 py-2.5 text-foreground-muted">
              <Flag code={country.code} width={24} />
              <span>{country.label}</span>
            </div>
            {flatColumns.map((c, ci) => (
              <div
                key={ci}
                className={cn(
                  "flex items-center justify-center border-t border-border px-4 py-2.5",
                  c.groupStart && "border-l",
                )}
              >
                <Checkbox
                  size="xs"
                  checked={checked[r]?.[ci] ?? false}
                  onChange={() => toggle(r, ci)}
                  aria-label="Выбрать"
                />
              </div>
            ))}
          </div>
        ))}

        {/* Итоги */}
        {!hideTotals && (
          <div className="contents">
            <div className="ds-caption-medium flex items-center border-t border-border px-6 py-3 text-foreground">
              {totalsLabel}
            </div>
            {totals.map((t, c) => (
              <div
                key={c}
                className={cn(
                  "ds-caption-medium flex items-center justify-center border-t border-border px-4 py-3 text-foreground",
                  flatColumns[c].groupStart && "border-l",
                )}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
