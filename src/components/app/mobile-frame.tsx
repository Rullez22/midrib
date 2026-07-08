import type { ReactNode } from "react";
import { IosStatusBar } from "./ios-status-bar";

/**
 * MobileFrame — «телефонная рамка» для мобильной апки MIDHUB (`/app`).
 *
 * На десктопе (md+) рисует устройство: фиксированный экран 390×844,
 * скруглённые углы, тёмная рамка-безель и тень — по центру страницы.
 * На реальном мобильном (< md) — полноэкранно, без рамки.
 *
 * Внутри — вертикальный стек: контент апки заполняет всю высоту рамки.
 * Скролл живёт внутри <main> в AppShell, а не на рамке.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[var(--color-grey-20)] md:p-8">
      <div
        className={[
          "relative flex w-full flex-col overflow-hidden bg-background",
          "h-[100dvh]",
          // Десктоп: превью телефона
          "md:h-[844px] md:w-[390px] md:rounded-[2.75rem]",
          "md:border-[11px] md:border-[#242b32] md:shadow-lg",
        ].join(" ")}
      >
        <IosStatusBar />
        {children}
      </div>
    </div>
  );
}
