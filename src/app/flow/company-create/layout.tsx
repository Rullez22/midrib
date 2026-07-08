import { type ReactNode } from "react";
import { RegFlowProvider } from "./_components/reg-flow";

/**
 * Layout флоу «Создание компании». Оборачивает все шаги в RegFlowProvider —
 * состояние формы регистрации (страны/уровни/приоритет/возраст) переживает
 * клиентскую навигацию между шагами 7 → 8.
 */
export default function CompanyCreateLayout({ children }: { children: ReactNode }) {
  return <RegFlowProvider>{children}</RegFlowProvider>;
}
