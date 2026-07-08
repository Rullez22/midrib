"use client";

import type { ReactNode } from "react";
import { Text } from "@/components/ds";

/**
 * ShareSheet — нижний лист «Поделиться» мобильной апки MIDHUB.
 * Открывается по тапу на QR в «Пополнении» (макет node 7009:570158 —
 * системный share-лист Android). Здесь — мокап в стиле листа: затемнение
 * + белый лист снизу + сетка таргетов. `absolute` внутри MobileFrame.
 */
interface Target {
  label: string;
  color: string;
  glyph: ReactNode;
}

const envelope = (
  <path
    d="M4 6h16v12H4z M4 7l8 6 8-6"
    stroke="#fff"
    strokeWidth="1.6"
    fill="none"
    strokeLinejoin="round"
  />
);
const chat = (
  <path
    d="M4 5h16v11H9l-4 3.5V16H4z"
    fill="#fff"
  />
);
const copy = (
  <path
    d="M9 9h9v11H9z M6 4h8v3H9v8H6z"
    fill="#fff"
  />
);

const TARGETS: Target[] = [
  { label: "Gmail", color: "#EA4335", glyph: envelope },
  { label: "Hangouts", color: "#0F9D58", glyph: chat },
  {
    label: "Google+",
    color: "#DB4437",
    glyph: (
      <path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    label: "Bluetooth",
    color: "#0A6CFF",
    glyph: (
      <path
        d="M8 8l8 8-4 3V5l4 3-8 8"
        stroke="#fff"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Keep",
    color: "#FFBB00",
    glyph: (
      <path
        d="M12 4a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Z M10 19h4"
        stroke="#fff"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "На Диск",
    color: "#1FA463",
    glyph: (
      <path d="M9 5h6l5 9H4z M4 14h16l-3 5H7z" fill="#fff" opacity="0.95" />
    ),
  },
  { label: "Почта", color: "#5A646E", glyph: envelope },
  { label: "Сообщение", color: "#5A646E", glyph: chat },
  { label: "Копировать", color: "#5A646E", glyph: copy },
];

export function ShareSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[70] flex flex-col justify-end bg-[rgba(0,0,0,0.4)]"
      onClick={onClose}
    >
      <div
        className="rounded-t-2xl bg-surface px-4 pb-6 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Text variant="p2" tone="muted" className="mb-4 block">
          Поделиться
        </Text>
        <div className="grid grid-cols-3 gap-y-5">
          {TARGETS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={onClose}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: t.color }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {t.glyph}
                </svg>
              </span>
              <span className="ds-caption text-foreground-muted">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
