import { notFound } from "next/navigation";
import { CabinetRegistersScreen } from "../_components/cabinet-registers-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «servisy» — «Сервисы» (реестр запросов ПД, 3 вкладки).
 *  Перенесено из «Реестры» (кабинет №4 Домены) в кабинет №6 Регулятор.
 *  Figma: 6827-544875 / 6820-554901 / 6820-554915. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "servisy");
  if (!item) notFound();
  return <CabinetRegistersScreen cabinet={cabinet} current={item.key} />;
}
