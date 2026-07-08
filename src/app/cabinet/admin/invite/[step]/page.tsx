import { notFound } from "next/navigation";
import { AdminSidebar } from "../../_components/admin-sidebar";
import { AdminReferralContent, type AdminReferralState } from "../../_components/admin-referral-screen";
import { ProfileScreen } from "../../../../flow/manager-invite/_components/profile-screen";

/**
 * Флоу приглашения компании в реферальной (админка). 1:1 с приглашением
 * кооператива (manager-invite): реферальная со списком «Ожидают ответа» →
 * «Подробнее» → профиль устава (ProfileScreen, переиспользуется) → «Продолжить
 * работу» → назад к списку. Figma 6479:333373…342870.
 */
const TOTAL = 4;
const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";
const step = (n: number) => `/cabinet/admin/invite/${n}`;

export function generateStaticParams() {
  return Array.from({ length: TOTAL }, (_, i) => ({ step: String(i + 1) }));
}

// Реферальная: партнёр отправлен и ждёт ответа; «Подробнее» открывает профиль.
const REFERRAL: Record<number, AdminReferralState> = {
  1: {
    expanded: true,
    interactive: true,
    activeTab: "waiting",
    rows: [{ name: "Pepsi", address: ADDR, status: "Приглашение отправлено" }],
    submitHref: step(1),
    rowHref: step(2),
  },
};

// Профиль устава приглашённой компании (стадии заполнения → сводка → свёрнуто).
const PROFILE: Record<number, { stage: 1 | 5 | 6; interactive?: boolean; actionHref: string }> = {
  2: { stage: 1, interactive: true, actionHref: step(3) },
  3: { stage: 5, actionHref: step(4) },
  4: { stage: 6, actionHref: step(1) },
};

export default async function AdminInviteStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL) notFound();

  const referral = REFERRAL[n];
  const profile = PROFILE[n];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar current="referral" />
      <main className="min-w-0 flex-1">
        {referral ? (
          <AdminReferralContent state={referral} />
        ) : profile ? (
          <ProfileScreen stage={profile.stage} interactive={profile.interactive} actionHref={profile.actionHref} />
        ) : null}
      </main>
    </div>
  );
}
