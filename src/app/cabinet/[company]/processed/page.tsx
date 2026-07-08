import { notFound } from "next/navigation";
import { ValidatorProcessedScreen } from "../_components/validator-processed-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «processed» — «Обработанные» верификации валидатора. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "processed");
  if (!item) notFound();
  return <ValidatorProcessedScreen cabinet={cabinet} current={item.key} />;
}
