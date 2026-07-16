"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useTableSort } from "@/lib/use-table-sort";
import { QuestionCard, Button, ProgressRing, TableHeader, Tooltip, Link, type TableColumn } from "@/components/ds";
import { useRegFlow, type PaymentVote } from "../../../flow/company-create/_components/reg-flow";

/**
 * VotingBlock — универсальный нижний блок голосования (1:1 с советом): карточка
 * «Голосование» (статусы + донат завершённости + Против/За) → «Завершить
 * голосование» → карточка «История транзакций». Един на всю платформу
 * (платежи, подключения к пулу, финансовый отчёт). Состояние — через RegFlow
 * (castPaymentVote / finishPaymentVote).
 *
 * Вынесено из payment-vote-detail, чтобы не дублировать между вопросами
 * платежей/подключений и финансового отчёта.
 */

const VOTER_ID = "0x608ed3676ab20f3055c7ff4d69428afead95f58a";
const TX_ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
const TX_FULL = "0x5c243af9b2e1c0d4a6f8e3b1c5d7a9e2f4b6c8d0a1b2c3d4e5f6a7b807db8";
const blue = "var(--color-blue-midhub-500)";
const dark = "var(--color-dark-900)";

/** Время голосов в истории транзакций — от свежего к раннему (сортировка по дате desc). */
const TX_TIMES = [
  "22.04.2025 - 16:40",
  "22.04.2025 - 15:05",
  "22.04.2025 - 12:18",
  "21.04.2025 - 18:32",
  "21.04.2025 - 10:47",
];

const TX_COLS: TableColumn[] = [
  { key: "user", label: "Участники" },
  { key: "res", label: "Результат", align: "center" },
  { key: "tx", label: "Номер транзакции", align: "center" },
  { key: "date", label: "Дата", align: "right", sortable: true },
];

export function VoteRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="ds-caption text-foreground-subtle">{label}</span>
      <span className="ds-p3 text-foreground">{value}</span>
    </div>
  );
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-foreground-subtle">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
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

function TxLine({ time, minus = false, striped = false }: { time: string; minus?: boolean; striped?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-6 py-4", striped && "bg-[var(--color-grey-10)]")}>
      <span className="flex-1 truncate" style={{ color: dark }}>{TX_ADDR}</span>
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

/** Карточка «История транзакций» голосования (5 строк после голоса, иначе 3). */
export function VotingHistory({ voted, against = false }: { voted: boolean; against?: boolean }) {
  // Строка = время голоса; сортируется только колонка «Дата» (остальные без стрелки).
  // Формат «22.04.2025 - 16:40» разбирает сам хук (useTableSort → asDate).
  const times = TX_TIMES.slice(0, voted ? 5 : 3);
  const { sorted, sortKey, sortDir, onSort } = useTableSort(times, {
    key: "date",
    dir: "desc",
    accessor: (t, k) => (k === "date" ? t : undefined),
  });

  return (
    <QuestionCard title="История транзакций" defaultOpen>
      <div className="-mx-[23px] flex flex-col">
        <TableHeader columns={TX_COLS} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        {sorted.map((t, i) => (
          <TxLine key={t} time={t} minus={against} striped={i % 2 === 0} />
        ))}
      </div>
    </QuestionCard>
  );
}

/** Универсальный блок голосования: «Голосование» + «Завершить» + «История транзакций». */
export function VotingBlock({ vote, onFinish }: { vote: PaymentVote; onFinish?: () => void }) {
  const flow = useRegFlow();
  const choice = vote.choice;
  const voted = choice != null;
  const readOnly = vote.done;

  const finish = () => {
    flow.finishPaymentVote(vote.id);
    onFinish?.();
  };

  return (
    <>
      <QuestionCard title="Голосование" defaultOpen>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <VoteRow label="Ваш ID" value={VOTER_ID} />
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
                  <Button variant="negative-sec" className="flex-1" onClick={() => flow.castPaymentVote(vote.id, "Против")}>Против</Button>
                  <Button className="flex-1" onClick={() => flow.castPaymentVote(vote.id, "За")}>За</Button>
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

      <VotingHistory voted={voted} against={choice === "Против"} />
    </>
  );
}
