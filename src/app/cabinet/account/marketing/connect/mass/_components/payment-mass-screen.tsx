"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, IncrimentField } from "@/components/ds";
import { CoopRail } from "../../../../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow } from "../../../../../../flow/company-create/_components/reg-flow";
import {
  PageHeader,
  SectionTitle,
  ReadField,
  BalancePill,
  DocTable,
  DOCS,
  PoolSummaryTable,
  PaishikShuttle,
  PRIVATE,
  LEGAL,
  ADDR,
  BASE_SHARES,
  BASE_PAISHIKI,
} from "../../../../../payment/_components/payment-shared";

/**
 * PaymentMassScreen — флоу «Массовое подключение» адресов к пул-счёту
 * (сценарий 3 раздела «Кооператив», карточка «Массовое подключение» в
 * /cabinet/account/marketing/connect). Источник Figma: 2649:360975 / 361412
 * (settings) · 2649:361553 / 2653:357673 (recipients) · 2653:359901 / 408433
 * (вопрос голосования).
 *
 * Две фазы одного мастер-экрана:
 *  settings   — сводка пул-счёта (PoolSummaryTable) + «Основание для добавления
 *               в пул-счет» (таблица документов, мультивыбор) → «Продолжить».
 *  recipients — сводка (проектные итоги) + основание (read-only) + «Настройка
 *               долей» (степпер «Количество долей на пайщика» + базовые итоги) +
 *               «Выбор пайщиков» (общий PaishikShuttle) → «Отправить на совет».
 *
 * Итог: количество долей в пуле = BASE_SHARES + shares × выбранных; пайщиков =
 * BASE_PAISHIKI + выбранных. Отправка создаёт вопрос голосования (kind="mass").
 *
 * Reuse DS: CoopRail · Button · IncrimentField + общий payment-shared.
 */

export function PaymentMassScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [phase, setPhase] = useState<"settings" | "recipients">("settings");
  const [docs, setDocs] = useState<Set<number>>(() => new Set([0]));
  const [shares, setShares] = useState(0);
  const [tab, setTab] = useState<"private" | "legal">("private");
  const [selPrivate, setSelPrivate] = useState<Set<number>>(() => new Set());
  const [selLegal, setSelLegal] = useState<Set<number>>(() => new Set());
  const [page, setPage] = useState(1);

  const count = selPrivate.size + selLegal.size;
  // Проектные итоги пул-счёта после подключения (сводная таблица сверху).
  const totalPaishiki = BASE_PAISHIKI + count;
  const totalShares = BASE_SHARES + shares * count;
  const canContinue = docs.size > 0;
  const canSend = count > 0 && shares > 0;

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
    else router.push("/cabinet/account/marketing/connect");
  };

  // «Отправить на совет» → вопрос голосования (kind="mass") → /cabinet/voting.
  const submitVote = () => {
    const recipients = [
      ...[...selPrivate].map((i) => ({ name: PRIVATE[i], mid: ADDR, legal: false })),
      ...[...selLegal].map((i) => ({ name: LEGAL[i].name, mid: ADDR, legal: true })),
    ];
    const docName = docs.size > 0 ? DOCS[[...docs][0]].name : "—";
    flow.submitPaymentVote({ title: "Массовое подключение", amount: "0", docName, recipients, kind: "mass", shares });
    router.push("/cabinet/voting");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col px-5 py-8 lg:px-10">
          <PageHeader title="Массовое подключение" onBack={back}>
            <BalancePill label="Маркетинговый счет" />
          </PageHeader>

          {/* 32px от шапки до секций, далее 40px между секциями */}
          <div className="mt-8 flex flex-col gap-10">
            <PoolSummaryTable paishiki={totalPaishiki} shares={totalShares} />

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

            {/* ── Фаза: настройка долей + выбор пайщиков ── */}
            {phase === "recipients" && (
              <>
                <div className="flex flex-col gap-4">
                  <SectionTitle noRule>Основание для добавления в пул-счет</SectionTitle>
                  <DocTable mode="readonly" selected={docs} />
                </div>

                <div className="flex flex-col gap-4">
                  <SectionTitle>Настройка долей</SectionTitle>
                  <div className="w-full max-w-[470px]">
                    <IncrimentField label="Количество долей на пайщика" value={shares} onValueChange={setShares} min={0} />
                  </div>
                  <ReadField label="Всего долей в счет-пуле" value={BASE_SHARES} />
                  <ReadField label="Всего пайщиков в счет-пуле" value={BASE_PAISHIKI} />
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
