"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { StatSummary, LineChart, AccountCharacteristics } from "@/components/ds";
import { STAT_ITEMS, GRAPH_POINTS, Y_TICKS, CHARACTERISTICS, IncomeBlock, ExpenseGroups } from "./report-data";

/**
 * ReportBody — тело отчёта: 5 показателей периода (StatSummary) → переключатель
 * графика + сегмент-табы (Транзакции / Источники поступлений / Статьи расходов) →
 * контент вкладки. Источник: Figma 2616:397631 / 400312 / 399624 / 401023.
 *
 * Переиспользуется экраном «Отчётность» и вопросом голосования «Финансовый отчёт
 * для совета». Reuse DS: StatSummary · LineChart · AccountCharacteristics +
 * IncomeBlock / ExpenseGroups (на ArticlesTable / IncomeSources).
 */

export type ReportTab = "tx" | "income" | "expense";
const TABS: { k: ReportTab; label: string }[] = [
  { k: "tx", label: "Транзакции" },
  { k: "income", label: "Источники поступлений" },
  { k: "expense", label: "Статьи расходов" },
];

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="M4 13v6M9 9v10M14 5v14M19 11v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ReportBody({
  defaultTab = "tx",
  onTabChange,
  expenseFooter,
}: {
  defaultTab?: ReportTab;
  onTabChange?: (tab: ReportTab) => void;
  /** Нижняя секция монолита на вкладке «Статьи расходов» (футер «Создать отчёт»). */
  expenseFooter?: ReactNode;
}) {
  const [tab, setTab] = useState<ReportTab>(defaultTab);
  const [chartOn, setChartOn] = useState(false);
  const selectTab = (t: ReportTab) => {
    setTab(t);
    onTabChange?.(t);
  };
  // Футер «Создать отчёт» — нижняя секция монолита с ПОЛНОЙ синей рамкой. Когда он
  // есть, тело монолита скругляет только верх и не рисует нижнюю границу (её даёт
  // синяя рамка футера). Figma 2616:354433.
  const hasFooter = tab === "expense" && !!expenseFooter;

  return (
    <div className="flex flex-col">
    {/* Монолит: показатели + [график] + сегмент-табы + контент в одном бордере.
        Figma 2616:398756 / 398757 / 399517 / 398759. */}
    <div className={cn("overflow-hidden border border-border bg-white", hasFooter ? "rounded-t-[8px] border-b-0" : "rounded-[8px]")}>
      <StatSummary items={STAT_ITEMS} bordered={false} />

      {chartOn && (
        <div className="border-t border-border p-5">
          <LineChart unit="ETH" yTicks={Y_TICKS} points={GRAPH_POINTS} highlightIndex={5} />
        </div>
      )}

      {/* Сегмент-бар: переключатель графика + 3 вкладки (Figma 2616:399517) */}
      <div className="flex w-full border-t border-border">
        <button
          type="button"
          onClick={() => setChartOn((v) => !v)}
          aria-label="Показать график"
          aria-pressed={chartOn}
          className={cn(
            "flex w-[60px] shrink-0 items-center justify-center border-b border-r border-border py-3 transition-colors",
            chartOn ? "bg-white text-primary" : "bg-[#f9fafc] text-foreground-subtle hover:text-foreground",
          )}
        >
          <ChartIcon />
        </button>
        {TABS.map((t, i) => (
          <button
            key={t.k}
            type="button"
            onClick={() => selectTab(t.k)}
            className={cn(
              // лёгкий сепаратор под всем таб-баром (в т.ч. под активной вкладкой)
              "flex flex-1 items-center justify-center border-b border-border px-3 py-3 text-center transition-colors",
              i < TABS.length - 1 && "border-r border-border",
              tab === t.k ? "ds-p3-medium bg-white text-primary" : "ds-p3 bg-[#f9fafc] text-foreground-subtle hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Контент вкладки — flush внутри монолита (без собственного бордера) */}
      {tab === "tx" && (
        <AccountCharacteristics title="Характеристики целевого счета" rows={CHARACTERISTICS} defaultOpen className="rounded-none border-0" />
      )}
      {tab === "income" && <IncomeBlock />}
      {tab === "expense" && <ExpenseGroups />}
    </div>
    {/* Футер «Создать отчёт» — отдельная секция с полной синей рамкой, прижата к
        низу монолита (Figma 2616:354433). */}
    {hasFooter && expenseFooter}
    </div>
  );
}
