"use client";

import { type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EditPencilIcon } from "../edit-pencil-icon";

/**
 * RoleCard — карточка роли / обязательства (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / роль — «Секция и Функция» (node 1699:237737) и
 * блок «Ваши обязательства» (1872:298230 / 1699:236473). Стили 1:1.
 *
 * Бордерная карточка по центру: название роли (Medium 14/22) + статус-бейдж
 * (Активный — green-300 · Неактивный — red-300) + карандаш редактирования в
 * правом верхнем углу. Выбранная карточка — розовая заливка (red-50) и
 * красная рамка (red-300).
 *
 * Это НЕ форма роли (см. RoleForm) и НЕ строка списка (см. Item) — компактная
 * карточка-статус для блока «Ваши обязательства».
 *
 * @example
 *   <RoleCard name="Пайщик" status="inactive" onEdit={edit} />
 *   <RoleCard name="Председатель правления" status="active" selected onEdit={edit} />
 */

export type RoleCardStatus = "active" | "inactive";

export interface RoleCardProps {
  /** Название роли. */
  name: ReactNode;
  /** Статус: active (зелёный) · inactive (красный). */
  status?: RoleCardStatus;
  /** Текст бейджа. По умолчанию «Активный» / «Неактивный» по статусу. */
  statusLabel?: ReactNode;
  /** Выбранная карточка — розовая заливка + красная рамка. */
  selected?: boolean;
  /** Клик по карточке (выбор). */
  onClick?: () => void;
  /** Клик по карандашу. Без него карандаш не рендерится. */
  onEdit?: () => void;
  className?: string;
}

const STATUS_BG: Record<RoleCardStatus, string> = {
  active: "var(--color-green-300)",
  inactive: "var(--color-red-300)",
};
const STATUS_TEXT: Record<RoleCardStatus, string> = {
  active: "Активный",
  inactive: "Неактивный",
};


export function RoleCard({
  name,
  status = "active",
  statusLabel,
  selected = false,
  onClick,
  onEdit,
  className,
}: RoleCardProps) {
  // Кликабельная карточка = div[role=button] (не <button>), т.к. внутри —
  // вложенная кнопка-карандаш (button-в-button невалиден и ломает гидрацию).
  return (
    <div
      {...(onClick
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick,
            onKeyDown: (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            },
          }
        : {})}
      className={cn(
        onClick && "cursor-pointer",
        "relative flex min-h-[86px] w-[242px] flex-col items-center justify-center gap-2 rounded-[4px] border px-4 py-4 text-center transition-colors",
        selected
          ? "border-[var(--color-red-300)] bg-[var(--color-red-50)]"
          : "border-border bg-white",
        onClick && !selected && "hover:bg-[var(--color-grey-10)]",
        className,
      )}
    >
      <span className="ds-p3-medium text-foreground">{name}</span>
      <span
        className="inline-flex items-center justify-center rounded-[4px] px-1 py-0.5"
        style={{ background: STATUS_BG[status] }}
      >
        {/* text-white в этом Tailwind не работает (white не токен) → text-[#fff]. */}
        <span className="ds-caption-medium text-[#fff]">{statusLabel ?? STATUS_TEXT[status]}</span>
      </span>

      {onEdit && (
        // Кнопка-карандаш (не просто иконка) — как на карточках коллектива
        // подразделения (CollectiveCard): белый фон, тень, карандаш 10px.
        <button
          type="button"
          aria-label="Редактировать роль"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-[4px] bg-[#fff] text-[var(--color-dark-800)] shadow-sm transition-colors hover:bg-surface-sunken"
        >
          <EditPencilIcon className="size-2.5" />
        </button>
      )}
    </div>
  );
}
