import { notFound } from "next/navigation";
import { CompanyMainScreen } from "./_components/company-main-screen";
import { getCabinet } from "./_config/cabinets";

/**
 * Главный экран кабинета 2–7 — профиль подразделения + чат. Slug определяет
 * компанию (validator/web/domains/executor/regulator/vuz). Неизвестный slug → 404.
 */
export default async function CompanyCabinetPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  return <CompanyMainScreen cabinet={cabinet} />;
}
