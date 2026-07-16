"use client";

import {
  useId,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Accordion — раскрывающаяся секция MIDHUB DS.
 * Источник: Figma «UI Контролы» / Dropdown=Accordion (node 335:3394).
 *
 * Заголовок (шеврон слева + текст, Ghost) раскрывает панель с контентом.
 *   size  : "l" (16) · "m" (14) · "s" (12)
 *   state : default / open / disabled
 *
 * Управляемый (`open` + `onOpenChange`) или неуправляемый (`defaultOpen`).
 *
 * @example
 *   <Accordion title="Подробнее">
 *     <Text variant="p3">Скрытый контент…</Text>
 *   </Accordion>
 */

export type AccordionSize = "l" | "m" | "s";

export interface AccordionProps {
  /** Заголовок (кликабельный). */
  title: ReactNode;
  size?: AccordionSize;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

const SIZE_CLASS: Record<AccordionSize, string> = {
  l: "ds-accordion--l",
  m: "ds-accordion--m",
  s: "ds-accordion--s",
};

function Chevron() {
  return (
    <span className="ds-accordion__chevron" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Accordion({
  title,
  size = "l",
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const current = open !== undefined ? open : internal;
  const panelId = useId();

  function toggle() {
    if (disabled) return;
    if (open === undefined) setInternal((v) => !v);
    onOpenChange?.(!current);
  }

  return (
    <div className={cn("ds-accordion", SIZE_CLASS[size], current && "ds-accordion--open", className)}>
      <button
        type="button"
        className="ds-accordion__header"
        aria-expanded={current}
        aria-controls={panelId}
        disabled={disabled}
        onClick={toggle}
      >
        <Chevron />
        <span className="ds-accordion__title">{title}</span>
      </button>
      <div
        className={cn("ds-accordion__panelwrap", current && "ds-accordion__panelwrap--open")}
        inert={!current}
      >
        <div id={panelId} className="ds-accordion__panel" role="region">
          {children}
        </div>
      </div>
    </div>
  );
}
