"use client";

import { ServiceScanScreen } from "@/components/app/service-scan-screen";

/**
 * Кейс 1 «Сервис запрашивает доступ» — сканирование штрихкода сервиса.
 * Источник: Figma 7009:573601 → 7009:573628.
 */
export default function ScanServicePage() {
  return <ServiceScanScreen grantHref="/app/qr/1/grant" />;
}
