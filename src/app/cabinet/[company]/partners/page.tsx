import { notFound } from "next/navigation";
import { PartnersListScreen } from "../../partners/_components/partners-list-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «Партнёры» (Figma 6760-461828 / 462037 / 462553). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  if (!cabinet.menu.some((m) => m.path === "partners")) notFound();
  return <PartnersListScreen cabinet={cabinet} />;
}
