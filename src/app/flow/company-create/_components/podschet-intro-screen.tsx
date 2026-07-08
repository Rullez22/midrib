"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ds";
import { CoopRail } from "./coop-sidebar";
import { useEnsureAccountsReady } from "./reg-flow";

/**
 * PodschetIntroScreen — интро «Создание подсчета для целевого счета».
 * Открывается из карточки счёта (дропдаун шестерёнки → «Создать подсчет»).
 * Источник: Figma 2493:286303.
 *
 * Reuse DS: CoopRail · Button. Текст-пояснение — уникальный одноразовый layout.
 *
 * @param backHref Закрытие (×) — назад на счета.
 * @param continueHref «Продолжить создание» — к форме создания подсчёта.
 */

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PodschetIntroScreen({
  backHref,
  continueHref,
}: {
  backHref?: string;
  continueHref?: string;
}) {
  const router = useRouter();
  useEnsureAccountsReady();
  const close = () => (backHref != null ? router.push(backHref) : router.back());
  const proceed = () => continueHref != null && router.push(continueHref);

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        <div className="flex w-full flex-col gap-8 px-5 py-8 md:px-[50px]">
          {/* Шапка: заголовок по центру + закрытие справа */}
          <div className="relative flex min-h-[40px] items-center justify-center">
            <h1 className="ds-p2-medium text-center text-foreground">Создание подсчета для целевого счета</h1>
            <span className="absolute right-0">
              <Button variant="negative-sec" size="m" icon={<CloseIcon />} aria-label="Закрыть" onClick={close} />
            </span>
          </div>

          {/* Пояснение */}
          <div className="ds-p3 flex max-w-[1120px] flex-col gap-4 text-foreground-muted">
            <p>
              Вы можете создать целевой подсчет для этого счета и вести через него расчеты по выбранному вами
              направлению. Пополнение этого счета будет осуществлять за счет средств которые вы можете направить с
              текущего счета на создаваемый вам подсчет процессе его создания.
            </p>
            <div className="flex flex-col gap-2">
              <p className="ds-p3-medium text-foreground">Существуют 2 типа подсчетов:</p>
              <ol className="flex list-decimal flex-col gap-2 pl-5">
                <li>
                  <span className="ds-p3-medium text-foreground">ПУЛ счет</span> – это счет все средства с которого
                  распределяются в равных количествах между всеми кошельками (выданными им пикетами) которые к нему
                  подключены.
                </li>
                <li>
                  У Пул счета не может быть создан Подсчет.
                  <br />
                  <span className="ds-p3-medium text-foreground">Матрешка счет</span> – это счет который позволяет
                  создавать подсчета и направлять на них часть средств из тех которые будут поступать на этот счет. Этот
                  счет может быть передан в управление подразделению
                </li>
              </ol>
            </div>
          </div>

          {/* CTA по центру */}
          <div className="flex justify-center">
            <Button size="l" onClick={proceed}>Продолжить создание</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
