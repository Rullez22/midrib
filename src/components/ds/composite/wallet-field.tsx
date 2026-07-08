"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input, type InputProps } from "../input";

/**
 * WalletField — карточка поля пайщика (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / user card input (nodes 418:5, 915:84715, 915:85000).
 * Стили 1:1.
 *
 * Бордерная карточка: шапка (grey-10) с подписью «Пайщик №N» + тело с полем
 * (DS Input, по умолчанию плейсхолдер «Кошелек»). `rightIcon` — действия поля
 * (обновить / очистить).
 *
 * @example
 *   <WalletField title="Пайщик №2" placeholder="Кошелек" />
 *   <WalletField title="Пайщик №2" defaultValue="0xca30…" rightIcon={<Actions />} />
 */

export interface WalletFieldProps
  extends Omit<InputProps, "size" | "label" | "caption" | "className" | "title"> {
  /** Подпись в шапке. */
  title: ReactNode;
  /** Ширина поля. По умолчанию 406px. */
  fieldWidth?: number | string;
  className?: string;
}

export function WalletField({
  title,
  placeholder = "Кошелек",
  fieldWidth = 406,
  className,
  ...input
}: WalletFieldProps) {
  return (
    <div className={cn("overflow-hidden rounded-[4px] border border-border bg-surface", className)}>
      <div className="flex h-[66px] items-center border-b border-border bg-surface-sunken px-6">
        <span className="ds-p3 text-foreground">{title}</span>
      </div>
      <div className="px-6 pb-6 pt-[23px]">
        <div style={{ maxWidth: typeof fieldWidth === "number" ? `${fieldWidth}px` : fieldWidth }}>
          <Input size="l" placeholder={placeholder} {...input} />
        </div>
      </div>
    </div>
  );
}
