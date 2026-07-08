"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { QuestionCard } from "./question-card";

/**
 * AccountCharacteristics — сворачиваемая карточка характеристик счёта (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / table «Характеристики целевого счёта» (675:64420). Стили 1:1.
 *
 * Сборка из DS: QuestionCard (раскрытие + бордер + шеврон) + строки-определения.
 * Строка бывает двух видов:
 *   • pair   — две колонки «подпись (синяя) сверху + значение снизу»;
 *   • inline — подпись слева (синяя, фикс. ширина) + значение справа (текст/список).
 *
 * @example
 *   <AccountCharacteristics
 *     title="Характеристики целевого счёта"
 *     rows={[
 *       { cells: [
 *         { label: "Наименование счёта", value: "Целевой" },
 *         { label: "Тип счёта", value: "Матрёшка" },
 *       ] },
 *       { label: "Коды ОКВЭД", value: ["81.22 — …", "81.29.1 — …"] },
 *     ]}
 *   />
 */

export interface AccountCharCell {
  label: ReactNode;
  value: ReactNode;
}

export type AccountCharRow =
  | { cells: AccountCharCell[]; label?: never; value?: never }
  | { label: ReactNode; value: ReactNode | ReactNode[]; cells?: never };

export interface AccountCharacteristicsProps {
  title?: ReactNode;
  rows: AccountCharRow[];
  defaultOpen?: boolean;
  className?: string;
}

function Value({ value }: { value: ReactNode | ReactNode[] }) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-2">
        {value.map((v, i) => (
          <span key={i} className="ds-p3 text-foreground-muted">{v}</span>
        ))}
      </div>
    );
  }
  return <span className="ds-p3 text-foreground-muted">{value}</span>;
}

export function AccountCharacteristics({
  title = "Характеристики целевого счёта",
  rows,
  defaultOpen = true,
  className,
}: AccountCharacteristicsProps) {
  return (
    <QuestionCard
      size="l"
      defaultOpen={defaultOpen}
      title={<span className="block w-full text-center text-foreground">{title}</span>}
      className={className}
    >
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn("py-5", i > 0 && "border-t border-border")}
          >
            {"cells" in row && row.cells ? (
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {row.cells.map((c, ci) => (
                  <div key={ci} className="flex min-w-[200px] flex-1 flex-col gap-2">
                    <span className="ds-caption" style={{ color: "var(--color-blue-midhub-500)" }}>{c.label}</span>
                    <span className="ds-p3 text-foreground-muted">{c.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span
                  className="ds-caption w-[260px] shrink-0"
                  style={{ color: "var(--color-blue-midhub-500)" }}
                >
                  {row.label}
                </span>
                <div className="min-w-[240px] flex-1">
                  <Value value={row.value} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </QuestionCard>
  );
}
