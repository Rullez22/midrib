"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Text } from "@/components/ds";
import { AccordionBlock } from "@/components/app/accordion-block";
import { ChevronRightIcon } from "@/components/app/app-icons";
import { useRegistrations } from "@/components/app/registrations-store";
import { useDiploma } from "@/components/app/diploma-store";

/**
 * Кейс 3 — запрос доступа ВУЗа для внесения дополнений в диплом
 * (Figma 7009:575066 → 7009:575131). Красный баннер-инструкция между блоками.
 * Данные блока «Дипломы и аттестаты» по умолчанию НЕ выбраны; «Подтвердить»
 * заблокирована, пока не выбрано хотя бы одно поле.
 */
const PASSPORT_FIELDS = ["ФИО", "Фото", "Дата рождения", "Кем выдан", "Дата выдачи"];
const DIPLOMA_CHOICES = ["Диплом (диплом, приложение)", "Аттестат"];

/** Строка-поле с чекбоксом. */
function FieldRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left"
    >
      <Text variant="p2">{label}</Text>
      <span className="pointer-events-none flex items-center">
        <Checkbox size="xs" checked={checked} readOnly tabIndex={-1} />
      </span>
    </button>
  );
}

/** Подпись-основание с шевроном. */
function BasisCaption() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <Text variant="caption" tone="subtle">
        На основании согласия
      </Text>
      <ChevronRightIcon className="text-foreground-subtle" />
    </div>
  );
}

export default function GrantAppendixPage() {
  const router = useRouter();
  const { grant } = useRegistrations();
  const { issue } = useDiploma();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const chosen = DIPLOMA_CHOICES.filter((c) => selected[c]);
  const canConfirm = chosen.length > 0;

  const confirm = () => {
    if (!canConfirm) return;
    grant({
      id: "university",
      title: "Университет имени Пушкина",
      detailed: true,
      extra: chosen,
    });
    issue("appendix");
    router.push("/app/service/university");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="shrink-0 bg-surface px-4 pt-11 pb-3">
        <Text variant="h5" as="h1" className="text-center">
          Университет имени Пушкина запрашивает доступ к вашим данным
        </Text>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <AccordionBlock title="Паспорт">
          <BasisCaption />
          {PASSPORT_FIELDS.map((label) => (
            <FieldRow key={label} label={label} checked />
          ))}
        </AccordionBlock>

        <div className="bg-[#fd6161] px-5 py-3 text-center">
          <Text variant="p2-medium" className="text-[#fff]">
            Выберите данные из блока дипломы и аттестаты, которые вы хотите
            предоставить для дополнения
          </Text>
        </div>

        <AccordionBlock title="Дипломы и аттестаты" defaultOpen>
          <BasisCaption />
          {DIPLOMA_CHOICES.map((label) => (
            <FieldRow
              key={label}
              label={label}
              checked={!!selected[label]}
              onToggle={() =>
                setSelected((p) => ({ ...p, [label]: !p[label] }))
              }
            />
          ))}
        </AccordionBlock>
      </main>

      <div className="flex shrink-0 gap-3 px-4 pt-6 pb-6">
        <Button
          variant="secondary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={() => router.push("/app")}
        >
          Отклонить
        </Button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase"
          disabled={!canConfirm}
          onClick={confirm}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}
