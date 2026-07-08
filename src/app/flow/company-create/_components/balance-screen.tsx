"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, Note, Button, Text, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";

/**
 * BalanceScreen — «Баланс вашего аккаунта». Открывается из RegistrationFormScreen
 * по «Сохранить форму регистрации». Источник: Figma 2671:398250.
 *
 * Каркас — общий CoopSidebar. Контент из DS: SectionHeader (заголовок+подзаголовок),
 * карточка баланса (Баланс / ETH / USD + «Реквизиты для пополнения»), Note
 * («Система вознаграждения»), Button «Продолжить».
 *
 * @param backHref Назад — к форме регистрации.
 * @param nextHref «Продолжить» — следующий шаг (если задан).
 */

/** Иконка пополнения (стрелка вниз к линии). */
function IncomeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BalanceScreen({
  backHref,
  nextHref,
  routes,
  sidebar,
}: {
  backHref?: string;
  nextHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Своя обвязка (напр. CompanySidebar ВУЗа). По умолчанию — CoopSidebar. */
  sidebar?: ReactNode;
}) {
  const router = useRouter();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar routes={routes} />}

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: кнопка «назад» слева, заголовок по центру */}
          <div className="relative flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              className="absolute left-0 top-0"
              onClick={goBack}
            />
            <SectionHeader
              title="Баланс вашего аккаунта"
              subtitle="Пополните баланс вашего аккаунта. Как только пользователь будет регистрации у вас на сайте и предоставлять вам доступ к своим данным с вашего баланса будет списываться за предоставленные данные."
            />
          </div>

          {/* Карточка баланса */}
          <div className="flex flex-col items-center gap-2 rounded-[4px] border border-border bg-surface px-6 py-8">
            <Text variant="p2" tone="default">Баланс</Text>
            <Text variant="h3" tone="default">1.231 ETH</Text>
            <Text variant="p2" tone="muted">15.88 USD</Text>
            <Button variant="secondary" size="m" className="mt-3" iconLeft={<IncomeIcon />}>
              Реквизиты для пополнения
            </Button>
          </div>

          {/* Система вознаграждения */}
          <Note title="Система вознаграждения">
            Если данный пользователь уже имеет акаунта в системе MIDHUB в момент предоставления данных
            c вашего акаунта будет списываться оплата за доступ к данным и они будет доступны вам в
            вашем кабинете. Для регистрации таких пользователей пополните баланс. Если нет то под формой
            есть ссылка на сервис где он моет скачать приложение и получить лицензию. Каждый такой
            пользователь пришедший в систему будет закреплен за вами на всегда и с этого момента вы
            будите получать стабильный доход каждый раз когда он будет авторизироватся в других
            компаниях. Все ваши пользователи вознаграждение за них будет страшатся тут. Доступ данным
            пользователя пришедши от вас будет для вашего ресурса будет для него бесплатным.
          </Note>

          {/* Продолжить */}
          <div className="flex justify-end">
            <Button onClick={nextHref != null ? () => router.push(nextHref) : undefined}>
              Продолжить
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
