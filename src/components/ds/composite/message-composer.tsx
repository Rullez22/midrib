"use client";

import { type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * MessageComposer — поле ввода сообщения с отправкой (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / создание договора — «Сообщение» (node 182:48). Стили 1:1.
 *
 * Текстовое поле (растёт) + круглая кнопка отправки (синяя стрелка).
 *
 * @example
 *   <MessageComposer placeholder="Сообщение" onSend={send} />
 */

export interface MessageComposerProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> {
  /** Колбэк отправки. */
  onSend?: (value: string) => void;
  className?: string;
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
      <path d="M4 12 20 4l-4 16-4-7-8-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageComposer({ onSend, className, value, placeholder = "Сообщение", ...rest }: MessageComposerProps) {
  return (
    <div className={cn("flex items-end gap-3 rounded-[4px] border border-border bg-surface px-4 py-3", className)}>
      <textarea
        rows={1}
        placeholder={placeholder}
        value={value}
        className="ds-p2 max-h-40 flex-1 resize-none bg-transparent text-foreground outline-none placeholder:text-foreground-subtle"
        {...rest}
      />
      <button
        type="button"
        aria-label="Отправить"
        className="flex-none self-end text-primary transition-opacity hover:opacity-80"
        onClick={() => onSend?.(typeof value === "string" ? value : "")}
      >
        <SendIcon />
      </button>
    </div>
  );
}
