"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  SectionHeader,
  Button,
  HeaderArrowLeftIcon,
  IncrimentField,
  Checkbox,
  QuestionCard,
  ProgressRing,
  TableHeader,
  Tooltip,
  type TableColumn,
} from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureAccountsReady, useRegFlow } from "./reg-flow";

/**
 * PodschetVotingScreen — голосование по вопросу «Создание нового подсчета».
 * Открывается из вопросов голосования. Источник: Figma 2494:364692 (до голоса) /
 * 2494:364699 (после).
 *
 * Reuse DS: CoopRail · MemberCard + Badge (сводка подсчёта) · IncrimentField
 * (read-only — распределение) · ProgressRing + Checkbox (буфер) · QuestionCard +
 * ProgressRing + Button (голосование) · TableHeader + Tooltip (история).
 *
 * @param backHref Назад — к вопросам голосования.
 * @param doneHref «Завершить голосование» — на счета (подсчёт добавлен).
 */

const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
const TX_FULL = "0x5c243af9b2e1c0d4a6f8e3b1c5d7a9e2f4b6c8d0a1b2c3d4e5f6a7b807db8";
const blue = "var(--color-blue-midhub-500)";
const dark = "var(--color-dark-900)";

const SUBACCOUNTS = ["Счет инвестиционных токенов", "Счет управляющих токенов", "Маршрутный счет"];
const PANEL_OPTS = [
  "Установить минимальный процент, ниже которого нельзя опускаться при будущих корректировках.",
  "Зафиксировать % поступлений без возможности изменений в будущем",
];

