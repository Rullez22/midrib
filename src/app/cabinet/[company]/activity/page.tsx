import { notFound } from "next/navigation";
import { ActivityScreen } from "../../../flow/company-create/_components/activity-screen";
import { CabinetActivityScreen } from "../_components/cabinet-activity-screen";
import { CompanySidebar } from "../_components/company-sidebar";
import { getCabinet } from "../_config/cabinets";
import { getCabinetActivity } from "../_config/cabinet-activity";

/**
 * Деятельность кабинета. Если есть данные Структуры кабинета (коллектив/каскад из
 * Figma) — рендерим CabinetActivityScreen (операционный вид). Иначе временный
 * fallback на админский ActivityScreen с сайдбаром кабинета.
 */
export default async function CabinetActivityPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const data = getCabinetActivity(company);
  if (data) return <CabinetActivityScreen cabinet={cabinet} data={data} />;
  return <ActivityScreen sidebar={<CompanySidebar cabinet={cabinet} current="activity" />} cabinetView />;
}
