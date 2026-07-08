"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";
import { type BadgeColor } from "../badge";

/**
 * OrgColumns — каскадные колонки оргструктуры (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / миссия · структура кооператива
 * (Отдел → Секция → Функция → Технология; департамент big, добавление/
 * редактирование отдела). Стили 1:1.
 *
 * Ряд колонок, разделённых стрелками. В каждой — выбираемые карточки-пункты
 * (active = цветная рамка; sub-подпись «Петров А. А.» или «Не назначено»
 * красным) и кнопка «+ Добавить …».
 *
 * @example
 *   <OrgColumns columns={[
 *     { items: [{ label: "Отдел источника", active: true }, { label: "Отдел 4" }], addLabel: "Добавить отдел" },
 *     { items: [{ label: "Vestibulum…", sub: "Петров А. А.", active: true }, { label: "…", sub: "Не назначено", subTone: "danger" }], addLabel: "Добавить функцию" },
 *   ]} />
 */

export interface OrgItem {
  label: ReactNode;
  sub?: ReactNode;
  subTone?: "muted" | "danger";
  active?: boolean;
  onClick?: () => void;
  /** Пункт-аккордеон (шеврон справа, раскрывает `body`). Figma «questions». */
  dropdown?: boolean;
  /** Содержимое раскрытого аккордеона. */
  body?: ReactNode;
  /** Раскрыт по умолчанию. */
  defaultOpen?: boolean;
}
export interface OrgColumn {
  items: OrgItem[];
  addLabel?: ReactNode;
  onAdd?: () => void;
}
export interface OrgColumnsProps {
  columns: OrgColumn[];
  /** Цвет активной рамки. По умолчанию синий (blue-midhub-500). */
  activeColor?: BadgeColor;
  className?: string;
}

function Arrow() {
  return (
    <div className="flex shrink-0 items-center self-start pt-5 text-foreground-subtle">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Пункт-аккордеон (Figma «questions»): шапка с шевроном + раскрываемое тело. */
function DropdownItem({ item, activeBorder }: { item: OrgItem; activeBorder: string }) {
  const [open, setOpen] = useState(!!item.defaultOpen);
  return (
    <div
      className={cn("overflow-hidden rounded-[4px] border bg-white", !item.active && "border-border")}
      style={item.active ? { borderColor: activeBorder, background: "var(--color-red-50, #fde9ed)" } : undefined}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="ds-p3 min-w-0 flex-1 truncate text-foreground">{item.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-foreground-subtle transition-transform", open && "rotate-180")} />
      </button>
      {open && item.body != null && (
        <div className="ds-caption px-3 pb-3 text-foreground-subtle">{item.body}</div>
      )}
    </div>
  );
}

export function OrgColumns({ columns, activeColor, className }: OrgColumnsProps) {
  const activeBorder = activeColor ? `var(--color-${activeColor}-300)` : "var(--color-blue-midhub-500)";
  return (
    <div className={cn("flex w-full items-stretch gap-3", className)}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex items-stretch gap-3">
          {ci > 0 && <Arrow />}
          <div className="flex w-[220px] flex-col gap-3">
            {col.items.map((it, i) =>
              it.dropdown ? (
                <DropdownItem key={i} item={it} activeBorder={activeBorder} />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={it.onClick}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-[8px] border bg-white px-4 py-3 text-left transition-colors",
                    !it.active && "border-border hover:bg-[var(--color-grey-10)]",
                  )}
                  style={it.active ? { borderColor: activeBorder } : undefined}
                >
                  <span className="ds-p3 text-foreground">{it.label}</span>
                  {it.sub != null && (
                    <span className={cn("ds-caption", it.subTone === "danger" ? "text-[var(--color-red-400)]" : "text-foreground-subtle")}>
                      {it.sub}
                    </span>
                  )}
                </button>
              ),
            )}
            {col.addLabel != null && (
              <Button variant="secondary" size="m" fullWidth iconLeft={<PlusIcon />} onClick={col.onAdd}>
                {col.addLabel}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
