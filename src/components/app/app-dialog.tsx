"use client";

import type { ReactNode } from "react";
import { Text } from "@/components/ds";

/**
 * AppDialog — модальный попап мобильной апки MIDHUB. Позиционируется
 * `absolute` внутри MobileFrame (не `fixed`), чтобы затемнение и карточка
 * оставались в рамке телефона. Иконка · заголовок · описание · действие.
 * Макет: «Операция отправлена…» (node 7009:569959).
 */
export interface AppDialogProps {
  open: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
}

export function AppDialog({
  open,
  onClose,
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: AppDialogProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center bg-[rgba(37,55,75,0.35)] px-4"
      onClick={() => onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[320px] rounded-xl bg-surface p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <div className="mb-4">{icon}</div>}
        <Text variant="p1-medium" as="p">
          {title}
        </Text>
        {description && (
          <Text variant="p2" tone="subtle" as="p" className="mt-2">
            {description}
          </Text>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onAction}
            className="ds-caption-up px-2 py-1 font-[500] text-primary"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Синий круг с белой галочкой — иконка успеха для AppDialog. */
export function SuccessCheck() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[#fff]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="m6 12 4 4 8-8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
