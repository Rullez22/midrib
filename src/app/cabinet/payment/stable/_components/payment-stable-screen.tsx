"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Tab,
  Button,
  Input,
  PartnerCard,
} from "@/components/ds";
import { CoopRail } from "../../../../flow/company-create/_components/coop-sidebar";
import { useRegFlow } from "../../../../flow/company-create/_components/reg-flow";
import {
  PageHeader,
  SectionTitle,
  ReadField,
  BalancePill,
  StablePercentConfig,
  DocTable,
  DOCS,
} from "../../_components/payment-shared";

/**
 * PaymentStableScreen — флоу «Стабильный платёж» (сценарий 2.2 раздела
 * «Кооператив»): периодический платёж в виде % от входящих средств до выплаты
 * фиксированной суммы. Источник: Figma 2659:493500 … 2659:497192 (12 фреймов).
 *
 * 3 фазы: payer (поиск и выбор одного пайщика) → basis (основание/документы) →
 * config (табы «Настройка %»/«Разовый платёж»: распределение целевого счёта +
 * карточка «Счёт пайщика» с донатом и фикс-суммой «раз в N дней»). «Отправить на
 * совет» создаёт вопрос голосования в RegFlow и уводит на /cabinet/voting — как
 * в «Разовом платеже» (деталь рендерит PaymentVoteDetail, stable-вариант).
 *
 * Reuse DS: CoopRail · PartnerCard (карточка пайщика, danger-кнопка «Отменить
 * выбор») · Tabs · Input + общий payment-shared (DocTable «Основание» +
 * StablePercentConfig «Настройка %»).
 */

const PAYER = "Кооператив Слоненок";
const PAYER_DESC = "Потребительский кооператив: совместные закупки и логистика для пайщиков. В пул-счете Иматры с февраля 2019 года.";
const PAYER_AVATAR_SRC = "/orgs/romashka.png";
// Аватар «Слонёнка» — из раздела «Партнёры» (partners-data).
const PAYER_AVATAR = <img src={PAYER_AVATAR_SRC} alt="" className="size-full object-cover" />;
const SUBS = [
  { name: "Счет инвестиционных токенов", pct: 10 },
  { name: "Счет управляющих токенов", pct: 10 },
  { name: "Маршрутный счет", pct: 10 },
  { name: "Маркетинговый счет", pct: 40 },
];

