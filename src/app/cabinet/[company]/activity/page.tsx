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
 * ?member=<слаг ЛК> — возврат со страницы человека: его карточка сразу выделена.
 */
export default async function CabinetActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ company: string }>;
  searchParams: Promise<{ member?: string }>;
}) {
  const { company } = await params;
  const { member } = await searchParams;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const data = getCabinetActivity(company);
  if (data) return <CabinetActivityScreen cabinet={cabinet} data={data} member={member} />;
  return <ActivityScreen sidebar={<CompanySidebar cabinet={cabinet} current="activity" />} cabinetView />;
}
