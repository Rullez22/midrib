"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ds";
import { CoopRail } from "../../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow } from "../../../../flow/company-create/_components/reg-flow";
import {
  PageHeader,
  SectionTitle,
  ReadField,
  BalancePill,
  DocTable,
  DOCS,
  PaishikShuttle,
  PRIVATE,
  LEGAL,
  ADDR,
} from "../../_components/payment-shared";

/**
 * PaymentOnceScreen — флоу «Разовый платёж» (сценарий 2.1 раздела «Кооператив»).
 * Источник Figma: 2655:429266 (settings) · 2655:429348/429346 (секции) ·
 * 2655:429918/429925/429926/430297 (recipients, dual-pane shuttle).
 *
 * Три фазы одного мастер-экрана:
 *  settings   — «Настройка платежа» (stacked: сумма + кол-во + итог) +
 *               «Основание для добавления в пул-счет» (таблица документов).
 *  recipients — те же сводки + «Выбор пайщиков» (PaishikShuttle — общий блок).
 *  voting     — отдельный вопрос в /cabinet/voting (submitPaymentVote).
 *
 * Reuse DS: CoopRail · Button · Input + общий payment-shared (PageHeader ·
 * SectionTitle · ReadField · BalancePill · DocTable · PaishikShuttle).
 */

const fmt = (n: number) => String(Math.round(n * 1e6) / 1e6);

export function PaymentOnceScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [phase, setPhase] = useState<"settings" | "recipients">("settings");
  const [amount, setAmount] = useState("0.02");
  // Основание — мультивыбор (есть select-all в шапке таблицы).
  const [docs, setDocs] = useState<Set<number>>(() => new Set([0]));
  const [tab, setTab] = useState<"private" | "legal">("private");
  // sel — выбранные пайщики (правая таблица). Чек в левой таблице сразу переносит строку вправо.
  const [selPrivate, setSelPrivate] = useState<Set<number>>(() => new Set());
  const [selLegal, setSelLegal] = useState<Set<number>>(() => new Set());
  const [page, setPage] = useState(1);

  const amountNum = parseFloat(amount.replace(",", ".")) || 0;
  const count = selPrivate.size + selLegal.size;
  const total = count * amountNum;
  const canContinue = amountNum > 0 && docs.size > 0;
  const canSend = count > 0;

  const toggleDoc = (i: number) => {
    const next = new Set(docs);
    next.has(i) ? next.delete(i) : next.add(i);
    setDocs(next);
  };
  const toggleAllDocs = () => setDocs(docs.size === DOCS.length ? new Set() : new Set(DOCS.map((_, i) => i)));

  const list = tab === "private" ? PRIVATE : LEGAL;
  const sel = tab === "private" ? selPrivate : selLegal;
  const setSel = tab === "private" ? setSelPrivate : setSelLegal;
  const toggleSel = (i: number) => {
    const next = new Set(sel);
    next.has(i) ? next.delete(i) : next.add(i);
    setSel(next);
  };
  const toggleSelAll = () => setSel(sel.size === list.length ? new Set() : new Set(list.map((_, i) => i)));

  const back = () => {
    if (phase === "recipients") setPhase("settings");
    else router.push("/cabinet/payment");
  };

  // «Отправить на совет» → создать вопрос голосования в RegFlow и перейти к «Вопросам».
  const submitVote = () => {
    const recipients = [
      ...[...selPrivate].map((i) => ({ name: PRIVATE[i], mid: ADDR, legal: false })),
      ...[...selLegal].map((i) => ({ name: LEGAL[i].name, mid: ADDR, legal: true })),
    ];
    const docName = docs.size > 0 ? DOCS[[...docs][0]].name : "—";
    flow.submitPaymentVote({ title: "Разовый платеж", amount, docName, recipients });
    router.push("/cabinet/voting");
  };

  /* ── «Настройка платежа» (stacked, с балансом в шапке секции) ── */
  const settingsSummary = (
    <div className="flex flex-col gap-4">
      {/* заголовок + плашка → 8px → разделитель (16px до контента даёт gap-4) */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="ds-p2-medium text-foreground">Настройка платежа</span>
          <BalancePill />
        </div>
        <span className="h-px w-full bg-border" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-full max-w-[444px]">
          {phase === "settings" ? (
            <Input size="l" label="Сумма платежа" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма платежа" />
          ) : (
            <Input size="l" label="Сумма платежа" value={`${amount} ETH`} readOnly />
          )}
        </div>
        <ReadField label="Количество получателей" value={count} />
        <ReadField label="Общая сумма платежа" value={total > 0 ? `${fmt(total)} ETH` : "0"} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col px-5 py-8 lg:px-10">
          <PageHeader title="Разовый платеж" onBack={back}>
            <span aria-hidden />
          </PageHeader>

          {/* 32px от шапки до секций, далее 40px между секциями */}
          <div className="mt-8 flex flex-col gap-10">
            {settingsSummary}

            {/* ── Фаза: настройка (выбор основания) ── */}
            {phase === "settings" && (
              <>
                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Основание для добавления в пул-счет</SectionTitle>
                  <DocTable mode="select" selected={docs} onToggle={toggleDoc} onToggleAll={toggleAllDocs} />
                </div>
                <div className="flex justify-end">
                  <Button size="l" disabled={!canContinue} onClick={() => setPhase("recipients")}>Продолжить</Button>
                </div>
              </>
            )}

            {/* ── Фаза: выбор пайщиков (dual-pane shuttle) ── */}
            {phase === "recipients" && (
              <>
                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Основание для добавления в пул-счет</SectionTitle>
                  <DocTable mode="readonly" selected={docs} />
                </div>

                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Выбор пайщиков</SectionTitle>
                  <PaishikShuttle
                    tab={tab}
                    onTabChange={setTab}
                    sel={sel}
                    onToggleSel={toggleSel}
                    onToggleSelAll={toggleSelAll}
                    count={count}
                    page={page}
                    onPageChange={setPage}
                  />
                </div>

                <div className="flex justify-end">
                  <Button size="l" disabled={!canSend} onClick={submitVote}>Отправить на совет</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
