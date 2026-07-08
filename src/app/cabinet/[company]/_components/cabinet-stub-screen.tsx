"use client";

import { EmptyState } from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * CabinetStubScreen — заглушка под-раздела кабинета, для пунктов меню, у которых
 * пока нет макета в Figma (нейтральный EmptyState, не выдуманный UI). Сайдбар
 * кабинета сохраняется, чтобы навигация работала и не было 404.
 */
export function CabinetStubScreen({
  cabinet,
  current,
  title,
}: {
  cabinet: CabinetConfig;
  current: string;
  title: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-10 md:px-[50px]">
          <h1 className="ds-h5 text-foreground">{title}</h1>
          <EmptyState title="Раздел в подготовке" />
        </div>
      </main>
    </div>
  );
}
