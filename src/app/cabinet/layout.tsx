import { type ReactNode } from "react";
import { PageTransition } from "@/components/ds/page-transition";
import { RegFlowProvider } from "../flow/company-create/_components/reg-flow";
import { CabinetSeed } from "./_components/cabinet-seed";
import { CabinetUnlockProvider } from "./[company]/_components/cabinet-unlock";

/**
 * Layout раздела «Кабинет кооператива» (/cabinet) — операционные экраны после
 * создания компании (раздел «Кооператив» карты «Компания создана»).
 *
 * Оборачивает страницы в RegFlowProvider: общая «шапка»/sidebar (CoopSidebar)
 * читает состояние платформы из RegFlow, а экраны кабинета засидивают «всё
 * готово» (useEnsureFinal), показывая настроенный кооператив.
 *
 * CabinetUnlockProvider — на весь /cabinet, а не только на кабинет 2–8: меню
 * подразделений переехало в Администрацию, поэтому пункты ВУЗа («Выдача диплома»,
 * «Дополнения») открываются оттуда, и снятая блокировка должна переживать уход
 * из /cabinet/vuz.
 */
export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <CabinetUnlockProvider>
      <RegFlowProvider>
        <CabinetSeed />
        <PageTransition>{children}</PageTransition>
      </RegFlowProvider>
    </CabinetUnlockProvider>
  );
}
