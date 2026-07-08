"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, OptionCard } from "@/components/ds";
import { CompanySidebar } from "./company-sidebar";
import { type CabinetConfig } from "../_config/cabinets";

/**
 * CabinetDirectionScreen — экран «Выберите нужное направление» кабинета ВУЗы
 * (под-раздел «Направление»). Развилка из 3 карточек: выдача диплома, внесение
 * дополнений, запрос на ознакомление.
 * Источник: Figma node 6970:552030.
 *
 * Reuse DS: CompanySidebar (боковое меню кабинета) · OptionCard (карточка-выбор,
 * как на развилках раздела «Кооператив») · Button. Ничего нового не верстаем.
 *
 * NB: переходы по кнопкам — прототип-реакции Figma, целевые экраны MCP не отдаёт.
 * «Выдать диплом» / «Внести дополнения» ведём на соответствующие пункты меню
 * кабинета; «Сделать запрос» пока без перехода (нет node-id экрана формы).
 */
export function CabinetDirectionScreen({
  cabinet,
  current,
}: {
  cabinet: CabinetConfig;
  current: string;
}) {
  const router = useRouter();
  const base = `/cabinet/${cabinet.slug}`;

  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar cabinet={cabinet} current={current} />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-10 px-5 py-10 md:px-10">
          {/* Заголовок */}
          <h1 className="ds-h4 text-center text-foreground">Выберите нужное направление</h1>

          {/* Три карточки-выбор */}
          <div className="grid items-stretch gap-10 md:grid-cols-3">
            <OptionCard
              media={<Image src="/images/cabinet/vuz-diploma.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Выдача диплома"
              description="Добавление нового документа на основе созданных шаблонов вашим доменом."
              action={
                <Button size="l" onClick={() => router.push(`${base}/direction/issue/1`)}>
                  Выдать диплом
                </Button>
              }
            />
            <OptionCard
              media={<Image src="/images/cabinet/vuz-additions.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Внесение в документ дополнений"
              description="Добавление нового документа на основе созданных шаблонов другими доменами."
              action={
                <Button size="l" onClick={() => router.push(`${base}/direction/issue/additions/1`)}>
                  Внести дополнения
                </Button>
              }
            />
            <OptionCard
              media={<Image src="/images/cabinet/vuz-request.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Запрос на ознакомление"
              description="Если вы раннее не создавали необходимый шаблон документа."
              action={<Button size="l">Сделать запрос</Button>}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
