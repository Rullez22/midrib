import { type ReactNode } from "react";

/**
 * AuthLayout — центрированный экран на surface-sunken с лого MIDHUB сверху.
 * Источник: Figma «партнёрская программа» (2477:274229, 2477:274452).
 * Используется экранами «Авторизация» и «Выбор организации».
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-surface-sunken px-5 py-10">
      <div className="mx-auto flex max-w-[552px] flex-col items-center gap-8">
        <span className="inline-flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/midhub-logo.svg" alt="" className="size-10" />
          <span className="ds-h5 text-black">MIDHUB</span>
        </span>
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
