import Link from "next/link";
import { notFound } from "next/navigation";
import { NavHubPage, LauncherCard } from "@/components/ds";
import { AuthScreen } from "../_components/auth-screen";
import { OrgSelectScreen } from "../_components/org-select-screen";
import { CompanyProfileScreen } from "../_components/company-profile-screen";
import { PaishikiScreen } from "../_components/paishiki-screen";
import { AgreementIntroScreen } from "../_components/agreement-intro-screen";
import { RegistrationSetupScreen } from "../_components/registration-setup-screen";
import { RegistrationFormScreen } from "../_components/registration-form-screen";
import { BasisEditorScreen } from "../_components/basis-editor-screen";
import { DocumentsScreen } from "../_components/documents-screen";
import { BalanceScreen } from "../_components/balance-screen";
import { ScriptScreen } from "../_components/script-screen";
import { PublishedFormScreen } from "../_components/published-form-screen";
import { BasisDetailScreen } from "../_components/basis-detail-screen";
import { PpListScreen } from "../_components/pp-list-screen";
import { PpDetailScreen } from "../_components/pp-detail-screen";
import { ActivityScreen } from "../_components/activity-screen";
import { VotingQuestionsScreen } from "../_components/voting-questions-screen";
import { CouncilVotingScreen } from "../_components/council-voting-screen";
import { AccountsScreen } from "../_components/accounts-screen";
import { AccountSettingsScreen } from "../_components/account-settings-screen";
import { AccountVotingScreen } from "../_components/account-voting-screen";
import { PodschetIntroScreen } from "../_components/podschet-intro-screen";
import { PodschetCreateScreen } from "../_components/podschet-create-screen";
import { PodschetVotingScreen } from "../_components/podschet-voting-screen";
import { ValidationVotingScreen } from "../_components/validation-voting-screen";
import { ValidatorChatScreen } from "../_components/validator-chat-screen";
import { FinalAccountsScreen } from "../_components/final-accounts-screen";

/**
 * Флоу «Создание компании» (Представитель компании).
 * Источник: Figma — 2478:274792 (интро), 2477:274229/2478:274683 (авторизация),
 * 2477:274452 (выбор организации), 2295:207316 (профиль компании),
 * 2422:348051 (пайщики), 2671:398056 (интро соглашения),
 * 2671:398098 (настройка формы регистрации), 2671:398111 (форма регистрации),
 * 2671:398664 (редактор основания), 288:643 (выбор документов),
 * 2671:398250 (баланс аккаунта), 2671:398272 (скрипт формы регистрации),
 * 2671:398342/398404 (опубликованная форма), 2671:398795/398809 (деталь основания),
 * 2671:398887 (список ПС), 2671:398356… (деталь ПС с табами),
 * 2301:214315 (профиль кооператива — заполненный, view),
 * 2468:280470 (Деятельность — структура).
 * Роут: /flow/company-create/1..18.
 */

const TOTAL = 29;
const step = (n: number) => `/flow/company-create/${n}`;

export function generateStaticParams() {
  return Array.from({ length: TOTAL }, (_, i) => ({ step: String(i + 1) }));
}

export default async function CompanyCreateStep({
  params,
  searchParams,
}: {
  params: Promise<{ step: string }>;
  searchParams?: Promise<{ stage?: string }>;
}) {
  const { step: raw } = await params;
  const sp = (await searchParams) ?? {};
  const seedStage = sp.stage != null ? Number(sp.stage) : undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL) notFound();

  if (n === 1) {
    return (
      <NavHubPage title="Приглашённая компания" backHref="/company-not-created">
        <div className="mx-auto w-full max-w-[480px]">
          <LauncherCard
            title="Представитель приглашённой компании"
            subtitle="Для полноценного функционирования компании необходима целостная структура, включающая как сотрудников, так и различные подразделения."
            className="items-center text-center"
            footer={
              <Link href={step(2)} className="ds-btn ds-btn--m ds-btn--secondary mx-auto">
                <span className="ds-btn__label">Начать</span>
              </Link>
            }
          />
        </div>
      </NavHubPage>
    );
  }

  if (n === 2) return <AuthScreen nextHref={step(3)} />;
  if (n === 3) return <OrgSelectScreen selectHref={step(4)} />;
  if (n === 4) return <CompanyProfileScreen paishikiHref={step(5)} />;
  if (n === 5)
    return (
      <PaishikiScreen agreementHref={step(6)} ppListHref={step(15)} />
    );
  if (n === 6) return <AgreementIntroScreen backHref={step(5)} startHref={step(7)} />;
  if (n === 7) return <RegistrationSetupScreen backHref={step(6)} saveHref={step(8)} />;
  if (n === 8)
    return (
      <RegistrationFormScreen
        backHref={step(7)}
        editorHref={step(9)}
        docsHref={step(10)}
        publishHref={step(11)}
      />
    );
  if (n === 9) return <BasisEditorScreen backHref={step(8)} />;
  if (n === 10) return <DocumentsScreen backHref={step(8)} />;
  if (n === 11) return <BalanceScreen backHref={step(8)} nextHref={step(12)} />;
  if (n === 12) return <ScriptScreen backHref={step(11)} publishHref={step(13)} />;
  if (n === 13)
    return <PublishedFormScreen detailHref={step(14)} continueHref={step(5)} draftHref={step(16)} />;
  if (n === 14) return <BasisDetailScreen backHref={step(13)} />;
  if (n === 15) return <PpListScreen detailHref={step(16)} closeHref={step(5)} />;
  if (n === 16) return <PpDetailScreen backHref={step(15)} detailHref={step(14)} />;
  if (n === 17) return <CompanyProfileScreen view paishikiHref={step(5)} />;
  if (n === 18) return <ActivityScreen seedStage={seedStage} />;
  if (n === 19) return <VotingQuestionsScreen />;
  if (n === 20) return <CouncilVotingScreen backHref={step(19)} doneHref={step(18)} />;
  if (n === 21) return <AccountsScreen settingsHref={step(22)} createPodschetHref={step(24)} validationVoteHref={step(19)} validatorChatHref={step(28)} />;
  if (n === 22) return <AccountSettingsScreen backHref={step(21)} voteHref={step(19)} />;
  if (n === 23) return <AccountVotingScreen backHref={step(19)} doneHref={step(21)} />;
  if (n === 24) return <PodschetIntroScreen backHref={step(21)} continueHref={step(25)} />;
  if (n === 25) return <PodschetCreateScreen backHref={step(24)} voteHref={step(19)} />;
  if (n === 26) return <PodschetVotingScreen backHref={step(19)} doneHref={step(21)} />;
  if (n === 27) return <ValidationVotingScreen backHref={step(19)} doneHref={step(21)} />;
  if (n === 28) return <ValidatorChatScreen backHref={step(21)} finalHref={step(29)} />;
  return <FinalAccountsScreen createPodschetHref={step(24)} validatorChatHref={step(28)} />;
}
