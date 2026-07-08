"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ManageAccessDialog } from "@/components/app/manage-access-dialog";
import { useRegistrations } from "@/components/app/registrations-store";

/**
 * Диалог закрытия доступа (Figma 7009:573362).
 * «Не отключать» → назад в карточку. «Отключить» → сервис помечается revoked,
 * переход на экран обработки запроса на удаление.
 */
export default function ServiceClosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { setStatus } = useRegistrations();

  return (
    <ManageAccessDialog
      title="Управление доступом"
      body={
        <>
          Если вы закроете доступ к своим данным для этой компании, доступ к ее
          услугам будет для вас закрыт.
          <br />
          <br />
          После закрытия доступа, данная компания по прежнему будет иметь
          возможность просмотра ваших персональным данным, еще в течении 3 лет,
          для того что бы соответствовать закону № и тд.
        </>
      }
      footnote={
        <>
          *Нажимая кнопку «Отключить», Вы подтверждаете, что ознакомлены с
          условиями Соглашения об обработке персональных данных PayPal о
          прекращении доступа к ПД по желанию Пользователя.
        </>
      }
      primaryLabel="Отключить"
      secondaryLabel="Не отключать"
      onPrimary={() => {
        setStatus(id, "revoked");
        router.push(`/app/service/${id}/removing`);
      }}
      onSecondary={() => router.back()}
      onClose={() => router.back()}
    />
  );
}