export function PaymentStableScreen() {
  const router = useRouter();
  const flow = useRegFlow();
  const [phase, setPhase] = useState<"payer" | "basis" | "config">("payer");
  const [query, setQuery] = useState("");
  // Основание — мультивыбор (есть select-all в шапке таблицы).
  const [docs, setDocs] = useState<Set<number>>(() => new Set([0]));
  const [subTab, setSubTab] = useState<"percent" | "once">("percent");
  const [targetPct, setTargetPct] = useState(25);
  // Доли подсчетов целевого счёта — все редактируемые степперами.
  const [subs, setSubs] = useState<number[]>(() => SUBS.map((s) => s.pct));
  const [amount, setAmount] = useState("0.05");
  const [days, setDays] = useState("");
  const [recurring, setRecurring] = useState(true);

  // Все доли тянутся из общего пула 100%. «Счет пайщика» = остаток (payerShare).
  const subTotal = subs.reduce((a, b) => a + b, 0);
  const payerShare = Math.max(0, 100 - targetPct - subTotal);
  const setSub = (i: number, v: number) => setSubs((prev) => prev.map((p, j) => (j === i ? v : p)));
  const amountNum = parseFloat(amount.replace(",", ".")) || 0;
  const canSend = amountNum > 0;
  const docName = docs.size > 0 ? DOCS[[...docs][0]].name : "—";

  const toggleDoc = (i: number) => {
    const next = new Set(docs);
    next.has(i) ? next.delete(i) : next.add(i);
    setDocs(next);
  };
  const toggleAllDocs = () => setDocs(docs.size === DOCS.length ? new Set() : new Set(DOCS.map((_, i) => i)));

  const back = () => {
    if (phase === "payer") router.push("/cabinet/payment");
    else if (phase === "basis") setPhase("payer");
    else setPhase("basis");
  };

  // «Отправить на совет» → создать вопрос голосования в RegFlow → /cabinet/voting.
  const submitVote = () => {
    flow.submitPaymentVote({
      title: "Стабильный платеж",
      amount,
      docName,
      recipients: [],
      kind: "stable",
      payer: { name: PAYER, description: PAYER_DESC, avatarSrc: PAYER_AVATAR_SRC },
      distribution: {
        target: targetPct,
        subs: SUBS.map((s, i) => ({ name: s.name, pct: subs[i] })),
        payerShare,
        days,
        sum: amount,
      },
    });
    router.push("/cabinet/voting");
  };

  const payerCard = (
    // заголовок + плашка баланса на одной линии → gap 8px → карточка пайщика (без сепаратора)
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="ds-p2-medium text-foreground">Выбранный пайщик</span>
        <BalancePill />
      </div>
      <PartnerCard
        title={PAYER}
        avatar={PAYER_AVATAR}
        description={PAYER_DESC}
        selectVariant="danger"
        selectLabel="Отменить выбор"
        onSelect={() => setPhase("payer")}
      />
    </div>
  );

  // «Основание для платежа» — read-only с DS-шапкой строк (как в фазе basis).
  const basisReadonly = (
    <div className="flex flex-col gap-4">
      <SectionTitle noRule>Основание для платежа</SectionTitle>
      <DocTable mode="readonly" selected={docs} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-8 lg:px-10">
          <PageHeader title="Стабильный платеж" onBack={back}>
            <span aria-hidden />
          </PageHeader>

          {/* ── Фаза: выбор пайщика ── */}
          {phase === "payer" && (
            <div className="flex flex-col gap-6">
              <Input size="m" placeholder="Название или адрес пайщика" value={query} onChange={(e) => setQuery(e.target.value)} />
              <PartnerCard
                title={PAYER}
                avatar={PAYER_AVATAR}
                description={PAYER_DESC}
                selectLabel="Выбрать пайщика"
                onSelect={() => setPhase("basis")}
              />
            </div>
          )}

          {/* ── Фаза: основание ── */}
          {phase === "basis" && (
            <>
              {payerCard}
              <div className="flex flex-col gap-4">
                <SectionTitle noRule>Основание для добавления в пул-счет</SectionTitle>
                <DocTable mode="select" selected={docs} onToggle={toggleDoc} onToggleAll={toggleAllDocs} />
              </div>
              <div className="flex justify-end">
                <Button size="l" disabled={docs.size === 0} onClick={() => setPhase("config")}>Продолжить</Button>
              </div>
            </>
          )}

          {/* ── Фаза: настройка % ── */}
          {phase === "config" && (
            <>
              {payerCard}
              {basisReadonly}
              <Tabs value={subTab} onValueChange={(v) => setSubTab(v as "percent" | "once")} variant="basic" size="m" aria-label="Тип распределения" className="w-full">
                <Tab value="percent">Настройка %</Tab>
                <Tab value="once">Разовый платеж</Tab>
              </Tabs>
              {subTab === "percent" ? (
                <StablePercentConfig
                  target={targetPct}
                  subs={SUBS.map((s, i) => ({ name: s.name, pct: subs[i] }))}
                  payerShare={payerShare}
                  days={days}
                  sum={amount}
                  recurring={recurring}
                  onTargetChange={setTargetPct}
                  onSubChange={setSub}
                  onDaysChange={setDays}
                  onSumChange={setAmount}
                  onRecurringChange={setRecurring}
                />
              ) : (
                /* «Разовый платеж» — Input + read-поля стопкой. Figma 2659:497153. */
                <div className="flex flex-col gap-5">
                  <div className="w-full max-w-[444px]">
                    <Input size="l" placeholder="Сумма платежа" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <ReadField label="Количество получателей" value={0} />
                  <ReadField label="Общая сумма платежа" value={0} />
                </div>
              )}
              <div className="flex justify-end">
                <Button size="l" disabled={!canSend} onClick={submitVote}>Отправить на совет</Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
