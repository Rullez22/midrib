import { notFound } from "next/navigation";
import { ValidatorTemplatesScreen } from "../_components/validator-templates-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «templates» — «Шаблоны» валидатора. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "templates");
  if (!item) notFound();
  return <ValidatorTemplatesScreen cabinet={cabinet} current={item.key} />;
}
