import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * StatCounter — карточка-счётчик «Кол-во» (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Кол-во (2124:232986 — крупная нейтральная),
 * Кол-во цветные (2124:233317 yellow · 2124:233318 green · 2124:233319 blue).
 * Стили 1:1.
 *
 * Бордерная карточка с центрированной парой «подпись (P2) + значение».
 * Одна реализация на крупный нейтральный счётчик и на цветные мини-счётчики —
 * без дублей: визуал управляется `tone` (фон/рамка/цвет подписи) и `size`
 * (размер значения и высота).
 *
 *   tone : "neutral" (white/grey-90) · "yellow" · "green" · "blue"
 *   size : "lg" (значение H3 32/40, высота 104) · "md" (значение P1 18/26, высота 90)
 *
 * @example
 *   <StatCounter size="lg" label="Общее количество выданных вами верификаций (за все время)" value={6} />
 *   <StatCounter tone="yellow" label="Документы по желтому типу" value={2} />
 */

export type StatCounterTone = "neutral" | "yellow" | "green" | "blue";
export type StatCounterSize = "lg" | "md";

export interface StatCounterProps {
  label: ReactNode;
  value: ReactNode;
  tone?: StatCounterTone;
  size?: StatCounterSize;
  className?: string;
}

const TONE_STYLE: Record<StatCounterTone, CSSProperties> = {
  neutral: { backgroundColor: "var(--color-white)", borderColor: "var(--color-grey-90)" },
  yellow: { backgroundColor: "var(--color-yellow-50)", borderColor: "var(--color-yellow-300)" },
  green: { backgroundColor: "var(--color-green-50)", borderColor: "var(--color-green-300)" },
  blue: { backgroundColor: "var(--color-blue-midhub-50)", borderColor: "var(--color-blue-midhub-300)" },
};

const SIZE_CLASS: Record<StatCounterSize, { wrap: string; gap: string; value: string }> = {
  lg: { wrap: "min-h-[104px] px-6 py-5", gap: "gap-2", value: "ds-h3" },
  md: { wrap: "min-h-[90px] px-6 py-4", gap: "gap-1", value: "ds-p1" },
};

export function StatCounter({
  label,
  value,
  tone = "neutral",
  size = "lg",
  className,
}: StatCounterProps) {
  const s = SIZE_CLASS[size];
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[4px] border text-center",
        s.wrap,
        s.gap,
        className,
      )}
      style={TONE_STYLE[tone]}
    >
      <span className={cn("ds-p2", tone === "neutral" ? "text-foreground" : "text-foreground-muted")}>
        {label}
      </span>
      <span className={cn(s.value, "text-foreground")}>{value}</span>
    </div>
  );
}
