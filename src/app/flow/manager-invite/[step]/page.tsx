import Link from "next/link";
import { notFound } from "next/navigation";
import { NavHubPage, LauncherCard } from "@/components/ds";
import { AppShell } from "../_components/app-shell";
import { ReferralScreen, type ReferralState } from "../_components/referral-screen";
import { ProfileScreen } from "../_components/profile-screen";
import { FlowNav } from "../_components/flow-nav";

/**
 * Флоу «Приглашение менеджера компании» (Компания не создана).
 * Источник: Figma «партнёрская программа» — 15 экранов (S1–S15).
 * Динамический роут: /flow/manager-invite/1..15.
 *
 * Меню «/company-not-created» ведёт на: Ввод данных→1, выбор типа организации→7,
 * Отправка приглашения→10, Приглашение отправлено→13.
 */

const TOTAL = 15;
const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
const step = (n: number) => `/flow/manager-invite/${n}`;

export function generateStaticParams() {
  return Array.from({ length: TOTAL }, (_, i) => ({ step: String(i + 1) }));
}

const REFERRAL: Record<number, ReferralState> = {
  2: { expanded: false, activeTab: "waiting", rows: [], expandHref: step(3) },
  3: { expanded: true, interactive: true, activeTab: "waiting", rows: [], collapseHref: step(2), submitHref: step(7) },
  4: { expanded: true, walletValue: ADDR, orgValue: "Immatra", agreed: true, submit: "enabled", submitHref: step(5), collapseHref: step(2) },
  5: { expanded: true, walletAsDropdown: true, walletValue: ADDR, orgValue: "Immatra", agreed: true, submit: "loading", collapseHref: step(2) },
  6: { expanded: true, partnerAddress: ADDR, walletAsDropdown: true, walletValue: ADDR, orgValue: "Immatra", agreed: true, submit: "loading", collapseHref: step(2) },
  13: { expanded: true, interactive: true, activeTab: "waiting", rows: [{ name: "Immatra", address: ADDR }], collapseHref: step(2), rowHref: step(7) },
  14: { expanded: true, interactive: true, activeTab: "invited", rows: [{ name: "Конобу", address: ADDR }], collapseHref: step(2), rowHref: step(7) },
  15: { expanded: false, interactive: true, activeTab: "waiting", rows: [{ name: "Immatra", address: ADDR }], expandHref: step(3), rowHref: step(7) },
};

const PROFILE: Record<number, { stage: 1 | 2 | 3 | 4 | 5 | 6; interactive?: boolean; actionHref?: string }> = {
  7: { stage: 1, interactive: true, actionHref: step(11) },
  8: { stage: 2 },
  9: { stage: 3 },
  10: { stage: 4, actionHref: step(11) },
  11: { stage: 5, actionHref: step(12) },
  12: { stage: 6, actionHref: step(13) },
};

export default async function FlowStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL) notFound();

  // S1 — интро (каркас NavHub, без app-shell)
  if (n === 1) {
    return (
      <>
        <NavHubPage title="Приглашающая компания" backHref="/company-not-created">
          <div className="mx-auto w-full max-w-[480px]">
            <LauncherCard
              title="Приглашающий менеджер компании"
              subtitle="Приглашающая компания несет ответственность за приглашенного. В целях безопасности приглашающая компания приглашает другую компанию."
              className="items-center text-center"
              footer={
                <Link href={step(2)} className="ds-btn ds-btn--m ds-btn--secondary mx-auto">
                  <span className="ds-btn__label">Начать</span>
                </Link>
              }
            />
          </div>
        </NavHubPage>
        <FlowNav step={n} total={TOTAL} />
      </>
    );
  }

  const referral = REFERRAL[n];
  const profile = PROFILE[n];

  return (
    <>
      <AppShell>
        {referral ? (
          <ReferralScreen state={referral} />
        ) : profile ? (
          <ProfileScreen stage={profile.stage} interactive={profile.interactive} actionHref={profile.actionHref} />
        ) : null}
      </AppShell>
      <FlowNav step={n} total={TOTAL} />
    </>
  );
}
