import { notFound } from "next/navigation";
import { LkAccountScreen } from "../../_components/lk-account-screen";
import { LkSidebar } from "../../_components/lk-sidebar";
import { PartnerAccount } from "../../../partners/_components/partner-account";
import { LK_ROLES, isSelfRole } from "../../_components/lk-data";

/** «Лицевой счёт» личного кабинета (Figma 1857:649778/649786/649794).
 *  ЛК-маршрут /cabinet/lk/[role]/account. На чужой странице (помощник, члены
 *  совета, пред. правления кабинетов 2–7) счёт — копия «Счёта» партнёра
 *  (PartnerAccount) в каркасе ЛК-сайдбара, как было у помощника. */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { role } = await params;
  const { from } = await searchParams;
  if (!LK_ROLES[role]) notFound();

  if (!isSelfRole(role)) {
    return (
      <div className="flex min-h-screen bg-background">
        <LkSidebar role={role} current="accounts" from={from} />
        <main className="min-w-0 flex-1 px-5 pb-8 pt-2 md:px-[50px]">
          <PartnerAccount />
        </main>
      </div>
    );
  }

  return <LkAccountScreen role={role} />;
}
