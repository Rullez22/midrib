import { notFound } from "next/navigation";
import { OrgDetailScreen } from "../../_components/org-detail-screen";
import { getOrg, ORGS } from "../../_components/partners-data";

/** Детальный экран организации-партнёра (Figma 6760-461737 / 467001 / 500491). */
export function generateStaticParams() {
  return ORGS.map((o) => ({ id: o.id }));
}

export default async function CabinetOrgPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = getOrg(id);
  if (!org) notFound();
  return <OrgDetailScreen org={org} />;
}
