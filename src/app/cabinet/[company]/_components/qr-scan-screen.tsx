"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Text, Link, Button, HeaderArrowLeftIcon } from "@/components/ds";

/**
 * QrScanScreen — экран «Считывание QR-кода» страниц «Выдача диплома» (6970:556049)
 * и «Внесение дополнений» (6970:556185) кабинета ВУЗы. Обе страницы идентичны,
 * отличаются подзаголовком и активным пунктом меню.
 *
 * Каркас — обвязка через `sidebar` (CompanySidebar). Собран из DS: Text
 * (заголовки/тексты), Link («Ссылка на запрос»), Button (назад). Ничего нового.
 */
export function QrScanScreen({
  sidebar,
  backHref,
  subtitle,
}: {
  sidebar?: ReactNode;
  backHref?: string;
  /** Подзаголовок под «Считывание QR-кода». */
  subtitle: string;
}) {
  const router = useRouter();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-[50px]">
          {/* Шапка: кнопка «назад» слева, заголовок по центру */}
          <div className="relative flex min-h-[40px] items-center">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              onClick={goBack}
            />
            <Text variant="h5" className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
              Считывание QR-кода
            </Text>
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <Text variant="p2" tone="default" className="max-w-[640px]">
              {subtitle}
            </Text>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cabinet/vuz-qr.png"
              alt="QR-код"
              width={206}
              height={206}
              className="size-[206px] select-none"
              draggable={false}
            />

            <div className="flex flex-col items-center gap-1">
              <Text variant="p2" tone="default">
                Запрос с этими характеристиками будет отправлен пользователю считавшему штрих-код.
              </Text>
              <Link href="#" size="p2">
                Ссылка на запрос
              </Link>
            </div>

            <Text variant="p3" tone="default" className="max-w-[760px]">
              После подтверждения им согласия на предоставление данных по этому запросу, данные
              вместе с формой выдачи диплома отразятся в вашем кабинете.
            </Text>
          </div>
        </div>
      </main>
    </div>
  );
}
