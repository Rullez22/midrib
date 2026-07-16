import { type ReactNode } from "react";
import { type BadgeColor, type BadgeVariant } from "@/components/ds";

export interface DefRow {
  label: ReactNode;
  value: ReactNode;
}

/**
 * Данные документов целевого счёта (таб «Документооборот» + детальные экраны).
 * Источник Figma: 6419:315630 (верификация «Сертификат соответствия») ·
 * 6419:314679 (документ «Правила БЖД») · 6419:314517 (редактирование).
 */

export interface AccountDoc {
  id: string;
  /** Тип (Устав / Сертификат / Договор). */
  type: string;
  /** Наименование документа. */
  name: string;
  /** Статус валидации (если есть). */
  status?: string;
  /** Бейдж типа верификации (Локальный / Международный). */
  badge?: string;
  badgeColor?: BadgeColor;
  /** Вариант бейджа: soft (по умолчанию) · solid. */
  badgeVariant?: BadgeVariant;
  date: string;
  /** verification — карточка верификации (с гайкой); document — простой документ;
   *  charter — полный устав (многосекционная страница). */
  kind: "verification" | "document" | "charter";
}

export const ACCOUNT_DOCS: AccountDoc[] = [
  { id: "ustav", type: "Устав", name: "Полный устав кооператива", status: "Отвалидирован", badge: "Локальный", badgeColor: "orange", badgeVariant: "solid", date: "24.08.2023", kind: "charter" },
  { id: "sertifikat", type: "Сертификат", name: "Сертификат соответствия", status: "Отвалидирован", badge: "Международный", badgeColor: "green", badgeVariant: "solid", date: "17.03.2023", kind: "verification" },
  { id: "bzhd", type: "Регламент", name: "Правила БЖД", date: "11.04.2025", kind: "document" },
];

export const getDoc = (id: string) => ACCOUNT_DOCS.find((d) => d.id === id);

/* ── Создаваемый по шаблону документ: плашка в табе «Документооборот» ─────────
   Один in-flow документ, проходящий 6 статусов флоу создания. Плашка в кабинете
   отражает текущий этап (Figma 6430:318689 · 6433:319072/319430 · 6434:319789 ·
   6434:320142 · 6434:320494). Тип/статус меняются: «Лицензия» → «Свидетельство». */
export type TemplateDocStage = "created" | "verify" | "validating" | "ready" | "signed";

/** id плашки in-flow документа в таблице «Документооборот». */
export const TEMPLATE_DOC_ID = "template-license";

