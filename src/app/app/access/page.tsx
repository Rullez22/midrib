"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { ACCESS_DETAILS } from "@/components/app/access-data";

/**
 * Экран доступа к данным (чек-лист «На основании согласия/соглашения»).
 * Источники: Figma 7009:567341 (Midhub), 7009:572753 (Иванов…).
 * Открывается из строк табов «Работа» / «Друзья»: /app/access?id=…
 * DS: Text, Checkbox, Button. Без нижней навигации (pushed-экран).
 */
function AccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "midhub";
  const detail = ACCESS_DETAILS[id] ?? ACCESS_DETAILS.midhub;

  const [checked, setChecked] = useState<boolean[]>(() =>
    (detail.items ?? []).map((i) => i.checked),
  );

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title={detail.title} showBack />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-border py-3 text-center">
          <Text variant="p2" tone="muted">
            {detail.access}
          </Text>
        </div>

        <div className="bg-surface-muted px-4 py-2.5">
          <Text variant="p2-medium">{detail.basis}</Text>
        </div>

        <Text
          variant="caption"
          tone="subtle"
          as="div"
          className="px-4 pb-1 pt-3"
        >
          {detail.date}
        </Text>

        {detail.items?.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left"
          >
            <Text variant="p2">{item.label}</Text>
            <span className="pointer-events-none flex items-center">
              <Checkbox size="xs" checked={checked[i]} readOnly tabIndex={-1} />
            </span>
          </button>
        ))}

        {detail.fields?.map((f) => (
          <div
            key={f.label}
            className="flex gap-4 border-b border-border px-4 py-3"
          >
            <Text variant="p2" tone="subtle" className="w-[120px] shrink-0">
              {f.label}
            </Text>
            <Text variant="p2-medium" className="flex-1">
              {f.value}
            </Text>
          </div>
        ))}
      </main>

      {detail.action && (
        <div className="px-4 pt-6 pb-6">
          <Button
            variant="primary"
            size="m"
            fullWidth
            className="uppercase tracking-[0.5px]"
            onClick={() => router.back()}
          >
            {detail.action}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense>
      <AccessInner />
    </Suspense>
  );
}
