"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { CONFIRM_FIELDS } from "@/components/app/add-flow-data";
import { VERIFS } from "@/components/app/add-doc-data";
import { usePendingDocs } from "@/components/app/pending-docs-store";

/**
 * Экран «Подтверждение» (/app/documents/add/confirm?v=…).
 * Источник: Figma 7009:569291. Таблица введённых данных + согласие +
 * «Подтвердить» → документ уходит в таб «Проверяются». DS: Text, Checkbox,
 * Button.
 */
function ConfirmInner() {
  const router = useRouter();
  const params = useSearchParams();
  const v = params.get("v") ?? "intl-yellow";
  const { addPending } = usePendingDocs();
  const [agree, setAgree] = useState(false);

  const submit = () => {
    if (!agree) return;
    const verif = VERIFS.find((x) => x.id === v) ?? VERIFS[0];
    addPending({ title: "Паспорт", color: verif.color, region: verif.region });
    router.push("/app/documents?tab=checking");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title="Подтверждение" showBack />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <Text variant="caption-up" tone="subtle" as="div" className="pb-2">
          Введенные данные
        </Text>
        <div className="overflow-hidden rounded-lg border border-border">
          {CONFIRM_FIELDS.map((f, i) => (
            <div
              key={f.label}
              className={`flex ${
                i < CONFIRM_FIELDS.length - 1 ? "border-b border-border" : ""
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
        <button
          type="button"
          onClick={() => setAgree((a) => !a)}
          className="mb-3 flex w-full items-start gap-3 text-left"
        >
          <span className="pointer-events-none mt-0.5">
            <Checkbox size="xs" checked={agree} readOnly tabIndex={-1} />
          </span>
          <Text variant="p3" tone="muted">
            Соглашаюсь с{" "}
            <span className="text-primary">условиями сервиса</span> и{" "}
            <span className="text-primary">
              обработкой персональных данных
            </span>
          </Text>
        </button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          disabled={!agree}
          className="uppercase tracking-[0.5px]"
          onClick={submit}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
