/**
 * Единый источник данных по целям кабинета «Фонд».
 * Из него берётся И карточка в списке (GoalsScreen), И страница цели
 * (GoalPublishedScreen) — контент карточки соответствует тому, что внутри цели,
 * плюс документы. Не client-модуль: только данные/типы (импортируется и
 * server-роутами, и client-экранами).
 */

import { type Org } from "../../partners/_components/partners-data";

export const DOT: Record<string, string> = {
  orange: "var(--color-orange-400)",
  green: "var(--color-green-400)",
  grey: "var(--color-grey-200)",
};

export interface Money {
  dot: keyof typeof DOT | string;
  amount: string;
  label: string;
}
export interface GoalProgress {
  fillPct: number;
  fillColor: "green" | "orange";
  marker?: number;
  handle?: boolean;
  left: Money;
  right: Money;
}
export type GoalCategory = "raising" | "collected" | "closed";

export interface GoalDoc {
  name: string;
  date: string;
  /** Документ ожидает участия — оранжевая обводка + статус (как у партнёра). */
  pending?: boolean;
}

export interface Goal {
  id: string;
  /** Обложка в списке. */
  image: string;
  /** Обложки в карусели на странице цели. */
  covers: string[];
  dates: string;
  title: string;
  /** Короткая локация для карточки. */
  location: string;
  /** Полная локация для страницы цели. */
  detailLocation: string;
  category: GoalCategory;
  action?: "process" | "edit";
  banner?: string;
  closed?: boolean;
  /** Прогресс в карточке списка. */
  progress?: GoalProgress;
  /** Суммы для страницы цели. */
  collected: string;
  total: string;
  description: string;
  tasks: string[];
  documents: GoalDoc[];
}

const DETAIL_LOCATION = "Москва, Академический, Либкнехта К. Ул., дом 107/В, кв. 10";

