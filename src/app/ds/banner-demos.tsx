"use client";

import { Banner, BannerInformationIcon } from "@/components/ds";

/**
 * Витрина Banner — матрица тонов в двух ширинах (Large / Small),
 * 1:1 с Figma «UI Контролы» / Banner (node 1220:58705).
 */
export function BannerDemos() {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
      {/* Large — широкая колонка */}
      <div className="flex w-full max-w-[1120px] flex-col gap-4">
        <span className="ds-caption-up text-foreground-subtle">Large</span>

        <Banner
          tone="info"
          title="Отправка уставных документов на валидацию"
          actionLabel="Отправить на валидатора"
        >
          Перед отправкой документа на валидацию, вам необходимо зарегистрировать кооператив
          в государственных органах.
        </Banner>

        <Banner tone="neutral" title="Отправка уставных документов на валидацию" loading>
          В данный момент времени осуществляется поиск конкретного валидатора,
          который согласится обрабатывать ваши документы.
        </Banner>

        <Banner
          tone="warning"
          title="Отправка уставных документов на валидацию"
          actionLabel="Подтвердить валидатора"
        >
          Валидатор выразил согласие обрабатывать ваши документы.
          Пожалуйста, подтвердите валидатора для дальнейшей обработки ваших документов.
        </Banner>

        <Banner
          tone="caution"
          title="Отправка уставных документов на валидацию"
          actionLabel="Перейти к документам"
        >
          В данный момент времени ваш документ обрабатывается
          валидатором, и этот процесс может занять некоторое время.
        </Banner>

        <Banner tone="danger" title="Обратите внимание!" actionLabel="Отозвать счет">
          Счет управляется самостоятельной группой пайщиков,
          При необходимости вы можете отозвать этот счет
        </Banner>

        <Banner
          tone="note"
          icon={<BannerInformationIcon />}
          title="Информация"
          actionLabel="Продолжить работу"
        >
          Реквизиты кооператива обновятся в реестре в течение суток после подтверждения валидатором.
          До этого момента подключение новых пайщиков и создание счетов будут недоступны.
        </Banner>
      </div>

      {/* Small — узкая колонка */}
      <div className="flex w-full max-w-[966px] flex-col gap-4">
        <span className="ds-caption-up text-foreground-subtle">Small</span>

        <Banner
          tone="info"
          title="Отправка уставных документов на валидацию"
          actionLabel="Завершить настройку"
        >
          Чтобы перейти к настройке счетов, необходимо завершить настройку вопросов.
        </Banner>

        <Banner tone="neutral" title="Отправка уставных документов на валидацию" loading>
          Идёт поиск валидатора. Обычно это занимает до двух рабочих дней.
        </Banner>

        <Banner
          tone="warning"
          title="Отправка уставных документов на валидацию"
          actionLabel="Подтвердить валидатора"
        >
          Валидатор готов взять ваши документы в работу — подтвердите его.
        </Banner>

        <Banner
          tone="caution"
          title="Отправка уставных документов на валидацию"
          actionLabel="Перейти к документам"
        >
          В данный момент времени ваш документ обрабатывается
        </Banner>

        <Banner tone="danger" title="Обратите внимание!" actionLabel="Отозвать счет">
          Счет управляется самостоятельной группой пайщиков,
        </Banner>

        <Banner
          tone="note"
          icon={<BannerInformationIcon />}
          title="Информация"
          actionLabel="Продолжить работу"
        >
          Реквизиты обновятся в реестре в течение суток после подтверждения.
        </Banner>

        <Banner
          tone="note"
          icon={<BannerInformationIcon />}
          title="Информация"
          actionLabel="Продолжить работу"
        >
          Пайщик получит уведомление о смене роли на почту и в чат кооператива.
        </Banner>
      </div>
    </div>
  );
}
