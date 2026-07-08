import { type MenuBadgeColor } from "@/components/ds";

/**
 * Данные таба «Деятельность → Структура» для кабинетов 2–7. Коллектив (с ролями
 * и статусами) и каскад структуры различаются у каждого кабинета — берутся из
 * Figma 1:1. Акцент-цвет каскада/карточек = цвет рейки кабинета. «План развития»
 * и «Обучение» одинаковы с кабинетом №1 (переиспользуются PlanPanel/EduPanel).
 */

export interface CollectiveMember {
  name: string;
  role: string;
  photo?: string;
  status: "active" | "inactive";
}

export interface CascadeFunc {
  text: string;
  role: string;
}
export interface CascadeQuestion {
  title: string;
  body?: string;
  open?: boolean;
}
export interface CascadeData {
  depts: { title: string; active?: boolean }[];
  sections: { title: string; active?: boolean }[];
  funcs: { items: CascadeFunc[]; activeIdx: number };
  questions: CascadeQuestion[];
}

export interface CabinetActivityData {
  /** Подпись «N пайщиков» в блоке ЦКП. */
  membersLabel: string;
  ckpDesc: string;
  collective: CollectiveMember[];
  cascade: CascadeData;
}

/** Акцент каскада/карточек по цвету рейки кабинета (border + светлая заливка). */
export const ACCENT: Record<MenuBadgeColor, { border: string; bg: string }> = {
  red: { border: "#e5424d", bg: "#fde9ed" },
  orange: { border: "#f6ad55", bg: "#fff5e9" },
  yellow: { border: "#e8c14a", bg: "#fdf8e7" },
  green: { border: "#56c271", bg: "#ecf8ef" },
  blue: { border: "#5a9bf0", bg: "#eaf2fd" },
  "blue-strong": { border: "#3b82f6", bg: "#e8f0fd" },
  purple: { border: "#a78bfa", bg: "#f3eefc" },
  cyan: { border: "#3fb8c4", bg: "#e7f8fa" },
};

