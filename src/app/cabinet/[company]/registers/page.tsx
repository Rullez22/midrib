import { notFound } from "next/navigation";
import { DomainRegistersScreen } from "../_components/domain-registers-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «registers» — «Реестры» (кабинет №4 Домены).
 *  Шаблоны (drill-down страны→категории→регионы→таблица) / Требования /
 *  Вознаграждения. Figma: 6752-444409 и др. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "registers");
  if (!item) notFound();
  return <DomainRegistersScreen cabinet={cabinet} current={item.key} />;
}
