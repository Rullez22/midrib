"use client";

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * ToggleButton — кнопка-переключатель MIDHUB DS.
 * Источник: Figma «UI Контролы» / Toggle, Type=Ghost/Solid light/Mode (node 196:17). Стили 1:1.
 *
 *   variant : "ghost" (selected → заливка blue/белый текст)
 *           · "solid-light" (selected → белый фон/синий текст/рамка)
 *           · "mode" (selected → серый фон/синий текст)
 *   size    : "l" (48) · "m" (40) · "s" (32) · "xl" (56)
 *   state   : default / hover / focus / disabled + selected (aria-pressed)
 *
 * Управляемый (`pressed` + `onPressedChange`) или неуправляемый (`defaultPressed`).
 *
 * @example
 *   <ToggleButton variant="ghost" defaultPressed>Button</ToggleButton>
 *   <ToggleButton variant="solid-light" pressed={on} onPressedChange={setOn}>Режим</ToggleButton>
 */

export type ToggleButtonVariant = "ghost" | "solid-light" | "mode";
export type ToggleButtonSize = "l" | "m" | "s" | "xl";

export interface ToggleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  variant?: ToggleButtonVariant;
  size?: ToggleButtonSize;
  /** Нажатое состояние (управляемый режим). */
  pressed?: boolean;
  /** Нажатое состояние по умолчанию (неуправляемый режим). */
  defaultPressed?: boolean;
  /** Колбэк смены состояния. */
  onPressedChange?: (pressed: boolean) => void;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<ToggleButtonVariant, string> = {
  ghost: "ds-togglebtn--ghost",
  "solid-light": "ds-togglebtn--solid-light",
  mode: "ds-togglebtn--mode",
};

const SIZE_CLASS: Record<ToggleButtonSize, string> = {
  l: "ds-togglebtn--l",
  m: "ds-togglebtn--m",
  s: "ds-togglebtn--s",
  xl: "ds-togglebtn--xl",
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      variant = "ghost",
      size = "l",
      pressed,
      defaultPressed = false,
      onPressedChange,
      onClick,
      className,
      type = "button",
      children,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = useState(defaultPressed);
    const current = pressed !== undefined ? pressed : internal;

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={current}
        className={cn("ds-togglebtn", VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
        onClick={(e) => {
          if (pressed === undefined) setInternal((v) => !v);
          onPressedChange?.(!current);
          onClick?.(e);
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
