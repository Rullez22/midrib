"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { CONFIRM_FIELDS } from "@/components/app/add-flow-data";
import { usePendingDocs } from "@/components/app/pending-docs-store";

/**
 * Экран «Проверка» (/app/documents/check?id=…) — документ на проверке.
 * Источник: Figma 7009:569361. Таблица: тип верификации (цветная плитка) +
 * введённые данные. Открывается из таба «Проверяются». DS: Text.
 */
const REGION_LABEL = {
  international: "Международный:",
  local: "Локальный:",
} as const;
const TILE_BG = { green: "var(--color-green-500)", orange: "#f0b429" } as const;

function CheckInner() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { getPending } = usePendingDocs();
  const doc = getPending(id);

  const tileColor = doc ? (doc.color === "green" ? "green" : "orange") : "orange";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Проверка" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <Text variant="caption-up" tone="subtle" as="div" className="pb-2">
          Введенные данные
        </Text>
        <div className="overflow-hidden rounded-lg border border-border">
          {/* Тип верификации */}
          <div className="flex border-b border-border">
            <div className="flex w-[40%] shrink-0 items-center border-r border-border px-3 py-3">
              <Text variant="p3" tone="subtle">
                Тип верификации
              </Text>
            </div>
            <div className="flex flex-1 items-center justify-between gap-2 px-3 py-3">
              <Text variant="p3-medium">
                {doc ? REGION_LABEL[doc.region] : REGION_LABEL.international}
              </Text>
              <span
                className="inline-block h-6 w-9 rounded-sm"
                style={{ backgroundColor: TILE_BG[tileColor] }}
              />
            </div>
          </div>

          {CONFIRM_FIELDS.map((f) => (
            <div key={f.label} className="flex border-b border-border last:border-b-0">
              <div className="flex w-[40%] shrink-0 items-center border-r border-border px-3 py-3">
                <Text variant="p3" tone="subtle">
                  {f.label}
                </Text>
              </div>
              <div className="flex flex-1 items-center px-3 py-3">
                <Text variant="p3-medium">{f.value}</Text>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense>
      <CheckInner />
    </Suspense>
  );
}
