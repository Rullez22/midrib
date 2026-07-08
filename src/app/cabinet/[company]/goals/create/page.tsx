import { notFound } from "next/navigation";
import { GoalCreateScreen } from "../../_components/goal-create-screen";
import { getCabinet } from "../../_config/cabinets";

/** «Добавление новой цели» (Figma 7021:586194). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "goals")) notFound();
  return <GoalCreateScreen cabinet={cabinet} />;
}
