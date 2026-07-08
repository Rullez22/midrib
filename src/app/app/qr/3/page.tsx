"use client";

import { ServiceScanScreen } from "@/components/app/service-scan-screen";

/**
 * Кейс 3 «ВУЗ запрашивает доступ для внесения дополнений в диплом» — скан.
 * Источник: Figma 7009:573787 → 7009:573708.
 */
export default function ScanAppendixPage() {
  return <ServiceScanScreen grantHref="/app/qr/3/grant" />;
}
