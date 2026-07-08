import { notFound } from "next/navigation";
import { GoalPublishedScreen } from "../../_components/goal-published-screen";
import { NEW_GOAL } from "../../_components/goals-data";
import { getCabinet } from "../../_config/cabinets";

/** Опубликованная цель, только что созданная через форму (Figma 7021:587278). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "goals")) notFound();
  return <GoalPublishedScreen cabinet={cabinet} goal={NEW_GOAL} />;
}
