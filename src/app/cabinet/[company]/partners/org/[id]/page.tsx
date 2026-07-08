import { notFound } from "next/navigation";
import { OrgDetailScreen } from "../../../../partners/_components/org-detail-screen";
import { getOrg } from "../../../../partners/_components/partners-data";
import { getCabinet } from "../../../_config/cabinets";

/** Детальный экран организации-партнёра внутри кабинета (Figma 6760-461737 …). */
export default async function Page({ params }: { params: Promise<{ company: string; id: string }> }) {
  const { company, id } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const org = getOrg(id);
  if (!org) notFound();
  return <OrgDetailScreen org={org} cabinet={cabinet} />;
}
