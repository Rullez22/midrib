"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Text } from "@/components/ds";
import { AccordionBlock } from "@/components/app/accordion-block";
import { ChevronRightIcon } from "@/components/app/app-icons";
import { useRegistrations } from "@/components/app/registrations-store";
import { useDiploma } from "@/components/app/diploma-store";

/**
 * Кейс 2 — запрос доступа ВУЗа с целью выдачи диплома (Figma 7009:574668 /
 * 7009:575009). Раскрывающиеся блоки «Паспорт» и «Дипломы и аттестаты».
 * «Отклонить» → сброс. «Подтвердить» → ВУЗ появляется в списке «Веб»,
 * диплом выдаётся (pending) и появляется в «Документах».
 */
const PASSPORT_FIELDS = ["ФИО", "Фото", "Дата рождения", "Кем выдан", "Дата выдачи"];
const DIPLOMA_FIELDS = ["Аттестат"];

/** Список полей внутри блока: подпись-основание + чекбоксы (все отмечены). */
function AccessFields({ fields }: { fields: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f, true])),
  );
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <Text variant="caption" tone="subtle">
          На основании согласия
        </Text>
        <ChevronRightIcon className="text-foreground-subtle" />
      </div>
      {fields.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => setChecked((p) => ({ ...p, [label]: !p[label] }))}
          className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left"
        >
          <Text variant="p2">{label}</Text>
          <span className="pointer-events-none flex items-center">
            <Checkbox size="xs" checked={checked[label]} readOnly tabIndex={-1} />
          </span>
        </button>
      ))}
    </div>
  );
}

export default function GrantUniversityPage() {
  const router = useRouter();
  const { grant } = useRegistrations();
  const { issue } = useDiploma();

  const decline = () => router.push("/app");
  const confirm = () => {
    grant({ id: "university", title: "Университет имени Пушкина", detailed: true });
    issue();
    router.push("/app");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="shrink-0 bg-surface px-4 pt-11 pb-3">
        <Text variant="h5" as="h1" className="text-center">
          Университет имени Пушкина запрашивает доступ к вашим данным
        </Text>
      </header>

      <div className="shrink-0 bg-[#fd6161] py-3 text-center">
        <Text variant="p2-medium" className="text-[#fff]">
          С целью выдачи диплома
        </Text>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <AccordionBlock title="Паспорт" defaultOpen>
          <AccessFields fields={PASSPORT_FIELDS} />
        </AccordionBlock>
        <AccordionBlock title="Дипломы и аттестаты" defaultOpen>
          <AccessFields fields={DIPLOMA_FIELDS} />
        </AccordionBlock>
      </main>

      <div className="flex shrink-0 gap-3 px-4 pt-6 pb-6">
        <Button
          variant="secondary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={decline}
        >
          Отклонить
        </Button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={confirm}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}
