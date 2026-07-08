"use client";

/**
 * Демки «Редактирование счёта» для витрины /ds.
 * Источник: Figma «UI фичи» / редактирование счёта (1503:177626 редактор,
 * 1504:178668 строка распределения).
 * Переиспользованы DS: IncrimentField, DistributionRow, ProgressRing, Text.
 */
import { IncrimentField, DistributionRow, ProgressRing, Text } from "@/components/ds";

const OPTS = [
  { label: "Установить процент, ниже которого при будущих корректировках опускаться будет невозможно." },
  { label: "Зафиксировать % поступлений без возможности изменений в будущем" },
];

export function AccountEditDemos() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Левая колонка — распределение */}
      <div className="flex w-[600px] max-w-full flex-col gap-4">
        <Text variant="caption-up" tone="subtle">Распределение целевого счета</Text>
        <IncrimentField label="Целевой счет" defaultValue={100} suffix="%" min={0} max={100} />

        <Text variant="caption-up" tone="subtle">Распределение подсчетов целевого счета</Text>
        <DistributionRow title="Счет инвестиционных токенов" defaultValue={0} options={OPTS} />
        <DistributionRow title="Счет управляющих токенов" defaultValue={0} options={OPTS} />
        <DistributionRow title="Маршрутный счет" defaultValue={0} options={OPTS} />
      </div>

      {/* Правая колонка — буферная область */}
      <BufferPanel />
    </div>
  );
}

function BufferPanel() {
  return (
    <div className="flex w-[300px] flex-none flex-col items-center gap-4 rounded-[4px] border border-border p-6">
      <div className="text-center">
        <div className="ds-p3-medium text-foreground">Буферная область</div>
        <div className="ds-caption text-foreground-subtle">Процент перенаправлений со счетов</div>
      </div>
      <ProgressRing value={0} />
    </div>
  );
}
