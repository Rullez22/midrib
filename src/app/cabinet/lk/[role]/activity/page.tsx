import { notFound } from "next/navigation";
import { LkActivityScreen } from "../../_components/lk-activity-screen";
import { LK_ROLES } from "../../_components/lk-data";

/** «Деятельность» личного кабинета — структура роли (Figma 1857:649427 / 649758).
 *  ЛК-маршрут /cabinet/lk/[role]/activity (не подразделение). Слаг — моя роль
 *  либо человек из коллектива подразделения; ?from=<слаг подразделения> задаёт
 *  палитру страницы и возврат по квадратику. */
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
  return <LkActivityScreen role={role} from={from} />;
}
