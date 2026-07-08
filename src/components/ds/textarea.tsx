import {
  forwardRef,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Textarea — многострочное текстовое поле MIDHUB DS.
 * Источник: Figma «UI Контролы» / Text field midhub: text areas (node 153:15367).
 *
 * Это тот же Input (`.ds-field`), только многострочный: выше по высоте,
 * растёт/сжимается по содержимому, в правом нижнем углу — ручка resize
 * (нативная, `resize: vertical`).
 *
 *   size  : "l" (min-h 120) · "m" (104) · "s" (88) · "xs" (76)
 *   state : default / hover / focus — нативные; locked (`readOnly`); disabled
 *   value : empty / filled / error (`error`)
 *
 * @example
 *   <Textarea placeholder="Комментарий" />
 *   <Textarea size="m" label="Описание" rows={5} caption="До 500 символов" />
 *   <Textarea error caption="Обязательное поле" />
 */

export type TextareaSize = "l" | "m" | "s" | "xs";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  label?: ReactNode;
  caption?: ReactNode;
  error?: boolean;
  /** Запретить ресайз пользователем (по умолчанию вертикальный resize включён). */
  noResize?: boolean;
  className?: string;
  textareaClassName?: string;
}

const SIZE_CLASS: Record<TextareaSize, string> = {
  l: "ds-field--l",
  m: "ds-field--m",
  s: "ds-field--s",
  xs: "ds-field--xs",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      size = "l",
      label,
      caption,
      error = false,
      disabled,
      readOnly,
      noResize = false,
      rows = 3,
      className,
      textareaClassName,
      id,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        className={cn(
          "ds-field",
          "ds-field--area",
          SIZE_CLASS[size],
          error && "ds-field--error",
          disabled && "ds-field--disabled",
          readOnly && !disabled && "ds-field--locked",
          className,
        )}
      >
        <label className="ds-field__box" htmlFor={id}>
          <span className="ds-field__main">
            {label != null && <span className="ds-field__label">{label}</span>}
            <textarea
              ref={ref}
              id={id}
              rows={rows}
              className={cn(
                "ds-field__input",
                "ds-field__textarea",
                noResize && "ds-field__textarea--no-resize",
                textareaClassName,
              )}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={error || undefined}
              {...rest}
            />
          </span>
        </label>
        {caption != null && <div className="ds-field__caption">{caption}</div>}
      </div>
    );
  },
);
