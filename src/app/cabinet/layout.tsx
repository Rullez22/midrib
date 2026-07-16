import { type ReactNode } from "react";
import { PageTransition } from "@/components/ds/page-transition";
import { RegFlowProvider } from "../flow/company-create/_components/reg-flow";
import { CabinetSeed } from "./_components/cabinet-seed";

/**
 * Layout раздела «Кабинет кооператива» (/cabinet) — операционные экраны после
 * создания компании (раздел «Кооператив» карты «Компания создана»).
 *
 * Оборачивает страницы в RegFlowProvider: общая «шапка»/sidebar (CoopSidebar)
 * читает состояние платформы из RegFlow, а экраны кабинета засидивают «всё
 * готово» (useEnsureFinal), показывая настроенный кооператив.
 */
export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <RegFlowProvider>
      <CabinetSeed />
      <PageTransition>{children}</PageTransition>
    </RegFlowProvider>
  );
}
