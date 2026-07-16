import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * ContentTransition — плавная смена контента (табы, фильтры, шаги, состояния).
 *
 * CSS-анимация играет только при появлении узла в DOM. При смене таба узел
 * остаётся прежним — меняется содержимое, и анимация не перезапускается.
 * Поэтому обёртка вешает `key={transitionKey}`: React размонтирует старый div
 * и смонтирует новый, класс `.ds-content*` отрабатывает заново.
 *
 * Следствие, о котором надо помнить: смена transitionKey РЕ-МОНТИРУЕТ детей —
 * их локальный useState обнуляется. Для табов это обычно и нужно. Но обёртку
 * нельзя ставить выше провайдера состояния (RegFlow и т.п.): иначе навигация
 * между шагами будет терять форму. Провайдер держим снаружи, обёртку — внутри.
 *
 * Варианты (globals.css):
 *   default — fade + подъём 6px;
 *   slide   — fade + сдвиг 12px по X;
 *   fade    — только opacity. Единственный безопасный вариант для обёрток
 *             уровня страницы: transform на предке делает его containing block
 *             для position: fixed, и модалки/drawer уезжают вместе с контентом;
 *   stagger — каскад по прямым потомкам (списки).
 */
export type ContentTransitionVariant = "default" | "slide" | "fade" | "stagger";

export interface ContentTransitionProps {
  /** Смена значения перезапускает анимацию (и ре-монтирует детей). */
  transitionKey: string | number;
  variant?: ContentTransitionVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<ContentTransitionVariant, string> = {
  default: "ds-content",
  slide: "ds-content--slide",
  fade: "ds-content--fade",
  stagger: "ds-content--stagger",
};

export function ContentTransition({
  transitionKey,
  variant = "default",
  children,
  className,
}: ContentTransitionProps) {
  return (
    <div key={transitionKey} className={cn(VARIANT_CLASS[variant], className)}>
      {children}
    </div>
  );
}
