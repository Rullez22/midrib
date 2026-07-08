"use client";

/**
 * Демки Item · роли для витрины /ds.
 * Источник: Figma «UI фичи» / items roles (722:67) — варианты 877:389,
 * 759:69524, 722:79. Переиспользованы DS: Item, Button.
 */
import { Item, Button } from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: "var(--color-grey-300)" }}>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 11.5v4.5" {...s} />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg className="ds-item__icon" viewBox="0 0 24 24" style={{ color: "var(--color-grey-300)" }}>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function RoleRow({ tone }: { tone: "muted" | "default" }) {
  return (
    <Item size="m" tone={tone} trailing={<KebabIcon />}>
      <div className="grid grid-cols-4 items-center">
        <span>Председатель правления</span>
        <span className="text-center">Антонов Илья</span>
        <span className="inline-flex items-center justify-center gap-1">
          Секция <InfoIcon />
        </span>
        <span className="text-center" style={{ color: "var(--color-green-300)" }}>
          Активная
        </span>
      </div>
    </Item>
  );
}

export function ItemRolesDemos() {
  return (
    <div className="flex max-w-[1120px] flex-col gap-3">
      <RoleRow tone="muted" />
      <RoleRow tone="default" />

      {/* Строка с кнопкой «Подробнее» */}
      <Item trailing={<Button variant="secondary" size="s">Подробнее</Button>}>
        Пайщик Midhub Global
      </Item>
    </div>
  );
}
