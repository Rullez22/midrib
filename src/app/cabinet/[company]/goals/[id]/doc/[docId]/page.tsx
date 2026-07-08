import { notFound } from "next/navigation";
import { GoalDocScreen } from "../../../../_components/goal-doc-screen";
import { getGoal } from "../../../../_components/goals-data";
import { getCabinet } from "../../../../_config/cabinets";

/** Документ внутри цели: без статуса → простая страница; требует участия →
 *  подписание с чатом → готовый; согласованный/созданный договор → страница
 *  договора (переиспользует партнёрский флоу через RegFlow). */
export default async function Page({ params }: { params: Promise<{ company: string; id: string; docId: string }> }) {
  const { company, id, docId } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const goal = getGoal(id);
  if (!goal) notFound();
  return <GoalDocScreen goal={goal} cabinet={cabinet} docId={docId} />;
}
