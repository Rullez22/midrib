"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { serviceName } from "@/components/app/service-details";

/**
 * Экран обработки запроса на удаление ПД (Figma 7009:573466).
 * Показывается после «Отключить». «Чат с сервисом» → чат с менеджером.
 */
export default function ServiceRemovingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title={serviceName(id)} showBack />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="bg-surface px-4 py-4">
          <Text variant="h5" as="p">
            Сервис обрабатывает ваш запрос на удаление персональных данных. Это
            может занять некоторое время
          </Text>
        </div>

        {/* Обе строки — в общей серой плашке (Figma 7009:573466). */}
        <div className="border-y border-border bg-surface-muted">
          <div className="px-4 pt-3">
            <Text variant="p2-medium">Сервис имеет доступ к вашим данным</Text>
          </div>
          <div className="px-4 pt-1 pb-3">
            <Text variant="caption" tone="subtle">
              На основании договора
            </Text>
          </div>
        </div>
        {["Фамилия", "Имя", "Дата рождения"].map((label) => (
          <div key={label} className="border-b border-border px-4 py-3">
            <Text variant="p2">{label}</Text>
          </div>
        ))}
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push(`/app/service/${id}/chat`)}
        >
          Чат с сервисом
        </Button>
      </div>
    </div>
  );
}
