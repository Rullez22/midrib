import { notFound } from "next/navigation";
import { ContractCreateScreen } from "../../../../partners/_components/contract-create-screen";
import { getGoal, goalAsOrg } from "../../../_components/goals-data";
import { getCabinet } from "../../../_config/cabinets";
import { type DocKind } from "../../../../../flow/company-create/_components/reg-flow";

/** Форма создания договора внутри цели — переиспользует партнёрский флоу. */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ company: string; id: string }>;
  searchParams: Promise<{ kind?: string; edit?: string }>;
}) {
  const { company, id } = await params;
  const { edit } = await searchParams;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const goal = getGoal(id);
  if (!goal) notFound();
  // Договор внутри цели всегда вид «goalcontract» (2 tx фонда → подпись исполнителя).
  const kind: DocKind = "goalcontract";
  return (
    <ContractCreateScreen
      org={goalAsOrg(goal)}
      cabinet={cabinet}
      kind={kind}
      editId={edit}
      basePath={`/cabinet/${cabinet.slug}/goals/${goal.id}`}
      sidebarCurrent="goals"
    />
  );
}