const P = "https://images.unsplash.com/";
const PH = {
  stepan: `${P}photo-1500648767791-00dcc994a43e?w=200&q=80`,
  ganish: `${P}photo-1507003211169-0a1dd7228f2d?w=200&q=80`,
  rozalina: `${P}photo-1438761681033-6461ffad8d80?w=200&q=80`,
  vanessa: `${P}photo-1494790108377-be9c29b29330?w=200&q=80`,
  aleksandr: `${P}photo-1472099645785-5658abf4ff4e?w=200&q=80`,
  dmitriy: `${P}photo-1519085360753-af0119f7cbe7?w=200&q=80`,
  tsukerberg: `${P}photo-1506794778202-cad84cf45f1d?w=200&q=80`,
  branderburg: `${P}photo-1492562080023-ab3db95bfbce?w=200&q=80`,
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam ac nec sit sit massa quam. Eleifend sed massa duis magna lacus ut neque faucibus viverra. At nec morbi nisi.";

const VEST = "Vestibulum justo sollicitudin vitae sum dolor sit amet";
const VEST_LONG = "Vestibulum justo sollicitudin vitae sum dolor sit amet ipsum dolor sit ame";

const CKP_DESC =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat eLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat euismod. Vel sed non gravida pharetra semper. Enim plerisque tem.";

/** Каскад одинаков у кабинетов 2–7 (текст лорема, активные позиции). Акцент-цвет
 * подставляется автоматически по цвету рейки кабинета (ACCENT). Также
 * переиспользуется в ЛК «Деятельность → Структура» (тот же каскад, красный акцент). */
export const CASCADE_SHARED: CascadeData = {
  depts: [
    { title: "Отдел источника", active: true },
    { title: "Отдел председателя" },
    { title: "Отдел офф. вопросов" },
  ],
  sections: [
    { title: "Секция счетов и сборов", active: true },
    { title: "Секция сбора дебиторской задолжности" },
    { title: "Секция ведения взаиморасчетов и первичных документов с клиентами" },
  ],
  funcs: {
    items: [
      { text: VEST, role: "Петров А. А. - Член совета" },
      { text: VEST, role: "Петров А. А. - Член совета" },
      { text: VEST_LONG, role: "Петров А. А. - Член совета" },
      { text: VEST, role: "Не назначено" },
    ],
    activeIdx: 1,
  },
  questions: [
    { title: "Lorem ipsum dolor sit amet, consectetur" },
    { title: "Lorem ipsum", body: LOREM, open: true },
    { title: "Lorem ipsum dolor sit amet, consectetur" },
  ],
};

/** Коллектив одинаков у кабинетов 3–7 (2-я карточка — Брандербург Г. И.). */
const COLLECTIVE_SHARED: CollectiveMember[] = [
  { name: "Степан А. А.", role: "Председатель правления", photo: PH.stepan, status: "active" },
  { name: "Брандербург Г. И.", role: "Помощник пред.", photo: PH.branderburg, status: "active" },
  { name: "Розалина К. И.", role: "Председатель совета", photo: PH.rozalina, status: "active" },
  { name: "Ванесса П. П.", role: "Помощник пред. совета", photo: PH.vanessa, status: "active" },
  { name: "Александр Д. Р.", role: "Член совета", photo: PH.aleksandr, status: "active" },
  { name: "Дмитрий А. А.", role: "Член совета", photo: PH.dmitriy, status: "active" },
  { name: "-", role: "Член совета", status: "inactive" },
];

export const CABINET_ACTIVITY: Record<string, CabinetActivityData> = {
  validator: {
    membersLabel: "20 пайщиков",
    ckpDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat eLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat euismod. Vel sed non gravida pharetra semper. Enim plerisque tem.",
    collective: [
      { name: "Степан А. А.", role: "Председатель правления", photo: PH.stepan, status: "active" },
      { name: "Ганиш Г. И.", role: "Помощник пред.", photo: PH.ganish, status: "active" },
      { name: "Розалина К. И.", role: "Председатель совета", photo: PH.rozalina, status: "active" },
      { name: "Ванесса П. П.", role: "Помощник пред. совета", photo: PH.vanessa, status: "active" },
      { name: "Александр Д. Р.", role: "Член совета", photo: PH.aleksandr, status: "active" },
      { name: "Дмитрий А. А.", role: "Член совета", photo: PH.dmitriy, status: "active" },
      { name: "-", role: "Член совета", status: "inactive" },
    ],
    cascade: {
      depts: [
        { title: "Отдел источника", active: true },
        { title: "Отдел председателя" },
        { title: "Отдел офф. вопросов" },
      ],
      sections: [
        { title: "Секция счетов и сборов", active: true },
        { title: "Секция сбора дебиторской задолжности" },
        { title: "Секция ведения взаиморасчетов и первичных документов с клиентами" },
      ],
      funcs: {
        items: [
          { text: VEST, role: "Петров А. А. - Член совета" },
          { text: VEST, role: "Петров А. А. - Член совета" },
          { text: VEST, role: "Петров А. А. - Член совета" },
        ],
        activeIdx: 1,
      },
      questions: [
        { title: "Lorem ipsum dolor sit amet, consectetur" },
        { title: "Lorem ipsum", body: LOREM, open: true },
        { title: "Lorem ipsum dolor sit amet, consectetur" },
      ],
    },
  },

  web: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: [
      { name: "Степан А. А.", role: "Председатель правления", photo: PH.stepan, status: "active" },
      { name: "Цукерберг Г. И.", role: "Помощник пред.", photo: PH.tsukerberg, status: "active" },
      { name: "Розалина К. И.", role: "Председатель совета", photo: PH.rozalina, status: "active" },
      { name: "Ванесса П. П.", role: "Помощник пред. совета", photo: PH.vanessa, status: "active" },
      { name: "Александр Д. Р.", role: "Член совета", photo: PH.aleksandr, status: "active" },
      { name: "Дмитрий А. А.", role: "Член совета", photo: PH.dmitriy, status: "active" },
      { name: "-", role: "Член совета", status: "inactive" },
    ],
    cascade: CASCADE_SHARED,
  },

  domains: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: COLLECTIVE_SHARED,
    cascade: CASCADE_SHARED,
  },

  executor: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: COLLECTIVE_SHARED,
    cascade: CASCADE_SHARED,
  },

  regulator: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: COLLECTIVE_SHARED,
    cascade: CASCADE_SHARED,
  },

  vuz: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: COLLECTIVE_SHARED,
    cascade: CASCADE_SHARED,
  },

  // Подразделение 8 «Фонд» — копия активности «Исполнителя» (5).
  fond: {
    membersLabel: "20 пайщиков",
    ckpDesc: CKP_DESC,
    collective: COLLECTIVE_SHARED,
    cascade: CASCADE_SHARED,
  },
};

export function getCabinetActivity(slug: string): CabinetActivityData | undefined {
  return CABINET_ACTIVITY[slug];
}
