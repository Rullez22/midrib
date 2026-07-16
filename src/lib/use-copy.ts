"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Копирование в буфер обмена с временным флагом `copied` (для смены иконки
 * Copy → Check и подписи «Скопировано»). Флаг сам сбрасывается через `timeout`.
 *
 * const { copied, copy } = useCopyToClipboard();
 * <button onClick={() => copy(address)}>{copied ? "Скопировано" : "Копировать"}</button>
 */
export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { copied, copy };
}
