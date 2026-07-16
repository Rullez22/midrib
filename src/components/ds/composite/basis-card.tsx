"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../button";
import { Tooltip } from "../tooltip";

/**
 * BasisCard — карточка основания обработки данных (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / ПП · Основания (Согласие, Договор, Правовое
 * обязательство …; states create / active / filled). Стили 1:1.
 *
 * Серая карточка: заголовок + info-иконка. В состоянии «create» — кнопка
 * «Создать →». В активном/заполненном — синяя рамка и тело (`children`:
 * локализации, «Добавить локализацию» и т.п.).
 *
 *   state : "create" (кнопка Создать) · "filled" (есть содержимое)
 *   active : подсветка синей рамкой (текущее редактируемое основание)
 *
 * @example
 *   <BasisCard title="Согласие" onCreate={create} />
 *   <BasisCard title="Согласие" state="filled" active>…локализации…</BasisCard>
 */

export interface BasisCardProps {
  title: ReactNode;
  state?: "create" | "filled";
  active?: boolean;
  /** Показать info-иконку справа от заголовка. По умолчанию true. */
  info?: boolean;
  /** Текст подсказки при наведении на иконку (тёмный Tooltip; заголовок = title). */
  tooltip?: ReactNode;
  createLabel?: ReactNode;
  onCreate?: () => void;
  /** Заблокировать кнопку «Создать». */
  createDisabled?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Иконка Alert (круг + «!») в шапке основания. Figma «Icons / Alert-24». */
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 shrink-0 text-foreground-subtle">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BasisCard({
  title,
  state = "create",
  active = false,
  info = true,
  tooltip,
  createLabel = "Создать",
  onCreate,
  createDisabled = false,
  children,
  className,
}: BasisCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-border bg-white shadow-[var(--shadow-sm)] last:border-b-0",
        active && "relative z-10 ring-1 ring-inset ring-[var(--color-blue-midhub-500)]",
        className,
      )}
    >
      {/* Шапка основания: серый фон (grey-10) + заголовок + иконка Alert */}
      <div
        className={cn(
          "flex h-[46px] items-center justify-between gap-2 border-b border-border px-4",
          active ? "bg-white" : "bg-surface-sunken",
        )}
      >
        <span className="ds-p3 text-foreground">{title}</span>
        {info &&
          (tooltip != null ? (
            <Tooltip
              title={title}
              content={tooltip}
              side="left"
              className="shrink-0 [&_.ds-tooltip\_\_bubble]:max-w-[320px]"
            >
              <AlertIcon />
            </Tooltip>
          ) : (
            <AlertIcon />
          ))}
      </div>

      {/* Тело: кнопка «Создать» (state=create) либо контент (filled) */}
      <div className="flex flex-col gap-3 p-4">
        {state === "create" ? (
          <Button
            variant="secondary"
            size="s"
            fullWidth
            iconRight={<ArrowRight />}
            disabled={createDisabled}
            onClick={onCreate}
          >
            {createLabel}
          </Button>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
