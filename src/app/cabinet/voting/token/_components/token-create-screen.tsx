"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button, Input, Checkbox } from "@/components/ds";
import { CoopRail } from "../../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow } from "../../../../flow/company-create/_components/reg-flow";
import { PageHeader, SectionTitle, Th } from "../../../payment/_components/payment-shared";

/**
 * TokenCreateScreen — флоу «Создание нового токена» (таб «Токены» → «Создать
 * токены»). Источник Figma: 6523:328574 (пусто) · 328738/328902 (заполнено) ·
 * 329066/329452 (выбор вопросов).
 *
 * Две фазы одного мастер-экрана (как у «Разового платежа»):
 *   settings  — «Настройка токена» (название + токен-роли) + «Основание для
 *               создания нового токена» (таблица-мультивыбор) → «Продолжить».
 *   questions — те же поля (read-only) + «Основание для платежа» (выбранное) +
 *               «Выбор вопросов голосования» → «Отправить на совет».
 *
 * «Отправить на совет» → submitPaymentVote(kind="token") → вопрос появляется в
 * списке голосования; после завершения голосования токен появляется в табе
 * «Токены» (finishPaymentVote). Состояние — через RegFlow.
 *
 * Reuse DS: CoopRail · Input · Checkbox · Button · payment-shared (PageHeader ·
 * SectionTitle · Th). Шапка — back + заголовок по центру, как у соседних
 * экранов создания (payment-once / podschet-create).
 */

/** Основания для создания токена (мок, 1:1 из Figma). */
const TOKEN_BASES: { type: string; name: string; date: string }[] = [
  { type: "Основание", name: "Кооператив Слоненок стал пайщиком кооператива Immatra", date: "12.01.2020" },
  { type: "Договор", name: "Договор №2", date: "11.01.2020" },
  { type: "Договор", name: "Договор №3", date: "10.01.2020" },
];

const TOKEN_QUESTIONS = ["Вопрос 1", "Вопрос 2", "Вопрос 3", "Вопрос 4"];

