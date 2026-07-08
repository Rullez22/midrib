"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Checkbox } from "../checkbox";

/**
 * VerificationCard — карточка-чек-лист реквизитов (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / card веб-ресурс (nodes 1942:303390, 1942:305217).
 * Стили 1:1.
 *
 * Бордерная карточка: шапка (grey-10) с чекбоксом «выбрать всё» и заголовком
 * (Medium) + строки «чекбокс · лейбл (grey-300) · значение». Reuse DS Checkbox.
 *
 * @example
 *   <VerificationCard
 *     title="Свидетельство о постановке на учет в налоговом органе"
 *     rows={[{ label: "ОГРН", value: "1167700074915" }]}
 *   />
 */

export interface VerificationRow {
  label: ReactNode;
  value: ReactNode;
}

export interface VerificationCardProps {
  title: ReactNode;
  rows: VerificationRow[];
  className?: string;
}

export function VerificationCard({ title, rows, className }: VerificationCardProps) {
  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      <div className="flex h-[66px] items-center gap-6 border-b border-border bg-surface-sunken px-6">
        <Checkbox size="xs" aria-label="Выбрать всё" />
        <span className="ds-p3-medium text-foreground">{title}</span>
      </div>
      <div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[24px_300px_1fr] items-center gap-6 border-b border-border px-6 py-[17px] last:border-b-0"
          >
            <Checkbox size="xs" aria-label="Выбрать" />
            <span className="ds-p3 text-foreground-subtle">{row.label}</span>
            <span className="ds-p3 text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
