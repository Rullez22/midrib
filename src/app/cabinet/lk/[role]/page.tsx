import { notFound } from "next/navigation";
import { LkScreen } from "../_components/lk-screen";
import { type LkRole } from "../_components/lk-data";

/**
 * Личный кабинет пользователя (ЛК). Открывается кликом по профилю-футеру внизу
 * сайдбара кабинета подразделения. Две роли — один и тот же профиль, разные URL:
 *   /cabinet/lk/chair — председатель правления
 *   /cabinet/lk/payer — пайщик
 * Различие только в списке чатов справа (Figma 1857:649798 / 1857:649802).
 */
const ROLES: LkRole[] = ["chair", "payer", "assistant"];

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!ROLES.includes(role as LkRole)) notFound();
  return <LkScreen role={role as LkRole} />;
}
