"use client";

import { cn } from "@/lib/cn";
import { SectionHeader, Button, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";
import { type PaymentVote } from "../../../flow/company-create/_components/reg-flow";
import { SectionTitle, ReadField } from "../../payment/_components/payment-shared";
import { VotingBlock } from "./voting-block";

/**
 * TokenVoteDetail — детальная страница вопроса «Создание нового токена».
 * Источник: Figma 6523:329838 / 330150. Заголовок по центру → «Настройка токена»
 * (название + токен-роли) → «Основание для платежа» (read-only) → «Вопросы
 * голосования» (аккордеоны) → универсальный VotingBlock.
 *
 * Reuse DS: CoopRail · SectionHeader · Button · Accordion · payment-shared
 * (SectionTitle · ReadField) · VotingBlock (общий блок голосования платформы).
 */

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0 text-foreground-subtle">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Заголовок колонки read-only таблицы основания. */
function Col({ children, flex, align }: { children: React.ReactNode; flex: number; align?: "center" | "right" }) {
  return (
    <span className={cn("ds-caption-medium text-foreground-subtle", align === "center" && "text-center", align === "right" && "text-right")} style={{ flex }}>
      {children}
    </span>
  );
}

export function TokenVoteDetail({ vote, onBack }: { vote: PaymentVote; onBack: () => void }) {
  const base = vote.baseDoc ?? { type: "Основание", name: vote.docName, date: "14.02.2025" };
  const questions = vote.questions ?? [];

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

          {/* Настройка токена (read-only) */}
          <div className="flex flex-col gap-4">
            <SectionTitle>Настройка токена</SectionTitle>
            <div className="flex flex-col gap-5">
              <ReadField label="Название токена" value={vote.tokenName ?? "—"} />
              <ReadField label="Токен-роли" value="-" />
            </div>
          </div>

          {/* Основание для платежа (read-only) */}
          <div className="flex flex-col gap-3">
            <span className="ds-p2-medium text-foreground">Основание для платежа</span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-4 py-2">
                <Col flex={2}>Тип документа</Col>
                <Col flex={1} align="center">Статус</Col>
                <Col flex={1} align="right">Дата</Col>
              </div>
              <div className="flex items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
                <div className="flex flex-col gap-0.5" style={{ flex: 2 }}>
                  <span className="ds-caption text-foreground-subtle">{base.type}</span>
                  <span className="ds-p3 text-foreground">{base.name}</span>
                </div>
                <div className="flex justify-center" style={{ flex: 1 }}>
                  <span className="inline-flex items-center rounded-[4px] bg-[#e6f6e7] px-3 py-1.5 ds-caption-medium text-[#54be5a]">Согласован</span>
                </div>
                <div className="ds-p3 text-right text-foreground" style={{ flex: 1 }}>{base.date}</div>
              </div>
            </div>
          </div>

          {/* Вопросы голосования (аккордеоны, read-only) */}
          {questions.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="ds-p2-medium text-foreground">Вопросы голосования</span>
              <div className="flex flex-col gap-2">
                {questions.map((q) => (
                  <div key={q} className="ds-row flex items-center gap-4 rounded-[4px] border border-border bg-surface px-6 py-4">
                    <span className="ds-p3 flex-1 text-foreground">{q}</span>
                    <Chevron />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Универсальный блок голосования */}
          <VotingBlock vote={vote} onFinish={onBack} />
        </div>
      </main>
    </div>
  );
}