const Q_DESC =
  "Тут описание вопроса, выносимый на голосование, варианты ответов, возможные значения для кастомизации вопроса, срок вступления решения в силу.";

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-primary">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function Chevron({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-6 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")}>
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Таблица «Основание» — мультивыбор (settings) либо одна read-only строка (questions). */
function BaseTable({
  mode,
  selected,
  onToggle,
  onToggleAll,
}: {
  mode: "select" | "readonly";
  selected: Set<number>;
  onToggle?: (i: number) => void;
  onToggleAll?: () => void;
}) {
  const rows = mode === "readonly" ? TOKEN_BASES.map((d, i) => ({ d, i })).filter((r) => selected.has(r.i)) : TOKEN_BASES.map((d, i) => ({ d, i }));
  const allChecked = selected.size === TOKEN_BASES.length;
  const someChecked = selected.size > 0 && !allChecked;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-[4px] bg-[#f9fafc] px-4 py-2">
        {mode === "select" && (
          <Checkbox size="xs" checked={allChecked} indeterminate={someChecked} onChange={onToggleAll} aria-label="Выбрать все" />
        )}
        <Th style={{ flex: 2 }}>Тип документа</Th>
        <Th style={{ flex: 1 }} center>Статус</Th>
        <Th style={{ flex: 1 }} right>Дата</Th>
      </div>
      {rows.map(({ d, i }) => {
        const inner: ReactNode = (
          <>
            <div className="flex flex-col gap-0.5" style={{ flex: 2 }}>
              <span className="ds-caption text-foreground-subtle">{d.type}</span>
              <span className="ds-p3 text-foreground">{d.name}</span>
            </div>
            <div className="flex justify-center" style={{ flex: 1 }}>
              <span className="inline-flex items-center rounded-[4px] bg-[#e6f6e7] px-3 py-1.5 ds-caption-medium text-[#54be5a]">Согласован</span>
            </div>
            <div className="ds-p3 text-right text-foreground" style={{ flex: 1 }}>{d.date}</div>
          </>
        );
        return mode === "select" ? (
          <label key={i} className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
            <Checkbox size="xs" checked={selected.has(i)} onChange={() => onToggle?.(i)} />
            {inner}
          </label>
        ) : (
          <div key={i} className="flex items-center gap-3 rounded-[4px] border border-border bg-surface px-4 py-3">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Строка-вопрос (чекбокс + заголовок + раскрытие) — выбор вопросов голосования. */
function QuestionSelectRow({ label, checked, onToggle, open, onOpen }: { label: string; checked: boolean; onToggle: () => void; open: boolean; onOpen: () => void }) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-border bg-surface">
      <div className="flex h-[66px] items-center gap-4 px-6">
        <Checkbox size="xs" checked={checked} onChange={onToggle} aria-label={label} />
        <span className="ds-p3 flex-1 text-foreground">{label}</span>
        <button type="button" aria-label="Раскрыть" onClick={onOpen} className="flex items-center">
          <Chevron open={open} />
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white px-6 py-4">
          <p className="ds-p3 text-foreground-muted">{Q_DESC}</p>
        </div>
      )}
    </div>
  );
}

export function TokenCreateScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [phase, setPhase] = useState<"settings" | "questions">("settings");
  const [name, setName] = useState("");
  // Основание — мультивыбор (есть select-all в шапке таблицы).
  const [bases, setBases] = useState<Set<number>>(() => new Set());
  // Выбор вопросов голосования (фаза questions).
  const [qsel, setQsel] = useState<Set<number>>(() => new Set());
  const [qopen, setQopen] = useState<Set<number>>(() => new Set());

  const canContinue = name.trim().length > 0 && bases.size > 0;
  const canSend = qsel.size > 0;

  const toggleBase = (i: number) => setBases((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const toggleAllBases = () => setBases(bases.size === TOKEN_BASES.length ? new Set() : new Set(TOKEN_BASES.map((_, i) => i)));
  const toggleQ = (i: number) => setQsel((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const toggleQOpen = (i: number) => setQopen((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const back = () => {
    if (phase === "questions") setPhase("settings");
    else router.push("/cabinet/voting");
  };

  // «Отправить на совет» → создать вопрос голосования (kind="token") и вернуться к списку.
  const submit = () => {
    const baseIdx = [...bases][0];
    const base = TOKEN_BASES[baseIdx];
    flow.submitPaymentVote({
      title: "Создание нового токена",
      kind: "token",
      tokenName: name.trim(),
      questions: [...qsel].sort((a, b) => a - b).map((i) => TOKEN_QUESTIONS[i]),
      docName: base.name,
      baseDoc: base,
      amount: "",
      recipients: [],
    });
    router.push("/cabinet/voting");
  };

  /* ── «Настройка токена» (название + токен-роли) ── */
  const settingsFields = (
    <div className="flex flex-col gap-4">
      <SectionTitle>Настройка токена</SectionTitle>
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-[611px]">
          {phase === "settings" ? (
            <Input size="l" placeholder="Название токена" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <Input size="l" label="Название токена" value={name} readOnly />
          )}
        </div>
        <div className="w-full max-w-[611px]">
          <Input size="l" placeholder="Токен роли (необязательно)" leftIcon={<PlusIcon />} readOnly />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col px-5 py-8 md:px-[50px]">
          <PageHeader title="Создание нового токена" onBack={back}>
            <span aria-hidden />
          </PageHeader>

          {/* 32px от шапки до секций, далее 40px между секциями */}
          <div className="mt-8 flex flex-col gap-10">
            {settingsFields}

            {/* ── Фаза: настройка (выбор основания) ── */}
            {phase === "settings" && (
              <>
                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Основание для создания нового токена</SectionTitle>
                  <BaseTable mode="select" selected={bases} onToggle={toggleBase} onToggleAll={toggleAllBases} />
                </div>
                <div className="flex justify-end">
                  <Button size="l" disabled={!canContinue} onClick={() => setPhase("questions")}>Продолжить</Button>
                </div>
              </>
            )}

            {/* ── Фаза: выбор вопросов голосования ── */}
            {phase === "questions" && (
              <>
                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Основание для платежа</SectionTitle>
                  <BaseTable mode="readonly" selected={bases} />
                </div>

                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Выбор вопросов голосования</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {TOKEN_QUESTIONS.map((q, i) => (
                      <QuestionSelectRow
                        key={q}
                        label={q}
                        checked={qsel.has(i)}
                        onToggle={() => toggleQ(i)}
                        open={qopen.has(i)}
                        onOpen={() => toggleQOpen(i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="l" disabled={!canSend} onClick={submit}>Отправить на совет</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