const TX_COLS: TableColumn[] = [
  { key: "user", label: "Участники" },
  { key: "res", label: "Результат", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

/** Даты голосов по созданию подсчёта (колонка отсортирована по убыванию). */
const TX_TIMES = [
  "22.04.2025 - 18:12",
  "22.04.2025 - 15:36",
  "22.04.2025 - 11:49",
  "21.04.2025 - 17:22",
  "21.04.2025 - 10:03",
];

function VoteRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

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

function TxLine({ time, striped = false }: { time: string; striped?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-6 py-4", striped && "bg-[var(--color-grey-10)]")}>
      <span className="flex-1 truncate" style={{ color: dark }}>{ADDR}</span>
      <span className="flex flex-1 justify-center"><CircleMark /></span>
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

export function PodschetVotingScreen({ backHref, doneHref }: { backHref?: string; doneHref?: string }) {
  const router = useRouter();
  const flow = useRegFlow();
  useEnsureAccountsReady();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());
  const finish = () => {
    flow.finishPodschetVote();
    if (doneHref != null) router.push(doneHref);
  };

  // Все данные — из черновика, который ты ввёл при создании (название, ОКВЭД,
  // назначение, распределение). Без мок-значений: пустой fallback только чтобы
  // экран не падал при прямом заходе без черновика.
  const draft = flow.podschetDraft ?? {
    name: "",
    type: "pool" as const,
    okved: [] as string[],
    purpose: "",
    target: 0,
    subs: [0, 0, 0],
  };
  const buffer = Math.max(0, 100 - draft.target - draft.subs.reduce((a, b) => a + b, 0));
  const readOnly = flow.podschetVoteDone;

  const [rawChoice, setChoice] = useState<"За" | "Против" | null>(null);
  const choice = readOnly ? "За" : rawChoice;
  const voted = choice != null;

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 md:px-[50px]">
          {/* Шапка */}
          <div className="relative flex min-h-[40px] items-center">
            <Button variant="ghost" size="m" icon={<HeaderArrowLeftIcon />} aria-label="Назад" onClick={goBack} />
            <SectionHeader className="absolute left-1/2 -translate-x-1/2" title="Создание нового подсчета" />
          </div>

          {/* Сводка подсчёта + распределение — ОДНА карточка (Figma 2494:364692).
              Строки характеристик — те же классы, что у AccountCard (серые лейблы,
              парная первая строка с вертикальным разделителем). */}
          <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
            {/* Наименование | Тип счета (две колонки) */}
            <div className="ds-account__row ds-account__row--pair">
              <span className="ds-account__cell">
                <span className="ds-account__cell-label">Наименование счета</span>
                <span className="ds-account__cell-value">{draft.name}</span>
              </span>
              <span className="ds-account__vdivider" aria-hidden="true" />
              <span className="ds-account__cell">
                <span className="ds-account__cell-label">Тип счета</span>
                <span className="ds-account__cell-value">{draft.type === "pool" ? "Счет-пул" : "Счет-матрешка"}</span>
              </span>
            </div>
            <div className="ds-account__row">
              <span className="ds-account__label">Коды и ОКВЭД</span>
              <span className="ds-account__value">{draft.okved.map((c) => <div key={c}>{c}</div>)}</span>
            </div>
            <div className="ds-account__row">
              <span className="ds-account__label">Назначение счета</span>
              <span className="ds-account__value">{draft.purpose}</span>
            </div>
            <div className="ds-account__row">
              <span className="ds-account__label">Источник поступлений</span>
              <span className="ds-account__value">Целевой счет</span>
            </div>

            {/* Распределение (read-only) + буфер — в той же карточке */}
            <div className="flex flex-col gap-8 border-t border-border p-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex w-full max-w-[600px] flex-col gap-4">
                <span className="ds-p3 text-foreground-subtle">Распределение целевого счета</span>
                <IncrimentField label="Целевой счет" size="m" value={draft.target} suffix="%" readOnly />
                <span className="ds-p3 mt-2 text-foreground-subtle">Распределение подсчетов целевого счета</span>
                {SUBACCOUNTS.map((label, i) => (
                  <IncrimentField key={label} label={label} size="m" value={draft.subs[i] ?? 0} suffix="%" readOnly />
                ))}
              </div>
              <div className="flex w-full flex-none flex-col rounded-[4px] border border-border lg:w-[444px]">
                <div className="flex flex-col items-center gap-6 px-6 py-6">
                  <div className="flex flex-col gap-2 text-center">
                    <span className="ds-p2-medium text-foreground">{draft.name}</span>
                    <span className="ds-p3 text-foreground-subtle">Процент переведенный со счетов</span>
                  </div>
                  <ProgressRing value={buffer} size={160} label={<span className="ds-h3 text-foreground">{buffer}%</span>} />
                </div>
                {PANEL_OPTS.map((o) => (
                  <div key={o} className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
                    <span className="ds-caption text-foreground-subtle">{o}</span>
                    <Checkbox size="xs" disabled aria-label="Отметить" />
                  </div>
                ))}
              </div>
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
                  value={voted ? <span style={{ color: choice === "За" ? blue : "var(--color-red-300)" }}>{choice}</span> : <span className="text-[#f18000]">Ожидает участия</span>}
                />
                {voted && <VoteRow label="Статус голосования" value={<span className="text-[var(--color-green-500)]">Выполнено</span>} />}
              </div>
              <div className="flex w-full flex-none flex-col items-center overflow-hidden rounded-[4px] border lg:w-[425px]" style={{ borderColor: blue }}>
                <div className="flex flex-col items-center gap-6 px-6 py-6">
                  <div className="flex flex-col gap-2 text-center">
                    <div className="ds-p2-medium text-foreground">Завершенность голосования</div>
                    <div className="ds-p3 text-foreground-subtle">Общее процентное отношение</div>
                  </div>
                  <ProgressRing value={voted ? 100 : 75} size={160} thickness={12} label={<span className="ds-h3 text-foreground">{voted ? 100 : 75}%</span>} />
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
                <TxLine key={i} time={TX_TIMES[i]} striped={i % 2 === 0} />
              ))}
            </div>
          </QuestionCard>
        </div>
      </main>
    </div>
  );
}
