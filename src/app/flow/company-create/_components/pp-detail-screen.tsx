"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SectionHeader,
  Button,
  Dropdown,
  Tabs,
  Tab,
  EmptyState,
  DeleteButton,
  HeaderArrowLeftIcon,
} from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { RegFormView, useRegFormTitle, GearIcon } from "./reg-form-view";
import { useRegFlow } from "./reg-flow";

/**
 * PpDetailScreen — деталь пользовательского соглашения (read-only форма + табы
 * «Черновики» / «История версий»). Открывается из PpListScreen по клику на
 * используемую форму. Источник: Figma 2671:398356/398393/398420/398431/
 * 398442/398461/398451/398470.
 *
 * Шапка: назад + заголовок + шестерёнка (дропдаун, «Создать черновик» добавляет
 * черновик во вкладку). Тело — общий RegFormView. Табы: черновики (flow.drafts
 * или пусто) и история версий (опубликованная форма).
 *
 * @param backHref   Назад — к списку ПС.
 * @param detailHref Деталь основания (клик по локализации).
 */
export function PpDetailScreen({ backHref, detailHref, routes }: { backHref?: string; detailHref?: string; routes?: Partial<CoopRoutes> }) {
  const router = useRouter();
  const flow = useRegFlow();
  const title = useRegFormTitle();
  const [tab, setTab] = useState<"drafts" | "history">("drafts");

  const createDraft = () => {
    flow.addDraft({ title, date: "15.08.2019 - 13:00" });
    setTab("drafts");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar routes={routes} />

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: назад + заголовок по центру + шестерёнка */}
          <div className="relative flex min-h-[40px] items-center">
            <Button
              variant="ghost"
              size="m"
              icon={<HeaderArrowLeftIcon />}
              aria-label="Назад"
              onClick={() => (backHref != null ? router.push(backHref) : router.back())}
            />
            <SectionHeader className="absolute left-1/2 -translate-x-1/2" title={title} />
            <Dropdown
              align="end"
              aria-label="Действия с формой"
              className="absolute right-0 top-0"
              trigger={<Button variant="ghost" size="m" icon={<GearIcon />} aria-label="Настройки" />}
              items={[
                { value: "use", label: "Использовать в работе" },
                { value: "draft", label: "Создать черновик" },
              ]}
              onSelect={(v) => v === "draft" && createDraft()}
            />
          </div>

          <RegFormView onBasisClick={() => detailHref != null && router.push(detailHref)} />

          {/* Табы: черновики / история версий */}
          <div className="flex flex-col gap-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} aria-label="Версии">
              <Tab value="drafts">Черновики</Tab>
              <Tab value="history">История версий</Tab>
            </Tabs>

            {tab === "drafts" ? (
              flow.drafts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {flow.drafts.map((d, i) => (
                    <div key={i} className="flex items-center">
                      {/* Строка-карточка + урна снаружи (gap 24px слева и справа) */}
                      <div className="ds-row flex flex-1 items-center justify-between gap-4 rounded-[4px] border border-border bg-white px-6 py-4">
                        <span className="ds-p3 text-foreground">{d.title}</span>
                        <span className="ds-p3 text-foreground-subtle tabular-nums">{d.date}</span>
                      </div>
                      <DeleteButton size="md" className="mx-6 shrink-0" onClick={() => flow.removeDraft(i)} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Отсутствуют черновики" />
              )
            ) : flow.published ? (
              <div className="ds-row flex items-center justify-between gap-4 rounded-[4px] border border-border bg-white px-6 py-4">
                <span className="ds-p3 text-foreground">{title}</span>
                <span className="ds-p3 shrink-0 text-foreground-subtle tabular-nums">11.03.2020 - 11.04.2020</span>
              </div>
            ) : (
              <EmptyState title="Отсутствует история версий" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
