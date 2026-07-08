import { AdminModuleDirectionScreen } from "../../_components/admin-module-direction-screen";
import { directionTitle } from "../../_components/admin-modules-data";

/** Направление в Магазине модулей → карточки под-модулей (Figma 6442:342320). */
export default async function AdminModuleDirectionPage({
  params,
}: {
  params: Promise<{ direction: string }>;
}) {
  const { direction } = await params;
  return <AdminModuleDirectionScreen slug={direction} title={directionTitle(direction)} />;
}
