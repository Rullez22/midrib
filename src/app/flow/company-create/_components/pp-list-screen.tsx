"use client";

import { useRouter } from "next/navigation";
import { Text, Button } from "@/components/ds";
import { CoopSidebar, type CoopRoutes } from "./coop-sidebar";
import { useRegFlow } from "./reg-flow";
import { useRegFormTitle } from "./reg-form-view";

/**
 * PpListScreen — «Пользовательские соглашения». Открывается из PaishikiScreen по
 * клику на строку «ПП». Источник: Figma 2671:398887.
 *
 * Заголовок + «Узнать больше», крестик закрытия (→ пайщики), «Создать черновик».
 * Разделы «Актуальные версии» → «Используется» (созданная форма) и «Не
 * используются» (примеры). Клик по используемой форме → деталь ПС (табы).
 *
 * @param detailHref Деталь ПС (табы) — клик по используемой форме / создать черновик.
 * @param closeHref  Крестик — назад к пайщикам.
 */

/** Не используемые соглашения — примеры (Figma 398887). */
const UNUSED = [
  { title: "Форма регистрации для граждан США", date: "12.08.2019 - 12:00" },
  { title: "Форма регистрации для граждан Бразили", date: "05.08.2019 - 11:00" },
  { title: "Форма регистрации для граждан Канады", date: "04.08.2019 - 9:00" },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PpRow({ title, date, onClick }: { title: string; date: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[4px] border border-border bg-white px-6 py-4 text-left transition-colors hover:bg-[var(--color-grey-10)]"
    >
      <span className="ds-p3 text-foreground">{title}</span>
      <span className="ds-p3 shrink-0 text-foreground-subtle tabular-nums">{date}</span>
    </button>
  );
}

export function PpListScreen({ detailHref, closeHref, routes }: { detailHref?: string; closeHref?: string; routes?: Partial<CoopRoutes> }) {
  const router = useRouter();
  const flow = useRegFlow();
  const title = useRegFormTitle();

  const goDetail = () => detailHref != null && router.push(detailHref);
  const createDraft = () => {
    flow.addDraft({ title, date: "15.08.2019 - 13:00" });
    goDetail();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CoopSidebar routes={routes} />

      {/* Контент */}
      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: заголовок по центру + крестик справа */}
          <div className="relative flex flex-col items-center gap-2">
            <Text variant="h4" className="text-center">Пользовательские соглашения</Text>
            <Text variant="p3" tone="muted" className="text-center">
              Вы можете создавать неограниченное количество пользовательских соглашений для разной аудитории.
            </Text>
            <button type="button" className="ds-p3-medium text-primary" onClick={goDetail}>
              Узнать больше.
            </button>
            <Button
              variant="negative-sec"
              size="m"
              icon={<CloseIcon />}
              aria-label="Закрыть"
              className="absolute right-0 top-0"
              onClick={() => closeHref != null && router.push(closeHref)}
            />
          </div>

          {/* Актуальные версии + Создать черновик */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Text variant="p2-medium">Актуальные версии</Text>
              <Button size="m" onClick={createDraft}>Создать черновик</Button>
            </div>

            {/* Используется */}
            <Text variant="caption" tone="subtle">Используется</Text>
            <PpRow title={title} date="15.08.2019 - 13:00" onClick={goDetail} />

            {/* Не используются */}
            <Text variant="caption" tone="subtle" className="mt-2">Не используются</Text>
            <div className="flex flex-col gap-4">
              {UNUSED.map((r) => (
                <PpRow key={r.title} title={r.title} date={r.date} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
