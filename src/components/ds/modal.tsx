"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Modal — модальное окно / попап (MIDHUB DS).
 * Источник: Figma «UI фичи» / попапы (nodes 134:26158/26159/26162, 135:26149, 206:0,
 * 584:0, 748:0, 651:0 …). Стили 1:1.
 *
 * Оверлей + центрированная карточка (рамка grey-90, тень) с крестиком, заголовком
 * по центру, телом (`children`) и футером действий (`footer`).
 * Закрытие — крестик, клик по оверлею, Escape.
 *
 *   size : "s" (480) · "m" (624) · "l" (760)
 *
 * @example
 *   <Modal open={open} onClose={close} title="Подтвердить действие?"
 *     footer={<Button fullWidth onClick={close}>Подтвердить</Button>}>
 *     Это действие изменит важную информацию.
 *   </Modal>
 */

export type ModalSize = "s" | "m" | "l";

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Футер действий (кнопки). По центру. */
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  s: "max-w-[480px]",
  m: "max-w-[624px]",
  l: "max-w-[760px]",
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Modal({ open, onClose, title, children, footer, size = "m", className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ds-anim-overlay fixed inset-0 z-50 flex items-center justify-center bg-[rgba(37,55,75,0.35)] p-4"
      onClick={() => onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "ds-anim-pop relative w-full rounded-[4px] border border-border bg-surface p-8 shadow-[0_2px_5px_rgba(37,55,75,0.25)]",
          SIZE_CLASS[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute right-4 top-4 text-foreground-subtle transition-colors hover:text-foreground-muted"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        )}
        {title != null && <h2 className="ds-h5 mb-4 px-8 text-center text-foreground">{title}</h2>}
        {children != null && <div className="ds-p2 text-foreground-muted">{children}</div>}
        {footer != null && <div className="mt-8 flex items-center justify-center gap-4">{footer}</div>}
      </div>
    </div>
  );
}
