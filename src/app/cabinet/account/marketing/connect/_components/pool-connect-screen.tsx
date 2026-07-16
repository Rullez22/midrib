"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, OptionCard } from "@/components/ds";
import { CoopRail } from "../../../../../flow/company-create/_components/coop-sidebar";

/**
 * PoolConnectScreen — экран-развилка «Подключение адресов к пул-счету».
 * Открывается по кнопке «Перевод» в маркетинговом (пул-)счёте.
 * Источник: Figma node 2649:360298.
 *
 * Reuse DS: CoopRail (рейка воркспейсов) · OptionCard (карточки-выбор) · Button.
 * Шаблон вёрстки — PaymentCreateScreen. Закрытие (×) → назад в маркетинговый счёт.
 *
 * «Массовое подключение» → /cabinet/account/marketing/connect/mass.
 * «Персональное подключение» → /cabinet/account/marketing/connect/personal.
 */

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PoolConnectScreen() {
  const router = useRouter();
  const close = () => router.push("/cabinet/account/marketing");

  return (
    <div className="flex min-h-screen bg-background">
      <CoopRail />

      <main className="min-w-0 flex-1">
        {/* Крестик закрытия — справа сверху (Figma: красная иконка-кнопка) */}
        <div className="flex justify-end px-5 pt-5 md:px-8">
          <button
            type="button"
            aria-label="Закрыть"
            onClick={close}
            className="flex size-10 items-center justify-center rounded-[4px] border border-[color:var(--color-red-300)] text-[color:var(--color-red-300)] transition-colors hover:bg-[color:var(--color-red-50)] hover:text-[color:var(--color-red-500)]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-10 px-5 pb-12 md:px-10">
          {/* Заголовок + описание */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="ds-h5 text-foreground">Подключение адресов к пул-счету</h1>
            <p className="ds-p2 text-foreground-subtle">Вы можете добавить два подключения к пулу</p>
          </div>

          {/* Две карточки-выбора */}
          <div className="grid items-stretch gap-10 md:grid-cols-2">
            <OptionCard
              media={<Image src="/images/cabinet/connect-mass.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Массовое подключение"
              description="Можно подключить много пользователей но только по одной доли на пользователя"
              action={<Button size="l" onClick={() => router.push("/cabinet/account/marketing/connect/mass")}>Подключить</Button>}
            />
            <OptionCard
              media={<Image src="/images/cabinet/connect-personal.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Персональное подключение"
              description="Можно подключить несколько долей на одного пользователя"
              action={<Button size="l" onClick={() => router.push("/cabinet/account/marketing/connect/personal")}>Подключить</Button>}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
