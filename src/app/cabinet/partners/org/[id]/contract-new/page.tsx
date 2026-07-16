import { notFound } from "next/navigation";
import { ContractCreateScreen } from "@/app/cabinet/partners/_components/contract-create-screen";
import { getOrg } from "@/app/cabinet/partners/_components/partners-data";
import { type DocKind } from "@/app/flow/company-create/_components/reg-flow";

/** Форма создания документа партнёра в общем кабинете кооператива (без company-slug).
 *  ?kind=contract|invoice|act · ?parent=<docId> (вложенный) · ?edit=<docId> (правка). */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string; parent?: string; edit?: string }>;
}) {
  const { id } = await params;
  const { kind: kindParam, parent, edit } = await searchParams;
  const org = getOrg(id);
  if (!org) notFound();
  const kind: DocKind = kindParam === "invoice" || kindParam === "act" ? kindParam : "contract";
  return <ContractCreateScreen org={org} kind={kind} parentId={parent ?? null} editId={edit} />;
}
