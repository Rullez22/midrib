import { AdminModulesScreen } from "../_components/admin-modules-screen";

/** Админка → «Модули». ?tab=shop открывает вкладку «Магазин» (возврат из направления). */
export default async function AdminModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <AdminModulesScreen initialTab={tab === "shop" ? "shop" : "apps"} />;
}
