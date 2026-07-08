import { notFound } from "next/navigation";
import { OrgContractScreen } from "../../../../../../partners/_components/org-contract-screen";
import { CreatedContractScreen } from "../../../../../../partners/_components/created-contract-screen";
import { PartnerDocScreen } from "../../../../../../partners/_components/partner-doc-screen";
import { CultureDocScreen } from "../../../../../../partners/_components/culture-doc-screen";
import { getOrg, VELESTA_CONTRACT } from "../../../../../../partners/_components/partners-data";
import { getCabinet } from "../../../../../_config/cabinets";

/** Детальный экран документа партнёра. Три вида:
 *  - velesta-nvo — заготовленный флоу-договор (OrgContractScreen);
 *  - created-*   — созданный через «Добавить документ» (CreatedContractScreen, RegFlow);
 *  - orgdoc-<i>  — «обычный» согласованный документ из org.docs (PartnerDocScreen). */
export default async function Page({ params }: { params: Promise<{ company: string; id: string; docId: string }> }) {
  const { company, id, docId } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const org = getOrg(id);
  if (!org) notFound();

  if (docId === VELESTA_CONTRACT.id) {
    return <OrgContractScreen org={org} contract={VELESTA_CONTRACT} cabinet={cabinet} />;
  }
  if (docId.startsWith("orgdoc-")) {
    const idx = Number(docId.slice("orgdoc-".length));
    const doc = org.docs[idx];
    if (!doc) notFound();
    // Исключение: «Живу с Культурой» / Договор №1 → флоу «Оценка и закрытие».
    if (org.id === "culture" && doc.name === "Договор №1") {
      return <CultureDocScreen org={org} doc={doc} docId={docId} cabinet={cabinet} />;
    }
    return <PartnerDocScreen org={org} doc={doc} docId={docId} cabinet={cabinet} />;
  }
  return <CreatedContractScreen org={org} contractId={docId} cabinet={cabinet} />;
}
