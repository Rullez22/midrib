"use client";

/**
 * Демки VerificationTable — таблица «страна × уровень верификации».
 * Источник: Figma — ПП / Настройка формы регистрации (2671:398104).
 * Reuse: VerificationTable (внутри Checkbox + Flag + Badge).
 */
import { VerificationTable, type VerificationGroup } from "@/components/ds";

const COUNTRIES = [
  { code: "at", label: "Австрия" },
  { code: "be", label: "Бельгия" },
  { code: "bg", label: "Болгария" },
  { code: "ru", label: "Россия" },
  { code: "gr", label: "Греция" },
  { code: "de", label: "Германия" },
];

const GROUPS: VerificationGroup[] = [
  {
    label: "Локальная",
    columns: [
      { label: "Желтая", color: "orange" },
      { label: "Зеленая", color: "green" },
    ],
  },
  {
    label: "Международная",
    columns: [
      { label: "Желтая", color: "orange" },
      { label: "Зеленая", color: "green" },
    ],
  },
];

export function VerificationTableDemos() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-up text-foreground-subtle">
          Страна × уровень верификации (группы + бейджи + «Всего»)
        </span>
        <VerificationTable
          className="max-w-[1120px]"
          countries={COUNTRIES}
          groups={GROUPS}
          defaultChecked={[
            [true, false, false, true],
            [false, true, false, false],
            [false, false, false, false],
            [false, false, true, false],
            [false, false, false, false],
            [true, false, false, false],
          ]}
        />
      </div>
    </div>
  );
}
