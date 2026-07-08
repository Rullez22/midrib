"use client";

import Link from "next/link";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppFab } from "@/components/app/app-fab";
import { WalletGlyphIcon } from "@/components/app/app-icons";
import { useWallets, type Wallet } from "@/components/app/wallets-store";

/**
 * Экран «Кошельки» — /app/balance/wallets (из «Выбрать кошелёк» на Выводе).
 * Источник: Figma 7009:570655 (пусто) / 7009:570134 (со списком).
 * Пусто → иллюстрация + текст; со списком → строки кошельков.
 * FAB «+» → добавление кошелька. DS: Text. Без нижней навигации.
 */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function WalletRow({ wallet }: { wallet: Wallet }) {
  return (
    <Link
      href={`/app/balance/wallets/edit?id=${wallet.id}`}
      className="flex items-center gap-3 border-b border-border px-4 py-3"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-[500] text-[#fff]">
        {initials(wallet.name)}
      </span>
      <span className="min-w-0 flex-1">
        <Text variant="p2" as="div">
          {wallet.name}
        </Text>
        <Text variant="caption" tone="subtle" as="div" className="truncate">
          {wallet.address}
        </Text>
      </span>
    </Link>
  );
}

export default function WalletsPage() {
  const { wallets } = useWallets();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Кошельки" showBack />

      {wallets.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4 pb-24">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-surface-muted text-[var(--color-grey-100)]">
            <WalletGlyphIcon width={56} height={56} />
          </div>
          <Text variant="p2" tone="subtle">
            У вас нет ни одного кошелька
          </Text>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {wallets.map((w) => (
            <WalletRow key={w.id} wallet={w} />
          ))}
        </div>
      )}

      <AppFab href="/app/balance/wallets/add" ariaLabel="Добавить кошелёк" />
    </div>
  );
}
