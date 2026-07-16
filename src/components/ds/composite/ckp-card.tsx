"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "../link";
import { EditPencilIcon } from "../edit-pencil-icon";

/**
 * CKPCard — карточка «Ценный конечный продукт» (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / миссия · структура кооператива · ЦКП-блок. Стили 1:1.
 *
 * Бордерная карточка: слева аватар-блок (лого + подпись + мета), справа —
 * заголовок «Ценный конечный продукт», описание и ссылка «Смотреть всю
 * информацию». Карандаш редактирования в правом верхнем углу.
 *
 * @example
 *   <CKPCard subtitle="Администрация" meta="150 пайщиков"
 *     description="Lorem ipsum…" editable />
 */

export interface CKPCardProps {
  title?: ReactNode;
  description: ReactNode;
  /** Подпись под аватаром (подразделение). */
  subtitle?: ReactNode;
  /** Мета под подписью (например «150 пайщиков»). */
  meta?: ReactNode;
  avatarSrc?: string;
  avatarLabel?: ReactNode;
  moreLabel?: ReactNode;
  onMore?: () => void;
  editable?: boolean;
  onEdit?: () => void;
  /** Показать иконку-сетку (вид/layout) справа от карандаша (Figma «menu-2»). */
  onLayout?: () => void;
  className?: string;
}

function EditIcon() {
  return <EditPencilIcon className="size-4 text-foreground-subtle" />;
}
function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-[var(--color-red-400)]">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CKPCard({
  title = "Ценный конечный продукт",
  description,
  subtitle,
  meta,
  avatarSrc,
  avatarLabel,
  moreLabel = "Смотреть всю информацию",
  onMore,
  editable = false,
  onEdit,
  onLayout,
  className,
}: CKPCardProps) {
  return (
    <div className={cn("relative flex w-full gap-6 rounded-[10px] border border-border bg-white p-5 shadow-[var(--shadow-sm)]", className)}>
      {/* Аватар-блок */}
      <div className="flex w-[120px] shrink-0 flex-col items-center gap-2 text-center">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-[12px]" style={{ background: "linear-gradient(135deg, var(--color-purple-200), var(--color-blue-midhub-200))" }}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="" className="size-full object-cover" />
          ) : (
            <span className="ds-caption text-white">{avatarLabel}</span>
          )}
        </div>
        {subtitle != null && <span className="ds-caption text-foreground">{subtitle}</span>}
        {meta != null && <span className="ds-caption text-foreground-subtle">{meta}</span>}
      </div>

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-2">
        <span className="ds-p3-medium text-foreground">{title}</span>
        <span className="ds-p3 text-foreground-muted">{description}</span>
        <Link href="#" size="p3" className="mt-1" onClick={(e) => { e.preventDefault(); onMore?.(); }}>
          {moreLabel}
        </Link>
      </div>

      {(editable || onLayout) && (
        <div className="absolute right-5 top-5 flex items-center gap-4">
          {editable && (
            <button type="button" aria-label="Редактировать" onClick={onEdit} className="transition-colors hover:text-foreground">
              <EditIcon />
            </button>
          )}
          {onLayout && (
            <button type="button" aria-label="Вид" onClick={onLayout} className="transition-colors hover:text-foreground">
              <GridIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
