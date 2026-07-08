import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Toggle — переключатель (switch) MIDHUB DS.
 * Источник: Figma «UI Контролы» / Toggle, Type=Basic (node 196:17). Стили 1:1.
 *
 *   size  : "s" (64×32) · "xs" (48×24)
 *   value : off / on — нативный <input type="checkbox">
 *   state : default / hover / focus / disabled
 *
 * Управляемый (`checked` + `onChange`) или неуправляемый (`defaultChecked`).
 *
 * @example
 *   <Toggle label="Уведомления" defaultChecked />
 *   <Toggle size="xs" checked={on} onChange={(e) => setOn(e.target.checked)} />
 */

export type ToggleSize = "s" | "xs";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Размер: s=32, xs=24. По умолчанию "s". */
  size?: ToggleSize;
  /** Подпись справа от переключателя. */
  label?: ReactNode;
}

const SIZE_CLASS: Record<ToggleSize, string> = {
  s: "ds-toggle--s",
  xs: "ds-toggle--xs",
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { size = "s", label, className, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn("ds-toggle", SIZE_CLASS[size], className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="ds-toggle__input"
        disabled={disabled}
        {...rest}
      />
      <span className="ds-toggle__track" aria-hidden="true">
        <span className="ds-toggle__thumb" />
      </span>
      {label != null && <span className="ds-toggle__label">{label}</span>}
    </label>
  );
});
