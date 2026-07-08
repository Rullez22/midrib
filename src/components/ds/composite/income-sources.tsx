"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge, type BadgeColor } from "../badge";

/**
 * IncomeSources — строки источников поступлений по счетам (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Источники поступлений (679:64533). Стили 1:1.
 *
 * Сборка из DS: Badge (цветной счёт) + описание + код + значение. Строки
 * разделены линиями.
 *
 * @example
 *   <IncomeSources
 *     rows={[
 *       { account: "Целевой счёт", color: "green", description: "Взносы и иные целевые поступления", code: "214", value: "10" },
 *       { account: "Маршрутный счёт", color: "cyan", description: "Прибыль с направлений", code: "216", value: "22" },
 *     ]}
 *   />
 */

export interface IncomeSourceRow {
  account: ReactNode;
  color: BadgeColor;
  description: ReactNode;
  code: ReactNode;
  value: ReactNode;
}

export interface IncomeSourcesProps {
  rows: IncomeSourceRow[];
  /** Шапка таблицы (Источник / Назначение / Код / Сумма (ETH)). По умолч. false. */
  showHeader?: boolean;
  className?: string;
}

export function IncomeSources({ rows, showHeader = false, className }: IncomeSourcesProps) {
  // Колонки 1:1 с Figma 2616:349675: badge w-160 (pl-6) · Назначение flex (pl-6) ·
  // Код/Сумма w-160 center, привязаны справа правым гаттером 68px (Код центр —
  // right-310, Сумма центр — right-148). Шапка с нижним сепаратором.
  return (
    <div className={cn("flex w-full flex-col", className)}>
      {showHeader && (
        <div className="flex items-center border-b border-border bg-[#f9fafc] py-3 pl-6">
          <span className="ds-caption-medium w-[160px] shrink-0 text-foreground-subtle">Источник</span>
          <span className="ds-caption-medium flex-1 pl-6 text-foreground-subtle">Назначение</span>
          <span className="ds-caption-medium w-[160px] shrink-0 text-center text-foreground-subtle">Код</span>
          <span className="ds-caption-medium w-[160px] shrink-0 text-center text-foreground-subtle">Сумма (ETH)</span>
          <span className="w-[68px] shrink-0" aria-hidden />
        </div>
      )}
      {rows.map((r, i) => (
        <div
          key={i}
          className={cn("flex items-center py-4 pl-6", i > 0 && "border-t border-border")}
        >
          <div className="w-[160px] shrink-0">
            <Badge variant="solid" color={r.color} className="px-3 py-1.5 text-[14px]">
              {r.account}
            </Badge>
          </div>
          <span className="ds-p3 flex-1 pl-6 text-foreground-muted">{r.description}</span>
          <span className="ds-p3 w-[160px] shrink-0 text-center text-foreground">{r.code}</span>
          <span className="ds-p3 w-[160px] shrink-0 text-center text-foreground">{r.value}</span>
          <span className="w-[68px] shrink-0" aria-hidden />
        </div>
      ))}
    </div>
  );
}
