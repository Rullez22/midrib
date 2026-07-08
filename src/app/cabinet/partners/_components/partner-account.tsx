"use client";

import { useState } from "react";
import {
  Tabs,
  Tab,
  ReportPeriodBar,
  StatSummary,
  LineChart,
  TransactionsTable,
} from "@/components/ds";
import { cn } from "@/lib/cn";
import { AccountDocFlow, AccountArtifacts } from "../../_components/account-tabs";
import {
  PARTNER_SUMMARY,
  PARTNER_TRANSACTIONS,
  PARTNER_DOCS,
  PARTNER_ARTIFACTS,
  CHART_POINTS,
  CHART_Y_TICKS,
  CHART_HIGHLIGHT,
} from "./partners-data";

/**
 * PartnerAccount — «Счёт» партнёра (Figma 1857:649850 / 6563:357867 / 1857:649854 /
 * 1857:649862). Верхние табы: Взаиморасчеты / Документооборот / Артефакты.
 *
 * Reuse DS: Tabs · ReportPeriodBar · StatSummary · LineChart · TransactionsTable.
 * Документооборот/Артефакты — общий модуль account-tabs (AccountDocFlow/AccountArtifacts),
 * переиспользуемый экраном «Лицевой счёт» ЛК.
 */

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 15l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Взаиморасчеты (p5/p6) ──────────────────────────────────────────────── */
function Mutual() {
  const [subTab, setSubTab] = useState("all");
  const [chartOpen, setChartOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <ReportPeriodBar
        period="15 декабря 2019 - 22 декабря 2019"
        periodLabel="Период отчета:"
        historyLabel="История отчетов"
      />

      {/* Монолит: сводка + переключатель транзакций (+ график) — единый блок */}
      <div className="w-full overflow-hidden rounded-[8px] border border-border bg-white">
        <StatSummary items={PARTNER_SUMMARY} className="rounded-none border-0" />

        {/* Под-табы транзакций — делят ширину на трети (совпадают с разделителями
            сводки). Кнопка-график наложена поверх левого края первой вкладки. */}
        <div className="relative flex w-full items-stretch border-t border-border">
          <Tabs
            value={subTab}
            onValueChange={setSubTab}
            variant="solid-light"
            size="l"
            equal
            aria-label="Транзакции"
            className="w-full rounded-none border-0"
          >
            <Tab value="all" className="pl-[52px]">Все транзакции</Tab>
            <Tab value="in">Входящие</Tab>
            <Tab value="out">Исходящие</Tab>
          </Tabs>
          <button
            type="button"
            aria-label="График"
            aria-pressed={chartOpen}
            onClick={() => setChartOpen((v) => !v)}
            className={cn(
              "absolute inset-y-0 left-0 z-10 flex w-[52px] items-center justify-center border-r border-border transition-colors",
              chartOpen ? "bg-surface-sunken text-primary" : "bg-white text-foreground-subtle hover:text-foreground",
            )}
          >
            <ChartIcon />
          </button>
        </div>

        {chartOpen && (
          <div className="border-t border-border px-6 py-5">
            <LineChart points={CHART_POINTS} yTicks={CHART_Y_TICKS} unit="ETH" highlightIndex={CHART_HIGHLIGHT} />
          </div>
        )}
      </div>

      {/* Фильтры кодов (чекбоксы + «Все коды») есть только на этом экране. */}
      <TransactionsTable transactions={PARTNER_TRANSACTIONS} />
    </div>
  );
}

export function PartnerAccount() {
  const [tab, setTab] = useState("mutual");
  return (
    <div className="flex flex-col gap-8">
      <Tabs value={tab} onValueChange={setTab} variant="basic" size="l" aria-label="Счёт партнёра" className="w-full">
        <Tab value="mutual">Взаиморасчеты</Tab>
        <Tab value="docs">Документооборот</Tab>
        <Tab value="artifacts">Артефакты</Tab>
      </Tabs>

      {tab === "mutual" && <Mutual />}
      {tab === "docs" && <AccountDocFlow docs={PARTNER_DOCS} />}
      {tab === "artifacts" && <AccountArtifacts artifacts={PARTNER_ARTIFACTS} />}
    </div>
  );
}
