import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Button — кнопка MIDHUB DS.
 * Источник: Figma «UI Контролы» / Button midhub (node 62:268). Стили 1:1.
 *
 * Матрица дизайна:
 *   size    : "l" (48) · "m" (40) · "s" (32) · "xs" (24)
 *   variant : primary · secondary · ghost · tertiary · negative · negative-sec
 *   view    : label · left/right icon · icon-only · link
 *   state   : default / hover / active / disabled — нативные CSS-состояния;
 *             loading — проп `loading` (спиннер, контент скрыт, кнопка disabled).
 *
 * Стили — классы `.ds-btn*` в button.css (палитра-токены MIDHUB).
 *
 * @example
 *   <Button>Кнопка</Button>
 *   <Button variant="secondary" size="m" iconLeft={<PlusIcon />}>Добавить</Button>
 *   <Button variant="ghost" icon={<CloseIcon />} aria-label="Закрыть" />
 *   <Button variant="tertiary" link>Подробнее</Button>
 *   <Button loading>Сохранить</Button>
 */

export type ButtonSize = "l" | "m" | "s" | "xs";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "tertiary"
  | "negative"
  | "negative-sec";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Размер: l=48, m=40, s=32, xs=24. По умолчанию "l". */
  size?: ButtonSize;
  /** Визуальный тип. По умолчанию "primary". */
  variant?: ButtonVariant;
  /** Иконка слева от текста. */
  iconLeft?: ReactNode;
  /** Иконка справа от текста. */
  iconRight?: ReactNode;
  /** Только иконка (квадратная кнопка). Требует `aria-label`. */
  icon?: ReactNode;
  /** Стиль ссылки: подчёркнутый текст без фона. */
  link?: boolean;
  /** Состояние загрузки: спиннер вместо контента, кнопка заблокирована. */
  loading?: boolean;
  /** Растянуть на всю ширину контейнера. */
  fullWidth?: boolean;
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  l: "ds-btn--l",
  m: "ds-btn--m",
  s: "ds-btn--s",
  xs: "ds-btn--xs",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "ds-btn--primary",
  secondary: "ds-btn--secondary",
  ghost: "ds-btn--ghost",
  tertiary: "ds-btn--tertiary",
  negative: "ds-btn--negative",
  "negative-sec": "ds-btn--negative-sec",
};

function Spinner() {
  return (
    <span className="ds-btn__spinner" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    size = "l",
    variant = "primary",
    iconLeft,
    iconRight,
    icon,
    link = false,
    loading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const isIconOnly = icon != null && children == null;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "ds-btn",
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        isIconOnly && "ds-btn--icon",
        link && "ds-btn--link",
        loading && "ds-btn--loading",
        fullWidth && "ds-btn--full",
        className,
      )}
      {...rest}
    >
      {isIconOnly ? (
        <span className="ds-btn__icon">{icon}</span>
      ) : (
        <>
          {iconLeft != null && <span className="ds-btn__icon">{iconLeft}</span>}
          {children != null && <span className="ds-btn__label">{children}</span>}
          {iconRight != null && <span className="ds-btn__icon">{iconRight}</span>}
        </>
      )}
      {loading && <Spinner />}
    </button>
  );
});
