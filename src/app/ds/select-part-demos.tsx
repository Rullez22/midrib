"use client";

/**
 * Демки «select part» (выбор типа верификации / подключения) для витрины /ds.
 * Источник: Figma «UI фичи» (966:90156 промо, 2233:231062 Международная,
 * 2233:231211 Локальная, 2233:231188 опция). Reuse SelectOption + Button + Text.
 */
import { SelectOption, Button, Text } from "@/components/ds";

function UsersIcon() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <span className="flex size-16 items-center justify-center rounded-full text-white" style={{ background: "var(--color-blue-midhub-500)" }}>
      <svg viewBox="0 0 24 24" className="size-8"><circle cx="9" cy="9" r="3" {...s} /><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" {...s} /><path d="M16 6a3 3 0 0 1 0 6M21 19c0-2.5-1.5-4.2-4-4.8" {...s} /></svg>
    </span>
  );
}

function ChoiceCard({ title, className }: { title: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 ${className ?? ""}`}>
      <Text variant="h5" className="text-center">{title}</Text>
      <div className="flex justify-around gap-6">
        <SelectOption color="orange" title="Жёлтая" description={`Дистанционная верификация\nпо ${title.toLowerCase() === "локальная" ? "локальному законодательству" : "международным стандартам"}`.split("\n").map((l, i) => <span key={i} className="block">{l}</span>)} />
        <SelectOption color="green" title="Зелёная" description={`Личная верификация по ${title.toLowerCase() === "локальная" ? "локальному законодательству" : "международным стандартам"}`} />
      </div>
    </div>
  );
}

export function SelectPartDemos() {
  return (
    <div className="flex flex-col gap-6">
      {/* Промо-карточка «Массовое подключение» */}
      <div className="flex w-[440px] max-w-full flex-col items-center gap-6 rounded-[4px] border border-border bg-surface p-8 text-center">
        <UsersIcon />
        <div className="flex flex-col gap-2">
          <Text variant="h5">Массовое подключение</Text>
          <Text variant="p2" tone="muted">Можно подключить много пользователей, но только по одной доли на пользователя</Text>
        </div>
        <Button>Подключить</Button>
      </div>

      {/* Карточки выбора верификации */}
      <div className="flex flex-wrap gap-6">
        <ChoiceCard title="Международная" className="flex-1" />
        <ChoiceCard title="Локальная" className="flex-1" />
      </div>
    </div>
  );
}
