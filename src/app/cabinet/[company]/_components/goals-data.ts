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

export const GOALS: Goal[] = [
  {
    id: "home-renovation",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    ],
    dates: "3 Мар, 2025 - 30 Апр, 2025",
    title: "Ремонт дома для семьи Дженнис и Мэгги",
    location: "Москва, Академический",
    detailLocation: "Москва, Академический р-н, ул. Кржижановского, 14, кв. 37",
    category: "raising",
    action: "process",
    progress: { fillPct: 100, fillColor: "green", marker: 0, left: { dot: "orange", amount: "0 ₽", label: "Использовано" }, right: { dot: "green", amount: "267 300 ₽", label: "Собрано" } },
    collected: "267 300 ₽",
    total: "267 300 ₽",
    description:
      "Помогаем семье Дженнис и Мэгги привести дом в порядок после наводнения. Средства пойдут на ремонт кровли, замену электрики и закупку мебели первой необходимости.",
    tasks: ["Найти подрядчика", "Закупить материалы", "Сдать объект"],
    documents: [
      { name: "Заявление семьи о материальной помощи", date: "14.02.2025" },
      { name: "Смета на ремонт кровли и электрики", date: "08.03.2025" },
    ],
  },
  {
    id: "cvetok",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=900&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80",
    ],
    dates: "11 Апр, 2025 - 19 Май, 2025",
    title: "Озеленить двор на Кржижановского",
    location: "Москва, Академический",
    detailLocation: "Москва, Академический р-н, ул. Кржижановского, 14, двор",
    category: "raising",
    action: "process",
    banner: "1",
    progress: { fillPct: 100, fillColor: "green", marker: 3, left: { dot: "orange", amount: "1 100 ₽", label: "Использовано" }, right: { dot: "green", amount: "34 900 ₽", label: "Собрано" } },
    collected: "34 900 ₽",
    total: "34 900 ₽",
    description:
      "Озеленяем общественное пространство района: закупаем саженцы, кашпо и грунт. Цветы высадят волонтёры вместе с жителями двора.",
    tasks: ["Выбрать сорт", "Оформить доставку"],
    documents: [{ name: "Заявка жителей на озеленение двора", date: "11.04.2025", pending: true }],
  },
  {
    id: "chashka",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=80",
    ],
    dates: "22 Апр, 2025 - 30 Июн, 2025",
    title: "Партия посуды для благотворительной ярмарки",
    location: "Санкт-Петербург, Адмиралтейский",
    detailLocation: "Санкт-Петербург, Адмиралтейский р-н, наб. реки Фонтанки, 78",
    category: "collected",
    action: "edit",
    progress: { fillPct: 54, fillColor: "green", handle: true, left: { dot: "green", amount: "84 600 ₽", label: "Собрано" }, right: { dot: "grey", amount: "156 700 ₽", label: "Общая сумма" } },
    collected: "84 600 ₽",
    total: "156 700 ₽",
    description:
      "Собираем средства на партию брендированной посуды для благотворительной ярмарки. Прибыль от продажи направим в фонд поддержки школ.",
    tasks: ["Найти поставщика", "Согласовать дизайн", "Разместить заказ"],
    documents: [
      { name: "Обращение школы №3 о проведении ярмарки", date: "22.04.2025" },
      { name: "Коммерческое предложение поставщика посуды", date: "19.05.2025" },
    ],
  },
  {
    id: "detsad-sait",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80",
    ],
    dates: "28 Янв, 2025 - 3 Июн, 2025",
    title: "Разработать сайт для детского сада №128",
    location: "Казань, Вахитовский",
    detailLocation: "Казань, Вахитовский р-н, ул. Достоевского, 42",
    category: "collected",
    action: "edit",
    progress: { fillPct: 68, fillColor: "green", handle: true, left: { dot: "green", amount: "80 600 ₽", label: "Собрано" }, right: { dot: "grey", amount: "118 600 ₽", label: "Общая сумма" } },
    collected: "80 600 ₽",
    total: "118 600 ₽",
    description:
      "Делаем современный сайт для муниципального детского сада: расписание, новости и запись в группы. Разработку ведёт волонтёрская команда.",
    tasks: ["Собрать требования", "Сверстать макет", "Запустить сайт"],
    documents: [
      { name: "Техническое задание на разработку сайта", date: "28.01.2025" },
      { name: "Договор подряда на разработку и поддержку", date: "14.02.2025" },
    ],
  },
  {
    id: "workshop",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80",
    ],
    dates: "9 Окт, 2023 - 6 Дек, 2024",
    title: "Закупить оборудование для школьной мастерской",
    location: "Новосибирск, Заельцовский",
    detailLocation: "Новосибирск, Заельцовский р-н, ул. Дуси Ковальчук, 179",
    category: "collected",
    action: "edit",
    progress: { fillPct: 100, fillColor: "orange", marker: 100, left: { dot: "orange", amount: "214 000 ₽", label: "Использовано" }, right: { dot: "grey", amount: "214 000 ₽", label: "Собрано" } },
    collected: "214 000 ₽",
    total: "214 000 ₽",
    description:
      "Оснащаем мастерскую школы №3: верстаки, ручной инструмент и станок по дереву. Оборудование закупили и передали школе, средства израсходованы полностью — готовим отчёт о целевом расходовании для жертвователей.",
    tasks: ["Согласовать перечень оборудования", "Провести закупку", "Передать оборудование школе"],
    documents: [{ name: "Заявка школы №3 на оснащение мастерской", date: "09.10.2023" }],
  },
  {
    id: "velosiped",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80",
    covers: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&q=80",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=900&q=80",
    ],
    dates: "24 Авг, 2023 - 30 Ноя, 2023",
    title: "Собрать спортивный велосипед для секции",
    location: "Екатеринбург, Верх-Исетский",
    detailLocation: "Екатеринбург, Верх-Исетский р-н, ул. Токарей, 26",
    category: "closed",
    closed: true,
    progress: { fillPct: 100, fillColor: "orange", marker: 100, left: { dot: "orange", amount: "91 000 ₽", label: "Использовано" }, right: { dot: "green", amount: "91 000 ₽", label: "Собрано" } },
    collected: "91 000 ₽",
    total: "91 000 ₽",
    description:
      "Цель закрыта: собрали средства и собрали спортивный велосипед для подопечного секции. Купили раму, колёса и обвес, настроили трансмиссию и тормоза.",
    tasks: ["Купить раму", "Собрать колёса", "Настроить тормоза"],
    documents: [{ name: "Отчёт о целевом расходовании средств", date: "30.11.2023" }],
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
  dates: "12 Май, 2025 - 31 Июл, 2025",
  title: "Создать парк",
  location: "Москва, Академический",
  detailLocation: "Москва, Академический р-н, ул. Профсоюзная, 21",
  category: "raising",
  progress: { fillPct: 0, fillColor: "green", handle: true, left: { dot: "green", amount: "0 ₽", label: "Собрано" }, right: { dot: "grey", amount: "324 500 ₽", label: "Общая сумма" } },
  collected: "0 ₽",
  total: "324 500 ₽",
  description:
    "Разбиваем парк на пустыре между жилыми кварталами: дорожки, освещение, скамейки и площадка для выгула собак. Проект согласован с управой района, работы ведём вместе с жителями и подрядчиком по благоустройству.",
  tasks: ["Найти архитектора", "Создать планировку", "Найти строителей"],
  documents: [
    { name: "Обращение жителей квартала о благоустройстве", date: "11.04.2025" },
    { name: "Смета на благоустройство территории", date: "22.04.2025" },
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
