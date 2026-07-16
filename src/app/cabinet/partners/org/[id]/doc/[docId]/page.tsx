import { notFound } from "next/navigation";
import { OrgContractScreen } from "@/app/cabinet/partners/_components/org-contract-screen";
import { CreatedContractScreen } from "@/app/cabinet/partners/_components/created-contract-screen";
import { PartnerDocScreen } from "@/app/cabinet/partners/_components/partner-doc-screen";
import { CultureDocScreen } from "@/app/cabinet/partners/_components/culture-doc-screen";
import { getOrg, VELESTA_CONTRACT } from "@/app/cabinet/partners/_components/partners-data";

/** Детальный экран документа партнёра в общем кабинете кооператива (без company-slug).
 *  Три вида:
 *  - velesta-nvo — заготовленный флоу-договор (OrgContractScreen);
 *  - created-*   — созданный через «Добавить документ» (CreatedContractScreen, RegFlow);
 *  - orgdoc-<i>  — «обычный» согласованный документ из org.docs (PartnerDocScreen). */
export default async function Page({ params }: { params: Promise<{ id: string; docId: string }> }) {
  const { id, docId } = await params;
  const org = getOrg(id);
  if (!org) notFound();

  if (docId === VELESTA_CONTRACT.id) {
    return <OrgContractScreen org={org} contract={VELESTA_CONTRACT} />;
  }
  if (docId.startsWith("orgdoc-")) {
    const idx = Number(docId.slice("orgdoc-".length));
    const doc = org.docs[idx];
    if (!doc) notFound();
    // Исключение: «Живу с Культурой» / «Договор на организацию выставки» →
    // флоу «Оценка и закрытие».
    if (org.id === "culture" && doc.name === "Договор на организацию выставки") {
      return <CultureDocScreen org={org} doc={doc} docId={docId} />;
    }
    return <PartnerDocScreen org={org} doc={doc} docId={docId} />;
  }
  return <CreatedContractScreen org={org} contractId={docId} />;
}
