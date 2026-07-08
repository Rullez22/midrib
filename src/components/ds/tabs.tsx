"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Tabs / Tab — вкладки MIDHUB DS.
 * Источник: Figma «UI Контролы» / WEB-Tabs (node 193:26022). Стили 1:1.
 *
 *   variant : "basic" (подчёркивание) · "solid" (заливка) · "solid-light" (контур)
 *   size    : "s" (32) · "m" (40) · "l" (48) · "xl" (56)
 *   state   : default / hover / active(selected) / disabled
 *
 * Управляемый (`value` + `onValueChange`) или неуправляемый (`defaultValue`).
 *
 * @example
 *   <Tabs defaultValue="one" variant="solid" size="m">
 *     <Tab value="one">Item one</Tab>
 *     <Tab value="two">Item two</Tab>
 *   </Tabs>
 */

export type TabsVariant = "basic" | "solid" | "solid-light";
export type TabsSize = "s" | "m" | "l" | "xl";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  /** Визуальный вариант. По умолчанию "basic". */
  variant?: TabsVariant;
  /** Размер. По умолчанию "m". */
  size?: TabsSize;
  /** Активная вкладка (управляемый режим). */
  value?: string;
  /** Активная вкладка по умолчанию (неуправляемый режим). */
  defaultValue?: string;
  /** Колбэк смены активной вкладки. */
  onValueChange?: (value: string) => void;
  /** Равная ширина вкладок по самой широкой. */
  equal?: boolean;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

const VARIANT_CLASS: Record<TabsVariant, string> = {
  basic: "ds-tabs--basic",
  solid: "ds-tabs--solid",
  "solid-light": "ds-tabs--solid-light",
};

const SIZE_CLASS: Record<TabsSize, string> = {
  s: "ds-tabs--s",
  m: "ds-tabs--m",
  l: "ds-tabs--l",
  xl: "ds-tabs--xl",
};

export function Tabs({
  variant = "basic",
  size = "m",
  value,
  defaultValue,
  onValueChange,
  equal = false,
  children,
  className,
  ...rest
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value !== undefined ? value : internal;

  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div
        role="tablist"
        className={cn("ds-tabs", VARIANT_CLASS[variant], SIZE_CLASS[size], equal && "ds-tabs--equal", className)}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabProps {
  /** Значение вкладки (идентификатор). */
  value: string;
  children?: ReactNode;
  /** Иконка слева от подписи. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, icon, disabled, className }: TabProps) {
  const ctx = useContext(TabsContext);
  const selected = ctx?.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={cn("ds-tab", className)}
      onClick={() => ctx?.setValue(value)}
    >
      {icon != null && <span className="ds-tab__icon" aria-hidden="true">{icon}</span>}
      {children != null && <span className="ds-tab__label">{children}</span>}
    </button>
  );
}
