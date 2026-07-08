"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Text, Button, Link, HeaderArrowLeftIcon } from "@/components/ds";
import { useCabinetUnlock, type UnlockKey } from "../../../_components/cabinet-unlock";

/**
 * DiplomaCycleScreen — финальный экран флоу «Выдача диплома» (ВУЗы):
 * «Цикл выдачи диплома». Открывается после пополнения баланса (BalanceScreen).
 * Источник: Figma 6970:556018.
 *
 * Каркас — обвязка передаётся через `sidebar` (CompanySidebar ВУЗа). Контент
 * собран из DS: Text (шаги/примечание/скрипт), Link (ссылки), Button («Начать»),
 * HeaderArrowLeftIcon (кнопка «назад»). Ничего нового не верстаем.
 *
 * @param sidebar   Левое меню кабинета (CompanySidebar).
 * @param backHref  Назад — к пополнению баланса.
 * @param startHref «Начать» — запуск цикла (если задан).
 */

const STEPS: { title: string; text: string }[] = [
  {
    title: "Шаг 1",
    text: "Предоставьте данный штрих-код пользователю, которому вы хотите выдать диплом, и система запросит у него документы, заданные вами в процессе настройки.",
  },
  {
    title: "Шаг 2",
    text: "Вместе с документами, подтверждающими личность, перед вами откроется форма для выдачи диплома, которая автоматически будет прикреплена к данному пользователю.",
  },
  {
    title: "Шаг 3",
    text: "Заполните данную форму согласно тем характеристикам, которые должен содержать в себе выдаваемый нами диплом, и подпишите выдачу диплома.",
  },
  {
    title: "Шаг 4",
    text: "Данные с выданным дипломом будут направлены на пользователя, и после подтверждения им того, что он согласен с данным документом, он будет размещён в хранилище с меткой о том, что диплом был выдан вашей организацией за подписью доверенного лица, который заполнял и подписывал форму.",
  },
];

export function DiplomaCycleScreen({
  sidebar,
  backHref,
  startHref,
  unlockKey,
}: {
  sidebar?: ReactNode;
  backHref?: string;
  startHref?: string;
  /** Какой пункт меню разблокировать по «Начать» (diploma/additions). */
  unlockKey?: UnlockKey;
}) {
  const router = useRouter();
  const { unlock } = useCabinetUnlock();
  const goBack = () => (backHref != null ? router.push(backHref) : router.back());
  // «Начать» — завершает флоу: разблокирует пункт меню и открывает его страницу.
  const start = () => {
    if (unlockKey) unlock(unlockKey);
    if (startHref != null) router.push(startHref);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebar}

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
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
              Цикл выдачи диплома
            </Text>
          </div>

          {/* Шаги цикла (по центру) */}
          <div className="flex flex-col items-center gap-6 text-center">
            {STEPS.map((s) => (
              <div key={s.title} className="flex flex-col items-center gap-2">
                <Text variant="p1-medium">{s.title}</Text>
                <Text variant="p3" tone="muted" className="max-w-[1120px]">
                  {s.text}
                </Text>
              </div>
            ))}
          </div>

          {/* Примечание (по центру) */}
          <Text variant="p2" tone="muted" className="mx-auto max-w-[1120px] text-center">
            <Text as="span" variant="p2-medium" tone="default">
              Примечание:
            </Text>{" "}
            «После того как цикл будет завершён, данные о выданном вами дипломе появятся в разделе
            История операций».
          </Text>

          {/* Скрипт + пример формы (по центру) */}
          <div className="flex flex-col items-center gap-6 pt-2 text-center">
            <Text variant="p2" tone="muted">
              Используйте{" "}
              <Link href="#" size="p2">
                данный скрипт
              </Link>{" "}
              для того, чтобы отразить форму со штрих-кодом в необходимом вам веб-ресурсе.
            </Text>
            <Link href="#" size="p1" className="font-medium">
              Пример полученных данных и формы для выдачи диплома.
            </Link>
          </div>

          {/* Начать */}
          <div className="flex justify-end">
            <Button onClick={start}>Начать</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
