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
