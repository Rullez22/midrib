import { notFound } from "next/navigation";
import { PartnerDetailScreen } from "../_components/partner-detail-screen";
import { getPartner, PARTNERS } from "../_components/partners-data";

/** Статическая генерация маршрутов партнёров. */
export function generateStaticParams() {
  return PARTNERS.map((p) => ({ id: p.id }));
}

export default async function CabinetPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = getPartner(id);
  if (!partner) notFound();
  return <PartnerDetailScreen partner={partner} />;
}
