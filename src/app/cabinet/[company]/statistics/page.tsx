import { notFound } from "next/navigation";
import { StatisticsScreen } from "../_components/statistics-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «Статистика» (Figma 7021:616815). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "statistics")) notFound();
  return <StatisticsScreen cabinet={cabinet} />;
}
