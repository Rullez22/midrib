import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Tag — чип-метка MIDHUB DS.
 * Источник: Figma «UI Контролы» / tags (node 366:617 …). Стили 1:1.
 *
 *   size : "l" (16/24) · "m" (14/22) · "s" (12/20)
 *   Удаляемый чип — проп `onRemove` (крестик справа).
 *
 * @example
 *   <Tag>Дизайн</Tag>
 *   <Tag size="m" onRemove={() => remove("react")}>React</Tag>
 *   <AddTag onClick={add} aria-label="Добавить" />
 */

export type TagSize = "l" | "m" | "s";

const SIZE_CLASS: Record<TagSize, string> = {
  l: "ds-tag--l",
  m: "ds-tag--m",
  s: "ds-tag--s",
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> {
  size?: TagSize;
  /** Колбэк удаления — показывает крестик. */
  onRemove?: () => void;
  /** Подпись для кнопки удаления (a11y). */
  removeLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { size = "l", onRemove, removeLabel = "Удалить", disabled, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ds-tag", SIZE_CLASS[size], onRemove && "ds-tag--removable", disabled && "ds-tag--disabled", className)}
      {...rest}
    >
      <span className="ds-tag__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="ds-tag__close"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});

export interface AddTagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TagSize;
}

export const AddTag = forwardRef<HTMLButtonElement, AddTagProps>(function AddTag(
  { size = "l", className, type = "button", "aria-label": ariaLabel = "Добавить", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn("ds-tag-add", SIZE_CLASS[size], className)}
      {...rest}
    >
      <PlusIcon />
    </button>
  );
});
