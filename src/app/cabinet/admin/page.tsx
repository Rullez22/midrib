import { AdminReferralScreen } from "./_components/admin-referral-screen";

const ADDR = "0xca30e63200a0fe3182dc61fc5605efc41456f32";

/** Админка → «Реферальная» (Партнёрская программа). Открывается по «Admin» в рейке.
 *  Figma 6442:341406 / 341517 / 341500. ?pending=coop — автономный кооператив на
 *  согласовании (таб «Ожидают допуска» → «Подробнее» открывает ready, Figma 6442:342950). */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const { pending } = await searchParams;
  if (pending === "coop") {
    return (
      <AdminReferralScreen
        state={{
          expanded: true,
          interactive: true,
          activeTab: "waiting",
          waitingLabel: "Ожидают допуска",
          rows: [{ name: "Immatra", address: ADDR, status: "Доступ запрошен" }],
          submitHref: "/cabinet/admin/invite/1",
          rowHref: "/cabinet/admin/coop-ready",
        }}
      />
    );
  }
  return <AdminReferralScreen />;
}
