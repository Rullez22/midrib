import { type ReactNode } from "react";
import { BADGE_COLOR_VAR, type MenuBadgeColor, type InfoGroup } from "@/components/ds";
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
  /** Имя подразделения-воркспейса: заголовок профиля, карточка в сайдбаре,
   *  оргструктура (HR, Производство …). */
  name: string;
  /** Имя раздела в меню подразделений Администрации — прежнее, по функции
   *  (Валидатор, Веб-ресурс …). По умолчанию совпадает с `name`. */
  sectionName?: string;
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
  /** Скрыт как воркспейс: нет ни в рейке, ни в оргструктуре. В меню подразделений
   *  Администрации раздел остаётся — его страницы никуда не делись. */
  hidden?: boolean;
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

/** Аватар Администрации (кабинет №1). Её самой в CABINETS нет — она живёт в
 *  /cabinet, — но фото нужно и карточке в сайдбаре, и её блоку ЦКП. */
export const ADMIN_AVATAR = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=240&q=80";

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
    name: "HR",
    sectionName: "Валидатор",
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
    name: "Производство",
    sectionName: "Веб-ресурс",
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
    name: "Коммуникации",
    sectionName: "Домены",
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
    name: "Развитие",
    sectionName: "Исполнитель",
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
    name: "Квалификации",
    sectionName: "Регулятор",
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
    name: "Распределение",
    sectionName: "ВУЗы",
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
    // Скрыт из навигации по решению структуры (рейка 1–7, оргструктура — 7 карточек).
    hidden: true,
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

/** Все кабинеты по порядку рейки, включая скрытые: их страницы остаются
 *  доступными из меню подразделений в Администрации. */
export const CABINET_ALL = Object.values(CABINETS).sort((a, b) => a.rail - b.rail);

/** Кабинеты-воркспейсы: рейка и оргструктура — без скрытых. */
export const CABINET_LIST = CABINET_ALL.filter((c) => !c.hidden);

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

/**
 * Приглушённая палитра подразделения: подсветка карточки департамента (border/bg)
 * + cover-градиент обложки аватара; `border` — он же цвет иконки-квадратика в
 * блоке ЦКП / «Общих сведениях». Это МЯГКИЙ тон — в отличие от яркого ACCENT
 * (cabinet-activity), которым красятся каскад и стрелки-связки.
 * Живёт в конфиге, а не в сайдбаре: палитру тянут и ЛК, и экраны деятельности.
 */
export const CARD_TINT: Record<MenuBadgeColor, { border: string; bg: string; cover: string }> = {
  red: { border: "#e8a0a8", bg: "#fdf3f4", cover: "linear-gradient(120deg,#f9c5d1,#a18cd1,#84fab0)" },
  orange: { border: "#f0c38a", bg: "#fff7ec", cover: "linear-gradient(120deg,#fbd38d,#f6ad55,#fc8181)" },
  yellow: { border: "#ecd98a", bg: "#fffbec", cover: "linear-gradient(120deg,#fef08a,#facc15,#fb923c)" },
  green: { border: "#a7e0b0", bg: "#f1faf2", cover: "linear-gradient(120deg,#86efac,#4ade80,#22d3ee)" },
  blue: { border: "#a9c7f0", bg: "#eef4fd", cover: "linear-gradient(120deg,#93c5fd,#60a5fa,#818cf8)" },
  "blue-strong": { border: "#8fb4ee", bg: "#eaf1fd", cover: "linear-gradient(120deg,#60a5fa,#3b82f6,#6366f1)" },
  purple: { border: "#c9b6ec", bg: "#f6f2fc", cover: "linear-gradient(120deg,#c4b5fd,#a78bfa,#f0abfc)" },
  cyan: { border: "#8fd6de", bg: "#eafafb", cover: "linear-gradient(120deg,#a5f3fc,#22d3ee,#38bdf8)" },
};

/**
 * Цвет иконки-квадратика (структура/ЦКП) для подразделения. Наследуется от бейджа
 * рейки 1–8 (BADGE_COLOR_VAR) — единственный источник цвета подразделения.
 */
export function ckpIconColor(slug?: string): string {
  return BADGE_COLOR_VAR[railColorOf(slug)];
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
