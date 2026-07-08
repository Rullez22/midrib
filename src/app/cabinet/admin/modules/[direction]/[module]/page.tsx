import { AdminModuleAppScreen } from "../../../_components/admin-module-app-screen";

/** Детальная страница модуля-приложения (Figma 6442:342448 «Приложение Банк»). */
const TITLES: Record<string, string> = {
  bank: "Приложение Банк",
  social: "Социальные проекты",
  consultant: "Консультант",
  executor: "Исполнитель",
};

export default async function AdminModuleAppPage({
  params,
}: {
  params: Promise<{ direction: string; module: string }>;
}) {
  const { direction, module } = await params;
  return (
    <AdminModuleAppScreen
      title={TITLES[module] ?? "Приложение"}
      connectHref={`/cabinet/admin/modules/${direction}/${module}/connect`}
    />
  );
}
