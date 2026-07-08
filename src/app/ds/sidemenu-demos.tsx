"use client";

/**
 * Демки Sidemenu (композит) для витрины /ds.
 * Источник: Figma «UI фичи» / sidemenu (1647:231585, 1170:101117, 1170:113096).
 */
import { useState } from "react";
import { Sidemenu, Text, type SidemenuItem } from "@/components/ds";

const LABEL_ITEMS: SidemenuItem[] = Array.from({ length: 7 }, (_, i) => ({
  value: String(i + 1),
  label: `Подразделение-${i + 1}`,
}));

const COLOR_ITEMS: SidemenuItem[] = [
  { value: "1", label: "1", color: "red" },
  { value: "2", label: "2", color: "orange" },
  { value: "3", label: "3", color: "yellow" },
  { value: "4", label: "4", color: "green" },
  { value: "5", label: "5", color: "blue" },
  { value: "6", label: "6", color: "blue-strong" },
  { value: "7", label: "7", color: "purple" },
];

export function SidemenuDemos() {
  const [color, setColor] = useState("1");
  const [label, setLabel] = useState("1");

  return (
    <div className="flex flex-wrap gap-12 rounded-xl border border-border p-5">
      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">variant=&quot;color&quot;</Text>
        <Sidemenu
          variant="color"
          gap="24px"
          className="w-12"
          value={color}
          onValueChange={setColor}
          items={COLOR_ITEMS}
          aria-label="Цветные бейджи"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Text variant="caption-up" tone="subtle">variant=&quot;label&quot;</Text>
        <Sidemenu
          variant="label"
          gap="8px"
          value={label}
          onValueChange={setLabel}
          items={LABEL_ITEMS}
          aria-label="Подразделения"
        />
      </div>
    </div>
  );
}
