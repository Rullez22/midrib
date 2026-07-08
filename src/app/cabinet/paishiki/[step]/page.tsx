import { notFound } from "next/navigation";
import { AgreementIntroScreen } from "../../../flow/company-create/_components/agreement-intro-screen";
import { RegistrationSetupScreen } from "../../../flow/company-create/_components/registration-setup-screen";
import { RegistrationFormScreen } from "../../../flow/company-create/_components/registration-form-screen";
import { BasisEditorScreen } from "../../../flow/company-create/_components/basis-editor-screen";
import { DocumentsScreen } from "../../../flow/company-create/_components/documents-screen";
import { BalanceScreen } from "../../../flow/company-create/_components/balance-screen";
import { ScriptScreen } from "../../../flow/company-create/_components/script-screen";
import { PublishedFormScreen } from "../../../flow/company-create/_components/published-form-screen";
import { BasisDetailScreen } from "../../../flow/company-create/_components/basis-detail-screen";
import { PpListScreen } from "../../../flow/company-create/_components/pp-list-screen";
import { PpDetailScreen } from "../../../flow/company-create/_components/pp-detail-screen";
import { CABINET_ROUTES } from "../../_components/cabinet-seed";

/**
 * Подфлоу «Пользовательское соглашение / форма регистрации» внутри кабинета
 * (/cabinet/paishiki/[step]). Зеркало шагов 6–16 онбординга
 * (/flow/company-create/[step]), но с маршрутами CABINET_ROUTES в сайдбаре —
 * чтобы навигация оставалась внутри засиженного провайдера /cabinet, а не
 * прыгала в онбординг. Точки выхода (закрыть/назад к пайщикам) ведут на
 * /cabinet/paishiki (база раздела).
 *
 * Нумерация шагов сохранена 1:1 с онбордингом, чтобы экраны переиспользовались
 * без изменения внутренних ссылок (back/next), а карта переходов читалась рядом
 * с оригиналом из [step]/page.tsx.
 */

const STEPS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const;

/** sub(5) — база раздела (экран пайщиков); остальные — шаги подфлоу. */
const sub = (n: number) => (n === 5 ? "/cabinet/paishiki" : `/cabinet/paishiki/${n}`);

export function generateStaticParams() {
  return STEPS.map((n) => ({ step: String(n) }));
}

export default async function CabinetPaishikiStep({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || !STEPS.includes(n as (typeof STEPS)[number])) notFound();

  const R = CABINET_ROUTES;

  if (n === 6) return <AgreementIntroScreen backHref={sub(5)} startHref={sub(7)} routes={R} />;
  if (n === 7) return <RegistrationSetupScreen backHref={sub(6)} saveHref={sub(8)} routes={R} />;
  if (n === 8)
    return (
      <RegistrationFormScreen
        backHref={sub(7)}
        editorHref={sub(9)}
        docsHref={sub(10)}
        publishHref={sub(11)}
        routes={R}
      />
    );
  if (n === 9) return <BasisEditorScreen backHref={sub(8)} routes={R} />;
  if (n === 10) return <DocumentsScreen backHref={sub(8)} routes={R} />;
  if (n === 11) return <BalanceScreen backHref={sub(8)} nextHref={sub(12)} routes={R} />;
  if (n === 12) return <ScriptScreen backHref={sub(11)} publishHref={sub(13)} routes={R} />;
  if (n === 13)
    return <PublishedFormScreen detailHref={sub(14)} continueHref={sub(5)} draftHref={sub(16)} routes={R} />;
  if (n === 14) return <BasisDetailScreen backHref={sub(13)} routes={R} />;
  if (n === 15) return <PpListScreen detailHref={sub(16)} closeHref={sub(5)} routes={R} />;
  return <PpDetailScreen backHref={sub(15)} detailHref={sub(14)} routes={R} />;
}
