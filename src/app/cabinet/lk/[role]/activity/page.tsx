import { notFound } from "next/navigation";
import { LkActivityScreen } from "../../_components/lk-activity-screen";
import { type LkRole } from "../../_components/lk-data";

/** «Деятельность» личного кабинета — структура роли (Figma 1857:649427 / 649758).
 *  ЛК-маршрут /cabinet/lk/[role]/activity (не подразделение). */
const ROLES: LkRole[] = ["chair", "payer", "assistant"];

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!ROLES.includes(role as LkRole)) notFound();
  return <LkActivityScreen role={role as LkRole} />;
}
