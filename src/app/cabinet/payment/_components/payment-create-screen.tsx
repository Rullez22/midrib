"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, OptionCard } from "@/components/ds";
import { CoopRail } from "../../../flow/company-create/_components/coop-sidebar";

/**
 * PaymentCreateScreen — экран-развилка «Создание разового или стабильного
 * распределения» (сценарий 2 раздела «Кооператив»).
 * Источник: Figma node 2655:380991.
 *
 * Reuse DS: CoopRail (рейка воркспейсов) · OptionCard (карточки-выбор) · Button.
 * Закрытие (×) → назад в /cabinet.
 *
 * NB: переходы по «Создать» (формы создания разового/стабильного платежа) — это
 * прототип-реакции Figma, цели которых MCP не отдаёт. Подключим, когда будут
 * node-id экранов форм.
 */

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PaymentCreateScreen() {
  const router = useRouter();
  const close = () => router.push("/cabinet");

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
            <h1 className="ds-h5 text-foreground">
              Создание разового или стабильного распределения
            </h1>
            <p className="ds-p2 max-w-[760px] text-foreground-subtle">
              Вы можете добавить 2 типа распределения средств на адреса. Все платежи
              с этого счета могут быть направлены только на адреса ваших пайщиков или
              партнеров с которыми у вас уже заключены договорные отношения.
            </p>
          </div>

          {/* Две карточки-выбора */}
          <div className="grid items-stretch gap-10 md:grid-cols-2">
            <OptionCard
              media={<Image src="/images/cabinet/payment-once.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Разовый платеж"
              description="Может быть осуществлен как на один адрес как и на несколько адресов сразу. Все транзакции с разовыми платежами отмечены синим или желтым цветом. Синие транзакции направление пайщикам. Желтые направленные коммерческим организациям вне кооператива."
              action={
                <Button size="l" onClick={() => router.push("/cabinet/payment/once")}>Создать</Button>
              }
            />
            <OptionCard
              media={<Image src="/images/cabinet/payment-stable.svg" alt="" width={100} height={100} className="size-[100px]" />}
              title="Стабильный платеж"
              description="Периодические платеж в виде % от входящих на ваш кошелек средств но не выше фиксированной суммы. Периодические платеж в виде % от входящих на ваш кошелек средств до выполнения обязательств по выплате суммы. Все транзакции с стабильными платежами отмечены красным цветом."
              action={
                <Button size="l" onClick={() => router.push("/cabinet/payment/stable")}>Создать</Button>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
