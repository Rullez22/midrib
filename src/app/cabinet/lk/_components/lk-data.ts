import { type InfoGroup } from "@/components/ds";
import { PH as CAB_PHOTO } from "../../[company]/_config/cabinet-activity";

/**
 * Данные личного кабинета (ЛК) пользователя — Антонов Илья Андреевич.
 * Пользователь одновременно Председатель правления и Пайщик кооператива Immatra.
 * Профиль ОДИНАКОВ для обеих ролей (Figma 1857:649798 — пред. правления /
 * 1857:649802 — пайщик). Различаются только: URL роли и список чатов справа.
 */

/**
 * Ключ ЛК — либо моя роль (chair/payer — это я, Антонов), либо слаг человека из
 * коллектива подразделения, на чью страницу я зашёл (assistant, joe, stepan …).
 * Валидный ключ — тот, что есть в LK_ROLES.
 */
export type LkRole = string;

/** Мои роли: только на них можно редактировать (карандаши) и голосовать. */
const SELF_ROLES = ["chair", "payer"];

/** Своя страница (моя) или чужая — я в гостях у подчинённого. */
export function isSelfRole(role: LkRole): boolean {
  return SELF_ROLES.includes(role);
}

export interface LkRoleConfig {
  key: LkRole;
  /** Короткая подпись (дропдаун роли + футер + карточка в сайдбаре). */
  short: string;
  /** Полная подпись роли (под именем в профиле + пункт дропдауна). */
  full: string;
  /** Должность на карточке обязательств («Член совета»). По умолчанию — full. */
  title?: string;
  /** Отдельная личность роли (напр. помощник — другой человек, другое фото). */
  name?: string;
  avatar?: string;
  /** Обложка профиля и карточки в сайдбаре — своя у каждого человека.
   *  По умолчанию — обложка Антонова (LK_USER.cover). */
  cover?: string;
  /** Имя на карточке — как в коллективе («Джо В. В.»). По умолчанию из ФИО. */
  card?: string;
}

/** Обложки профилей: у каждого человека своя (Figma-стиль — абстракции). */
const U = "https://images.unsplash.com/";
const COVER = {
  anna: `${U}photo-1541701494587-cb58502866ab?w=1200&q=80`,
  joe: `${U}photo-1550859492-d5da9d8e45f3?w=1200&q=80`,
  aleksandr: `${U}photo-1618005182384-a83a8bd57fbe?w=1200&q=80`,
  dmitriy: `${U}photo-1557672172-298e090bd0f1?w=1200&q=80`,
  rozalina: `${U}photo-1579546929518-9e396f3cc809?w=1200&q=80`,
  stepan: `${U}photo-1508739773434-c26b3d09e071?w=1200&q=80`,
  ganish: `${U}photo-1462331940025-496dfbfc7564?w=1200&q=80`,
  tsukerberg: `${U}photo-1451187580459-43490279c0fa?w=1200&q=80`,
  branderburg: `${U}photo-1614850523459-c2f4c699c52e?w=1200&q=80`,
  rozalinaK: `${U}photo-1533134486753-c833f0ed4866?w=1200&q=80`,
  vanessa: `${U}photo-1502691876148-a84978e59af8?w=1200&q=80`,
  aleksandrD: `${U}photo-1478760329108-5c3ed9d495a0?w=1200&q=80`,
  dmitriyA: `${U}photo-1550684376-efcbd6e3f031?w=1200&q=80`,
};

/** Фото участников коллектива Администрации (те же файлы, что в MEMBERS). */
const P_ILYA = "/members/ilya.png";
const P_JOE = "/members/joe.png";
const P_ALEKSANDR = "/members/aleksandr.png";
const P_DMITRIY = "/members/dmitriy.png";
const P_ROZALINA = "/members/rozalina.png";
const P_ANNA = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&q=80";

