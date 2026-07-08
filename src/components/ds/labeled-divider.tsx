import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * LabeledDivider — разделитель с подписью по центру (MIDHUB DS).
 * Источник: Figma «UI фичи» / launcher — «Или», «Кооперативы», «ООО»
 * (nodes 2086:272686, 2086:272858). Стили 1:1.
 *
 * Hairline-линии слева/справа от центрированной подписи (grey-300, caption).
 *
 * @example
 *   <LabeledDivider>Или</LabeledDivider>
 *   <LabeledDivider>Кооперативы</LabeledDivider>
 */

export interface LabeledDividerProps {
  children: ReactNode;
  className?: string;
}

export function LabeledDivider({ children, className }: LabeledDividerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="ds-caption text-foreground-subtle">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
