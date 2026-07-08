import { Suspense } from "react";
import { DocumentExternalFlow } from "../_components/document-external-flow";

/**
 * Флоу создания документа по сторонним шаблонам (Figma 6419:315570 …). Открывается
 * из «Добавление нового документа» → «Сторонние шаблоны», либо возобновляется по
 * клику на плашку документа в табе «Документооборот» счёта (?resume=1).
 *
 * Suspense — требование Next для useSearchParams (чтение ?resume во флоу).
 */
export default function DocumentExternalPage() {
  return (
    <Suspense>
      <DocumentExternalFlow />
    </Suspense>
  );
}
