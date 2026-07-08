import { notFound } from "next/navigation";
import { ValidatorZayavkiScreen } from "../_components/validator-zayavki-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «zayavki» — «Заявки» валидатора (кабинет №2). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "zayavki");
  if (!item) notFound();
  return <ValidatorZayavkiScreen cabinet={cabinet} current={item.key} />;
}
