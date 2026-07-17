"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { type BadgeColor } from "../badge";
import { EditPencilIcon } from "../edit-pencil-icon";

/**
 * ProfileCard — карточка подразделения/профиля (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / миссия · профиль (1594:225576) и колонки
 * департаментов в структуре кооператива (Администрация, HR, Производство …).
 * Стили 1:1.
 *
 * Узкая карточка с цветным хедером (заголовок + опц. карандаш), именем
 * ответственного и маркированным списком отделов (цветные точки по `color`).
 * `active` — подсветка цветной рамкой (выбранное подразделение).
 *
 * @example
 *   <ProfileCard color="orange" title="HR" person="Петров А. А."
 *     items={["Отдел направления и персонала", "Отдел коммуникаций"]} editable />
 */

export interface ProfileCardProps {
  title: ReactNode;
  person?: ReactNode;
  items: ReactNode[];
  color?: BadgeColor;
  active?: boolean;
  /** Заливка выделенной карточки. По умолчанию `var(--color-${color}-100)`;
   *  передайте, чтобы совпасть с палитрой каскада (ACCENT). */
  activeBg?: string;
  /** Бордер. По умолчанию `var(--color-${color}-300)`. */
  borderColor?: string;
  editable?: boolean;
  onEdit?: () => void;
  className?: string;
}

function EditIcon() {
  return <EditPencilIcon className="size-3 text-foreground-subtle" />;
}

export function ProfileCard({
  title,
  person,
  items,
  color = "grey",
  active = false,
  activeBg,
  borderColor,
  editable = false,
  onEdit,
  className,
}: ProfileCardProps) {
  // Цвет акцента (бордер/буллеты). borderColor (реальный hex из ACCENT) имеет
  // приоритет — токенов `--color-blue-*` в проекте нет, поэтому для надёжности
  // цвет передаётся явным hex, а не через `var(--color-${color}-…)`.
  const accent = borderColor ?? `var(--color-${color}-400)`;
  return (
    <div
      className={cn("flex w-[180px] flex-col rounded-[10px] border bg-white shadow-[var(--shadow-sm)]", className)}
      style={{
        // Всегда цветной бордер; выделенный — с цветной заливкой.
        borderColor: borderColor ?? `var(--color-${color}-300)`,
        backgroundColor: active ? (activeBg ?? `var(--color-${color}-100)`) : undefined,
      }}
    >
      {/* Хедер: заголовок по центру (чёрный) + карандаш-кнопка в углу.
          Сепаратор — цветной (акцент карточки), у всех карточек. Не border
          хедера, а отдельная линия: нужен отступ 12px от краёв карточки. */}
      <div className="relative flex flex-col items-center gap-1 px-4 pt-4 pb-3">
        <span className="ds-p3-medium text-center text-foreground">{title}</span>
        {person != null && <span className="ds-caption text-center text-foreground-subtle">{person}</span>}
        {editable && (
          <button
            type="button"
            aria-label="Редактировать"
            onClick={onEdit}
            className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-[4px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
          >
            <EditIcon />
          </button>
        )}
        <span aria-hidden className="absolute inset-x-3 bottom-0 h-px" style={{ backgroundColor: accent }} />
      </div>

      {/* Список отделов */}
      <ul className="flex flex-col gap-2.5 px-4 py-4">
        {items.map((it, i) => (
          <li key={i} className="ds-caption flex gap-2 text-foreground-muted">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
