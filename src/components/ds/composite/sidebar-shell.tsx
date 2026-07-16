"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * SidebarShell — обёртка сайдбара с адаптивным поведением.
 *
 * На ≥lg — обычная липкая колонка (как раньше). На <lg сам сайдбар скрыт,
 * поэтому здесь появляется плавающий гамбургер, а по клику — выезжающий слева
 * drawer с тем же содержимым (backdrop + slide, закрытие по клику/Escape/смене
 * маршрута). Анимации под prefers-reduced-motion (утилиты .ds-anim-*).
 *
 * Использование: обернуть содержимое сайдбара (rail + панель) вместо внешнего
 * `<div className="sticky top-0 hidden … lg:flex">`.
 */
export function SidebarShell({
  children,
  desktopClassName = "sticky top-0 hidden h-screen shrink-0 lg:flex",
  ariaLabel = "Открыть меню",
}: {
  children: ReactNode;
  desktopClassName?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Закрывать drawer при переходе на другой маршрут.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape + блокировка скролла страницы под открытым drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Десктоп: обычная колонка. */}
      <div className={desktopClassName}>{children}</div>

      {/* Мобильный гамбургер (виден только <lg). */}
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-40 flex size-10 items-center justify-center rounded-[8px] border border-border bg-surface text-foreground-subtle transition-colors hover:text-foreground lg:hidden"
      >
        <BurgerIcon />
      </button>

      {/* Мобильный drawer. */}
      {open && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div
            className="ds-anim-overlay fixed inset-0 z-50 bg-[rgba(37,55,75,0.35)]"
            onClick={() => setOpen(false)}
          />
          <div className="ds-anim-drawer fixed left-0 top-0 z-50 flex h-screen max-w-[92vw] overflow-y-auto bg-surface">
            {children}
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
              className={cn(
                "absolute right-2 top-2 flex size-8 items-center justify-center rounded-[6px]",
                "text-foreground-subtle transition-colors hover:text-foreground",
              )}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
