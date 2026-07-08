"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { ChevronRightIcon } from "@/components/app/app-icons";
import { useRegistrations } from "@/components/app/registrations-store";
import {
  SERVICE_DETAILS,
  type DetailSection,
} from "@/components/app/service-details";

/**
 * Карточка сервиса — «… имеет доступ к вашим данным» (Figma 7009:573827 /
 * 7009:573911). Данные — из SERVICE_DETAILS[id] (PayPal / Университет).
 * «Редактировать доступ» → /edit, «Закрыть доступ» → /close.
 */

function BasisSection({ section }: { section: DetailSection }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <Text variant="caption" tone="subtle">
          {section.caption}
        </Text>
        <ChevronRightIcon className="text-foreground-subtle" />
      </div>
      {section.groups.map((group) => (
        <div key={group.doc}>
          <div className="bg-[#c4c4c4] px-4 py-2">
            <Text variant="caption-medium" className="text-[#fff]" as="div">
              {group.doc}
            </Text>
          </div>
          {group.fields.map((field) => (
            <div key={field} className="border-b border-border px-4 py-3">
              <Text variant="p2">{field}</Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { get } = useRegistrations();
  const reg = get(id);
  const base = SERVICE_DETAILS[id] ?? SERVICE_DETAILS.paypal;
  const name = reg?.title ?? base.name;

  // Для ВУЗа поля блока «Дипломы и аттестаты» — из выбранных при выдаче
  // доступа дополнений (reg.extra); иначе — статический состав из конфига.
  const detail = reg?.extra?.length
    ? {
        ...base,
        sections: base.sections.map((s) => ({
          ...s,
          groups: s.groups.map((g) =>
            g.doc === "Дипломы и аттестаты"
              ? { ...g, fields: reg.extra as string[] }
              : g,
          ),
        })),
      }
    : base;

  const editLink = (
    <button
      type="button"
      onClick={() => router.push(`/app/service/${id}/edit`)}
      className="w-full border-b border-border bg-surface px-4 py-3.5 text-center"
    >
      <Text variant="caption-up" className="text-primary">
        Редактировать доступ
      </Text>
    </button>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader title={name} showBack backHref="/app" />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-surface px-4 py-3.5 text-left"
        >
          <Text variant="p2-medium">Пользовательское соглашение</Text>
          <ChevronRightIcon className="text-foreground-subtle" />
        </button>

        <div className="border-b border-border px-4 py-3">
          <Text variant="p2-medium">{detail.accessLabel}</Text>
        </div>

        {detail.sections.map((section) => (
          <div key={section.caption}>
            <BasisSection section={section} />
            {section.editLinkAfter && editLink}
          </div>
        ))}
      </main>

      {/* Кнопка закреплена внизу экрана, отступ 40px от низа. */}
      <div className="shrink-0 px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push(`/app/service/${id}/close`)}
        >
          Закрыть доступ
        </Button>
      </div>
    </div>
  );
}
