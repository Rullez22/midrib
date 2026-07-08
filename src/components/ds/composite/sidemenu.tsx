"use client";

import {
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Sidemenu — вертикальная навигация-список (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / sidemenu (nodes 1647:231585, 1170:101117,
 * 1170:113096). Стили 1:1.
 *
 * Каждый пункт — базовый чип «Tabs midhub» (Size=S-32, Solid light):
 * h32, rounded-4, Articulat Regular 12/20 (см. sidemenu.css).
 *
 *   variant : "label" (текстовые чипы) · "color" (цветные номер-бейджи)
 *
 * Управляемый (`value` + `onValueChange`) или неуправляемый
 * (`defaultValue`). Активный пункт — `aria-selected`.
 *
 * @example
 *   <Sidemenu
 *     variant="label"
 *     defaultValue="1"
 *     items={[
 *       { value: "1", label: "Подразделение-1" },
 *       { value: "2", label: "Подразделение-2" },
 *     ]}
 *   />
 *
 *   <Sidemenu
 *     variant="color"
 *     defaultValue="1"
 *     items={[
 *       { value: "1", label: "1", color: "red" },
 *       { value: "2", label: "2", color: "orange" },
 *     ]}
 *   />
 */

export type SidemenuVariant = "label" | "color";

/** Палитра цветных бейджей (variant="color") — токены MIDHUB. */
export type SidemenuColor =
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "blue-strong"
  | "purple"
  | "red";

export interface SidemenuItem {
  /** Идентификатор пункта. */
  value: string;
  /** Подпись пункта. */
  label: ReactNode;
  /** Цвет бейджа для variant="color". По умолчанию grey-20. */
  color?: SidemenuColor;
  disabled?: boolean;
}

export interface SidemenuProps {
  /** Пункты меню. */
  items: SidemenuItem[];
  /** Визуальный вариант. По умолчанию "label". */
  variant?: SidemenuVariant;
  /** Активный пункт (управляемый режим). */
  value?: string;
  /** Активный пункт по умолчанию (неуправляемый режим). */
  defaultValue?: string;
  /** Колбэк смены активного пункта. */
  onValueChange?: (value: string) => void;
  /** Расстояние между пунктами (CSS-значение). По умолчанию 8px. */
  gap?: string;
  className?: string;
  "aria-label"?: string;
}

const COLOR_VAR: Record<SidemenuColor, string> = {
  orange: "var(--color-orange-200)",
  yellow: "var(--color-yellow-300)",
  green: "var(--color-green-200)",
  blue: "var(--color-blue-midhub-200)",
  "blue-strong": "var(--color-blue-midhub-300)",
  purple: "var(--color-purple-200)",
  red: "var(--color-red-200)",
};

export function Sidemenu({
  items,
  variant = "label",
  value,
  defaultValue,
  onValueChange,
  gap,
  className,
  ...rest
}: SidemenuProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value !== undefined ? value : internal;

  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <div
      role="tablist"
      aria-orientation="vertical"
      className={cn(
        "ds-sidemenu",
        variant === "color" ? "ds-sidemenu--color" : "ds-sidemenu--label",
        className,
      )}
      style={gap ? ({ "--sm-gap": gap } as CSSProperties) : undefined}
      {...rest}
    >
      {items.map((item) => {
        const selected = current === item.value;
        const itemStyle =
          variant === "color" && item.color
            ? ({ "--sm-color": COLOR_VAR[item.color] } as CSSProperties)
            : undefined;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            className="ds-sidemenu__item"
            style={itemStyle}
            onClick={() => setValue(item.value)}
          >
            <span className="ds-sidemenu__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
