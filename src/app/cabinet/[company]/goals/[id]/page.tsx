import { notFound } from "next/navigation";
import { GoalPublishedScreen } from "../../_components/goal-published-screen";
import { getGoal } from "../../_components/goals-data";
import { getCabinet } from "../../_config/cabinets";

/** Страница конкретной цели из списка (заполнена данными этой цели + документы). */
export default async function Page({ params }: { params: Promise<{ company: string; id: string }> }) {
  const { company, id } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "goals")) notFound();
  const goal = getGoal(id);
  if (!goal) notFound();
  return <GoalPublishedScreen cabinet={cabinet} goal={goal} />;
}
