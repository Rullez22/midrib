import { type InfoGroup } from "@/components/ds";

/**
 * Данные личного кабинета (ЛК) пользователя — Антонов Илья Андреевич.
 * Пользователь одновременно Председатель правления и Пайщик кооператива Immatra.
 * Профиль ОДИНАКОВ для обеих ролей (Figma 1857:649798 — пред. правления /
 * 1857:649802 — пайщик). Различаются только: URL роли и список чатов справа.
 */

export type LkRole = "chair" | "payer" | "assistant";

export interface LkRoleConfig {
  key: LkRole;
  /** Короткая подпись (дропдаун роли + футер). */
  short: string;
  /** Полная подпись роли (под именем в профиле + пункт дропдауна). */
  full: string;
  /** Отдельная личность роли (напр. помощник — другой человек, другое фото). */
  name?: string;
  avatar?: string;
}

export const LK_ROLES: Record<LkRole, LkRoleConfig> = {
  chair: {
    key: "chair",
    short: "Пред. правления",
    full: "Председатель правления кооператива Immatra",
  },
  payer: {
    key: "payer",
    short: "Пайщик",
    full: "Пайщик кооператива Immatra",
  },
  assistant: {
    key: "assistant",
    short: "Помощник пред. прав.",
    full: "Помощник председателя правления кооператива Immatra",
    // Помощник — отдельный человек (не Антонов), другое фото.
    name: "Грум Анна Ивановна",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&q=80",
  },
};

export const LK_USER = {
  name: "Антонов Илья Андреевич",
  avatar: "/members/ilya.png",
  cover: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=1200&q=80",
};

/** Личность (имя+фото) для роли: помощник — свой человек, остальные — LK_USER. */
export function lkIdentity(role: LkRole): { name: string; avatar: string } {
  const cfg = LK_ROLES[role];
  return { name: cfg.name ?? LK_USER.name, avatar: cfg.avatar ?? LK_USER.avatar };
}

/** Короткое имя для карточки в сайдбаре: «Илья А. А.» / «Дмитрий А. Ш.». */
export function lkShortName(role: LkRole): string {
  const [last, first, middle] = lkIdentity(role).name.split(" ");
  return `${first ?? last} ${last?.[0] ?? ""}.${middle ? ` ${middle[0]}.` : ""}`;
}

/* ── Профиль (одинаков для обеих ролей) ─────────────────────────────────── */

const A2 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80";
const A3 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80";

export const LK_INFO_GROUPS: InfoGroup[] = [
  {
    heading: "Описание",
    text: "Пайщик кооператива Immatra с 2019 года. Отвечаю за операционные вопросы и взаимодействие с партнёрами. Участвую в голосованиях совета и развитии новых направлений.",
  },
  {
    heading: "Контакты",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, ул. Комиссара Смирнова, 15, кв. 42" },
      { label: "Контактный телефон", value: "+7 (921) 706-84-33" },
      { label: "E-mail", value: "i.antonov@mail.ru" },
    ],
  },
  {
    heading: "Личные данные",
    rows: [
      { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
      { label: "Фамилия", value: "Антонов" },
      { label: "Имя", value: "Илья" },
      { label: "Отчество", value: "Андреевич" },
      { label: "Номер паспорта", value: "40 12 574903" },
      { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
      { label: "Дата выдачи", value: "14.03.2012" },
    ],
  },
];

export const LK_REQUIREMENTS = [
  { name: "Подтверждённый домен", type: "Домен", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Верификация паспорта", type: "Документы", badge: { label: "Пройдена", color: "green" as const } },
];

export const LK_ACHIEVEMENTS = [
  { logo: A2, title: "Победитель конкурса «Кооператив года» в номинации «Цифровые сервисы»", org: "Ассоциация кооперативов СЗФО", date: "февраль 2025" },
  { logo: A3, title: "Благодарность за организацию благотворительного сбора", org: "Фонд «Живу с Культурой»", date: "сентябрь 2024" },
  { logo: LK_USER.avatar, title: "Диплом программы «Управление потребительским кооперативом»", org: "Учебный центр кооператива «Immatra»", date: "июнь 2022" },
];

export const LK_HISTORY = [
  { avatar: LK_USER.avatar, name: "Антонов Илья Андреевич", period: "март 2023 — настоящее время · 2 года 4 месяца" },
  { avatar: A2, name: "Михайлов Денис Сергеевич", period: "июнь 2022 — март 2023 · 9 месяцев" },
  { avatar: A3, name: "Соколов Максим Алексеевич", period: "февраль 2021 — июнь 2022 · 1 год 4 месяца" },
];

const POST_IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";

export const LK_FEED_POSTS = [
  { title: "Выезд на объект в Дегтярном переулке", date: "12 апреля 2025", text: "Провёл осмотр площадки перед началом работ, согласовал график с подрядчиком и подготовил фотоотчёт для совета.", media: { type: "image" as const, src: POST_IMG } },
  { title: "Прикрепил документы к отчёту", date: "8 апреля 2025", media: { type: "documents" as const, files: ["Акт осмотра", "Смета работ"] } },
];

/* ── Список чатов (единственное различие между ролями) ──────────────────── */

export interface LkChatItem {
  name: string;
  /** Групповой чат (иконка-группа) вместо фото. */
  group?: boolean;
  /** URL фото собеседника. */
  avatar?: string;
  /** Число непрочитанных. */
  unread?: number;
}

const ANNA = "/members/rozalina.png";
const VALERIY = "/members/aleksandr.png";
const ELEPHANT = "/members/joe.png";

/** Пред. правления — 3 групповых чата подразделения/совета + личные (Figma 1857:649798). */
const CHAIR_CHATS: LkChatItem[] = [
  { name: "Внутренний чат (подразделение)", group: true, unread: 1 },
  { name: "Внешний чат (подразделение)", group: true },
  { name: "Чат совета", group: true },
  { name: "Анна Грум", avatar: ANNA },
  { name: "Валерий Канов", avatar: VALERIY },
  { name: "Кооператив «Слонёнок»", avatar: ELEPHANT },
];

/** Пайщик — только внутренний чат подразделения + личные (Figma 1857:649802). */
const PAYER_CHATS: LkChatItem[] = [
  { name: "Внутренний чат (подразделение)", group: true, unread: 1 },
  { name: "Анна Грум", avatar: ANNA },
  { name: "Валерий Канов", avatar: VALERIY },
  { name: "Кооператив «Слонёнок»", avatar: ELEPHANT },
];

/** Помощник пред. — единственный чат (только с ней), без списка. */
const ASSISTANT_CHATS: LkChatItem[] = [
  { name: LK_ROLES.assistant.name!, avatar: LK_ROLES.assistant.avatar },
];

export const LK_CHATS: Record<LkRole, LkChatItem[]> = {
  chair: CHAIR_CHATS,
  payer: PAYER_CHATS,
  assistant: ASSISTANT_CHATS,
};
