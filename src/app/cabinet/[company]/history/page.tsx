import { notFound } from "next/navigation";
import { getCabinet } from "../_config/cabinets";
import { HistoryOperationsScreen } from "../_components/history-operations-screen";

/** Под-раздел кабинета «История операций» (ВУЗы) — обработанные документы.
 *  Источник Figma 6970:551336 / 6970:551560. Reuse валидаторского «Обработанные» + DS. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "history");
  if (!item) notFound();
  return <HistoryOperationsScreen cabinet={cabinet} current={item.key} />;
}
