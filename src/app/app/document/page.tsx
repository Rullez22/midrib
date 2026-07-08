"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import {
  DOCUMENTS,
  VERIF_LABEL,
  type TileColor,
} from "@/components/app/document-data";

/**
 * Экран документа — /app/document?id=… (из списка «Мои документы»).
 * Источник: Figma «Свидетельство о рождении» 7009:568165 (шаблон-таблица).
 * Таблица полей + тип верификации (Международный/Локальный, green/orange) +
 * «Получить доп. верификацию» + «Обновить документ». DS: Text, Button.
 */
function VerifyTile({ color }: { color: TileColor }) {
  return (
    <span
      className="inline-block h-6 w-9 rounded-sm"
      style={{
        backgroundColor:
          color === "green"
            ? "var(--color-green-500)"
            : "var(--color-orange-300)",
      }}
    />
  );
}

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 11v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function DocumentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "birth";
  const doc = DOCUMENTS[id] ?? DOCUMENTS.birth;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title={doc.title}
        showBack
        actions={
          <span className="text-foreground-subtle">
            <InfoIcon />
          </span>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="overflow-hidden rounded-lg border border-border">
          {/* Тип верификации */}
          <div className="flex border-b border-border">
            <div className="flex w-[40%] shrink-0 items-center border-r border-border px-3 py-3">
              <Text variant="p3" tone="subtle">
                Тип верификации
              </Text>
            </div>
            <div className="flex flex-1 flex-col gap-2 px-3 py-3">
              {doc.verifications.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2"
                >
                  <Text variant="p3-medium">{VERIF_LABEL[v.type]}</Text>
                  <VerifyTile color={v.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Доп. верификация — во всю ширину, без вертикального разделителя */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 border-b border-border py-3 text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <Text variant="p3-medium" as="span" className="text-primary">
              Получить доп. верификацию
            </Text>
          </button>

          {/* Поля документа */}
          {doc.fields.map((f, i) => (
            <div
              key={f.label}
              className={`flex ${
                i < doc.fields.length - 1 ? "border-b border-border" : ""
              }`}
            >
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

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.back()}
        >
          Обновить документ
        </Button>
      </div>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <Suspense>
      <DocumentInner />
    </Suspense>
  );
}