export const GOALS: Goal[] = [
  {
    id: "home-renovation",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Home renovation for Jannice and Maggy",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "raising",
    action: "process",
    progress: { fillPct: 100, fillColor: "green", marker: 0, left: { dot: "orange", amount: "0 ₽", label: "Использовано" }, right: { dot: "green", amount: "250 000 ₽", label: "Собрано" } },
    collected: "250 000 ₽",
    total: "250 000 ₽",
    description:
      "Помогаем семье Дженнис и Мэгги привести дом в порядок после наводнения. Средства пойдут на ремонт кровли, замену электрики и закупку мебели первой необходимости.",
    tasks: ["Найти подрядчика", "Закупить материалы", "Сдать объект"],
    documents: [
      { name: "Заявление семьи Дженнис", date: "12.01.2020" },
      { name: "Смета на ремонт дома", date: "12.01.2020" },
    ],
  },
  {
    id: "cvetok",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=900&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Купить цветок",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "raising",
    action: "process",
    banner: "1",
    progress: { fillPct: 100, fillColor: "green", marker: 3, left: { dot: "orange", amount: "1 000 ₽", label: "Использовано" }, right: { dot: "green", amount: "250 000 ₽", label: "Собрано" } },
    collected: "250 000 ₽",
    total: "250 000 ₽",
    description:
      "Озеленяем общественное пространство района: закупаем саженцы, кашпо и грунт. Цветы высадят волонтёры вместе с жителями двора.",
    tasks: ["Выбрать сорт", "Оформить доставку"],
    documents: [{ name: "Заявка на озеленение #12", date: "12.01.2020", pending: true }],
  },
  {
    id: "chashka",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Собрать на чашку",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "collected",
    action: "edit",
    progress: { fillPct: 54, fillColor: "green", handle: true, left: { dot: "green", amount: "134 200 ₽", label: "Собрано" }, right: { dot: "grey", amount: "250 000 ₽", label: "Общая сумма" } },
    collected: "134 200 ₽",
    total: "250 000 ₽",
    description:
      "Собираем средства на партию брендированной посуды для благотворительной ярмарки. Прибыль от продажи направим в фонд поддержки школ.",
    tasks: ["Найти поставщика", "Согласовать дизайн", "Разместить заказ"],
    documents: [
      { name: "The request of the kids from school#3", date: "12.01.2020" },
      { name: "The request of the kids from", date: "12.01.2020" },
    ],
  },
  {
    id: "detsad-sait",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Разработать сайт для детского сада",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "collected",
    action: "edit",
    progress: { fillPct: 54, fillColor: "green", handle: true, left: { dot: "green", amount: "134 200 ₽", label: "Собрано" }, right: { dot: "grey", amount: "250 000 ₽", label: "Общая сумма" } },
    collected: "134 200 ₽",
    total: "250 000 ₽",
    description:
      "Делаем современный сайт для муниципального детского сада: расписание, новости и запись в группы. Разработку ведёт волонтёрская команда.",
    tasks: ["Собрать требования", "Сверстать макет", "Запустить сайт"],
    documents: [
      { name: "Техническое задание", date: "12.01.2020" },
      { name: "Договор с подрядчиком", date: "12.01.2020" },
    ],
  },
  {
    id: "lorem",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Lorem ipsum dolor sit amet",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "collected",
    action: "edit",
    progress: { fillPct: 100, fillColor: "orange", marker: 100, left: { dot: "orange", amount: "250 000 ₽", label: "Использовано" }, right: { dot: "grey", amount: "250 000 ₽", label: "Собрано" } },
    collected: "250 000 ₽",
    total: "250 000 ₽",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tasks: ["Task one", "Task two", "Task three"],
    documents: [{ name: "Основание #1", date: "12.01.2020" }],
  },
  {
    id: "velosiped",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&q=80",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=900&q=80",
    ],
    dates: "14 Окт, 2019 - 28 Окт, 2019",
    title: "Прокачать велосипед",
    location: "Москва, Академический",
    detailLocation: DETAIL_LOCATION,
    category: "closed",
    closed: true,
    progress: { fillPct: 100, fillColor: "orange", marker: 100, left: { dot: "orange", amount: "250 000 ₽", label: "Использовано" }, right: { dot: "green", amount: "250 000 ₽", label: "Собрано" } },
    collected: "250 000 ₽",
    total: "250 000 ₽",
    description:
      "Цель закрыта: собрали средства и собрали спортивный велосипед для подопечного секции. Купили раму, колёса и обвес, настроили трансмиссию и тормоза.",
    tasks: ["Купить раму", "Собрать колёса", "Настроить тормоза"],
    documents: [{ name: "Чек на комплектующие", date: "12.01.2020" }],
  },
];

/** Цель, только что созданная через форму (поток «Создать парк»). */
export const NEW_GOAL: Goal = {
  id: "new",
  image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80",
  covers: [
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80",
  ],
  dates: "14 Oct, 2019 - 28 Oct, 2019",
  title: "Создать парк",
  location: "Москва, Академический",
  detailLocation: DETAIL_LOCATION,
  category: "raising",
  progress: { fillPct: 0, fillColor: "green", handle: true, left: { dot: "green", amount: "0 ₽", label: "Собрано" }, right: { dot: "grey", amount: "250 000 ₽", label: "Общая сумма" } },
  collected: "0 ₽",
  total: "250 000 ₽",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  tasks: ["Найти архитектора", "Создать планировку", "Найти строителей"],
  documents: [
    { name: "The request of the kids from school#3", date: "12.01.2020" },
    { name: "The request of the kids from", date: "12.01.2020" },
  ],
};

export function getGoal(id: string): Goal | undefined {
  if (id === NEW_GOAL.id) return NEW_GOAL;
  return GOALS.find((g) => g.id === id);
}

/**
 * Синтетический Org для переиспользования партнёрского флоу договора внутри
 * цели: id/имя цели становятся orgId/customer для RegFlow.createdContracts.
 */
export function goalAsOrg(goal: Goal): Org {
  return {
    id: goal.id,
    name: goal.title,
    address: goal.detailLocation,
    short: "",
    rating: 0,
    media: goal.image,
    paragraphs: [],
    activity: "",
    docs: [],
  };
}
