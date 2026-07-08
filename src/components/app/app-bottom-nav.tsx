"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NavHomeIcon, NavDocumentsIcon, NavWalletIcon } from "./app-icons";
import { useDiploma } from "./diploma-store";

/**
 * AppBottomNav — нижняя таб-навигация мобильной апки MIDHUB.
 * Разделы 1:1 с макетом Figma («Mobile | Main 2»): Главная · Документы ·
 * Баланс. Активный — primary (blue-midhub 500), неактивные — dark 800.
 */
interface NavItem {
  href: string;
  label: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

const ITEMS: NavItem[] = [
  { href: "/app", label: "Главная", Icon: NavHomeIcon },
  { href: "/app/documents", label: "Документы", Icon: NavDocumentsIcon },
  { href: "/app/balance", label: "Баланс", Icon: NavWalletIcon },
];

/** Корневые табы, где видна нижняя навигация. На вложенных
 *  (pushed) экранах — скрыта (там свой back-хедер). */
const TAB_ROUTES = ["/app", "/app/documents", "/app/balance"];

export function AppBottomNav() {
  const pathname = usePathname();
  const { status: diplomaStatus } = useDiploma();

  // На вложенных экранах (напр. /app/balance/withdraw) навигации нет.
  if (!TAB_ROUTES.includes(pathname)) return null;

  return (
    <nav className="flex shrink-0 items-stretch bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0px_-0.5px_5px_0px_rgba(0,0,0,0.04),0px_-3.75px_11px_0px_rgba(0,0,0,0.06)]">
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
        // Оранжевая точка на «Документы» — есть невыполненное действие
        // (диплом ждёт подтверждения корректности). Figma 7009:575880.
        const dot = href === "/app/documents" && diplomaStatus === "pending";
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-start gap-1 pt-2 pb-2 transition-colors",
              active ? "text-primary" : "text-foreground-muted",
            )}
          >
            <span className="relative">
              <Icon width={24} height={24} />
              {dot && (
                <span className="absolute -right-1.5 -top-0.5 size-2 rounded-full bg-[var(--color-orange-300)]" />
              )}
            </span>
            <span className="ds-caption">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
