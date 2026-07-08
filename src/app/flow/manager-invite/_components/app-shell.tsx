"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import {
  LeftMenu,
  MenuRail,
  MenuBadge,
  MenuPanel,
  MenuNavItem,
  MenuFooter,
  MenuIcon,
  type MenuBadgeColor,
} from "@/components/ds";

/**
 * AppShell — каркас приложения для флоу «Приглашение менеджера компании».
 * Источник: Figma «партнёрская программа» (2262:202327 и др.) — левое меню
 * (рейка 1–7 + панель «Реферальная»). Собран целиком из DS LeftMenu.
 *
 * Responsive: на lg+ — вертикальный сайдбар; на ≤lg — топ-бар (лого + гамбургер),
 * по тапу открывается меню-шторка с той же структурой (рейка 1–7 | разделитель |
 * «Реферальная», снизу Admin | Пред. правления). Контент — без горизонтального скролла.
 */

// Плейсхолдер-аватар (силуэт) — фото-ассет из Figma пустой.
const AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#e8edf2"/><circle cx="32" cy="25" r="11" fill="#b1becb"/><path d="M13 60c0-12 9-19 19-19s19 7 19 19z" fill="#b1becb"/></svg>`,
  );

const WORKSPACES: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  { label: "2", color: "orange" },
  { label: "3", color: "yellow" },
  { label: "4", color: "green" },
  { label: "5", color: "blue" },
  { label: "6", color: "blue-strong" },
  { label: "7", color: "purple" },
];

/** Сайдбар (рейка 1–7 + панель «Реферальная») — общий для десктопа и шторки. */
function Sidebar() {
  return (
    <LeftMenu className="h-full">
      <MenuRail
        height="100vh"
        brand={
          <MenuBadge brand aria-label="Главная">
            <MenuIcon.Brand />
          </MenuBadge>
        }
        footer={<MenuFooter>Admin</MenuFooter>}
      >
        {WORKSPACES.map((w) => (
          <MenuBadge key={w.label} color={w.color}>
            {w.label}
          </MenuBadge>
        ))}
      </MenuRail>
      <MenuPanel
        height="100vh"
        footer={
          <MenuFooter avatar={AVATAR} avatarRing>
            Пред. правления
          </MenuFooter>
        }
      >
        {/* gap 24px сверху (7px паддинг панели + 17px) — как в Figma */}
        <MenuNavItem icon={<MenuIcon.Megaphone />} active className="mt-[17px]">
          Реферальная
        </MenuNavItem>
      </MenuPanel>
    </LeftMenu>
  );
}

/** Кнопка-тоггл: 3 полоски ↔ крест (анимация). */
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  const bar = "absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out";
  return (
    <button
      type="button"
      aria-label={open ? "Закрыть меню" : "Меню"}
      aria-expanded={open}
      onClick={onClick}
      className="fixed right-4 top-2 z-[70] inline-flex size-10 items-center justify-center rounded-[4px] text-foreground-muted transition-colors hover:bg-surface-muted lg:hidden"
    >
      <span className="relative block h-4 w-6">
        <span className={cn(bar, open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
        <span className={cn(bar, "top-1/2 -translate-y-1/2", open ? "opacity-0" : "opacity-100")} />
        <span className={cn(bar, open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full")} />
      </span>
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Мобильный топ-бар: лого + тоггл (≤lg) */}
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background px-4 lg:hidden">
        <span className="inline-flex size-8 items-center justify-center">
          <MenuIcon.Brand />
        </span>
      </header>
      <MenuToggle open={open} onClick={() => setOpen((o) => !o)} />

      {/* Меню-шторка (≤lg) */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Сайдбар — только на десктопе (lg+) */}
        <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
          <Sidebar />
        </div>

        {/* Контент */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
