"use client";

/**
 * Демки «Документ на валидацию» для витрины /ds.
 * Источник: Figma «UI фичи» / документ на валидацию (290:0 кооператив, 654:71 пайщики,
 * 654:1399 вопросы голосований, 656:65209 счета, 656:65319 документы).
 * 100% reuse DS: MemberCard, QuestionCard, Badge, Item. Новых компонентов нет.
 */
import { MemberCard, QuestionCard, Badge, Item, type MemberRow } from "@/components/ds";

const OKVED = (
  <>
    <div>81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;</div>
    <div>81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;</div>
    <div>81.30 - Предоставление услуг по благоустройству ландшафта;</div>
  </>
);

const COOP: MemberRow[] = [
  { label: "Тип верификации", value: <Badge color="orange">Локальный</Badge> },
  { label: "Тип документа", value: "Устав" },
  { label: "Регистрационный номер", value: "1167700006946" },
  { label: "Организация", value: "Потребительский кооператив MMATRA" },
  { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Почтовый адрес", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Контактный телефон", value: "+7 (992) 222-22-22" },
  { label: "E-mail", value: "immatra@mmatra.ru" },
  { label: "ОКВЭД", value: OKVED },
  { label: "ИНН", value: "1234567990" },
  { label: "Орган выдавший документ", value: "Управление министерства юстиции РФ по Санкт-Петербургу" },
  { label: "Дата решения", value: "03.08.2020" },
  { label: "Дата внесения в ЮГРЮЛ", value: "09.08.2020" },
];

const PAYERS: MemberRow[] = [
  { label: "Председатель правления", value: "Антонов Илья" },
  { label: "Председатель совета", value: "Самик Михаил" },
  { label: "Совет", value: <>Андреев Андрей<br />Ан Дмитрий<br />Варгамов Илья</> },
];

const VOTE_PARAMS: MemberRow[] = [
  { label: "MIN продолжительность", value: "24 часа" },
  { label: "MAX продолжительность", value: "24 часа" },
  { label: "Кворум", value: "100 %" },
  { label: "Первоначальный кворум", value: "100 %" },
  { label: "Консенсус", value: "70 %" },
  { label: "Тип роли", value: "Член совета" },
  { label: "Доступна к передаче", value: "Нет" },
];

const ACCOUNT: MemberRow[] = [
  { label: "Тип счета", value: "Матрешка" },
  { label: "ОКВЭД", value: OKVED },
  { label: "Назначение счета", value: "Данный счет является основным расчетным счетом кооператива. Неделимый фонд." },
  { label: "Источник поступлений", value: "Целевые и членские взносы от пайщиков." },
  { label: "Распределение целевого счета и подсчетов", value: <><div>100% - Целевой счет</div><div>0% - Счет инвестиционных токенов</div><div>0% - Счет управляющих токенов</div></> },
];

const QUESTIONS = [
  "Установление размера паевого взноса",
  "Избрание ревизионной комиссии",
  "Прием в члены кооператива и исключение из членов кооператива",
  "Образование наблюдательного совета и прекращение полномочий его членов",
  "Распределение прибыли и убытков кооператива",
];

const DOCS: { label: string; value: string }[] = [
  { label: "Сертификат", value: "Сертификат соответствия" },
  { label: "Свидетельство", value: "Свидетельство о государственной регистрации программы ЭВМ" },
  { label: "Лицензия", value: "Лицензия на использование ЭВМ" },
];

export function ValidationDemos() {
  return (
    <div className="flex max-w-[1019px] flex-col gap-5">
      <MemberCard title="Информация о кооперативе" defaultOpen rows={COOP} />
      <MemberCard title="Пайщики" rows={PAYERS} />

      <QuestionCard title="Вопросы голосований" defaultOpen>
        <div className="flex flex-col gap-3">
          <MemberCard title="Изменить управляющего" defaultOpen rows={VOTE_PARAMS} />
          {QUESTIONS.map((q) => (
            <QuestionCard key={q} size="s" title={q} />
          ))}
        </div>
      </QuestionCard>

      <MemberCard title="Счета" rows={ACCOUNT} />

      <QuestionCard title="Документы" defaultOpen>
        <div className="flex flex-col gap-2">
          {DOCS.map((d) => (
            <Item key={d.label} trailing={<span style={{ color: "var(--color-dark-900)" }}>09.01.2020</span>}>
              <span className="flex flex-col gap-0.5">
                <span className="ds-caption text-foreground-subtle">{d.label}</span>
                <span className="ds-p3 text-foreground">{d.value}</span>
              </span>
            </Item>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}
