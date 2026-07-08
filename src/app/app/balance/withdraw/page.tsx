"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Textarea } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { QrIcon } from "@/components/app/app-icons";
import { SAMPLE_ADDRESS } from "@/components/app/wallets-store";

/**
 * Экран «Вывод средств» — /app/balance/withdraw (из кнопки «Вывести»).
 * Источник: Figma 7009:570496 (пусто) / 7009:570575 (адрес вставлен).
 * Адрес кошелька (Вставить / Выбрать кошелёк) + суммы ETH/$ + «Вывести».
 * «Вывести» → /app/balance?success=1 (попап успеха на Балансе).
 * DS: Input, Textarea, Button. Без нижней навигации (pushed-экран).
 */
export default function WithdrawPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Вывод средств"
        subtitle="Доступно: 0.00245 ETH"
        showBack
        actions={
          <Link
            href="/app/balance/wallets"
            aria-label="Выбрать кошелёк"
            className="p-0.5 text-primary"
          >
            <QrIcon />
          </Link>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-5">
        <Textarea
          label="Адрес кошелька"
          placeholder="Адрес кошелька"
          size="s"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          noResize
        />

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => setAddress(SAMPLE_ADDRESS)}
          >
            Вставить
          </Button>
          <Button
            variant="secondary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => router.push("/app/balance/wallets")}
          >
            Выбрать кошелек
          </Button>
        </div>

        <Input label="Сумма, ETH" defaultValue="0,0001" />
        <Input label="Сумма, $" defaultValue="10" />
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          disabled={address.trim() === ""}
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push("/app/balance?success=1")}
        >
          Вывести
        </Button>
      </div>
    </div>
  );
}
