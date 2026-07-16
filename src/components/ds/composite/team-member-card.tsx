"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * TeamMemberCard — карточка участника подразделения (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / структура · «Коллектив подразделения»
 * (2023:223041 · 2024:226388). Стили 1:1.
 *
 * Карточка-аватар: фото 155×128 (или пустое состояние с «warning» + «Нет
 * пайщика») · статус-бейдж, наезжающий на низ фото (Активный green-300 /
 * Принятие токена yellow-300 / Неактивный red-300) · иконка-меню в правом
 * верхнем углу · имя (Medium 12/20) и роль (Regular 12/20) по центру.
 * Рамка red-200 (выбранная — red-400).
 *
 * @example
 *   <TeamMemberCard photo={url} name="Илья А. А." role="Член совета" status="active" selected onEdit={fn} />
 *   <TeamMemberCard role="Председатель совета" status="inactive" />  // пусто
 */

export type TeamStatus = "active" | "pending" | "inactive";

export interface TeamMemberCardProps {
  /** URL фото. Без него — пустое состояние («Нет пайщика»). */
  photo?: string;
  name?: ReactNode;
  role?: ReactNode;
  status?: TeamStatus;
  /** Текст бейджа (перекрывает дефолт по статусу). */
  statusLabel?: ReactNode;
  /** Текст пустого состояния. По умолчанию «Нет пайщика». */
  emptyLabel?: ReactNode;
  /** Выбранная карточка — рамка red-400. */
  selected?: boolean;
  onEdit?: () => void;
  onClick?: () => void;
  className?: string;
}

const STATUS_BG: Record<TeamStatus, string> = {
  active: "var(--color-green-300)",
  pending: "var(--color-yellow-300)",
  inactive: "var(--color-red-300)",
};
const STATUS_TEXT: Record<TeamStatus, string> = {
  active: "Активный",
  pending: "Принятие токена",
  inactive: "Неактивный",
};

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-white drop-shadow">
      <circle cx="3" cy="8" r="1.3" fill="currentColor" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
      <circle cx="13" cy="8" r="1.3" fill="currentColor" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="size-8 text-[var(--color-grey-300)]">
      <path d="M16 5 29 27H3L16 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 13v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="23" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TeamMemberCard({
  photo,
  name = "-",
  role,
  status = "inactive",
  statusLabel,
  emptyLabel = "Нет пайщика",
  selected = false,
  onEdit,
  onClick,
  className,
}: TeamMemberCardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={cn(
        "flex w-[157px] flex-col overflow-hidden rounded-[4px] border bg-white text-left",
        selected ? "border-[var(--color-red-400)]" : "border-[var(--color-red-200)]",
        onClick && !selected && "cursor-pointer transition-colors hover:border-[var(--color-red-400)]",
        className,
      )}
    >
      {/* Фото / пустое состояние */}
      <div className="relative h-[128px] w-full">
        {photo ? (
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-white">
            <WarningIcon />
            <span className="ds-caption text-foreground-subtle">{emptyLabel}</span>
          </div>
        )}

        {onEdit && (
          <button
            type="button"
            aria-label="Меню участника"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center"
          >
            <MenuIcon />
          </button>
        )}

        {/* Статус-бейдж, наезжающий на низ фото */}
        <span
          className="ds-caption-medium absolute left-1/2 top-[116px] -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1 py-0.5 text-white"
          style={{ backgroundColor: STATUS_BG[status] }}
        >
          {statusLabel ?? STATUS_TEXT[status]}
        </span>
      </div>

      {/* Имя + роль */}
      <div className="flex flex-col items-center gap-2 px-2 pb-2 pt-4 text-center">
        <span className="ds-caption-medium text-foreground">{name}</span>
        {role != null && <span className="ds-caption truncate text-foreground-subtle w-full">{role}</span>}
      </div>
    </Tag>
  );
}
