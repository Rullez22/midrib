import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Toast — уведомление MIDHUB DS.
 * Источник: Figma «UI Контролы» / Toast (node 1229:61463 …). Стили 1:1.
 *
 *   variant : "positive" (зелёный) · "notice" (жёлтый) · "error" (красный)
 *             · "info" (синий, белый фон) · "default" (синий, голубой фон)
 *   title   : задан → раскладка «2+ строки» (иконка сверху, заголовок + текст, 312px)
 *             не задан → раскладка «одна строка» (иконка по центру, 280px)
 *   onClose : показывает крестик справа.
 *
 * @example
 *   <Toast variant="positive" title="Платеж отправлен">Вопрос вынесен на голосование совета</Toast>
 *   <Toast variant="error" onClose={dismiss}>Что-то пошло не так</Toast>
 */

export type ToastVariant = "positive" | "notice" | "error" | "info" | "default";

const VARIANT_CLASS: Record<ToastVariant, string> = {
  positive: "ds-toast--positive",
  notice: "ds-toast--notice",
  error: "ds-toast--error",
  info: "ds-toast--info",
  default: "ds-toast--default",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M4.5 8.3 6.8 10.6 11.6 5.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7.13 1.99a1 1 0 0 1 1.74 0l6.06 10.51A1 1 0 0 1 14.06 14H1.94a1 1 0 0 1-.87-1.5L7.13 1.99Z" fill="currentColor" />
      <path d="M8 5.6v3.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.4" r="0.95" fill="#fff" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <circle cx="8" cy="4.9" r="1.05" fill="#fff" />
      <path d="M8 7.1v4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const VARIANT_ICON: Record<ToastVariant, () => ReactNode> = {
  positive: CheckIcon,
  notice: WarningIcon,
  error: WarningIcon,
  info: InfoIcon,
  default: InfoIcon,
};

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  /** Заголовок — включает раскладку «2+ строки». */
  title?: ReactNode;
  /** Колбэк закрытия — показывает крестик. */
  onClose?: () => void;
  /** Подпись для кнопки закрытия (a11y). */
  closeLabel?: string;
  children?: ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = "positive", title, onClose, closeLabel = "Закрыть", className, children, ...rest },
  ref,
) {
  const Icon = VARIANT_ICON[variant];
  return (
    <div
      ref={ref}
      role="status"
      className={cn("ds-toast", VARIANT_CLASS[variant], title != null && "ds-toast--with-title", className)}
      {...rest}
    >
      <span className="ds-toast__icon">
        <Icon />
      </span>
      <div className="ds-toast__content">
        {title != null && <div className="ds-toast__title">{title}</div>}
        <div className="ds-toast__body">{children}</div>
      </div>
      {onClose && (
        <button type="button" className="ds-toast__close" aria-label={closeLabel} onClick={onClose}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
