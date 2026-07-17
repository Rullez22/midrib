import { type ReactNode } from "react";
import { type MenuBadgeColor, type InfoGroup } from "@/components/ds";
import {
  INFO_GROUPS,
  CHARTER_ROWS,
  REQUIREMENTS,
  ACHIEVEMENTS,
  AGE_GROUPS,
  DEVICES,
  GEO_COUNTRIES,
  GEO_CITIES,
  FEED_POSTS,
  SUBDIVISION_COVER,
  CHAT_MESSAGES,
  PEER_AVATAR,
  type ChatMessage,
} from "../../subdivision/administration/_components/subdivision-data";
import { CabinetMenuIcon } from "../_components/cabinet-menu-icons";

/**
 * Конфигурация кабинетов 2–7 (рейка). Кабинет №1 (Администрация) живёт в /cabinet.
 * Каждый кабинет — отдельная компания-подразделение: свой профиль, своё боковое
 * меню, свой чат. Контент профиля — общий мок из subdivision-data (Описание /
 * Контакты / Устав / Требования / Достижения / Статистика / Лента) с подменой
 * имени и контактов. Ничего нового не верстаем — собираем из DS/композитов.
 *
 * Источник Figma: 1994-823130 (Валидатор) / 1857-649696 (Веб-ресурс) /
 * 1857-649701 (Домены) / 1857-649464 (Исполнитель) / 6820-554868 (Регулятор) /
 * 6945-550651 (ВУЗы).
 */

export interface CabinetMenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  /** Подпуть внутри /cabinet/[company]; "" — главный экран. */
  path: string;
  /** Пункт скрыт в сайдбаре, пока не пройден соответствующий флоу (ВУЗы). */
  lockedUntil?: "diploma" | "additions";
}

export interface DeptProfileData {
  name: string;
  role: string;
  org: string;
  cover: string;
  /** Фото-аватар (url). Если нет — кружок с названием кооператива. */
  avatar?: string;
  infoGroups: InfoGroup[];
  charterRows: { label: string; value: string | string[] }[];
  requirements: typeof REQUIREMENTS;
  achievements: typeof ACHIEVEMENTS;
  ageGroups: typeof AGE_GROUPS;
  devices: typeof DEVICES;
  geoCountries: typeof GEO_COUNTRIES;
  geoCities: typeof GEO_CITIES;
  feedPosts: typeof FEED_POSTS;
}

export interface CabinetConfig {
  slug: string;
  /** Номер на рейке (2–7). */
  rail: number;
  railColor: MenuBadgeColor;
  /** Имя подразделения (заголовок профиля и карточки в сайдбаре). */
  name: string;
  /** Подзаголовок профиля. */
  role: string;
  /** Фото-аватар подразделения. */
  avatar: string;
  cover: string;
  /** Подпись под заголовком чата справа. */
  chatSubtitle: string;
  chatMessages: ChatMessage[];
  /** Кабинет-специфичные пункты меню (помимо Деятельность + Счета). */
  menu: CabinetMenuItem[];
}

const ORG = "Immatra";
const ROLE = "Подразделение кооператива Immatra";

/**
 * Реквизиты подразделения: адрес — общий, кооператива Immatra (подразделения
 * сидят в одном офисе), а телефон (добавочный отдела), почта и описание — свои
 * у каждого кабинета.
 */
