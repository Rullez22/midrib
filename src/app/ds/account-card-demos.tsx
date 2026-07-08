"use client";

/**
 * Демка AccountCard (карточка счёта) для витрины /ds.
 * Источник: Figma «UI фичи» / карточка счета раскрыта (2237:231380).
 * Переиспользованы DS: AccountCard + Button.
 */
import { AccountCard, Button } from "@/components/ds";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function UpRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 17 17 7M9 7h8v8" {...s} /></svg>
  );
}
function DownRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 7l10 10M17 9v8H9" {...s} /></svg>
  );
}

const OKVED = (
  <>
    <div>81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;</div>
    <div>81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;</div>
    <div>81.30 - Предоставление услуг по благоустройству ландшафта;</div>
  </>
);

const DISTRIB = (
  <>
    <div>30% - Целевой счет</div>
    <div>20% - Счет инвестиционных токенов</div>
    <div>20% - Счет управляющих токенов</div>
    <div>20% - Маршрутный счет</div>
    <div>10% - Маркетинговый счет</div>
  </>
);

export function AccountCardDemos() {
  return (
    <div className="max-w-[1120px]">
      <AccountCard
        amount="1.231 ETH"
        secondaryAmount="15.88 USD"
        leftAction={<Button size="m" iconLeft={<UpRight />}>Реквизиты</Button>}
        rightAction={<Button size="m" iconLeft={<DownRight />}>Перевод</Button>}
        title="Характеристики целевого счета"
        onClose={() => {}}
        rows={[
          {
            label: "Наименование счета",
            value: "Целевой",
            secondary: { label: "Тип счета", value: "Матрешка" },
          },
          { label: "Коды и ОКВЭД", value: OKVED },
          {
            label: "Назначение счета",
            value:
              "Данный счет является основным расчетным счетом кооператива. Неделимый фонд. На него поступают все членские и целевые взносы.",
          },
          {
            label: "Источник поступлений",
            value: "Целевые и членские взносы от пайщиков. Никакие другие платежи не принимаются.",
          },
          { label: "Распределение целевого счета и подсчетов", value: DISTRIB },
        ]}
        editLabel="Редактировать % по распределению"
        onEdit={() => {}}
      />
    </div>
  );
}
