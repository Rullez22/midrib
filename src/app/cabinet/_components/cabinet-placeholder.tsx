"use client";

import { EmptyState } from "@/components/ds";
import { CoopSidebar } from "../../flow/company-create/_components/coop-sidebar";
import { CABINET_ROUTES } from "./cabinet-seed";

/**
 * CabinetPlaceholder — временный экран раздела кабинета, который ещё не построен
 * 1:1 из Figma. Держит общий сайдбар с маршрутами /cabinet, чтобы навигация
 * оставалась внутри засиженного кабинета (не прыгала в пустой онбординг).
 */
export function CabinetPlaceholder({
  current,
  title,
}: {
  current?: "paishiki" | "activity" | "voting" | "accounts";
  title: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar current={current} routes={CABINET_ROUTES} />
      <main className="flex min-w-0 flex-1 items-center justify-center px-10 py-8">
        <EmptyState title={title} description="Раздел в разработке — скоро добавим экраны из Figma." />
      </main>
    </div>
  );
}
