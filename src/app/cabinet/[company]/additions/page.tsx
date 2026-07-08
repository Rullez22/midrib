import { notFound } from "next/navigation";
import { getCabinet } from "../_config/cabinets";
import { CompanySidebar } from "../_components/company-sidebar";
import { QrScanScreen } from "../_components/qr-scan-screen";

/** Под-раздел кабинета «Дополнения» (ВУЗы) — экран «Считывание QR-кода».
 *  Источник Figma 6970:556185. Открывается после флоу дополнений (кнопка «Начать»). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "additions");
  if (!item) notFound();
  return (
    <QrScanScreen
      sidebar={<CompanySidebar cabinet={cabinet} current={item.key} />}
      backHref={`/cabinet/${cabinet.slug}/direction`}
      subtitle="Для запроса совершения у пользователя документов на внесение дополнения предоставьте ему считать данный штрих-код"
    />
  );
}
