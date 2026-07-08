"use client";

import { useState } from "react";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { QrMock } from "@/components/app/qr-mock";
import { ShareSheet } from "@/components/app/share-sheet";
import { SAMPLE_ADDRESS } from "@/components/app/wallets-store";

/**
 * Экран «Поделиться моим адресом» — /app/profile/share.
 * Источник: Figma 7009:571890 (+ share-лист 7009:571913).
 * Адрес + QR + «Поделиться»/«Скопировать» (Поделиться → нижний лист).
 * DS: Text, Button. Без нижней навигации (pushed-экран).
 */
export default function ProfileSharePage() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Поделиться моим адресом" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-border px-4 py-4 text-center">
          <Text variant="p2" tone="muted" className="break-all">
            {SAMPLE_ADDRESS}
          </Text>
        </div>

        <div className="mt-8 flex justify-center">
          <QrMock size={180} />
        </div>
      </main>

      <div className="grid grid-cols-2 gap-3 px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => setShareOpen(true)}
        >
          Поделиться
        </Button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
        >
          Скопировать
        </Button>
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
