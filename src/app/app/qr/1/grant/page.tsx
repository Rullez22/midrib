"use client";

import { useRouter } from "next/navigation";
import { AccessRequestScreen } from "@/components/app/access-request-screen";
import { useRegistrations } from "@/components/app/registrations-store";

/**
 * Кейс 1 — запрос доступа сервиса (Figma 7009:573389, режим grant).
 * «Отклонить» → доступ не выдан, возврат в список.
 * «Предоставить» → сервис Paypal добавляется в список регистраций, переход
 * на «Главную» (таб «Веб») уже с новой строкой.
 */
export default function GrantPaypalPage() {
  const router = useRouter();
  const { grant } = useRegistrations();

  return (
    <AccessRequestScreen
      serviceName="Pay Pal"
      mode="grant"
      onDecline={() => router.push("/app")}
      onSubmit={() => {
        grant({ id: "paypal", title: "Paypal", detailed: true });
        router.push("/app");
      }}
    />
  );
}
