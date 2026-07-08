"use client";

/**
 * Демки IncrimentField (подпись + степпер) для витрины /ds.
 * Источник: Figma «UI фичи» / Incriment (1470:204348). Переиспользован DS Incriment.
 */
import { IncrimentField } from "@/components/ds";

export function IncrimentFieldDemos() {
  return (
    <div className="flex max-w-[450px] flex-col gap-4">
      <IncrimentField label="Количество долей на пайщика" size="l" defaultValue={0} min={0} />
      <IncrimentField label="Количество долей на пайщика" size="m" defaultValue={0} min={0} />
      <IncrimentField label="Количество долей на пайщика" size="s" defaultValue={0} min={0} />
    </div>
  );
}
