import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Toolbar — панель действий над таблицей (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / folder and select item (node 558:85340). Стили 1:1.
 *
 * Полоса grey-20 с тремя зонами: `left` (bulk-действия), `center` (счётчик
 * «Отмечено: N»), `right` (пагинация, kebab). Высота 38.
 *
 * @example
 *   <Toolbar
 *     left={<Button variant="tertiary" size="xs" iconLeft={<Folder/>}>Переместить в папку</Button>}
 *     center="Отмечено: 1"
 *     right={<Pagination size="xs" view="full" page={1} total={200} onChange={...} />}
 *   />
 */

export interface ToolbarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Toolbar({ left, center, right, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-[38px] items-center gap-4 rounded-[4px] border border-border bg-surface-muted px-6",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-3">{left}</div>
      {center != null && (
        <div className="ds-caption-medium flex-none text-center text-foreground-muted">{center}</div>
      )}
      <div className="flex flex-1 items-center justify-end gap-3">{right}</div>
    </div>
  );
}
