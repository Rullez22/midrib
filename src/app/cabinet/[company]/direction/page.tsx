import { notFound } from "next/navigation";
import { CabinetDirectionScreen } from "../_components/cabinet-direction-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «direction» — «Выберите нужное направление» (Figma 6970:552030). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "direction");
  if (!item) notFound();
  return <CabinetDirectionScreen cabinet={cabinet} current={item.key} />;
}
