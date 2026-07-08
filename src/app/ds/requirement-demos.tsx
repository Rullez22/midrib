"use client";

/**
 * Демки «Требования» для витрины /ds.
 * Источник: Figma «UI фичи» / Требование (120:0, 638:62786, 642:63109 …).
 * Просмотр — MemberCard (label/value + бейдж статуса); редактирование — RequirementForm
 * (Input · select · Textarea · Radio+Badge · CheckMatrix · документы · кнопки).
 */
import { MemberCard, Badge, RequirementForm } from "@/components/ds";

export function RequirementDemos() {
  return (
    <div className="flex max-w-[814px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Просмотр требования (MemberCard + бейдж)</span>
        <MemberCard
          title={
            <span className="flex w-full items-center justify-between gap-2">
              <span>Для документов об образовании</span>
              <Badge color="orange">Жёлтый</Badge>
            </span>
          }
          defaultOpen
          rows={[
            { label: "Описание", value: "Данные требования распространяются на документы категории «удостоверяющие личность» в РФ." },
            { label: "Тип верификации", value: <Badge color="orange">Международный</Badge> },
            { label: "Документы", value: "Паспорт, Удостоверение нотариуса РФ" },
            { label: "Выдано / Использовано", value: "0$ / 3$" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">Редактирование (RequirementForm)</span>
        <RequirementForm />
      </div>
    </div>
  );
}
