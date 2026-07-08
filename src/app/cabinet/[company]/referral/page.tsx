import { notFound } from "next/navigation";
import { ValidatorReferralScreen } from "../_components/validator-referral-screen";
import { getCabinet } from "../_config/cabinets";

/** Под-раздел кабинета «referral» — «Реферальные» доходы валидатора. */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "referral");
  if (!item) notFound();
  return <ValidatorReferralScreen cabinet={cabinet} current={item.key} />;
}