export const LK_ROLES: Record<LkRole, LkRoleConfig> = {
  chair: {
    key: "chair",
    short: "Пред. правления",
    full: "Председатель правления кооператива Immatra",
    title: "Председатель правления",
  },
  payer: {
    key: "payer",
    short: "Пайщик",
    full: "Пайщик кооператива Immatra",
    title: "Пайщик",
  },
  assistant: {
    key: "assistant",
    short: "Помощник пред. прав.",
    full: "Помощник председателя правления кооператива Immatra",
    title: "Помощник пред. правления",
    // Помощник — отдельный человек (не Антонов), другое фото.
    name: "Грум Анна Ивановна",
    avatar: P_ANNA,
    cover: COVER.anna,
  },

  /* ── Коллектив Администрации: ФИО из MEMBERS, имя на карточке — как в коллективе ── */
  joe: {
    key: "joe",
    short: "Пред. совета",
    full: "Председатель совета кооператива Immatra",
    title: "Председатель совета",
    name: "Джо Валенов Валенович",
    card: "Джо В. В.",
    avatar: P_JOE,
    cover: COVER.joe,
  },
  aleksandr: {
    key: "aleksandr",
    short: "Член совета",
    full: "Член совета кооператива Immatra",
    title: "Член совета",
    name: "Александр Дмитров Романович",
    card: "Александр Д. Р.",
    avatar: P_ALEKSANDR,
    cover: COVER.aleksandr,
  },
  dmitriy: {
    key: "dmitriy",
    short: "Член совета",
    full: "Член совета кооператива Immatra",
    title: "Член совета",
    name: "Дмитрий Александров Александрович",
    card: "Дмитрий А. А.",
    avatar: P_DMITRIY,
    cover: COVER.dmitriy,
  },
  rozalina: {
    key: "rozalina",
    short: "Член совета",
    full: "Член совета кооператива Immatra",
    title: "Член совета",
    name: "Розалина Курт Артуровна",
    card: "Розалина К. А.",
    avatar: P_ROZALINA,
    cover: COVER.rozalina,
  },

  /* ── Коллективы кабинетов 2–7: в данных только короткие имена ───────────── */
  stepan: {
    key: "stepan",
    short: "Пред. правления",
    full: "Председатель правления подразделения",
    title: "Председатель правления",
    name: "Степан А. А.",
    card: "Степан А. А.",
    avatar: CAB_PHOTO.stepan,
    cover: COVER.stepan,
  },
  ganish: {
    key: "ganish",
    short: "Помощник пред.",
    full: "Помощник председателя правления подразделения",
    title: "Помощник пред.",
    name: "Ганиш Г. И.",
    card: "Ганиш Г. И.",
    avatar: CAB_PHOTO.ganish,
    cover: COVER.ganish,
  },
  tsukerberg: {
    key: "tsukerberg",
    short: "Помощник пред.",
    full: "Помощник председателя правления подразделения",
    title: "Помощник пред.",
    name: "Цукерберг Г. И.",
    card: "Цукерберг Г. И.",
    avatar: CAB_PHOTO.tsukerberg,
    cover: COVER.tsukerberg,
  },
  branderburg: {
    key: "branderburg",
    short: "Помощник пред.",
    full: "Помощник председателя правления подразделения",
    title: "Помощник пред.",
    name: "Брандербург Г. И.",
    card: "Брандербург Г. И.",
    avatar: CAB_PHOTO.branderburg,
    cover: COVER.branderburg,
  },
  "rozalina-k": {
    key: "rozalina-k",
    short: "Пред. совета",
    full: "Председатель совета подразделения",
    title: "Председатель совета",
    name: "Розалина К. И.",
    card: "Розалина К. И.",
    avatar: CAB_PHOTO.rozalina,
    cover: COVER.rozalinaK,
  },
  vanessa: {
    key: "vanessa",
    short: "Помощник пред. совета",
    full: "Помощник председателя совета подразделения",
    title: "Помощник пред. совета",
    name: "Ванесса П. П.",
    card: "Ванесса П. П.",
    avatar: CAB_PHOTO.vanessa,
    cover: COVER.vanessa,
  },
  "aleksandr-d": {
    key: "aleksandr-d",
    short: "Член совета",
    full: "Член совета подразделения",
    title: "Член совета",
    name: "Александр Д. Р.",
    card: "Александр Д. Р.",
    avatar: CAB_PHOTO.aleksandr,
    cover: COVER.aleksandrD,
  },
  "dmitriy-a": {
    key: "dmitriy-a",
    short: "Член совета",
    full: "Член совета подразделения",
    title: "Член совета",
    name: "Дмитрий А. А.",
    card: "Дмитрий А. А.",
    avatar: CAB_PHOTO.dmitriy,
    cover: COVER.dmitriyA,
  },
};

