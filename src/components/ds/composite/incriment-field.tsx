"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Incriment, type IncrimentSize } from "../incriment";

/**
 * IncrimentField — строка «подпись + степпер» (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / Incriment (node 1470:204348). Стили 1:1.
 *
 * Бордерная строка: подпись слева (Medium) + DS <Incriment> справа.
 * Размер задаёт и шрифт подписи, и размер степпера.
 *
 *   size : "l" (16/24 · степпер 48) · "m" (14/22 · 40) · "s" (12/20 · 32)
 *
 * @example
 *   <IncrimentField label="Количество долей на пайщика" defaultValue={0} />
 *   <IncrimentField label="Доля" size="m" value={n} onValueChange={setN} min={0} />
 */

export interface IncrimentFieldProps {
  /** Подпись слева. */
  label: ReactNode;
  /** Размер (подпись + степпер). По умолчанию "l". */
  size?: IncrimentSize;
  /** Значение (управляемый режим). */
  value?: number;
  /** Значение по умолчанию (неуправляемый режим). */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Единица после значения. По умолчанию без неё. */
  suffix?: string;
  disabled?: boolean;
  /** Только просмотр: значение в рамке без кнопок. */
  readOnly?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<IncrimentSize, string> = {
  l: "ds-incriment-field--l",
  m: "ds-incriment-field--m",
  s: "ds-incriment-field--s",
};

export function IncrimentField({
  label,
  size = "l",
  suffix = "",
  className,
  ...incriment
}: IncrimentFieldProps) {
  return (
    <div className={cn("ds-incriment-field", SIZE_CLASS[size], className)}>
      <span className="ds-incriment-field__label">{label}</span>
      <Incriment size={size} suffix={suffix} {...incriment} />
    </div>
  );
}
