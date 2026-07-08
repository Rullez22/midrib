"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MidhubLogo, HeaderExitIcon } from "@/components/ds";
import { cn } from "@/lib/cn";

/**
 * CultureShell — общий каркас экранов кооператива «Культура 3» (Figma 7021-572213 /
 * 572597): верхняя полоса приложения + левый сайдбар с направлениями + слот main.
 * Используется экранами «Категории» и «Бизнес».
 */

const NAV = [
  { key: "mash", label: "Машиностроение", href: "/cabinet/spaces/mash" },
  { key: "transport", label: "Транспорт" },
  { key: "svyaz", label: "Связь" },
  { key: "stroy", label: "Строительство" },
];

export function CultureShell({ active = "mash", children }: { active?: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Полоса приложения: лого слева, выход справа. */}
      <header className="sticky top-0 z-20 flex h-[60px] w-full items-center justify-between border-b border-border bg-surface px-5 md:px-[50px]">
        <button type="button" aria-label="На главную" onClick={() => router.push("/cabinet/about")} className="flex items-center">
          <MidhubLogo className="size-8" />
        </button>
        <button
          type="button"
          aria-label="Выход"
          onClick={() => router.push("/cabinet/about")}
          className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-grey-20)] text-foreground-subtle transition-colors hover:bg-surface-sunken"
        >
          <HeaderExitIcon className="size-4" />
        </button>
      </header>

      <div className="flex flex-1">
        {/* Левый сайдбар: заголовок кооператива · направления · Admin снизу. */}
        <aside className="sticky top-[60px] flex h-[calc(100vh-60px)] w-[220px] shrink-0 flex-col border-r border-border bg-surface">
          <div className="flex h-[64px] items-center justify-center border-b border-border px-6">
            <span className="ds-p1-medium text-foreground">Культура 3</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
            {NAV.map((item) => {
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => item.href && router.push(item.href)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-[6px] px-3 text-center transition-colors",
                    isActive ? "ds-p3-medium text-[color:var(--color-blue-midhub-500)]" : "ds-p3 text-foreground hover:bg-surface-sunken",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 border-t border-border px-4 py-3">
            <span className="ds-caption text-foreground-subtle">Admin</span>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
              alt=""
              className="ml-auto size-9 rounded-full object-cover"
            />
          </div>
        </aside>

        {/* Основной контент экрана. */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
