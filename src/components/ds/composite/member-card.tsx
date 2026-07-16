"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";

/**
 * MemberCard — раскрывающаяся карточка пайщика (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / user card ready (nodes 414:1, 915:84998, 917:84920,
 * 915:85200/85301/85361, 915:85421, 937:89378). Стили 1:1.
 *
 * Бордерная карточка-аккордеон: шапка (grey-10) с заголовком и шевроном +
 * строки label/value (паспортные данные) + опциональный футер со статусом
 * (загрузка / принято) и кнопкой «Отменить выбор».
 *
 * @example
 *   <MemberCard
 *     title="Пайщик №1 (Вы-председатель правления)"
 *     defaultOpen
 *     rows={[{ label: "Адрес", value: "0xca30…" }, { label: "Фамилия", value: "Антонов" }]}
 *     status="success" statusText="Токен принят"
 *     onCancel={() => {}}
 *   />
 */

export interface MemberRow {
  label: ReactNode;
  value: ReactNode;
}

export type MemberStatus = "idle" | "loading" | "success";

export interface MemberCardProps {
  title: ReactNode;
  rows?: MemberRow[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Статус в футере: loading (спиннер) · success (зелёная галка). */
  status?: MemberStatus;
  statusText?: ReactNode;
  /** Кнопка «Отменить выбор» в футере. */
  onCancel?: () => void;
  cancelLabel?: ReactNode;
  className?: string;
}

function Chevron() {
  return (
    <svg className="size-6 transition-transform" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="size-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--color-green-500)" />
      <path d="m8 12 2.5 2.5L16 9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MemberCard({
  title,
  rows = [],
  open,
  defaultOpen = false,
  onOpenChange,
  status = "idle",
  statusText,
  onCancel,
  cancelLabel = "Отменить выбор",
  className,
}: MemberCardProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const current = open !== undefined ? open : internal;
  const panelId = useId();

  function toggle() {
    if (open === undefined) setInternal((v) => !v);
    onOpenChange?.(!current);
  }

  const hasFooter = status !== "idle" || statusText != null || onCancel != null;

  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface shadow-[var(--shadow-sm)]", className)}>
      <button
        type="button"
        className={cn(
          "flex h-[66px] w-full items-center justify-between gap-4 bg-surface-sunken px-6 text-left transition-colors hover:bg-[color:var(--color-grey-90)]",
          current && "border-b border-border",
        )}
        aria-expanded={current}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className="ds-p3 text-foreground">{title}</span>
        <span className={cn("flex-none text-foreground-subtle", current && "rotate-180")}>
          <Chevron />
        </span>
      </button>

      {current && (
        <div id={panelId}>
          <dl className="grid grid-cols-[284px_1fr]">
            {rows.map((row, i) => (
              <div
                key={i}
                className={cn(
                  "col-span-2 grid grid-cols-subgrid items-center px-6 py-[11px]",
                  // Нижняя рамка у всех строк, кроме последней без футера
                  // (иначе складывается с рамкой карточки → 2px).
                  (i < rows.length - 1 || hasFooter) && "border-b border-border",
                )}
              >
                <dt className="ds-p3 text-foreground-subtle">{row.label}</dt>
                <dd className="ds-p3 text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          {hasFooter && (
            <div className="flex min-h-[56px] items-center justify-between gap-4 bg-surface-sunken px-6 py-3">
              <span className="ds-p3 flex items-center gap-2">
                {status === "loading" && <Spinner />}
                {status === "success" && <CheckCircle />}
                <span
                  style={{
                    color:
                      status === "success"
                        ? "var(--color-green-500)"
                        : status === "loading"
                          ? "var(--color-blue-midhub-500)"
                          : "var(--color-dark-800)",
                  }}
                >
                  {statusText}
                </span>
              </span>
              {onCancel != null && (
                <Button variant="negative-sec" size="s" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