/** Плашка in-flow документа для текущего этапа флоу. Бейдж — solid orange (#FAC06C). */
export function templateDocRow(stage: TemplateDocStage): AccountDoc {
  const base = {
    id: TEMPLATE_DOC_ID,
    name: "Лицензия на оказание тематических услуг связи",
    date: "22.04.2025",
    kind: "document" as const,
    badge: "Международный",
    badgeColor: "orange" as BadgeColor,
    badgeVariant: "solid" as BadgeVariant,
  };
  switch (stage) {
    case "created":
      return { id: base.id, name: base.name, date: base.date, kind: base.kind, type: "Лицензия", status: "Не отвалидирован" };
    case "verify":
      return { ...base, type: "Лицензия", status: "Не отвалидирован" };
    case "validating":
      return { ...base, type: "Свидетельство", status: "Ожидает подписания" };
    case "ready":
      return { ...base, type: "Свидетельство", status: "Ожидает участия" };
    case "signed":
      return { ...base, type: "Свидетельство", status: "Отвалидирован" };
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   ФЛОУ «Сторонние шаблоны» (Figma 6419:315570 …). Документ «Свидетельство о
   постановке на учёт в налоговом органе»: верификация выбирается ПЕРВОЙ, затем
   вложенный выбор Страна→Категория→Документ, форма, создание, валидатор.
   ════════════════════════════════════════════════════════════════════════════ */

/** id плашки in-flow стороннего документа в таблице «Документооборот». */
export const EXTERNAL_DOC_ID = "external-tax-cert";
/** Наименование стороннего документа (целевой шаблон, ведущий на форму). */
export const EXTERNAL_DOC_NAME = "Свидетельство о постановке на учёт в налоговом органе";

/** Префилл формы стороннего документа (Figma 6419:314016 / 314558). */
export const EXTERNAL_PREFILL = {
  company: 'Общество с ограниченной ответственностью "Сапфир"',
  ogrn: "1167700074915",
  date: "03.08.2018",
  taxOrg: "Инспекция Федеральной налоговой службы №3 по г. Москве",
  taxCode: "7703",
  inn: "9715286548",
  kpp: "770301001",
  signedBy: "И.В.Мансурова",
};

/** Плашка стороннего документа для текущего этапа флоу. Тип всегда «Свидетельство»,
 *  бейдж solid orange «Международный» (верификация выбрана заранее). */
export function externalDocRow(stage: TemplateDocStage): AccountDoc {
  const status =
    stage === "validating" ? "Ожидает подписания" :
    stage === "ready" ? "Ожидает участия" :
    stage === "signed" ? "Отвалидирован" :
    "Не отвалидирован";
  return {
    id: EXTERNAL_DOC_ID,
    type: "Свидетельство",
    name: EXTERNAL_DOC_NAME,
    status,
    badge: "Международный",
    badgeColor: "orange",
    badgeVariant: "solid",
    date: "19.05.2025",
    kind: "document",
  };
}

/* ── Вложенный выбор документа: Страна → Категория → Документ (Figma 6419:313823/
      313922). Целевой документ EXTERNAL_DOC_NAME ведёт на форму, остальные — мок. */
export interface ExtDoc {
  name: string;
  price: string;
}
export interface ExtCategory {
  name: string;
  docs: ExtDoc[];
}
export interface ExtCountry {
  code: string;
  name: string;
  flag: string;
  categories: ExtCategory[];
}

export const EXTERNAL_COUNTRIES: ExtCountry[] = [
  {
    code: "ru",
    name: "Россия",
    flag: "🇷🇺",
    categories: [
      { name: "Удостоверяющие личность", docs: [{ name: "Паспорт гражданина РФ", price: "0$" }, { name: "Заграничный паспорт", price: "2$" }] },
      { name: "Образование", docs: [{ name: "Диплом о высшем образовании", price: "1$" }, { name: "Аттестат о среднем образовании", price: "0$" }] },
      { name: "Медицина", docs: [{ name: "Медицинская книжка", price: "1$" }, { name: "Полис ОМС", price: "0$" }] },
      { name: "Делопроизводство", docs: [{ name: EXTERNAL_DOC_NAME, price: "5$" }, { name: "Выписка из ЕГРЮЛ", price: "3$" }, { name: "Устав организации", price: "0$" }, { name: "Приказ о назначении директора", price: "0$" }] },
    ],
  },
  {
    code: "de",
    name: "Германия",
    flag: "🇩🇪",
    categories: [
      { name: "Удостоверяющие личность", docs: [{ name: "Personalausweis", price: "2$" }, { name: "Reisepass", price: "3$" }] },
      { name: "Образование", docs: [{ name: "Diplom", price: "1$" }] },
      { name: "Делопроизводство", docs: [{ name: "Handelsregisterauszug", price: "4$" }, { name: "Gewerbeanmeldung", price: "2$" }] },
    ],
  },
  {
    code: "at",
    name: "Австрия",
    flag: "🇦🇹",
    categories: [
      { name: "Удостоверяющие личность", docs: [{ name: "Personalausweis", price: "2$" }, { name: "Reisepass", price: "3$" }] },
      { name: "Образование", docs: [{ name: "Diplom", price: "1$" }] },
      { name: "Делопроизводство", docs: [{ name: "Firmenbuchauszug", price: "4$" }, { name: "Gewerbeschein", price: "2$" }] },
    ],
  },
];

/** Кол-во документов в стране (для заголовка аккордеона «Россия (10)»). */
export const extCountryCount = (c: ExtCountry) => c.categories.reduce((n, cat) => n + cat.docs.length, 0);

/* ── Верификация «Сертификат соответствия» (Figma 6419:315630) ───────────── */
export const VERIFICATION_ROWS = (badge: ReactNode): DefRow[] => [
  { label: "Тип верификации", value: badge },
  { label: "Документ", value: "Сертификат соответствия" },
  { label: "№ сертификата", value: "RA.RU.11FD" },
  { label: "Срок действия", value: "17.03.2023 - 17.03.2026" },
  { label: "Наименование компании", value: 'Общество с ограниченной ответственностью "Сапфир"' },
  { label: "Продукция", value: "Справочно-правовая информационно-поисковая система Norma" },
  { label: "Код ОК", value: "58.29.29.000" },
  { label: "Соответствует требованиям", value: "Гост 28195-89, Гост 28806-90" },
  { label: "Сертификат выдан", value: 'ООО "Нанасофт разработка", Россия, 108811, г. Москва, п. Московский, 22-й км Киевского шоссе, д 4.' },
  { label: "Основание", value: "ООО ЦСПС № 04-11-23 от 09.02.2023" },
  { label: "Руководитель органа", value: "С.Д.Ратнер" },
  { label: "Руководитель органа", value: "Т.Н.Бубнова" },
];

/** Транзакции в блокчейне (Действие · Участники · Номер транзакции · Дата). */
export const BLOCKCHAIN_TX = [
  { action: "Подпись создателя документа", party: 'ООО "Сапфир"', date: "17.03.2023 - 16:40" },
  { action: "Подпись валидатора по зеленой международной верификации", party: 'ООО "Слон"', date: "17.03.2023 - 15:05" },
  { action: "Отправка валидатору", party: 'ООО "Сапфир"', date: "16.03.2023 - 11:25" },
];

/* ── Документ «Правила БЖД» (Figma 6419:314679 / 314517) ─────────────────── */
export const BZHD_RULES = [
  "Выполнять только ту работу, которая определена его должностной инструкцией.",
  "Содержать в чистоте рабочее место.",
  "Соблюдать режим труда и отдыха в зависимости от продолжительности, вида и категории трудовой деятельности.",
  "Соблюдать меры пожарной безопасности.",
];
export const BZHD_RULES_TEXT = BZHD_RULES.join("\n");

/* ── Полный устав кооператива (Figma 2542:437478) ───────────────────────── */
const OKVED = [
  "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;",
  "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;",
  "64.19 - Денежное посредничество прочее",
];

export const CHARTER_INFO = (badge: ReactNode): DefRow[] => [
  { label: "Тип верификации", value: badge },
  { label: "Тип документа", value: "Устав" },
  { label: "Регистрационный номер", value: "1057812345678" },
  { label: "Организация", value: "Потребительский кооператив «Иматра»" },
  { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Почтовый адрес", value: "191036, Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  { label: "Контактный телефон", value: "+7 (812) 401-32-18" },
  { label: "E-mail", value: "office@immatra.ru" },
  { label: "ОКВЭД", value: OKVED },
  { label: "ИНН", value: "7842315690" },
  { label: "Орган выдавший документ", value: "Управление Министерства юстиции РФ по Санкт-Петербургу" },
  { label: "Дата решения", value: "18.04.2018" },
  { label: "Дата внесения в ЕГРЮЛ", value: "26.04.2018" },
];

export const CHARTER_PAYERS: DefRow[] = [
  { label: "Председатель правления", value: "Степан А. А." },
  { label: "Председатель совета", value: "Розалина К. И." },
  { label: "Совет", value: ["Ганиш Г. И.", "Ванесса П. П.", "Александр Д. Р."] },
];

export const CHARTER_VOTING_MAIN: DefRow[] = [
  { label: "MIN продолжительность", value: "24-часа" },
  { label: "MAX продолжительность", value: "72-часа" },
  { label: "Кворум", value: "100 %" },
  { label: "Первоначальный кворум", value: "50 %" },
  { label: "Консенсус", value: "70 %" },
  { label: "Также роль", value: "Член совета" },
  { label: "Доступна к передаче", value: "Нет" },
];
export const CHARTER_VOTING_OTHER = [
  "Установление размера паевого взноса",
  "Избрание ревизионной комиссии",
  "Права в члены кооператива и исключение из членов кооператива",
  "Образование наблюдательного совета и прекращение полномочий его члена",
  "Распределение прибыли и убытков кооператива",
];

export const CHARTER_ACCOUNT: DefRow[] = [
  { label: "Тип счета", value: "Матрешка" },
  { label: "ОКВЭД", value: OKVED },
  { label: "Назначение счета", value: "Данный счет является основным расчетным счетом кооператива. Неделимый фонд. На него поступают все членские и целевые взносы." },
  { label: "Источник поступлений", value: "Целевые и членские взносы от пайщиков. Никакие другие платежи не принимаются." },
  { label: "Распределение целевого счета и подсчетов", value: ["100% - Целевой счет", "0% - Счет инвестиционных токенов", "0% - Счет управляющих токенов", "0% - Маршрутный счет"] },
];

export const CHARTER_DOCS = [
  { type: "Сертификат", name: "Сертификат соответствия", date: "17.03.2023" },
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программ ЭВМ", date: "06.12.2024" },
  { type: "Лицензия", name: "Лицензия на использование ЭВМ", date: "28.01.2025" },
];
