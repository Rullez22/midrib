"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegFlow, type CreatedContract } from "../../../flow/company-create/_components/reg-flow";
import { CreatedContractScreen } from "../../partners/_components/created-contract-screen";
import { AttachedDoc, Field, BackIcon } from "../../partners/_components/org-contract-screen";
import { CompanySidebar } from "./company-sidebar";
import { goalAsOrg, type Goal, type GoalDoc } from "./goals-data";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * GoalDocScreen — открытие документа цели. Три случая:
 *  - без статуса (просто «Основание») → простая страница дока (без статуса,
 *    транзакций и ленты);
 *  - требует участия (pending) → флоу договора (подписание + чат) → готовый;
 *  - согласованный / созданный договор → страница договора (переиспользуем
 *    партнёрский CreatedContractScreen через RegFlow).
 */

/** Сид документа цели в RegFlow как договор (goalcontract), состояние — по pending. */
function seedGoalDoc(goal: Goal, d: GoalDoc, i: number): CreatedContract {
  return {
    id: `gdoc-${i}`,
    orgId: goal.id,
    kind: "goalcontract",
    parentId: null,
    customer: goal.title,
    name: d.name,
    number: "—",
    code: "—",
    amount: "—",
    comment: "—",
    attachedName: "Договор с фондом",
    attachedMeta: "PDF · 1 MB",
    executor: "ИП Слоненок",
    signed: false,
    step: 0,
    finalized: false,
    consultant: null,
    consultationDone: false,
  };
}

/** Простой документ без статуса: только содержимое + прикреплённый файл. */
function GoalPlainDoc({ goal, cabinet, doc, back }: { goal: Goal; cabinet: CabinetConfig; doc: GoalDoc; back: string }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current="goals" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-6 md:px-[50px]">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.push(back)}
            className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
          >
            <BackIcon />
          </button>

          <div className="overflow-hidden rounded-[4px] border border-border">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
              <span className="ds-p1-medium text-foreground">{doc.name}</span>
              <span className="ds-p3 text-foreground-subtle">{doc.date}</span>
            </div>
            <div className="flex flex-col gap-6 p-6 md:flex-row">
              <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Тип документа" value="Основание" />
                <Field label="Цель" value={goal.title} />
                <Field label="Дата" value={doc.date} />
              </div>
              <AttachedDoc name="Основание" meta="PDF · 1 MB" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function GoalDocScreen({ goal, cabinet, docId }: { goal: Goal; cabinet: CabinetConfig; docId: string }) {
  const { ensureContract } = useRegFlow();
  const base = `/cabinet/${cabinet.slug}/goals/${goal.id}`;

  const gi = docId.startsWith("gdoc-") ? Number(docId.slice("gdoc-".length)) : -1;
  const gdoc = gi >= 0 ? goal.documents[gi] : undefined;
  // Документ цели без статуса (не pending) — простая страница, без RegFlow.
  const plain = gdoc != null && !gdoc.pending;

  const [ready, setReady] = useState(plain);
  useEffect(() => {
    if (plain) return;
    // Засеять документы цели, требующие участия, как договоры (goalcontract).
    goal.documents.forEach((d, i) => {
      if (d.pending) ensureContract(seedGoalDoc(goal, d, i));
    });
    setReady(true);
  }, [plain, goal, ensureContract]);

  if (plain && gdoc) return <GoalPlainDoc goal={goal} cabinet={cabinet} doc={gdoc} back={base} />;
  if (!ready) return null;
  return (
    <CreatedContractScreen
      org={goalAsOrg(goal)}
      contractId={docId}
      cabinet={cabinet}
      basePath={base}
      sidebarCurrent="goals"
      showNested={false}
    />
  );
}