const DEPT_CONTACTS: Record<string, { phone: string; email: string; desc: string }> = {
  validator: {
    phone: "+7 (812) 401-32-24",
    email: "validator@immatra.ru",
    desc: "Подразделение «Валидатор» проверяет заявки и документы пайщиков: сверяет реквизиты с реестрами, подтверждает подлинность и выдаёт статус «отвалидирован». Работает с международными и локальными типами верификации, ведёт реферальную сеть валидаторов.",
  },
  web: {
    phone: "+7 (812) 401-32-31",
    email: "web@immatra.ru",
    desc: "Подразделение «Веб-ресурс» отвечает за сайт кооператива и личные кабинеты пайщиков: регистрации новых участников, доступность сервисов и развитие интерфейсов. Ведёт статистику посещений и обрабатывает обращения из формы регистрации.",
  },
  domains: {
    phone: "+7 (812) 401-32-45",
    email: "domains@immatra.ru",
    desc: "Подразделение «Домены» ведёт доменные имена и реестры кооператива: дерево доменов по странам и категориям, шаблоны документов и требования к ним. Делегирует поддомены пайщикам и распределяет вознаграждения между владельцами шаблонов.",
  },
  executor: {
    phone: "+7 (812) 401-32-58",
    email: "executor@immatra.ru",
    desc: "Подразделение «Исполнитель» ведёт договорную работу с партнёрами кооператива: сделки, согласование условий и закрывающие документы. Сопровождает партнёра от первого обращения до подписанного акта и следит за сроками расчётов.",
  },
  regulator: {
    phone: "+7 (812) 401-32-60",
    email: "regulator@immatra.ru",
    desc: "Подразделение «Регулятор» разрабатывает внутренние регламенты кооператива и обеспечивает сервисы для пайщиков: справки, консультации и разбор спорных ситуаций. Следит за тем, чтобы внутренние документы не противоречили уставу.",
  },
  vuz: {
    phone: "+7 (812) 401-32-77",
    email: "vuz@immatra.ru",
    desc: "Подразделение «ВУЗы» ведёт образовательные программы кооператива: направления обучения, приём слушателей и выдачу дипломов с записью в блокчейн. Обновляет программы вместе с партнёрами и хранит историю выданных документов.",
  },
  fond: {
    phone: "+7 (812) 401-32-89",
    email: "fond@immatra.ru",
    desc: "Подразделение «Фонд» ведёт адресную помощь и целевые сборы: проверяет основания заявок, публикует цели и отчитывается по расходованию средств. Работает с благотворительными фондами-партнёрами и ведёт статистику по каждой цели.",
  },
};

