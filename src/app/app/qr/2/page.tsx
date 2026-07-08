"use client";

import { ServiceScanScreen } from "@/components/app/service-scan-screen";

/**
 * Кейс 2 «ВУЗ запрашивает доступ для выдачи диплома» — скан штрихкода.
 * Источник: Figma 7009:573748 → 7009:573668.
 */
export default function ScanUniversityPage() {
  return <ServiceScanScreen grantHref="/app/qr/2/grant" />;
}