/**
 * Слаг ЛК по фото участника коллектива. Карты раздельные: в Администрации и в
 * кабинетах 2–7 есть тёзки (Александр Д. Р., Дмитрий А. А., Розалина) — это
 * разные люди с разными фото, поэтому и страницы у них разные.
 */
const ADMIN_LK_BY_PHOTO: Record<string, LkRole> = {
  [P_ILYA]: "chair",
  [P_ANNA]: "assistant",
  [P_JOE]: "joe",
  [P_ALEKSANDR]: "aleksandr",
  [P_DMITRIY]: "dmitriy",
  [P_ROZALINA]: "rozalina",
};

const CABINET_LK_BY_PHOTO: Record<string, LkRole> = {
  [CAB_PHOTO.stepan]: "stepan",
  [CAB_PHOTO.ganish]: "ganish",
  [CAB_PHOTO.tsukerberg]: "tsukerberg",
  [CAB_PHOTO.branderburg]: "branderburg",
  [CAB_PHOTO.rozalina]: "rozalina-k",
  [CAB_PHOTO.vanessa]: "vanessa",
  [CAB_PHOTO.aleksandr]: "aleksandr-d",
  [CAB_PHOTO.dmitriy]: "dmitriy-a",
};

/** Слаг ЛК участника коллектива Администрации (`/cabinet/activity`). */
export function lkKeyByAdminPhoto(photo?: string): LkRole | undefined {
  return photo ? ADMIN_LK_BY_PHOTO[photo] : undefined;
}

/** Слаг ЛК участника коллектива кабинета 2–7. Пустой слот («-») ЛК не имеет. */
export function lkKeyByCabinetPhoto(photo?: string): LkRole | undefined {
  return photo ? CABINET_LK_BY_PHOTO[photo] : undefined;
}

export const LK_USER = {
  name: "Антонов Илья Андреевич",
  avatar: "/members/ilya.png",
  cover: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=1200&q=80",
};

/** Личность (имя + фото + обложка) для роли: люди коллектива — свои, chair/payer
 *  (это я, Антонов) — LK_USER. */
export function lkIdentity(role: LkRole): { name: string; avatar: string; cover: string } {
  const cfg = LK_ROLES[role];
  return {
    name: cfg.name ?? LK_USER.name,
    avatar: cfg.avatar ?? LK_USER.avatar,
    cover: cfg.cover ?? LK_USER.cover,
  };
}

/**
 * Короткое имя для карточки в сайдбаре: «Илья А. А.» / «Дмитрий А. Ш.». Люди
 * коллектива задают его явно (`card`) — их имена в данных лежат в другом порядке
 * («Джо Валенов Валенович») либо уже сокращены («Степан А. А.»).
 */
export function lkShortName(role: LkRole): string {
  const cfg = LK_ROLES[role];
  if (cfg.card) return cfg.card;
  const [last, first, middle] = lkIdentity(role).name.split(" ");
  return `${first ?? last} ${last?.[0] ?? ""}.${middle ? ` ${middle[0]}.` : ""}`;
}

/** Должность для карточки обязательств: «Член совета», «Пред. правления». */
export function lkTitle(role: LkRole): string {
  const cfg = LK_ROLES[role];
  return cfg.title ?? cfg.full;
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

export const LK_CHATS: Record<LkRole, LkChatItem[]> = {
  chair: CHAIR_CHATS,
  payer: PAYER_CHATS,
};

/**
 * Чаты страницы. Свои роли — свои списки чатов; на чужой странице список чатов
 * человека мне не виден, вижу только чат с ним самим (как было у помощника).
 */
export function lkChats(role: LkRole): LkChatItem[] {
  const own = LK_CHATS[role];
  if (own) return own;
  const me = lkIdentity(role);
  return [{ name: me.name, avatar: me.avatar }];
}
