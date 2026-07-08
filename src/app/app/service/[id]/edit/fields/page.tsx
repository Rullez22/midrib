"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { AccessRequestScreen } from "@/components/app/access-request-screen";

/**
 * Редактирование полей доступа (Figma 7009:573389, режим edit).
 * Кнопка «Предоставить» одна на всю ширину и заблокирована, пока не снята
 * хотя бы одна галочка. По «Предоставить» → возврат в карточку сервиса.
 */
export default function ServiceEditFieldsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <AccessRequestScreen
      serviceName="Pay Pal"
      mode="edit"
      onSubmit={() => router.push(`/app/service/${id}`)}
    />
  );
}
