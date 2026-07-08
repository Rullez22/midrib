import { notFound } from "next/navigation";
import { CabinetScreen } from "../../_components/cabinet-screen";
import { CompanySidebar } from "../_components/company-sidebar";
import { JoinBanner } from "../_components/join-banner";
import { getCabinet } from "../_config/cabinets";

/**
 * Счета кабинета — переиспользует CabinetScreen в cabinet-режиме: баннер «стать
 * пайщиком» + под-таб «Взаиморасчёты» (ReportBody) + Документооборот/Артефакты.
 */
export default async function CabinetAccountsPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  return (
    <CabinetScreen
      sidebar={<CompanySidebar cabinet={cabinet} current="accounts" />}
      banner={<JoinBanner />}
    />
  );
}
