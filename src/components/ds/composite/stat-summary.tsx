import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * StatSummary — ряд карточек сводной статистики (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Header information (676:64411 · 674:41 · 1316:152300 …),
 * Label (675:64307). Стили 1:1.
 *
 * Бордерная карточка с колонками «подпись (subtle) + крупное значение»,
 * разделёнными вертикальными линиями. Кол-во колонок — по длине `items`,
 * ширина тянется (web-first, адаптив через flex-wrap).
 *
 * @example
 *   <StatSummary
 *     items={[
 *       { label: "Ваш оборот с компанией", value: "1000 ETH" },
 *       { label: "Поступило за период", value: "97 ETH" },
 *       { label: "Расходы за период", value: "518 ETH" },
 *     ]}
 *   />
 */

export interface StatSummaryItem {
  label: ReactNode;
  value: ReactNode;
}

export interface StatSummaryProps {
  items: StatSummaryItem[];
  /** Внешний бордер + скругление. При false — для встраивания в монолит. По умолч. true. */
  bordered?: boolean;
  className?: string;
}

export function StatSummary({ items, bordered = true, className }: StatSummaryProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap overflow-hidden bg-white",
        bordered && "rounded-[8px] border border-border",
        className,
      )}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className={cn(
            "flex min-w-[180px] flex-1 flex-col gap-3 px-6 py-5",
            i > 0 && "border-l border-border",
          )}
        >
          <span className="ds-caption text-foreground-subtle">{it.label}</span>
          <span className="ds-h4 text-foreground">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
