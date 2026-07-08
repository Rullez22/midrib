import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Radio — радиокнопка MIDHUB DS.
 * Источник: Figma «UI Контролы» / Radio (node 63:401, 79:569). Стили 1:1.
 *
 * Матрица дизайна:
 *   size  : "s" (32) · "xs" (24)
 *   value : unchecked / selected (точка по центру)
 *   state : default / hover / focus / disabled — нативные состояния
 *           скрытого <input>; error — проп `error`.
 *   view  : без подписи или с подписью (`label`).
 *
 * Группируются через общий `name` (как нативные radio).
 *
 * @example
 *   <Radio name="plan" value="free" label="Бесплатно" defaultChecked />
 *   <Radio name="plan" value="pro" label="Pro" />
 *   <Radio size="xs" error label="Выберите вариант" />
 */

export type RadioSize = "s" | "xs";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Размер: s=32, xs=24. По умолчанию "s". */
  size?: RadioSize;
  /** Подпись справа от радиокнопки. */
  label?: ReactNode;
  /** Состояние ошибки (красная рамка/подпись). */
  error?: boolean;
}

const SIZE_CLASS: Record<RadioSize, string> = {
  s: "ds-radio--s",
  xs: "ds-radio--xs",
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = "s", label, error = false, className, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn("ds-radio", SIZE_CLASS[size], error && "ds-radio--error", className)}>
      <span className="ds-radio__control">
        <input
          ref={ref}
          type="radio"
          className="ds-radio__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          {...rest}
        />
        <span className="ds-radio__circle" aria-hidden="true">
          <span className="ds-radio__dot" />
        </span>
      </span>
      {label != null && <span className="ds-radio__label">{label}</span>}
    </label>
  );
});
