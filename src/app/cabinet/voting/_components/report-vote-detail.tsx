"use client";

import { SectionHeader, Button, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";
import { type PaymentVote } from "../../../flow/company-create/_components/reg-flow";
import { ReportBody } from "../../report/_components/report-body";
import { PERIOD_DEFAULT } from "../../report/_components/report-data";
import { VotingBlock } from "./voting-block";

/**
 * ReportVoteDetail — детальная страница вопроса «Финансовый отчёт для совета».
 * Источник: Figma 2628:360134 / 360976. Заголовок по центру → период отчёта →
 * тело отчёта (ReportBody, по умолч. «Статьи расходов») → универсальный
 * VotingBlock («Голосование» + «История транзакций»).
 *
 * Reuse: ReportBody (общий с экраном «Отчётность») + VotingBlock (общий блок
 * голосования по всей платформе).
 */
export function ReportVoteDetail({ vote, onBack }: { vote: PaymentVote; onBack: () => void }) {
  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
          {/* Шапка: назад + заголовок по центру (как у совета) */}
          <div className="relative flex min-h-[40px] items-center">
            <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={onBack} />
            <SectionHeader className="absolute left-1/2 -translate-x-1/2" title={vote.title} />
          </div>

          {/* Период отчёта (read-only) */}
          <div className="rounded-[8px] border border-border px-6 py-4">
            <span className="ds-p3 text-foreground-muted">Период отчета: </span>
            <span className="ds-p3 text-foreground">{vote.period ?? PERIOD_DEFAULT}</span>
          </div>

          {/* Тело отчёта — по умолчанию «Статьи расходов» (Figma 2628:360134) */}
          <ReportBody defaultTab="expense" />

          {/* Универсальный блок голосования */}
          <VotingBlock vote={vote} onFinish={onBack} />
        </div>
      </main>
    </div>
  );
}
