import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * DeleteButton — контрол удаления MIDHUB DS.
 * Источник: Figma «UI Контролы» / delete document (node 804:5509). Стили 1:1.
 *
 * Красная иконка-корзина с опциональной подписью слева.
 *   size : "md" (Font 14, иконка 24) · "sm" (Font 12, иконка 16)
 *   view : с подписью (`label`) или только иконка
 *
 * @example
 *   <DeleteButton label="Удалить документ" onClick={remove} />
 *   <DeleteButton size="sm" aria-label="Удалить" onClick={remove} />
 */

export type DeleteSize = "md" | "sm";

export interface DeleteButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Размер: md (иконка 24) · sm (иконка 16). По умолчанию "md". */
  size?: DeleteSize;
  /** Подпись слева от иконки. */
  label?: ReactNode;
}

const SIZE_CLASS: Record<DeleteSize, string> = {
  md: "ds-delete--md",
  sm: "ds-delete--sm",
};

function TrashIcon() {
  // Залитая корзина (1:1 из Figma «delete document» 804:5509). Цвет — через
  // currentColor (CSS задаёт red-300 + состояния hover/active/disabled).
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.57143 20.3333C5.57143 21.525 6.53571 22.5 7.71429 22.5H16.2857C17.4643 22.5 18.4286 21.525 18.4286 20.3333V7.33333H5.57143V20.3333ZM19.5 4.08333H15.75L14.6786 3H9.32143L8.25 4.08333H4.5V6.25H19.5V4.08333Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  function DeleteButton(
    { size = "md", label, className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label == null ? "Удалить" : undefined}
        className={cn("ds-delete", SIZE_CLASS[size], className)}
        {...rest}
      >
        {label != null && <span className="ds-delete__label">{label}</span>}
        <span className="ds-delete__icon" aria-hidden="true">
          <TrashIcon />
        </span>
      </button>
    );
  },
);
