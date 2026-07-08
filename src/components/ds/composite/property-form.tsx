"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input } from "../input";
import { Textarea } from "../textarea";

/**
 * PropertyForm — карточка-форма свойств (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / свойство документа (node 420:49) и форма вопроса.
 * Стили 1:1.
 *
 * Бордерная карточка с шапкой (grey-10) и списком полей. Тип поля:
 *   text     — DS Input
 *   number   — Input + иконка-степпер
 *   select   — Input + стрелка (переход к выбору)
 *   textarea — DS Textarea
 *
 * Поле `wide` растягивается на всю ширину; иначе — узкая колонка (`columnWidth`).
 *
 * @example
 *   <PropertyForm
 *     title="Свойства документа"
 *     fields={[
 *       { label: "Наименование документа", wide: true },
 *       { label: "Категория", kind: "select" },
 *       { label: "Время актуальности документа", kind: "number" },
 *     ]}
 *   />
 */

export type PropertyFieldKind = "text" | "number" | "select" | "textarea";

export interface PropertyField {
  /** Подпись/плейсхолдер. */
  label: string;
  /** Тип поля. По умолчанию "text". */
  kind?: PropertyFieldKind;
  /** Значение (плейсхолдер заменяется значением). */
  value?: string;
  /** Растянуть поле на всю ширину. */
  wide?: boolean;
}

export interface PropertyFormProps {
  /** Заголовок в шапке. */
  title?: ReactNode;
  fields: PropertyField[];
  /** Ширина узкой колонки. По умолчанию 320px. */
  columnWidth?: string;
  /** Футер (кнопки и т.п.). */
  footer?: ReactNode;
  className?: string;
}

function Stepper() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m8 10 4-4 4 4M8 14l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({ field, columnWidth }: { field: PropertyField; columnWidth: string }) {
  const { label, kind = "text", value, wide } = field;
  const common = { size: "l" as const, placeholder: label, defaultValue: value };
  const control =
    kind === "textarea" ? (
      <Textarea size="l" placeholder={label} defaultValue={value} />
    ) : kind === "number" ? (
      <Input {...common} rightIcon={<Stepper />} />
    ) : kind === "select" ? (
      <Input {...common} rightIcon={<ArrowRight />} readOnly />
    ) : (
      <Input {...common} />
    );
  const full = wide || kind === "textarea";
  return (
    <div style={full ? undefined : { maxWidth: columnWidth }} className={full ? "w-full" : undefined}>
      {control}
    </div>
  );
}

export function PropertyForm({
  title,
  fields,
  columnWidth = "320px",
  footer,
  className,
}: PropertyFormProps) {
  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      {title != null && (
        <div className="flex h-[66px] items-center border-b border-border bg-surface-sunken px-6">
          <span className="ds-p3 text-foreground">{title}</span>
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        {fields.map((f, i) => (
          <Field key={i} field={f} columnWidth={columnWidth} />
        ))}
      </div>
      {footer != null && <div className="px-6 pb-6">{footer}</div>}
    </div>
  );
}
