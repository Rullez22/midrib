import { DocumentDetailScreen } from "../_components/document-detail-screen";

/**
 * Детальный экран документа целевого счёта (открывается из таба
 * «Документооборот»). Figma node 6419:315630 / 6419:314679.
 */
export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentDetailScreen id={id} />;
}
