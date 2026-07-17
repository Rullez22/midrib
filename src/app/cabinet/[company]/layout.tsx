import { type ReactNode } from "react";
import { RegFlowProvider } from "../../flow/company-create/_components/reg-flow";
import { CabinetSeed } from "../_components/cabinet-seed";

/**
 * Layout кабинета 2–7 (/cabinet/[company]). Собственный RegFlowProvider —
 * состояние изолировано от Администрации (/cabinet) и от других кабинетов: каждый
 * кабинет это отдельная компания. CabinetSeed засеивает «всё готово», чтобы
 * операционные под-экраны (Деятельность/Счета) работали как в кабинете №1.
 *
 * CabinetUnlockProvider живёт выше — в layout всего /cabinet: меню подразделений
 * переехало в Администрацию, пункты ВУЗа открываются оттуда, поэтому снятая
 * блокировка не должна теряться при уходе из этого кабинета.
 */
export default function CompanyCabinetLayout({ children }: { children: ReactNode }) {
  return (
    <RegFlowProvider>
      <CabinetSeed />
      {children}
    </RegFlowProvider>
  );
}
