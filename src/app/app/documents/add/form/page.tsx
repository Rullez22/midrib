"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Radio, Text } from "@/components/ds";
import { AppHeader } from "@/components/app/app-header";
import { AppProgress } from "@/components/app/app-progress";

/**
 * Шаг 4 — «Заполните форму» (/app/documents/add/form?v=…).
 * Источник: Figma 7009:569200. Поля документа + пол + «Далее».
 * Предзаполнено демо-данными (форма валидна). DS: Input, Radio, Button.
 */
function ScanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const v = params.get("v") ?? "";
  const [gender, setGender] = useState<"m" | "f">("m");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <AppHeader
        title="Заполните форму"
        showBack
        flush
        actions={
          <button type="button" aria-label="Сканировать" className="p-0.5">
            <ScanIcon />
          </button>
        }
      />
      <AppProgress current={4} total={5} />

      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
        <Input label="Фамилия" defaultValue="Иванов" />
        <Input label="Имя" defaultValue="Иван" />
        <Input label="Отчество" defaultValue="Иванович" />
        <Input label="Дата рождения" defaultValue="12.01.1991" />

        <div className="py-1">
          <Text variant="p2" tone="muted" as="div" className="mb-3">
            Пол
          </Text>
          <div className="flex gap-10">
            <Radio
              name="gender"
              size="xs"
              checked={gender === "m"}
              onChange={() => setGender("m")}
              label="Мужской"
            />
            <Radio
              name="gender"
              size="xs"
              checked={gender === "f"}
              onChange={() => setGender("f")}
              label="Женский"
            />
          </div>
        </div>

        <Input label="Номер паспорта" defaultValue="1234 56790" />
        <Input label="Место выдачи" defaultValue="76 ОМ Ленинского р-на, Пермь" />
        <Input label="Дата выдачи" defaultValue="12.04.2002" />
        <Input label="Код подразделения" defaultValue="0132424" />
      </main>

      <div className="px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase tracking-[0.5px]"
          onClick={() => router.push(`/app/documents/add/photo?v=${v}`)}
        >
          Далее
        </Button>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense>
      <FormInner />
    </Suspense>
  );
}
