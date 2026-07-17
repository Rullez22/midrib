import { type MenuBadgeColor } from "@/components/ds";
import { CABINET_LIST } from "./cabinets";

/**
 * Навигация по рейке воркспейсов. Бейдж №1 → профиль подразделения «Администрация»
 * (/cabinet/subdivision/administration) — открывается так же, как кабинеты 2–7
 * (профиль + чат); №2–7 → соответствующий кабинет (/cabinet/[slug]). Общий
 * источник для админского CoopSidebar и кабинетного CompanySidebar — рейка
 * кликабельна везде.
 */
export const RAIL_HREFS: Record<string, string> = {
  "1": "/cabinet/subdivision/administration",
  ...Object.fromEntries(CABINET_LIST.map((c) => [String(c.rail), `/cabinet/${c.slug}`])),
};

export function railHref(label: string): string | undefined {
  return RAIL_HREFS[label];
}

/**
 * Бейджи рейки: №1 — Администрация, дальше кабинеты из CABINET_LIST (скрытые
 * подразделения туда не попадают). Один источник на все сайдбары — раньше этот
 * список был скопирован в каждый из пяти.
 */
export const RAIL_WORKSPACES: { label: string; color: MenuBadgeColor }[] = [
  { label: "1", color: "red" },
  ...CABINET_LIST.map((c) => ({ label: String(c.rail), color: c.railColor })),
];
