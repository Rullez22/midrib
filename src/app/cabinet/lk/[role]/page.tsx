import { notFound } from "next/navigation";
import { LkScreen } from "../_components/lk-screen";
import { LK_ROLES } from "../_components/lk-data";

/**
 * Личный кабинет пользователя (ЛК). Открывается кликом по профилю-футеру внизу
 * сайдбара кабинета подразделения. Мои роли — один и тот же профиль, разные URL:
 *   /cabinet/lk/chair — председатель правления
 *   /cabinet/lk/payer — пайщик
 * Различие только в списке чатов справа (Figma 1857:649798 / 1857:649802).
 * Остальные слаги — люди из коллектива подразделения (помощник, члены совета,
 * пред. правления кабинетов 2–7); их страницы открываются как чужие.
 * ?from=<слаг подразделения> — откуда открыли: задаёт палитру страницы.
 */
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
  return <LkScreen role={role} from={from} />;
}
