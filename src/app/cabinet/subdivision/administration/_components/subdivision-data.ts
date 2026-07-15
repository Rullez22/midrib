import { type InfoGroup } from "@/components/ds";

export interface ChatMessage {
  me: boolean;
  text: string;
  time: string;
}

/**
 * Данные экрана подразделения «Администрация» (Figma 1857:649499 / 1981:713209 /
 * 1981:716175). Только контент — вёрстка собирается из DS-композитов.
 */

const A1 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80";
const A2 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80";
const A3 = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&q=80";

export const SUBDIVISION_COVER =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80";
export const FEED_IMG =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80";
export const FEED_VIDEO =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700&q=80";
export const PEER_AVATAR = A1;

export const SUBDIVISION = {
  name: "Администрация",
  role: "Подразделение кооператива Immatra",
  org: "Immatra",
  membersLabel: "20 пайщиков",
};

export const INFO_GROUPS: InfoGroup[] = [
  {
    heading: "Описание",
    text: "Потребительский кооператив Immatra объединяет 120 пайщиков и занимается управлением недвижимостью, инвестициями и цифровыми сервисами. Администрация отвечает за операционную работу, документооборот и взаимодействие с партнёрами.",
  },
  {
    heading: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "Домен", value: "Immatra.ru" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
];

/** Строки секции «Устав» (без «Прикреплённых документов» — добавляются в профиле с JSX). */
export const CHARTER_ROWS = [
  { label: "Регистрационный номер", value: "4648469330202" },
  { label: "Организация", value: "Потребительский кооператив Immatra" },
  { label: "Почтовый адрес", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
  {
    label: "ОКВЭД",
    value: [
      "81.22 — Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая",
      "81.29.1 — Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования",
      "64.19 — Денежное посредничество прочее",
    ],
  },
  { label: "ИНН", value: "45267345678" },
  { label: "Кем выдан", value: "Управление министерства юстиции РФ по Санкт-Петербургу" },
  { label: "Дата решения", value: "15.12.2005" },
  { label: "Дата внесения в ЕГРПОО", value: "25.12.2005" },
];

export const REQUIREMENTS = [
  { name: "Подтверждённый домен", type: "Домен", badge: { label: "Локальный", color: "orange" as const } },
  { name: "Верификация KYC", type: "Документы", badge: { label: "Пройдена", color: "green" as const } },
];

export const ACHIEVEMENTS = [
  { logo: A1, title: "Пайщик года", org: "Ким Дмитрий Кимович", date: "август 2019" },
  { logo: A2, title: "За вклад в развитие", org: "Энрике Чучела Каримович", date: "август 2018" },
  { logo: A3, title: "Лучший наставник", org: "Валитин Дмитрий Кузякин", date: "август 2016" },
];

export const AGE_GROUPS = [
  { label: "< 18", values: [0, 0] },
  { label: "18-21", values: [18, 0] },
  { label: "21-24", values: [18, 0] },
  { label: "24-27", values: [30, 20] },
  { label: "27-30", values: [22, 22] },
  { label: "30-36", values: [3, 2] },
  { label: "36-40", values: [0, 8] },
  { label: ">40", values: [7, 0] },
];

export const DEVICES = [
  { label: "Десктоп", value: 86 },
  { label: "Смартфоны", value: 14 },
];

export const GEO_COUNTRIES = [
  { label: "Россия", value: 94 },
  { label: "Китай", value: 0.26 },
  { label: "Украина", value: 0.2 },
  { label: "США", value: 0.2 },
  { label: "Монголия", value: 0.13 },
  { label: "Другие", value: 1.37 },
];

export const GEO_CITIES = [
  { label: "Санкт-Петербург", value: 78 },
  { label: "Москва", value: 12 },
  { label: "Казань", value: 4 },
  { label: "Новосибирск", value: 3 },
  { label: "Сочи", value: 2 },
  { label: "Другие", value: 1 },
];

export const FEED_POSTS = [
  { title: "Выезд на объект в Дегтярном переулке", date: "12 апреля 2025", text: "Провели осмотр площадки перед началом работ: зафиксировали объёмы, согласовали график с подрядчиком и сделали фотоотчёт для пайщиков.", media: { type: "image" as const, src: FEED_IMG } },
  { title: "Обновили пакет внутренних документов", date: "8 апреля 2025", text: "Утвердили новую редакцию регламента и положения об отделе. Все документы доступны для ознакомления в разделе «Документооборот».", media: { type: "documents" as const, files: ["Внутренний регламент", "Положение об отделе", "Должностная №14"] } },
  { title: "Запись общего собрания пайщиков", date: "2 апреля 2025", text: "Опубликовали видеозапись собрания: обсудили бюджет на второй квартал, обновление состава правления и новые направления.", media: { type: "video" as const, poster: FEED_VIDEO } },
  { title: "Фотоотчёт с весеннего субботника", date: "28 марта 2025", text: "Больше 40 пайщиков вышли на благоустройство территории. Спасибо всем, кто присоединился — фотографии в галерее.", media: { type: "gallery" as const, items: [{ src: FEED_IMG }, { src: FEED_VIDEO, video: true }, { src: FEED_IMG }], total: 8 } },
  { title: "Приём заявок на весенний поток открыт", date: "20 марта 2025", text: "Новые пайщики могут подать документы через личный кабинет до конца месяца. По вопросам — пишите в чат подразделения." },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { me: true, text: "Коллеги, отправил обновлённый регламент на согласование — посмотрите, пожалуйста, до конца дня.", time: "12:01" },
  { me: true, text: "И заодно подтвердите график выезда на объект.", time: "12:02" },
  { me: false, text: "Принято, регламент посмотрю сегодня. По выезду — вторник подходит, согласую с подрядчиком.", time: "12:03" },
];
