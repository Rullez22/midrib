import { notFound } from "next/navigation";
import { getCabinet } from "../_config/cabinets";
import { CompanySidebar } from "../_components/company-sidebar";
import { QrScanScreen } from "../_components/qr-scan-screen";

/** Под-раздел кабинета «Выдача диплома» (ВУЗы) — экран «Считывание QR-кода».
 *  Источник Figma 6970:556049. Открывается после флоу выдачи (кнопка «Начать»). */
export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const cabinet = getCabinet(company);
  if (!cabinet) notFound();
  const item = cabinet.menu.find((m) => m.path === "diploma");
  if (!item) notFound();
  return (
    <QrScanScreen
      sidebar={<CompanySidebar cabinet={cabinet} current={item.key} />}
      backHref={`/cabinet/${cabinet.slug}/direction`}
      subtitle="Для выдачи диплома попросите пользователя считать данный штрих-код"
    />
  );
}
