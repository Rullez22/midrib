import { notFound } from "next/navigation";
import { GoalsScreen } from "../_components/goals-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «Цели» (Figma 7021:585703). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "goals")) notFound();
  return <GoalsScreen cabinet={cabinet} />;
}
