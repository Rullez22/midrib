"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReportPeriodBar,
  ReportFooter,
  TransactionsTable,
  Calendar,
  Badge,
  type CalendarRange,
} from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow } from "../../../flow/company-create/_components/reg-flow";
import { VotingHistory } from "../../voting/_components/voting-block";
import { ReportBody, type ReportTab } from "./report-body";
import { PERIOD_DEFAULT, TRANSACTIONS, formatRange } from "./report-data";

/**
 * ReportScreen — экран «Отчётность» целевого счёта (Figma 2616:397631 …).
 * Открывается кнопкой «Отчётность» в карточке счёта (CabinetScreen).
 *
 * Состояния:
 *  • период по умолчанию — без футера;
 *  • выбран новый период (календарь) → внизу появляется ReportFooter
 *    «Создать отчёт» (Figma 2616:400690 / 2628:364561);
 *  • «Создать отчёт» → вопрос голосования «Финансовый отчёт для совета»
 *    (kind="report") + плашка «Отчёт на голосовании» (Figma 2627:359394);
 *  • голосование завершено → зелёная плашка «Отчётность» (Figma 2628:363552).
 *
 * Reuse DS: CoopRail · ReportPeriodBar · ReportFooter · Calendar · TransactionsTable
 * · Badge + ReportBody (StatSummary/LineChart/AccountCharacteristics/Articles…) +
 * VotingHistory (общий блок голосования). Голосование — общий механизм RegFlow.
 */

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ReportScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [period, setPeriod] = useState(PERIOD_DEFAULT);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [tab, setTab] = useState<ReportTab>("tx");

  const reportVote = flow.paymentVotes.find((v) => v.kind === "report");
  // Футер «Создать отчёт» — снизу вкладки «Статьи расходов», пока отчёт не отправлен
  // (Figma 2616:354433 / r7 / r8). Период в футере — текущий (по умолч. или выбранный).
  const showFooter = tab === "expense" && !reportVote;

  const onSelectRange = (r: CalendarRange) => {
    setRange(r);
    const formatted = formatRange(r.start, r.end);
    if (formatted) {
      setPeriod(formatted);
      setPickerOpen(false);
    }
  };

  const createReport = () => {
    flow.submitPaymentVote({ title: "Финансовый отчет для совета", kind: "report", period, amount: "0", docName: "—", recipients: [] });
  };

  const statusBadge = reportVote
    ? reportVote.done
      ? <Badge variant="solid" color="green">Согласован</Badge>
      : <Badge variant="solid" color="orange">Отчет на голосовании</Badge>
    : undefined;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-8 lg:px-10">
          {/* Шапка: «Отчетность» + крестик закрытия */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="ds-h5 text-foreground">Отчетность</h1>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => router.push("/cabinet")}
              className="flex size-10 items-center justify-center rounded-[4px] border border-[color:var(--color-red-300)] text-[color:var(--color-red-300)] transition-colors hover:bg-[color:var(--color-red-50)] hover:text-[color:var(--color-red-500)]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Период отчёта + История отчётов (бордерная плашка), календарь-поповер */}
          <div className="relative">
            <ReportPeriodBar
              period={period}
              periodLabel="Период отчета:"
              historyLabel="История отчетов"
              statusBadge={statusBadge}
              onPickPeriod={() => setPickerOpen((v) => !v)}
            />
            {pickerOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 rounded-[8px] border border-border bg-white p-3 shadow-lg">
                <Calendar mode="range" range={range} onSelectRange={onSelectRange} />
              </div>
            )}
          </div>

          {/* Футер «Создать отчёт» — нижняя секция монолита на вкладке
              «Статьи расходов», пока отчёт не отправлен (Figma 2616:354433). */}
          <ReportBody
            onTabChange={setTab}
            expenseFooter={
              showFooter ? (
                <ReportFooter
                  embedded
                  period={period}
                  total="1 120"
                  periodLabel="Период отчета:"
                  createLabel="Создать отчет"
                  onPickPeriod={() => setPickerOpen((v) => !v)}
                  onCreate={createReport}
                />
              ) : undefined
            }
          />

          {/* Отчёт отправлен/завершён → история транзакций голосования */}
          {reportVote && <VotingHistory voted={reportVote.choice != null} against={reportVote.choice === "Против"} />}

          {/* Последние транзакции (общий DS TransactionsTable) */}
          <TransactionsTable transactions={TRANSACTIONS} />
        </div>
      </main>
    </div>
  );
}
