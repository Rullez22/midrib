"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Checkbox — чекбокс MIDHUB DS.
 * Источник: Figma «UI Контролы» / Checkbox (node 62:22, 79:98). Стили 1:1.
 *
 * Матрица дизайна:
 *   size  : "s" (32) · "xs" (24) · "xxs" (16)
 *   value : unchecked / checked / indeterminate (проп `indeterminate`)
 *   state : default / hover / active / focus / disabled — нативные состояния
 *           скрытого <input>; error — проп `error`.
 *   view  : без текста или с подписью (`label`).
 *
 * Доступность: рендерит настоящий <input type="checkbox"> (фокус, клавиатура,
 * формы). Управляемый/неуправляемый — как у нативного input (`checked`/`defaultChecked`).
 *
 * @example
 *   <Checkbox label="Согласен с условиями" />
 *   <Checkbox size="xs" defaultChecked label="По умолчанию выбран" />
 *   <Checkbox indeterminate label="Выбрано частично" />
 *   <Checkbox error label="Обязательное поле" />
 */

export type CheckboxSize = "s" | "xs" | "xxs";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Размер: s=32, xs=24, xxs=16. По умолчанию "s". */
  size?: CheckboxSize;
  /** Подпись справа от чекбокса. */
  label?: ReactNode;
  /** Промежуточное состояние (минус вместо галочки). */
  indeterminate?: boolean;
  /** Состояние ошибки (красная рамка/подпись). */
  error?: boolean;
}

const SIZE_CLASS: Record<CheckboxSize, string> = {
  s: "ds-check--s",
  xs: "ds-check--xs",
  xxs: "ds-check--xxs",
};

function CheckIcon() {
  return (
    <svg className="ds-check__check" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="ds-check__minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = "s",
    label,
    indeterminate = false,
    error = false,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <label className={cn("ds-check", SIZE_CLASS[size], error && "ds-check--error", className)}>
      <span className="ds-check__control">
        <input
          ref={setRefs}
          type="checkbox"
          className="ds-check__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          {...rest}
        />
        <span className="ds-check__box" aria-hidden="true">
          <CheckIcon />
          <MinusIcon />
        </span>
      </span>
      {label != null && <span className="ds-check__label">{label}</span>}
    </label>
  );
});
