import { Suspense } from "react";
import { DocumentTemplateFlow } from "../_components/document-template-flow";

/**
 * Флоу создания документа по шаблону компании (Figma 6419:313880 …). Открывается
 * из «Добавление нового документа» → «Шаблоны компании», либо возобновляется по
 * клику на плашку документа в табе «Документооборот» счёта (?resume=1).
 *
 * Suspense — требование Next для useSearchParams (чтение ?resume во флоу).
 */
export default function DocumentCreatePage() {
  return (
    <Suspense>
      <DocumentTemplateFlow />
    </Suspense>
  );
}
