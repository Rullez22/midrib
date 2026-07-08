"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { NavWalletIcon } from "@/components/app/app-icons";
import { AppDialog, SuccessCheck } from "@/components/app/app-dialog";

/**
 * Экран «Баланс» — таб нижней навигации «Баланс».
 * Источник: Figma «8.1.2» пусто (7009:570060) / заполнено (7009:570013).
 * Карточка баланса + кнопки «Пополнить»/«Вывести» + список транзакций.
 * `?success=1` (после «Вывести») → попап «Операция отправлена…» (7009:569959).
 * DS: Text, Button. Стиль — MIDHUB (токены).
 */
interface Tx {
  title: string;
  eth: string;
  fin: string;
  positive: boolean;
  /** Статус: "processing" (синий) · "error" (красный) · время "13:52" (серый). */
  status?: "processing" | "error" | string;
}
interface TxGroup {
  date: string;
  items: Tx[];
}

// Фабрики частых транзакций (уменьшают дублирование данных).
const reward = (status?: string): Tx => ({
  title: "Вознаграждение за партнера 1-го уровня",
  eth: "+1.0334 ETH",
  fin: "−12 231 434 FIN",
  positive: true,
  status,
});
const withdraw = (status?: string): Tx => ({
  title: "Вывод с кошелька",
  eth: "−1.0334 ETH",
  fin: "−1 234 FIN",
  positive: false,
  status,
});
const topup = (status?: string): Tx => ({
  title: "Пополнение кошелька",
  eth: "+0.0234 ETH",
  fin: "−1 234 FIN",
  positive: true,
  status,
});

const TX_GROUPS: TxGroup[] = [
  { date: "Сегодня", items: [reward("processing")] },
  { date: "22 марта", items: [reward()] },
  { date: "13 декабря 2018", items: [topup(), withdraw()] },
  // ── ниже — большой скроллящийся список (даты по убыванию) ──
  {
    date: "12 декабря 2018",
    items: [withdraw("13:52"), reward("13:52"), withdraw("error")],
  },
  { date: "8 декабря 2018", items: [withdraw("13:52"), reward("13:52")] },
  { date: "3 декабря 2018", items: [topup("13:52"), withdraw("13:52")] },
  {
    date: "28 ноября 2018",
    items: [reward("13:52"), withdraw("13:52"), withdraw("13:52")],
  },
  { date: "20 ноября 2018", items: [withdraw("13:52"), reward("error")] },
  {
    date: "11 ноября 2018",
    items: [topup("13:52"), withdraw("13:52"), reward("13:52")],
  },
  {
    date: "2 ноября 2018",
    items: [withdraw("13:52"), reward("13:52"), withdraw("13:52")],
  },
  { date: "25 октября 2018", items: [reward("13:52"), withdraw("13:52")] },
];

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.5 8.5 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TxStatus({ status }: { status: string }) {
  if (status === "processing") {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-primary">
        <RefreshIcon />
        <span className="ds-caption-up">Транзакция обрабатывается</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-[var(--color-red-500)]">
        <ErrorMark />
        <span className="ds-caption-up">Ошибка транзакции</span>
      </div>
    );
  }
  return (
    <div className="mt-1.5 flex items-center gap-1 text-foreground-subtle">
      <ClockIcon />
      <span className="ds-caption tabular-nums">{status}</span>
    </div>
  );
}

function TxRow({ tx }: { tx: Tx }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
      <div className="min-w-0 flex-1">
        {/* Название — вторичный уровень (серый dark-800). */}
        <Text variant="p2" tone="muted" as="div" className="leading-snug">
          {tx.title}
        </Text>
        {tx.status && <TxStatus status={tx.status} />}
      </div>
      <div className="shrink-0 pt-px text-right">
        {/* Сумма ETH — главный акцент: зелёный «+», тёмный «−». */}
        <Text
          variant="p2-medium"
          as="div"
          className={`tabular-nums leading-snug ${
            tx.positive
              ? "text-[var(--color-green-600)]"
              : "text-foreground"
          }`}
        >
          {tx.eth}
        </Text>
        {/* FIN — третичный уровень (светло-серый). */}
        <Text
          variant="caption"
          tone="subtle"
          as="div"
          className="tabular-nums"
        >
          {tx.fin}
        </Text>
      </div>
    </div>
  );
}

function BalanceInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const showSuccess = params.get("success") === "1" && !dismissed;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      {/* Карточка баланса */}
      <div className="relative z-10 bg-surface px-4 pt-11 pb-5 shadow-[0_6px_16px_-4px_rgba(10,10,11,0.12)]">
        <div className="flex h-8 items-center justify-between">
          <Text variant="h5">Баланс</Text>
          <Link
            href="/app/balance/wallets"
            aria-label="Кошельки"
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
          >
            <NavWalletIcon width={24} height={24} />
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Text variant="h3" as="div">
            2.0124 ETH
          </Text>
          <Text variant="p1" tone="subtle" as="div" className="mt-1">
            (97.03 USD)
          </Text>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => router.push("/app/balance/topup")}
          >
            Пополнить
          </Button>
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => router.push("/app/balance/withdraw")}
          >
            Вывести
          </Button>
        </div>
      </div>

      {/* Транзакции */}
      <main className="min-h-0 flex-1 overflow-y-auto bg-surface pt-1">
        {TX_GROUPS.map((g) => (
          <section key={g.date}>
            <Text
              variant="caption-up"
              tone="subtle"
              as="div"
              className="px-4 pb-1.5 pt-5"
            >
              {g.date}
            </Text>
            {g.items.map((tx, i) => (
              <TxRow key={i} tx={tx} />
            ))}
          </section>
        ))}
      </main>

      <AppDialog
        open={showSuccess}
        icon={<SuccessCheck />}
        title="Операция отправлена в очередь транзакций блокчейна."
        description="Ее выполнение займет несколько минут."
        actionLabel="Понятно"
        onAction={() => {
          setDismissed(true);
          router.replace("/app/balance");
        }}
        onClose={() => setDismissed(true)}
      />
    </div>
  );
}

export default function BalancePage() {
  return (
    <Suspense>
      <BalanceInner />
    </Suspense>
  );
}
