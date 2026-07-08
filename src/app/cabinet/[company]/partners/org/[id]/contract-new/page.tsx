import { notFound } from "next/navigation";
import { ContractCreateScreen } from "../../../../../partners/_components/contract-create-screen";
import { getOrg } from "../../../../../partners/_components/partners-data";
import { getCabinet } from "../../../../_config/cabinets";
import { type DocKind } from "../../../../../../flow/company-create/_components/reg-flow";

/** Форма создания документа партнёра (договор / счёт / акт, Figma 466719/481947/496773).
 *  ?kind=contract|invoice|act · ?parent=<docId> (вложенный) · ?edit=<docId> (правка). */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ company: string; id: string }>;
  searchParams: Promise<{ kind?: string; parent?: string; edit?: string }>;
}) {
  const { company, id } = await params;
  const { kind: kindParam, parent, edit } = await searchParams;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const org = getOrg(id);
  if (!org) notFound();
  const kind: DocKind = kindParam === "invoice" || kindParam === "act" ? kindParam : "contract";
  return <ContractCreateScreen org={org} cabinet={cabinet} kind={kind} parentId={parent ?? null} editId={edit} />;
}
