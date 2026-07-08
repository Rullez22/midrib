import { type ReactNode } from "react";
import { RegFlowProvider } from "../../flow/company-create/_components/reg-flow";
import { CabinetSeed } from "../_components/cabinet-seed";
import { CabinetUnlockProvider } from "./_components/cabinet-unlock";

/**
 * Layout кабинета 2–7 (/cabinet/[company]). Собственный RegFlowProvider —
 * состояние изолировано от Администрации (/cabinet) и от других кабинетов: каждый
 * кабинет это отдельная компания. CabinetSeed засеивает «всё готово», чтобы
 * операционные под-экраны (Деятельность/Счета) работали как в кабинете №1.
 *
 * CabinetUnlockProvider — выше RegFlowProvider: разблокировка пунктов меню (ВУЗы:
 * «Выдача диплома»/«Дополнения») видна и под-флоу «Направление», и сайдбару.
 */
export default function CompanyCabinetLayout({ children }: { children: ReactNode }) {
  return (
    <CabinetUnlockProvider>
      <RegFlowProvider>
        <CabinetSeed />
        {children}
      </RegFlowProvider>
    </CabinetUnlockProvider>
  );
}
