"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, TextBlock, TextList, Note, Button, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";

/**
 * AgreementIntroScreen — интро «Создайте пользовательское соглашение».
 * Открывается из PaishikiScreen по плашке «Создать Пользовательское соглашение».
 * Источник: Figma 2671:398056.
 *
 * Каркас — общий CoopSidebar; контент собран из DS:
 * SectionHeader (заголовок + подзаголовок), TextBlock + TextList (что содержит
 * соглашение), Note (блок «Обратите внимание!»), кнопки primary/secondary.
 * Иллюстрация-свиток — ассет public/illustrations/contract-scroll.png (из Figma).
 *
 * @param backHref  Назад — к экрану пайщиков.
 * @param startHref «Начать создание» — следующий шаг (если задан).
 */
export function AgreementIntroScreen({
  backHref,
  startHref,
  routes,
  sidebar,
}: {
  backHref?: string;
  startHref?: string;
  routes?: Partial<CoopRoutes>;
  /** Своя обвязка (напр. CompanySidebar ВУЗа). По умолчанию — CoopSidebar. */
  sidebar?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar ?? <CoopSidebar routes={routes} />}

      {/* Контент: внешний контейнер держит обе колонки —
          кнопку «назад» слева (gap 50px) и центрированный контент. */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col px-5 py-10 md:px-[50px]">
          {/* Контейнер кнопки «назад» — слева, у края контента */}
          <div className="flex">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              onClick={() => (backHref != null ? router.push(backHref) : router.back())}
            />
          </div>

          {/* Контейнер контента — по центру */}
          <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 pt-8">
          {/* Иллюстрация + заголовок (по центру) */}
          <div className="flex flex-col items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/contract-scroll.png"
              alt=""
              width={132}
              height={132}
              className="size-[132px] select-none"
              draggable={false}
            />
            <SectionHeader
              title="Создайте пользовательское соглашение"
              subtitle="Для начала работы с пользователями"
            />
          </div>

          {/* Что будет содержать соглашение */}
          <TextBlock
            title="Пользовательское соглашение (далее Соглашение) будет содержать:"
            titleVariant="p2-medium"
            gap={8}
          >
            <TextList
              items={[
                "набор персональных данных, которые вам необходимо получить от пользователя;",
                "основания для запроса данных согласно GDPR;",
                "текст соглашения, в котором вы опишите для пользователя условия обработки запрашиваемых данных.",
              ]}
            />
          </TextBlock>

          {/* Заметка «Обратите внимание!» */}
          <Note title="Обратите внимание!">
            Перечень запрашиваемых у пользователя данных и документов может отличаться в зависимости
            от гражданства и местанахождения пользователя. Поэтому вы можете создать несколько
            Соглашений с разными условиями. Для этого сначала вы выбираете страну или несколько стран,
            на которые будет распространяться создаваемое Соглашение. Количество создаваемых Соглашений
            не ограничено.
          </Note>

          {/* CTA — DS Button primary L-48 */}
          <Button
            className="mx-auto"
            onClick={startHref != null ? () => router.push(startHref) : undefined}
          >
            Начать создание
          </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