/** Контакты профиля с подменой домена/почты/телефона и описания под кабинет. */
function infoGroups(domain: string, email: string, phone: string, desc: string): InfoGroup[] {
  return [
    { ...INFO_GROUPS[0], text: desc },
    {
      heading: "Контактная информация",
      rows: [
        { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
        { label: "Контактный телефон", value: phone },
        { label: "Домен", value: domain },
        { label: "E-mail", value: email },
      ],
    },
  ];
}

/** Общий профиль-контент (мок) с подменой имени/контактов. */
function deptData(name: string, opts: { avatar: string; domain: string; email: string; phone: string; desc: string }): DeptProfileData {
  return {
    name,
    role: ROLE,
    org: ORG,
    cover: SUBDIVISION_COVER,
    avatar: opts.avatar,
    infoGroups: infoGroups(opts.domain, opts.email, opts.phone, opts.desc),
    charterRows: CHARTER_ROWS,
    requirements: REQUIREMENTS,
    achievements: ACHIEVEMENTS,
    ageGroups: AGE_GROUPS,
    devices: DEVICES,
    geoCountries: GEO_COUNTRIES,
    geoCities: GEO_CITIES,
    feedPosts: FEED_POSTS,
  };
}

const I = CabinetMenuIcon;

const AV = {
  validator: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=240&q=80",
  web: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=240&q=80",
  domains: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=240&q=80",
  executor: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=240&q=80",
  regulator: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=240&q=80",
  vuz: "https://images.unsplash.com/photo-1562774053-701939374585?w=240&q=80",
  fond: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=240&q=80",
};

export const CABINETS: Record<string, CabinetConfig> = {
  validator: {
    slug: "validator",
    rail: 2,
    railColor: "orange",
    name: "Валидатор",
    role: ROLE,
    avatar: AV.validator,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "18 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [
      { key: "zayavki", label: "Заявки", icon: <I.Requests />, path: "zayavki" },
      { key: "processed", label: "Обработанные", icon: <I.Processed />, path: "processed" },
      { key: "referral", label: "Реферальные", icon: <I.Referral />, path: "referral" },
      { key: "templates", label: "Шаблоны", icon: <I.Templates />, path: "templates" },
    ],
  },
  web: {
    slug: "web",
    rail: 3,
    railColor: "yellow",
    name: "Веб-ресурс",
    role: ROLE,
    avatar: AV.web,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "12 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [{ key: "registrations", label: "Регистрации", icon: <I.Registrations />, path: "registrations" }],
  },
  domains: {
    slug: "domains",
    rail: 4,
    railColor: "green",
    name: "Домены",
    role: ROLE,
    avatar: AV.domains,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "9 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [{ key: "registers", label: "Реестры", icon: <I.Registers />, path: "registers" }],
  },
  executor: {
    slug: "executor",
    rail: 5,
    railColor: "blue",
    name: "Исполнитель",
    role: ROLE,
    avatar: AV.executor,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "24 пайщика",
    chatMessages: CHAT_MESSAGES,
    menu: [{ key: "partners", label: "Партнеры", icon: <I.Partners />, path: "partners" }],
  },
  regulator: {
    slug: "regulator",
    rail: 6,
    railColor: "blue-strong",
    name: "Регулятор",
    role: ROLE,
    avatar: AV.regulator,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "14 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [{ key: "servisy", label: "Сервисы", icon: <I.Spravki />, path: "servisy" }],
  },
  vuz: {
    slug: "vuz",
    rail: 7,
    railColor: "purple",
    name: "ВУЗы",
    role: ROLE,
    avatar: AV.vuz,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "11 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [
      { key: "direction", label: "Направление", icon: <I.Direction />, path: "direction" },
      { key: "diploma", label: "Выдача диплома", icon: <I.Diploma />, path: "diploma", lockedUntil: "diploma" },
      { key: "additions", label: "Дополнения", icon: <I.Additions />, path: "additions", lockedUntil: "additions" },
      { key: "history", label: "История операций", icon: <I.History />, path: "history" },
    ],
  },
  // Подразделение 8 «Фонд» — копия «Исполнителя» (5), цвет cyan. Меню: Цели →
  // Партнёры → Статистика.
  fond: {
    slug: "fond",
    rail: 8,
    railColor: "cyan",
    name: "Фонд",
    role: ROLE,
    avatar: AV.fond,
    cover: SUBDIVISION_COVER,
    chatSubtitle: "12 пайщиков",
    chatMessages: CHAT_MESSAGES,
    menu: [
      { key: "goals", label: "Цели", icon: <I.Goals />, path: "goals" },
      { key: "partners", label: "Партнеры", icon: <I.Partners />, path: "partners" },
      { key: "statistics", label: "Статистика", icon: <I.Statistics />, path: "statistics" },
    ],
  },
};

export const CABINET_LIST = Object.values(CABINETS).sort((a, b) => a.rail - b.rail);

export function getCabinet(slug: string): CabinetConfig | undefined {
  return CABINETS[slug];
}

/**
 * Цвет рейки подразделения по слагу — им красятся каскад, карточки и стрелки.
 * Администрация (кабинет №1) в CABINETS не лежит, её цвет — red; он же дефолт
 * для неизвестного слага.
 */
export function railColorOf(slug?: string): MenuBadgeColor {
  if (!slug || slug === "administration") return "red";
  return getCabinet(slug)?.railColor ?? "red";
}

/** Профиль-данные кабинета (мок-контент с подменой имени/контактов). */
export function cabinetDeptData(c: CabinetConfig): DeptProfileData {
  const domain = `${c.slug}.immatra.ru`;
  const contacts = DEPT_CONTACTS[c.slug];
  return deptData(c.name, {
    avatar: c.avatar,
    domain,
    email: contacts?.email ?? `${c.slug}@immatra.ru`,
    phone: contacts?.phone ?? "+7 (812) 401-32-18",
    desc: contacts?.desc ?? INFO_GROUPS[0].text ?? "",
  });
}

export { PEER_AVATAR };
