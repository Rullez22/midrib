"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SidebarPanel — панель правого сайдбара / настроек (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / right sidebar setting — Верификации (nodes 611:61819,
 * 469:0, 444:80216 …). Стили 1:1.
 *
 * Бордерная карточка: шапка (заголовок Medium + опц. крестик + нижняя hairline) +
 * тело (`children`, вертикальный список) + опц. футер (обычно кнопка во всю ширину).
 *
 * @example
 *   <SidebarPanel title="Верификации" onClose={close}
 *     footer={<Button fullWidth>Согласовать верификацию</Button>}>
 *     <SettingRow … />
 *   </SidebarPanel>
 */

export interface SidebarPanelProps {
  title: ReactNode;
  onClose?: () => void;
  /** Футер (например, кнопка во всю ширину). */
  footer?: ReactNode;
  children?: ReactNode;
  /** Класс на тело (по умолчанию padding 24 + gap 20). */
  bodyClassName?: string;
  className?: string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarPanel({
  title,
  onClose,
  footer,
  children,
  bodyClassName,
  className,
}: SidebarPanelProps) {
  return (
    <div className={cn("flex flex-col rounded-[4px] border border-border bg-surface", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <span className="ds-p3-medium text-foreground">{title}</span>
        {onClose && (
          <button type="button" aria-label="Закрыть" className="flex-none text-foreground-subtle hover:text-foreground-muted" onClick={onClose}>
            <CloseIcon />
          </button>
        )}
      </div>
      <div className={bodyClassName ?? "flex flex-col gap-5 p-6"}>{children}</div>
      {footer != null && <div className="px-6 pb-6">{footer}</div>}
    </div>
  );
}
