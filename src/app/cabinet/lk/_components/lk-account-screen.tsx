"use client";

import { useState } from "react";
import { Tabs, Tab, Button, AccountCard, TransactionsTable } from "@/components/ds";
import { AccountDocFlow, AccountArtifacts } from "../../_components/account-tabs";
import { LkSidebar } from "./lk-sidebar";
import { type LkRole } from "./lk-data";
import { LK_TRANSACTIONS, LK_DOCS, LK_ARTIFACTS } from "./lk-account-data";

/**
 * LkAccountScreen — «Лицевой счёт» личного кабинета (Figma 1857:649778 —
 * Взаиморасчёты · 1857:649786 — Документооборот · 1857:649794 — Артефакты).
 * Одна страница для обеих ролей (chair/payer), маршрут /cabinet/lk/[role]/account.
 *
 * Reuse: AccountCard (свёрнутая карта баланса + шестерёнка) · TransactionsTable ·
 * AccountDocFlow/AccountArtifacts (общий модуль account-tabs, как у партнёра).
 */

function UpRight() {
  return <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DownRight() {
  return <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M7 7l10 10M17 9v8H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function LkAccountScreen({ role }: { role: LkRole }) {
  const [tab, setTab] = useState("mutual");
  return (
    <div className="flex min-h-screen bg-background">
      <LkSidebar role={role} current="accounts" />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 pb-8 pt-4 md:px-10">
          {/* Заголовок + «Отчётность» (Figma 13:42079 / 13:27240). -mb-6 сводит
              gap-10 (40px) к 16px до карты — как в счетах /cabinet (cabinet-screen).
              Кнопка ghost из DS. */}
          <div className="-mb-6 flex items-center justify-between gap-4">
            <h1 className="ds-h5 text-foreground">Лицевой счет</h1>
            <Button variant="ghost" size="s">Отчетность</Button>
          </div>

          {/* Карта + табы + контент — единая группа gap 16px (как в счетах подразделения). */}
          <div className="flex flex-col gap-4">
            <AccountCard
              collapsed
              amount="1.231 ETH"
              secondaryAmount="15.88 USD"
              leftAction={<Button size="m" iconLeft={<UpRight />} className="w-[150px]">Реквизиты</Button>}
              rightAction={<Button size="m" iconLeft={<DownRight />} className="w-[150px]">Перевод</Button>}
              menuItems={[
                { label: "Отчетность" },
                { label: "Настройки счёта" },
              ]}
            />

            <Tabs value={tab} onValueChange={setTab} variant="basic" size="m" aria-label="Лицевой счёт" className="w-full">
              <Tab value="mutual">Взаиморасчеты</Tab>
              <Tab value="docs">Документооборот</Tab>
              <Tab value="artifacts">Артефакты</Tab>
            </Tabs>

            {tab === "mutual" && <TransactionsTable transactions={LK_TRANSACTIONS} />}
            {tab === "docs" && <AccountDocFlow docs={LK_DOCS} />}
            {tab === "artifacts" && <AccountArtifacts artifacts={LK_ARTIFACTS} />}
          </div>
        </div>
      </main>
    </div>
  );
}
