import { notFound } from "next/navigation";
import { VotingRolesScreen } from "../../../voting/_components/voting-roles-screen";
import { LkSidebar } from "../../_components/lk-sidebar";
import { type LkRole } from "../../_components/lk-data";

/** «Вопросы голосования» личного кабинета (Figma 1857:649899/649902). Та же
 *  страница, что в подразделении (VotingRolesScreen), но compact: только фильтр-
 *  табы + список вопросов, с сайдбаром ЛК. Только свои роли (chair/payer): на
 *  чужой странице голосований нет — этого пункта нет и в её меню. */
const ROLES: LkRole[] = ["chair", "payer"];

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!ROLES.includes(role)) notFound();
  return <VotingRolesScreen compact sidebar={<LkSidebar role={role} current="voting" />} />;
}
