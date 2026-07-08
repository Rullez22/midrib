import { notFound } from "next/navigation";
import { CabinetRegistrationsScreen } from "../_components/cabinet-registrations-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «registrations» — «Регистрации» (Веб-ресурс, кабинет №3). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "registrations");
  if (!item) notFound();
  return <CabinetRegistrationsScreen cabinet={cabinet} current={item.key} />;
}
