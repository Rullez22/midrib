import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * EmptyState — пустое состояние (MIDHUB DS).
 * Источник: Figma «UI фичи» / ПП — «Отсутствуют документы», «…нажать Продолжить»
 * (nodes 246:54, 251:43009). Стили 1:1.
 *
 * По центру: иконка (по умолчанию папка) + сообщение (grey-300) + опц. действие.
 *
 * @example
 *   <EmptyState title="Отсутствуют документы" />
 *   <EmptyState title="Для выбора данных нажмите «Продолжить»"
 *     action={<Button>Продолжить</Button>} />
 */

export interface EmptyStateProps {
  /** Иконка. По умолчанию папка. */
  icon?: ReactNode;
  /** Сообщение. */
  title: ReactNode;
  description?: ReactNode;
  /** Действие (кнопка/ссылка). */
  action?: ReactNode;
  className?: string;
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 72 56" fill="none" aria-hidden className="h-14 w-[72px]">
      <path d="M4 14a4 4 0 0 1 4-4h16l5 6h35a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V14Z" fill="var(--color-blue-midhub-200)" />
      <path d="M30 28l12 12M42 28 30 40" stroke="var(--color-white)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-10 text-center", className)}>
      <span className="text-foreground-subtle">{icon ?? <FolderIcon />}</span>
      <div className="flex flex-col gap-1">
        <span className="ds-p3 text-foreground-subtle">{title}</span>
        {description != null && <span className="ds-caption text-foreground-subtle">{description}</span>}
      </div>
      {action}
    </div>
  );
}
