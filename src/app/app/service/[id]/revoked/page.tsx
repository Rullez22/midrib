"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { ArrowLeftIcon, TrashIcon } from "@/components/app/app-icons";
import { useRegistrations } from "@/components/app/registrations-store";

/**
 * Экран «Все данные сервиса отозваны» (Figma 7009:573502).
 * «Скрыть сервис» удаляет строку из списка на главном экране.
 */
export default function ServiceRevokedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { remove } = useRegistrations();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface pt-11">
      <div className="px-3 py-2">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center text-foreground-muted"
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center px-6 pt-6 text-center">
        {/* Иллюстрация: карточка сервиса с красной урной */}
        <div className="relative mb-8">
          <div className="flex w-[168px] items-center gap-2.5 rounded-[3px] bg-surface-muted p-3">
            <span className="size-9 shrink-0 rounded-full bg-[#c9c9c9]" />
            <div className="flex-1 space-y-1.5">
              <span className="block h-1.5 w-full rounded bg-[#d3d3d3]" />
              <span className="block h-1.5 w-3/4 rounded bg-[#dedede]" />
              <span className="mt-2 block h-1.5 w-1/2 rounded bg-[#dedede]" />
            </div>
          </div>
          <span className="absolute -right-2 -bottom-3 flex size-9 items-center justify-center rounded-full bg-[var(--color-red-500)] text-[#fff]">
            <TrashIcon width={18} height={18} />
          </span>
        </div>

        <Text variant="h5" as="h1" className="mb-1">
          Все данные серивиса отозваны
        </Text>
        <Text variant="p2" tone="muted" as="p">
          Вы можете скрыть его из списка на главном экране
        </Text>
      </div>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => {
            remove(id);
            router.push("/app");
          }}
        >
          Скрыть сервис
        </Button>
      </div>
    </div>
  );
}
