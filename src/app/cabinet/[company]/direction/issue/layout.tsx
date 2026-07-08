import { type ReactNode } from "react";
import { RegFlowProvider } from "../../../../flow/company-create/_components/reg-flow";

/**
 * Layout под-флоу «Выдача диплома» (ВУЗы). Оборачивает шаги в RegFlowProvider —
 * то же общее состояние формы регистрации, что и во флоу создания ПП кооператива
 * (страны/уровни/приоритет/возраст/основания/документы переживают навигацию).
 */
export default function DiplomaIssueLayout({ children }: { children: ReactNode }) {
  return <RegFlowProvider>{children}</RegFlowProvider>;
}
