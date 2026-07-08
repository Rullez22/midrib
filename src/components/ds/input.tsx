import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Input — текстовое поле MIDHUB DS.
 * Источник: Figma «UI Контролы» / Text field midhub (node 148:156). Стили 1:1.
 *
 * Анатомия: бордер-контейнер + плавающая подпись (`label`, внутри сверху) +
 * placeholder/значение + иконки (`leftIcon`/`rightIcon`) + вспом. текст
 * (`caption`, под полем).
 *
 *   size  : "l" (48) · "m" (40) · "s" (32) · "xs" (24)
 *   state : default / hover / focus — нативные; locked (`readOnly`); disabled
 *   value : empty / filled / error (`error`)
 *
 * @example
 *   <Input placeholder="Введите имя" />
 *   <Input size="m" label="E-mail" placeholder="you@mail.ru" caption="Не публикуется" />
 *   <Input leftIcon={<SearchIcon />} placeholder="Поиск" />
 *   <Input error caption="Обязательное поле" defaultValue="ошибка" />
 */

export type InputSize = "l" | "m" | "s" | "xs";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Размер: l=48, m=40, s=32, xs=24. По умолчанию "l". */
  size?: InputSize;
  /** Плавающая подпись внутри поля (сверху). */
  label?: ReactNode;
  /** Вспомогательный текст под полем. */
  caption?: ReactNode;
  /** Иконка слева. */
  leftIcon?: ReactNode;
  /** Иконка справа. */
  rightIcon?: ReactNode;
  /** Состояние ошибки (красная рамка и красный caption). */
  error?: boolean;
  /** Класс на внешний контейнер (.ds-field). */
  className?: string;
  /** Класс на сам <input>. */
  inputClassName?: string;
}

const SIZE_CLASS: Record<InputSize, string> = {
  l: "ds-field--l",
  m: "ds-field--m",
  s: "ds-field--s",
  xs: "ds-field--xs",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "l",
    label,
    caption,
    leftIcon,
    rightIcon,
    error = false,
    disabled,
    readOnly,
    className,
    inputClassName,
    id,
    ...rest
  },
  ref,
) {
  return (
    <div
      className={cn(
        "ds-field",
        SIZE_CLASS[size],
        error && "ds-field--error",
        disabled && "ds-field--disabled",
        readOnly && !disabled && "ds-field--locked",
        className,
      )}
    >
      <label className="ds-field__box" htmlFor={id}>
        {leftIcon != null && (
          <span className="ds-field__icon" aria-hidden="true">{leftIcon}</span>
        )}
        <span className="ds-field__main">
          {label != null && <span className="ds-field__label">{label}</span>}
          <input
            ref={ref}
            id={id}
            className={cn("ds-field__input", inputClassName)}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error || undefined}
            {...rest}
          />
        </span>
        {rightIcon != null && (
          <span className="ds-field__icon" aria-hidden="true">{rightIcon}</span>
        )}
      </label>
      {caption != null && <div className="ds-field__caption">{caption}</div>}
    </div>
  );
});
