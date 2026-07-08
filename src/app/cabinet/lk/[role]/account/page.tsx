import { notFound } from "next/navigation";
import { LkAccountScreen } from "../../_components/lk-account-screen";
import { LkSidebar } from "../../_components/lk-sidebar";
import { PartnerAccount } from "../../../partners/_components/partner-account";
import { type LkRole } from "../../_components/lk-data";

/** «Лицевой счёт» личного кабинета (Figma 1857:649778/649786/649794).
 *  ЛК-маршрут /cabinet/lk/[role]/account. Для помощника пред. правления счёт —
 *  это копия «Счёта» партнёра (PartnerAccount) в каркасе ЛК-сайдбара. */
const ROLES: LkRole[] = ["chair", "payer", "assistant"];

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!ROLES.includes(role as LkRole)) notFound();

  if (role === "assistant") {
    return (
      <div className="flex min-h-screen bg-background">
        <LkSidebar role="assistant" current="accounts" />
        <main className="min-w-0 flex-1 px-5 pb-8 pt-2 md:px-[50px]">
          <PartnerAccount />
        </main>
      </div>
    );
  }

  return <LkAccountScreen role={role as LkRole} />;
}
