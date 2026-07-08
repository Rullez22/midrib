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
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec.",
  },
  {
    heading: "Контакты",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
  {
    heading: "Личные данные",
    rows: [
      { label: "Адрес", value: "0xca30e63200a0fe3182dc61fc5605efc41456f32" },
      { label: "Фамилия", value: "Антонов" },
      { label: "Имя", value: "Илья" },
      { label: "Отчество", value: "Андреевич" },
      { label: "Номер паспорта", value: "45 67 345678" },
      { label: "Кем выдан", value: "ТП № 19 Калининского района, г. Санкт-Петербург" },
      { label: "Дата выдачи", value: "25.12.2005" },
    ],
  },
];

export const LK_REQUIREMENTS = [
  { name: "Требование 1", type: "Домен", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Требование 2", type: "Домен", badge: { label: "Зеленый", color: "green" as const } },
];

export const LK_ACHIEVEMENTS = [
  { logo: A2, title: "Google cooperation hackfest - the 1st place", org: "Google corp.", date: "август 2019" },
  { logo: A3, title: "Apple cooperation hackfest - the 1st place", org: "Apple corp.", date: "август 2018" },
  { logo: LK_USER.avatar, title: "Angelhack cooperation hackfest - the 1st place", org: "AngelList", date: "август 2016" },
];

export const LK_HISTORY = [
  { avatar: LK_USER.avatar, name: "Антонов Илья Андреевич", period: "август 2019 — настоящее время · 2 года 3 месяца" },
  { avatar: A2, name: "Ан Дмитрий Шпакович", period: "август 2017 — август 2019 · 2 года" },
  { avatar: A3, name: "Варламов Илья Варламович", period: "август 2014 — август 2017 · 3 года" },
];

const POST_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A, sed pulvinar scelerisque maecenas volutpat. Ornare in massa, blandit est, venenatis posuere felis, dolor.";
const POST_IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";

export const LK_FEED_POSTS = [
  { title: "Departure to the site of installation", date: "Август 23, 2019", text: POST_TEXT, media: { type: "image" as const, src: POST_IMG } },
  { title: "Departure to the site of installation", date: "Август 23, 2019", media: { type: "documents" as const, files: ["Лунная соната", "Дневник №1"] } },
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
  { name: "Кооператива Слоненок", avatar: ELEPHANT },
];

/** Пайщик — только внутренний чат подразделения + личные (Figma 1857:649802). */
const PAYER_CHATS: LkChatItem[] = [
  { name: "Внутренний чат (подразделение)", group: true, unread: 1 },
  { name: "Анна Грум", avatar: ANNA },
  { name: "Валерий Канов", avatar: VALERIY },
  { name: "Кооператива Слоненок", avatar: ELEPHANT },
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
