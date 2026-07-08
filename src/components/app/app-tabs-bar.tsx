"use client";

import { Tabs, Tab } from "@/components/ds";

/**
 * AppTabsBar — таб-бар экрана мобильной апки MIDHUB (Android-стиль макетов).
 * Серая зона (surface-muted) + DS Tabs с зелёной пилюлей (класс `app-tabs`),
 * во всю ширину с отступами 16px. Переиспользуется на экранах с табами.
 */
export interface AppTabItem {
  value: string;
  label: string;
}

export function AppTabsBar({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (value: string) => void;
  items: AppTabItem[];
}) {
  return (
    <div className="border-b border-border bg-surface-muted px-4 pt-4 pb-3">
      <Tabs
        value={value}
        onValueChange={onChange}
        variant="solid"
        size="m"
        equal
        className="app-tabs w-full"
      >
        {items.map((t) => (
          <Tab key={t.value} value={t.value}>
            {t.label}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
