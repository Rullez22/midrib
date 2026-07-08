"use client";

/**
 * Демки Badge (статус-бейдж) для витрины /ds.
 * Источник: Figma «UI фичи» — статусы (968:90167), код «214» (672:5788).
 */
import { Badge, type BadgeColor } from "@/components/ds";

const COLORS: BadgeColor[] = ["green", "orange", "red", "blue", "cyan", "yellow", "purple", "grey"];

export function BadgeDemos() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border p-5">
      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">soft — статусы (Согласован / Локальный)</span>
        <div className="flex flex-wrap items-center gap-3">
          <Badge color="green">Согласован</Badge>
          <Badge color="orange">Локальный</Badge>
          <Badge color="red">Отклонён</Badge>
          <Badge color="blue">На проверке</Badge>
          {COLORS.map((c) => (
            <Badge key={c} color={c}>{c}</Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="ds-caption-medium text-foreground-subtle">solid — код (214)</span>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="solid" color="cyan">214</Badge>
          {COLORS.map((c) => (
            <Badge key={c} variant="solid" color={c}>{c}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
