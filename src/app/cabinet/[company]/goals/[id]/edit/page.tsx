import { notFound } from "next/navigation";
import { GoalCreateScreen } from "../../../_components/goal-create-screen";
import { getGoal } from "../../../_components/goals-data";
import { getCabinet } from "../../../_config/cabinets";

/** Редактирование конкретной цели — форма создания, префилл контентом цели. */
export default async function Page({ params }: { params: Promise<{ company: string; id: string }> }) {
  const { company, id } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "goals")) notFound();
  const goal = getGoal(id);
  if (!goal) notFound();
  return <GoalCreateScreen cabinet={cabinet} goal={goal} />;
}
