"use client";

import { useState } from "react";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { QrMock } from "@/components/app/qr-mock";
import { ShareSheet } from "@/components/app/share-sheet";
import { SAMPLE_ADDRESS } from "@/components/app/wallets-store";

/**
 * Экран «Пополнение» — /app/balance/topup (из кнопки «Пополнить»).
 * Источник: Figma node 7009:570089 (+ share-лист 7009:570158).
 * QR-код + адрес + «Копировать»/«Отправить адрес» + пояснение.
 * Тап по QR / «Отправить адрес» → нижний лист «Поделиться».
 * DS: Text, Button. Стиль — MIDHUB. Без нижней навигации (pushed-экран).
 */
export default function TopUpPage() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Пополнение" showBack />

      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pt-8 text-center">
        <Text variant="p1-medium" as="p" className="max-w-[260px]">
          Скопируйте адрес или сфотографируйте QR-код
        </Text>

        <button
          type="button"
          onClick={() => setShareOpen(true)}
          aria-label="Поделиться QR-кодом"
          className="mt-6"
        >
          <QrMock size={168} />
        </button>

        <Text
          variant="p2"
          tone="muted"
          as="p"
          className="mt-6 max-w-[280px] break-all"
        >
          {SAMPLE_ADDRESS}
        </Text>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
          >
            Копировать
          </Button>
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => setShareOpen(true)}
          >
            Отправить адрес
          </Button>
        </div>

        <Text variant="p2" tone="subtle" as="p" className="mt-6 max-w-[300px]">
          Отправленные средства поступают на баланс в течение нескольких минут в
          зависимости от загруженности сети Ethereum
        </Text>
      </main>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
