"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tooltip — тёмная подсказка MIDHUB DS.
 * Источник: Figma «UI Контролы» (node 1008:58062).
 *
 * Оборачивает любой триггер и показывает пузырёк по hover/focus (чистый CSS).
 *   side    : "top" (по умолч.) · "bottom" · "left" · "right"
 *   caption : тело Caption 12/20 вместо P3 14/22
 *   title   : опциональный заголовок (P3-Medium 14/22)
 *
 * @example
 *   <Tooltip content="Короткая подсказка">
 *     <Button>Наведи</Button>
 *   </Tooltip>
 *
 *   <Tooltip title="Заголовок" content="Длинные разрушают" side="bottom" caption>
 *     <span>?</span>
 *   </Tooltip>
 */

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Текст подсказки (тело пузырька). */
  content: ReactNode;
  /** Опциональный заголовок над телом. */
  title?: ReactNode;
  /** Сторона появления относительно триггера. */
  side?: TooltipSide;
  /** Тело текстом Caption 12/20 вместо P3 14/22. */
  caption?: boolean;
  /** Триггер — элемент, при наведении на который видна подсказка. */
  children: ReactNode;
  className?: string;
}

const SIDE_CLASS: Record<TooltipSide, string> = {
  top: "ds-tooltip__bubble--top",
  bottom: "ds-tooltip__bubble--bottom",
  left: "ds-tooltip__bubble--left",
  right: "ds-tooltip__bubble--right",
};

export function Tooltip({
  content,
  title,
  side = "top",
  caption = false,
  children,
  className,
}: TooltipProps) {
  const bubbleId = useId();

  return (
    <span
      className={cn("ds-tooltip", caption && "ds-tooltip--caption", className)}
      tabIndex={0}
      aria-describedby={bubbleId}
    >
      {children}
      <span id={bubbleId} role="tooltip" className={cn("ds-tooltip__bubble", SIDE_CLASS[side])}>
        {title != null && <span className="ds-tooltip__title">{title}</span>}
        <span className="ds-tooltip__body">{content}</span>
      </span>
    </span>
  );
}
