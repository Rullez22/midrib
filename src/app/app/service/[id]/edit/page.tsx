"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ManageAccessDialog } from "@/components/app/manage-access-dialog";

/**
 * Диалог перед редактированием доступа (Figma 7009:573376).
 * «Отмена» → выходим в список. «Редактировать» → экран полей доступа.
 */
export default function ServiceEditIntroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <ManageAccessDialog
      title="Управление доступом"
      body="При редактировании доступа, некоторые фукнции сервиса могут оказаться недоступны"
      footnote={
        <>
          *Нажимая кнопку «Редактировать», Вы подтверждаете, что ознакомлены с
          условиями Соглашения об обработке персональных данных PayPal о
          прекращении доступа к ПД по желанию Пользователя.
        </>
      }
      primaryLabel="Редактировать"
      secondaryLabel="Отмена"
      onPrimary={() => router.push(`/app/service/${id}/edit/fields`)}
      onSecondary={() => router.push("/app")}
      onClose={() => router.back()}
    />
  );
}
