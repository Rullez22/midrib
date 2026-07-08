"use client";

import { useRouter } from "next/navigation";
import { CabinetScreen } from "../../_components/cabinet-screen";

/**
 * Маркетинговый счёт (под-счёт целевого) — открывается по «Подробнее» у строки
 * «Маркетинговый счет» в подсчётах целевого счёта. Источник: Figma node
 * 2642:356140. Тот же экран, что и целевой счёт (CabinetScreen), но с заголовком
 * «Маркетинговый счет», кнопкой «назад» и первым под-табом «Адреса пула».
 */
export default function MarketingAccountPage() {
  const router = useRouter();
  return <CabinetScreen title="Маркетинговый счет" pool onBack={() => router.push("/cabinet")} />;
}
