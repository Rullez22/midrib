"use client";

import { useRouter } from "next/navigation";
import { SectionHeader, Button, Dropdown } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { RegFormView, useRegFormTitle, GearIcon } from "./reg-form-view";
import { useRegFlow } from "./reg-flow";

/**
 * PublishedFormScreen — опубликованная (read-only) форма регистрации.
 * Открывается из ScriptScreen по «Опубликовать форму регистрации».
 * Источник: Figma 2671:398342 / 398404.
 *
 * Шапка: заголовок по центру + шестерёнка (дропдаун «Использовать в работе» /
 * «Создать черновик»). Тело — общий RegFormView. Снизу — «Продолжить работу»
 * (публикует ПС → экран пайщиков). Клик по основанию → деталь основания.
 *
 * @param detailHref   Деталь основания (клик по локализации).
 * @param continueHref «Продолжить работу» — экран пайщиков (если задан).
 * @param draftHref    «Создать черновик» — деталь ПС (вкладка «Черновики»).
 */

export function PublishedFormScreen({
  detailHref,
  continueHref,
  draftHref,
  routes,
}: {
  detailHref?: string;
  continueHref?: string;
  draftHref?: string;
  routes?: Partial<CoopRoutes>;
}) {
  const router = useRouter();
  const flow = useRegFlow();
  const title = useRegFormTitle();

  const publishAndContinue = () => {
    flow.setPublished(true);
    if (continueHref != null) router.push(continueHref);
  };

  const createDraft = () => {
    flow.addDraft({ title, date: "15.08.2019 - 13:00" });
    if (draftHref != null) router.push(draftHref);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar routes={routes} />

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: заголовок по центру + шестерёнка справа (дропдаун действий) */}
          <div className="relative flex min-h-[40px] items-center justify-center">
            <SectionHeader title={title} />
            <Dropdown
              align="end"
              aria-label="Действия с формой"
              className="absolute right-0 top-0"
              trigger={<Button variant="ghost" size="m" icon={<GearIcon />} aria-label="Настройки" />}
              items={[
                { value: "use", label: "Использовать в работе" },
                { value: "draft", label: "Создать черновик" },
              ]}
              onSelect={(v) => {
                if (v === "draft") createDraft();
                else if (v === "use") publishAndContinue();
              }}
            />
          </div>

          <RegFormView onBasisClick={() => detailHref != null && router.push(detailHref)} />

          {/* Продолжить работу */}
          <div className="flex justify-end">
            <Button size="l" onClick={publishAndContinue}>
              Продолжить работу
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
