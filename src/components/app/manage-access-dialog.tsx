"use client";

import type { ReactNode } from "react";
import { Button, Text } from "@/components/ds";

/**
 * Полноэкранный диалог «Управление доступом» (Figma 7009:573376 / 7009:573362).
 * Крестик сверху слева, заголовок + текст, сноска внизу и две кнопки.
 * DS: Text, Button.
 */
export function ManageAccessDialog({
  title,
  body,
  footnote,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}: {
  title: string;
  body: ReactNode;
  footnote: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface pt-11">
      <div className="px-3 py-2">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="flex size-10 items-center justify-center text-foreground-muted"
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4">
        <div className="flex flex-col gap-1 pt-3">
          <Text variant="h5" as="h1">
            {title}
          </Text>
          <Text variant="p2" tone="muted" as="div">
            {body}
          </Text>
        </div>

        <Text
          variant="caption"
          tone="subtle"
          as="div"
          className="mt-auto pb-4 leading-[20px]"
        >
          {footnote}
        </Text>
      </div>

      <div className="flex shrink-0 gap-3 px-4 pt-6 pb-6">
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={onPrimary}
        >
          {primaryLabel}
        </Button>
        <Button
          variant="primary"
          size="m"
          fullWidth
          className="uppercase"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
