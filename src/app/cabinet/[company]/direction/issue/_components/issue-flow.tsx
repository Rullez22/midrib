import { notFound } from "next/navigation";
import { getCabinet } from "../../../_config/cabinets";
import { CompanySidebar } from "../../../_components/company-sidebar";
import { AgreementIntroScreen } from "../../../../../flow/company-create/_components/agreement-intro-screen";
import { RegistrationSetupScreen } from "../../../../../flow/company-create/_components/registration-setup-screen";
import { RegistrationFormScreen } from "../../../../../flow/company-create/_components/registration-form-screen";
import { BasisEditorScreen } from "../../../../../flow/company-create/_components/basis-editor-screen";
import { DocumentsScreen } from "../../../../../flow/company-create/_components/documents-screen";
import { BalanceScreen } from "../../../../../flow/company-create/_components/balance-screen";
import { DiplomaCycleScreen } from "./diploma-cycle-screen";

/**
 * Общий рендерер под-флоу раздела «Направление» (ВУЗы). Два вида:
 *  - "diploma"   — «Выдача диплома»: все основания на форме (роут …/direction/issue/N).
 *  - "additions" — «Внести дополнения»: одно основание (роут …/direction/issue/additions/N).
 * Различие — только `singleBasis` на экране формы; остальные экраны общие.
 *
 * Экраны — реюз company-create с пробросом VUZ-сайдбара; финал — DiplomaCycleScreen.
 */

export type IssueKind = "diploma" | "additions";

export const ISSUE_TOTAL = 7;

export function renderIssueStep({
  company,
  kind,
  raw,
}: {
  company: string;
  kind: IssueKind;
  raw: string;
}) {
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  // Под-флоу есть только у кабинетов с разделом «Направление» (ВУЗы).
  if (!cabinet.menu.some((m) => m.path === "direction")) notFound();

  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > ISSUE_TOTAL) notFound();

  const base = `/cabinet/${cabinet.slug}/direction`;
  const root = kind === "additions" ? `${base}/issue/additions` : `${base}/issue`;
  const step = (i: number) => `${root}/${i}`;
  const sidebar = <CompanySidebar cabinet={cabinet} current="direction" />;
  // «Начать» на финале → страница соответствующего пункта меню (diploma/additions).
  const finalHref = `/cabinet/${cabinet.slug}/${kind}`;

  if (n === 1)
    return <AgreementIntroScreen sidebar={sidebar} backHref={base} startHref={step(2)} />;
  if (n === 2)
    return <RegistrationSetupScreen sidebar={sidebar} backHref={step(1)} saveHref={step(3)} />;
  if (n === 3)
    return (
      <RegistrationFormScreen
        sidebar={sidebar}
        singleBasis={kind === "additions"}
        backHref={step(2)}
        editorHref={step(4)}
        docsHref={step(5)}
        publishHref={step(6)}
      />
    );
  if (n === 4) return <BasisEditorScreen sidebar={sidebar} backHref={step(3)} />;
  if (n === 5) return <DocumentsScreen sidebar={sidebar} backHref={step(3)} />;
  if (n === 6) return <BalanceScreen sidebar={sidebar} backHref={step(3)} nextHref={step(7)} />;
  return (
    <DiplomaCycleScreen sidebar={sidebar} backHref={step(6)} startHref={finalHref} unlockKey={kind} />
  );
}
