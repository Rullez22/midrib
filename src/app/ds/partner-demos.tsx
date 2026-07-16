"use client";

/**
 * Демки RoleLegend + PartnerCard для витрины /ds.
 * Источник: Figma «UI фичи» — «Dropdown роли» (1380:163064) и
 * «партнер-пайщик» (2205:230934). Reuse: RoleLegend, PartnerCard, Button.
 */
import { RoleLegend, PartnerCard, Text } from "@/components/ds";

const ROLE_ITEMS = [
  { color: "red-200", label: "Пайщик кооператива Immatra" },
  { color: "red-200", label: "Председатель правления кооператива Immatra" },
  { color: "orange-200", label: "Пайщик HR отделения" },
  { color: "orange-200", label: "Председатель правления HR отделения" },
  { color: "yellow-300", label: "Пайщик Производственного отделения" },
  { color: "yellow-300", label: "Председатель правления Производственного отделения" },
  { color: "green-200", label: "Пайщик Коммуникационного отделения" },
  { color: "green-200", label: "Председатель правления Коммуникационного отделения" },
] as const;

export function PartnerDemos() {
  return (
    <div className="flex flex-col gap-8">
      {/* RoleLegend */}
      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">RoleLegend — легенда ролей (Dropdown роли)</Text>
        <div className="flex flex-wrap gap-8">
          <RoleLegend items={[...ROLE_ITEMS]} className="w-[384px] max-w-full" />
          <div className="flex flex-col gap-2">
            <Text variant="caption" tone="subtle">plain (встраиваемая)</Text>
            <RoleLegend plain items={[...ROLE_ITEMS].slice(0, 4)} className="w-[280px]" />
          </div>
        </div>
      </div>

      {/* PartnerCard */}
      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">PartnerCard — промо партнёра-пайщика</Text>
        <PartnerCard
          className="max-w-[720px]"
          title="Кооператив Слонёнок"
          description="Совместные закупки и логистика для пайщиков: собираем заявки, находим поставщика и развозим партию по складам участников."
        />
      </div>
    </div>
  );
}
