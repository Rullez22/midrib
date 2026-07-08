"use client";

import { useRouter } from "next/navigation";
import { SectionHeader, Note, Button, HeaderArrowLeftIcon } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";

/**
 * ScriptScreen — «Скрипт формы регистрации». Открывается из BalanceScreen по
 * «Продолжить». Источник: Figma 2671:398272.
 *
 * Каркас — общий CoopSidebar. Контент из DS: SectionHeader (заголовок+подзаголовок),
 * tertiary-ссылки «Посмотреть…»/«Скачать скрипт», иконка JS-файла, Note
 * («Примечание»), primary-кнопка «Опубликовать форму регистрации».
 *
 * @param backHref     Назад — к балансу аккаунта.
 * @param publishHref  «Опубликовать форму регистрации» — следующий шаг (если задан).
 */

/** Иконка JS-файла (документ с фигурными скобками и «JS»). */
function JsFileIcon() {
  return (
    <svg viewBox="0 0 48 56" fill="none" aria-hidden className="size-14 text-primary">
      <path
        d="M5 5a4 4 0 0 1 4-4h22l12 12v38a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M31 1v8a4 4 0 0 0 4 4h8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M19 25c-3 0-3 5-6 5 3 0 3 5 6 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 25c3 0 3 5 6 5-3 0-3 5-6 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function ScriptScreen({
  backHref,
  publishHref,
  routes,
}: {
  backHref?: string;
  publishHref?: string;
  routes?: Partial<CoopRoutes>;
}) {
  const router = useRouter();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar routes={routes} />

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
              title="Скрипт формы регистрации"
              subtitle="Используя скрипт, опубликуйте у себя в нужном месте форму верификации и пользователи прошедшие процедуру будут появляется у вас в разделе Верификация."
            />
          </div>

          {/* Превью / скачивание скрипта */}
          <div className="flex flex-col items-center gap-6">
            <Button variant="tertiary" size="m">
              Посмотреть как будет выглядеть ваша форма запроса данных.
            </Button>
            <JsFileIcon />
            <Button variant="tertiary" size="m">
              Скачать скрипт
            </Button>
          </div>

          {/* Примечание */}
          <Note title="Примечание">
            Как только по этой форме пройдет первая авторизация она будеть закреплена в блокчейне и
            данные пользователей предоставивших вам доступ появятся здесь. Для добавления виджета
            необходимо подключить его на Ваш сайт и проинициализировать функцией init с аргументами:
            id, baseUrl, title, description, предварительно добавив элемент с соответствующим id, где
            id — идентификатор html элемента, baseUrl — адрес сервера, title — заголовок формы,
            description — описание формы, policyId — id соглашения
          </Note>

          {/* Опубликовать форму регистрации */}
          <div className="flex justify-end">
            <Button
              size="l"
              onClick={publishHref != null ? () => router.push(publishHref) : undefined}
            >
              Опубликовать форму регистрации
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
