import { type BadgeColor } from "@/components/ds";
import { type DeptProfileData, CABINET_LIST } from "./cabinets";
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
} from "../../subdivision/administration/_components/subdivision-data";

/**
 * Данные экрана «О компании» (кооператив-уровень). Профиль кооператива Immatra
 * собран из тех же мок-блоков, что и подразделения (subdivision-data), но с
 * именем/типом кооператива. Лендинг и список пайщиков — 1:1 из Figma
 * (1857-650112 / 650116), названия подразделений подставляются из текущих
 * `CABINETS` в самом экране.
 */

export const COOP_NAME = "Кооператив Immatra";
export const COOP_TYPE = "Потребительский кооператив";
export const COOP_MEMBERS = "120 пайщиков";
export const COOP_ORG = "Immatra";

/** Профиль кооператива для `DeptProfile` (Информация / Лента). */
export const COOP_PROFILE: DeptProfileData = {
  name: COOP_NAME,
  role: COOP_TYPE,
  org: COOP_ORG,
  cover: SUBDIVISION_COVER,
  infoGroups: INFO_GROUPS,
  charterRows: CHARTER_ROWS,
  requirements: REQUIREMENTS,
  achievements: ACHIEVEMENTS,
  ageGroups: AGE_GROUPS,
  devices: DEVICES,
  geoCountries: GEO_COUNTRIES,
  geoCities: GEO_CITIES,
  feedPosts: FEED_POSTS,
};

/** Лендинг IMMATRA (Figma 1857-650112): герой + аккордеон-пункты. */
export const LANDING_HERO = {
  brand: "IMMATRA",
  tagline: "Дом для твоей уникальности",
  lead:
    "Мы создаём платформу для осознанного человека, который хочет безопасно и эффективно взаимодействовать с окружающим миром, не теряя контроль над своими данными, а также для организаций, ориентированных на людей.",
};

export const LANDING_SECTIONS: { title: string; meta: string; body: string; tint: string }[] = [
  {
    title: "Что нами движет",
    meta: "Цель",
    body: "Человек не должен раздавать копии паспорта десяткам сервисов, чтобы снять квартиру или устроиться на работу. Мы строим среду, где данные принадлежат человеку, а организации получают только то, что им действительно нужно, и только с его согласия.",
    tint: "linear-gradient(135deg,#f9c5d1,#fbc2eb)",
  },
  {
    title: "IMMATRA",
    meta: "Идея",
    body: "Кооператив объединяет пайщиков, сервисы и валидаторов в одну сеть доверия. Документ проверяется один раз — дальше подтверждение живёт в блокчейне, и его можно предъявить любому участнику сети без повторной проверки и бумажных копий.",
    tint: "linear-gradient(135deg,#fbd38d,#f6ad55)",
  },
  {
    title: "Для веб-сервисов",
    meta: "Соответствие стандартам",
    body: "Сервис подключается к платформе и запрашивает у пользователя только нужные поля, с зафиксированным основанием и сроком. Согласия, запросы и их отзыв хранятся в блокчейне — это закрывает требования к обработке персональных данных без своего хранилища документов.",
    tint: "linear-gradient(135deg,#c4b5fd,#a78bfa)",
  },
  {
    title: "Для пользователя",
    meta: "Безопасное взаимодействие",
    body: "Вы видите, какой сервис, когда и на каком основании запросил ваши данные, и можете отозвать доступ в один клик. Документы подтверждаются один раз, а дальше вы делитесь не копией паспорта, а фактом проверки — например, только тем, что вам больше 18 лет.",
    tint: "linear-gradient(135deg,#93c5fd,#60a5fa)",
  },
  {
    title: "Для валидаторов",
    meta: "Новая бизнес-модель",
    body: "Валидатор зарабатывает на проверке документов и на реферальной сети: вознаграждение начисляется за каждую верификацию и за активацию шаблонов его структуры. Правила и тарифы описаны в реестрах, а расчёты проходят прозрачно и подтверждаются транзакциями.",
    tint: "linear-gradient(135deg,#86efac,#4ade80)",
  },
];

/**
 * Карточки оргструктуры (Figma 1894-709614). У каждого подразделения — СВОИ
 * отделы (не заглушка!). Названия — из ТЕКУЩИХ подразделений: Администрация (№1)
 * + кабинеты рейки 2–7; отделы/цвета — из оргструктуры кооператива.
 * Рендерится готовым композитом `ProfileCard`.
 */
export interface StructureDept {
  slug: string;
  name: string;
  color: BadgeColor;
  items: string[];
  /** Руководитель подразделения — свой у каждого отдела. */
  head: string;
}

// Буллеты карточки = текущие СТРАНИЦЫ подразделения (пункты его сайдбара):
// общие (Деятельность, Счета) + специфичные из `cabinet.menu`.
const COMMON_PAGES = ["Деятельность", "Счета"];
const DEPT_ITEMS: string[][] = [
  [...COMMON_PAGES, "Пайщики", "Партнеры"], // Администрация (кабинет №1)
  ...CABINET_LIST.map((c) => [...COMMON_PAGES, ...c.menu.map((m) => m.label)]),
];
const DEPT_COLORS: BadgeColor[] = ["red", "orange", "yellow", "green", "blue", "cyan", "purple"];
const DEPT_NAMES = ["Администрация", ...CABINET_LIST.map((c) => c.name)];
const DEPT_SLUGS = ["administration", ...CABINET_LIST.map((c) => c.slug)];
/** Администрация — председатель правления (тот же, что первым в коллективе). */
const DEPT_HEADS = [
  "Степан А. А.",
  "Соколов М. А.",
  "Новикова Е. П.",
  "Кузнецова О. И.",
  "Михайлов Д. С.",
  "Морозов В. Н.",
  "Волкова Т. Г.",
];

export const STRUCTURE_DEPARTMENTS: StructureDept[] = DEPT_NAMES.map((name, i) => ({
  slug: DEPT_SLUGS[i],
  name,
  color: DEPT_COLORS[i],
  items: DEPT_ITEMS[i],
  head: DEPT_HEADS[i] ?? "Не назначено",
}));

/** Пайщики кооператива (Figma 650116) — список имён для таблицы. */
export const COOP_PEERS = [
  "Илья Антонов",
  "Анна Козлова",
  "Дмитрий Михайлов",
  "Валерий Антонов",
  "Влад Шульц",
  "Илья Попов",
  "Екатерина Новикова",
];
