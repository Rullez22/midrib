import { notFound } from "next/navigation";
import { LkActivityScreen } from "../../_components/lk-activity-screen";
import { LK_ROLES } from "../../_components/lk-data";

/** «Деятельность» личного кабинета — структура роли (Figma 1857:649427 / 649758).
 *  ЛК-маршрут /cabinet/lk/[role]/activity (не подразделение). Слаг — моя роль
 *  либо человек из коллектива подразделения. */
export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!LK_ROLES[role]) notFound();
  return <LkActivityScreen role={role} />;
}
