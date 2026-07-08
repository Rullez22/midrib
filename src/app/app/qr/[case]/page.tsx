"use client";

import { use } from "react";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";

/**
 * Флоу конкретного кейса доступа к данным (`/app/qr/1|2|3`).
 * Открывается из списка «Выберите кейс:» (../page.tsx).
 *
 * ЗАГЛУШКА: сами сценарии добавляются по мере поступления от пользователя.
 * Как только приходит флоу для кейса N — здесь ветвим по `caseNo`.
 */
export default function QrCaseFlowPage({
  params,
}: {
  params: Promise<{ case: string }>;
}) {
  const { case: caseNo } = use(params);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title={`Кейс ${caseNo}`} showBack />

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
        <Text variant="p2" tone="subtle">
          Флоу этого кейса скоро появится.
        </Text>
      </main>
    </div>
  );
}
