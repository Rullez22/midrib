"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuNavItem, MenuIcon } from "@/components/ds";
import { CABINET_LIST } from "../[company]/_config/cabinets";
import { useCabinetUnlock, type UnlockKey } from "../[company]/_components/cabinet-unlock";
import { CABINET_ROUTES } from "./cabinet-seed";

/**
 * DeptMenu — блок «подразделения» под сепаратором в сайдбаре Администрации
 * (Figma «menu full»). Два состояния:
 *   • список — все 8 подразделений (Администрация … Фонд);
 *   • раскрытый раздел — кнопка «Назад» к списку + страницы этого подразделения.
 *
 * Страницы подразделений переехали сюда: в кабинетах 2–8 своего меню больше нет,
 * там остались только карточка, «Деятельность» и «Счета». Маршруты страниц при
 * этом не менялись — переехала навигация, а не URL.
 */

interface DeptItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
  /** Пункт скрыт, пока не пройден его флоу (ВУЗы: диплом/дополнения). */
  lockedUntil?: UnlockKey;
}
interface DeptSection {
  slug: string;
  name: string;
  items: DeptItem[];
}

/** Разделы: Администрация (её страницы — Пайщики/Партнеры) + кабинеты 2–8. */
const SECTIONS: DeptSection[] = [
  {
    slug: "administration",
    name: "Администрация",
    items: [
      { key: "paishiki", label: "Пайщики", icon: <MenuIcon.Users />, href: CABINET_ROUTES.paishiki },
      { key: "partners", label: "Партнеры", icon: <MenuIcon.Partners />, href: CABINET_ROUTES.partners },
    ],
  },
  ...CABINET_LIST.map((c) => ({
    slug: c.slug,
    name: c.name,
    items: c.menu.map((m) => ({
      key: m.key,
      label: m.label,
      icon: m.icon,
      href: `/cabinet/${c.slug}/${m.path}`,
      lockedUntil: m.lockedUntil,
    })),
  })),
];

/** Раздел, которому принадлежит открытая страница (иначе — список). */
export function sectionOfPath(pathname: string): string | null {
  const hit = SECTIONS.find((s) => s.items.some((i) => pathname.startsWith(i.href)));
  return hit?.slug ?? null;
}

/** Кнопка «Назад» — 1:1 из сайдбара партнёра. */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Назад к подразделениям"
      onClick={onClick}
      className="flex size-7 items-center justify-center self-start rounded-[4px] border border-border bg-surface-sunken text-foreground-subtle transition-colors hover:text-foreground"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
        <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function DeptMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { unlocked } = useCabinetUnlock();
  // Раскрытый раздел живёт в сайдбаре, а не в URL: открытая страница задаёт его
  // начальное значение, «Назад» возвращает к списку, не трогая контент.
  const [open, setOpen] = useState<string | null>(() => sectionOfPath(pathname));
  const section = open ? SECTIONS.find((s) => s.slug === open) : undefined;

  if (!section) {
    return (
      <>
        {SECTIONS.map((s) => (
          <MenuNavItem key={s.slug} onClick={() => setOpen(s.slug)}>
            {s.name}
          </MenuNavItem>
        ))}
      </>
    );
  }

  return (
    <>
      <BackButton onClick={() => setOpen(null)} />
      {section.items
        .filter((i) => !i.lockedUntil || unlocked[i.lockedUntil])
        .map((i) => (
          <MenuNavItem
            key={i.key}
            icon={i.icon}
            active={pathname.startsWith(i.href)}
            onClick={() => router.push(i.href)}
          >
            {i.label}
          </MenuNavItem>
        ))}
    </>
  );
}
