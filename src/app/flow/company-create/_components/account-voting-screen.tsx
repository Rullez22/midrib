"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  SectionHeader,
  Button,
  HeaderArrowLeftIcon,
  IncrimentField,
  DistributionRow,
  QuestionCard,
  ProgressRing,
  TableHeader,
  Tooltip,
  type TableColumn,
} from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * AccountVotingScreen — голосование по вопросу «Распределение % по подсчетам
 * целевого счета». Открывается из вопросов голосования (вопрос подсвечен после
 * «Запустить голосование»). Источник: Figma 2492:283045 (до голоса) / 2492:283052
 * (после голоса).
 *
 * Reuse DS: CoopRail · IncrimentField + DistributionRow (read-only — карточка
 * распределения) · QuestionCard + ProgressRing + Button (голосование) ·
 * TableHeader + Tooltip (история транзакций). Структура голосования/истории —
 * 1:1 с CouncilVotingScreen.
 *
 * @param backHref Назад — к вопросам голосования.
 * @param doneHref «Завершить голосование» — на счета (проценты применены).
 */

const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
const TX_FULL = "0x5c243af9b2e1c0d4a6f8e3b1c5d7a9e2f4b6c8d0a1b2c3d4e5f6a7b807db8";
const blue = "var(--color-blue-midhub-500)";
const dark = "var(--color-dark-900)";

const SUBACCOUNTS = ["Счет инвестиционных токенов", "Счет управляющих токенов", "Маршрутный счет"];
const DIST_OPTIONS = [
  { label: "Установить процент опустится ниже которого при будущих корректировках будет невозможно." },
  { label: "Зафиксировать % поступлений без возможности изменений в будущем" },
];

const TX_COLS: TableColumn[] = [
  { key: "user", label: "Участники" },
  { key: "res", label: "Результат", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

function VoteRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

/** Кружок результата: галочка («За») или минус («Против») — синий. */
function CircleMark({ minus = false }: { minus?: boolean }) {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full" style={{ background: blue }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: "#fff" }}>
        {minus ? (
          <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        ) : (
          <path d="m6 12 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function TxLine({ time, minus = false, striped = false }: { time: string; minus?: boolean; striped?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-6 py-4", striped && "bg-[var(--color-grey-10)]")}>
      <span className="flex-1 truncate" style={{ color: dark }}>{ADDR}</span>
      <span className="flex flex-1 justify-center"><CircleMark minus={minus} /></span>
      <span className="flex flex-1 items-center justify-center gap-1.5" style={{ color: blue }}>
        5c243af... 07db8
        <Tooltip content={<span className="break-all">{TX_FULL}</span>} side="top">
          <span className="inline-flex cursor-help"><InfoIcon /></span>
        </Tooltip>
      </span>
      <span className="flex-1 text-right" style={{ color: dark }}>{time}</span>
    </div>
  );
}

export function AccountVotingScreen({ backHref, doneHref }: { backHref?: string; doneHref?: string }) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());
  // Завершить голосование → применить проценты к счетам + перейти на счета.
  const finish = () => {
    flow.finishAccountsVote();
    if (doneHref != null) router.push(doneHref);
  };

  // Распределение из флоу (защитный дефолт на случай прямого захода).
  const dist = flow.distribution ?? { target: 40, subs: [20, 20, 20] };
  // Завершённое голосование открывается в режиме результатов.
  const readOnly = flow.accountsVoteDone;

  const [rawChoice, setChoice] = useState<"За" | "Против" | null>(null);
  const choice = readOnly ? "За" : rawChoice;
  const voted = choice != null;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
          {/* Шапка: назад + заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center">
            <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={goBack} />
            <SectionHeader
              className="absolute left-1/2 -translate-x-1/2"
              title="Распределение % по подсчетам целевого счета"
            />
          </div>

          {/* Карточка распределения (read-only) */}
          <div className="rounded-[4px] border border-border bg-surface p-6">
            <div className="flex w-full max-w-[600px] flex-col gap-4">
              <span className="ds-p3 text-foreground-subtle">Распределение целевого счета</span>
              <IncrimentField label="Целевой счет" size="m" value={dist.target} suffix="%" readOnly />

              <span className="ds-p3 mt-2 text-foreground-subtle">Распределение подсчетов целевого счета</span>
              {SUBACCOUNTS.map((name, i) => (
                <DistributionRow key={name} title={name} value={dist.subs[i] ?? 0} suffix="%" options={DIST_OPTIONS} readOnly />
              ))}
            </div>
          </div>

          {/* Голосование */}
          <QuestionCard title="Голосование" defaultOpen>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex flex-1 flex-col gap-4">
                <VoteRow label="Ваш ID" value="0x608ed3676ab20f3055c7ff4d99428afead95f58a" />
                <VoteRow label="Кол-во голосов для принятия решения" value="5" />
                <VoteRow label="Проголосовало" value={voted ? "5" : "3"} />
                <VoteRow
                  label="Ваш статус ответа"
                  value={
                    voted ? (
                      <span style={{ color: choice === "За" ? blue : "var(--color-red-300)" }}>{choice}</span>
                    ) : (
                      <span className="text-[#f18000]">Ожидает участия</span>
                    )
                  }
                />
                {voted && (
                  <VoteRow label="Статус голосования" value={<span className="text-[var(--color-green-500)]">Выполнено</span>} />
                )}
              </div>
              <div
                className="flex w-full flex-none flex-col items-center overflow-hidden rounded-[4px] border lg:w-[425px]"
                style={{ borderColor: "var(--color-blue-midhub-500)" }}
              >
                <div className="flex flex-col items-center gap-6 px-6 py-6">
                  <div className="flex flex-col gap-2 text-center">
                    <div className="ds-p2-medium text-foreground">Завершенность голосования</div>
                    <div className="ds-p3 text-foreground-subtle">Общее процентное отношение</div>
                  </div>
                  <ProgressRing
                    value={voted ? 100 : 75}
                    size={160}
                    thickness={12}
                    label={<span className="ds-h3 text-foreground">{voted ? 100 : 75}%</span>}
                  />
                </div>
                <div className="w-full bg-[var(--color-grey-20)] p-6">
                  {voted ? (
                    <span className="ds-p3 flex items-center justify-center gap-2 text-foreground-muted">
                      <CircleMark minus={choice === "Против"} />
                      {choice === "За" ? "Вы успешно проголосовали" : "Вы проголосовали против"}
                    </span>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="negative-sec" className="flex-1" onClick={() => setChoice("Против")}>Против</Button>
                      <Button className="flex-1" onClick={() => setChoice("За")}>За</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </QuestionCard>

          {/* «Завершить голосование» — справа, после голоса */}
          {voted && !readOnly && (
            <div className="flex justify-end">
              <Button variant="negative-sec" onClick={finish}>Завершить голосование</Button>
            </div>
          )}

          {/* История транзакций */}
          <QuestionCard title="История транзакций" defaultOpen>
            <div className="-mx-[23px] flex flex-col">
              <TableHeader columns={TX_COLS} sortKey="date" sortDir="desc" />
              {Array.from({ length: voted ? 5 : 3 }).map((_, i) => (
                <TxLine
                  key={i}
                  time={i === 0 ? "11.01.2020 - 13:00" : "11.01.2020 - 12:00"}
                  minus={choice === "Против"}
                  striped={i % 2 === 0}
                />
              ))}
            </div>
          </QuestionCard>
        </div>
      </main>
    </div>
  );
}
