"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, PartnerCard, IncrimentField } from "@/components/ds";
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
  BASE_SHARES,
  BASE_PERSONAL_PAISHIKI,
} from "../../../../../payment/_components/payment-shared";

/**
 * PaymentPersonalScreen — флоу «Персональное подключение» к пул-счёту
 * (сценарий 3.2 раздела «Кооператив», карточка «Персональное подключение» в
 * /cabinet/account/marketing/connect). В отличие от массового — несколько долей
 * на ОДНОГО выбранного пайщика. Источник Figma: 2653:448155 (выбор пайщика) ·
 * 2654:543592 / 543855 / 544054 (settings + настройка долей) · 2654:545332 /
 * 546398 / 546409 (вопрос голосования).
 *
 * Три фазы одного мастер-экрана:
 *  payer    — поиск + выбор одного пайщика (PartnerCard «Выбрать пайщика»).
 *  settings — сводка пул-счёта + «Выбранный пайщик» (PartnerCard danger) +
 *             «Основание…» (DocTable мультивыбор) → «Продолжить».
 *  config   — сводка (проектные итоги) + пайщик + основание (read-only) +
 *             «Настройка долей» (степпер) → «Отправить на совет».
 *
 * Итог: всего долей = BASE_SHARES + shares (один пайщик); кол-во пайщиков не
 * меняется (пайщик уже в пуле). Отправка создаёт вопрос голосования
 * (kind="personal"). Голосование — общий механизм (PaymentVoteDetail).
 *
 * Reuse DS: CoopRail · PartnerCard · Button · Input · IncrimentField +
 * общий payment-shared (PageHeader · PoolSummaryTable · DocTable · ReadField).
 */

const PAYER = "Кооператив Слоненок";
const PAYER_DESC =
  "Потребительский кооператив: совместные закупки и логистика для пайщиков. Работает с Иматрой с 2019 года — общие поставки, склад в Санкт-Петербурге и распределение расходов между участниками пул-счета.";
const PAYER_AVATAR_SRC = "/orgs/romashka.png";
const PAYER_AVATAR = <img src={PAYER_AVATAR_SRC} alt="" className="size-full object-cover" />;

export function PaymentPersonalScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [phase, setPhase] = useState<"payer" | "settings" | "config">("payer");
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<Set<number>>(() => new Set([0]));
  const [shares, setShares] = useState(0);

  // Один пайщик: всего долей растёт на shares, кол-во пайщиков не меняется.
  const totalShares = BASE_SHARES + shares;
  const canSend = shares > 0;
  const docName = docs.size > 0 ? DOCS[[...docs][0]].name : "—";

  const toggleDoc = (i: number) => {
    const next = new Set(docs);
    next.has(i) ? next.delete(i) : next.add(i);
    setDocs(next);
  };
  const toggleAllDocs = () => setDocs(docs.size === DOCS.length ? new Set() : new Set(DOCS.map((_, i) => i)));

  const back = () => {
    if (phase === "config") setPhase("settings");
    else if (phase === "settings") setPhase("payer");
    else router.push("/cabinet/account/marketing/connect");
  };

  // «Отправить на совет» → вопрос голосования (kind="personal") → /cabinet/voting.
  const submitVote = () => {
    flow.submitPaymentVote({
      title: "Персональное подключение",
      amount: "0",
      docName,
      recipients: [],
      kind: "personal",
      shares,
      payer: { name: PAYER, description: PAYER_DESC, avatarSrc: PAYER_AVATAR_SRC },
    });
    router.push("/cabinet/voting");
  };

  // «Выбранный пайщик» — карточка с danger-кнопкой «Отменить выбор» → назад к поиску.
  const payerCard = (
    <div className="flex flex-col gap-3">
      <span className="ds-p2-medium text-foreground">Выбранный пайщик</span>
      <PartnerCard
        title={PAYER}
        avatar={PAYER_AVATAR}
        description={PAYER_DESC}
        selectVariant="danger"
        selectLabel="Отменить выбор"
        onSelect={() => setPhase("payer")}
        onDetails={() => {}}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col px-5 py-8 lg:px-10">
          <PageHeader title="Персональное подключение" onBack={back}>
            {phase === "payer" ? <span aria-hidden /> : <BalancePill label="Маркетинговый счет" />}
          </PageHeader>

          {/* ── Фаза: выбор пайщика ── */}
          {phase === "payer" && (
            <div className="mt-8 flex flex-col gap-6">
              <Input size="m" placeholder="Название или адрес пайщика" value={query} onChange={(e) => setQuery(e.target.value)} />
              <PartnerCard
                title={PAYER}
                avatar={PAYER_AVATAR}
                description={PAYER_DESC}
                selectLabel="Выбрать пайщика"
                onSelect={() => setPhase("settings")}
                onDetails={() => {}}
              />
            </div>
          )}

          {/* ── Фазы settings/config: сводка + пайщик + основание (+ доли) ── */}
          {phase !== "payer" && (
            <div className="mt-8 flex flex-col gap-10">
              <PoolSummaryTable paishiki={BASE_PERSONAL_PAISHIKI} shares={totalShares} />
              {payerCard}

              {phase === "settings" && (
                <>
                  <div className="flex flex-col gap-4">
                    <SectionTitle noRule>Основание для добавления в пул-счет</SectionTitle>
                    <DocTable mode="select" selected={docs} onToggle={toggleDoc} onToggleAll={toggleAllDocs} />
                  </div>
                  <div className="flex justify-end">
                    <Button size="l" disabled={docs.size === 0} onClick={() => setPhase("config")}>Продолжить</Button>
                  </div>
                </>
              )}

              {phase === "config" && (
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
                    <ReadField label="Всего пайщиков в счет-пуле" value={BASE_PERSONAL_PAISHIKI} />
                  </div>

                  <div className="flex justify-end">
                    <Button size="l" disabled={!canSend} onClick={submitVote}>Отправить на совет</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
