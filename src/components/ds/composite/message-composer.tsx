"use client";

import { useState, type ChangeEvent, type KeyboardEvent, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * MessageComposer — поле ввода сообщения с отправкой (композит MIDHUB DS).
 * Источник: Figma «UI фичи» / создание договора — «Сообщение» (node 182:48). Стили 1:1.
 *
 * Текстовое поле (растёт) + круглая кнопка отправки (синяя стрелка).
 * Enter отправляет, Shift+Enter переносит строку. Пустое/пробельное не уходит.
 *
 * Работает без внешнего состояния: если `value` не передан, текст держится
 * внутри и очищается после отправки — раньше компонент требовал value/onChange
 * от каждого потребителя, и все 12 мест звали его как <MessageComposer />,
 * из-за чего кнопка отдавала в onSend пустую строку и чат не отправлял ничего.
 * Контролируемый режим (value + onChange) по-прежнему работает.
 *
 * @example
 *   <MessageComposer placeholder="Сообщение" onSend={(text) => add(text)} />
 */

export interface MessageComposerProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> {
  /** Колбэк отправки. Получает текст без крайних пробелов. */
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

export function MessageComposer({
  onSend,
  className,
  value,
  onChange,
  onKeyDown,
  placeholder = "Сообщение",
  ...rest
}: MessageComposerProps) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState("");
  const text = controlled ? String(value ?? "") : inner;
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend?.(text.trim());
    if (!controlled) setInner("");
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    // ds-composer — якорь для правила в globals.css: глобальный :focus-visible
    // безслойный и бьёт Tailwind-утилиту outline-none из @layer, поэтому внутри
    // поля рисовалась вторая синяя рамка. Фокус показываем на обёртке.
    <div
      className={cn(
        "ds-composer flex items-end gap-3 rounded-[4px] border border-border bg-surface px-4 py-3 transition-colors",
        "focus-within:border-[color:var(--color-blue-midhub-500)]",
        className,
      )}
    >
      <textarea
        rows={1}
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="ds-p2 max-h-40 flex-1 resize-none bg-transparent text-foreground outline-none placeholder:text-foreground-subtle"
        {...rest}
      />
      <button
        type="button"
        aria-label="Отправить"
        disabled={!canSend}
        onClick={send}
        className="flex-none self-end text-primary transition-opacity hover:opacity-80 disabled:opacity-40"
      >
        <SendIcon />
      </button>
    </div>
  );
}
