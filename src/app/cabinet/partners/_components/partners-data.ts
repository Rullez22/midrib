import type { Transaction } from "@/components/ds";

/**
 * Данные раздела «Партнёры» (сценарий 9 «Кооператив»).
 * Источник: Figma 1857:649888 (список) и 1987:737273 / 1984:719937 / 1857:649850…
 * (детальные экраны партнёра). Презентационные мок-данные.
 */

/** Градиент-обложка партнёра (CSS). Используется на карточках и в шапке. */
export const PARTNER_COVER =
  "linear-gradient(120deg,#f9c5d1 0%,#a18cd1 35%,#7bd5f5 65%,#84fab0 100%)";

/** Нейтральная картинка-заглушка для поста ленты (SVG data-URI, не истекает). */
export const FEED_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe0f2"/><stop offset="1" stop-color="#e9d8f0"/></linearGradient></defs><rect width="600" height="300" fill="url(#g)"/></svg>`,
  );

/** Аватар-заглушка партнёра (эмблема в круге). */
export const PARTNER_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#eef2f7"/><circle cx="48" cy="48" r="30" fill="none" stroke="#9aa7b4" stroke-width="3"/><path d="M30 58l18-26 18 26z" fill="none" stroke="#9aa7b4" stroke-width="3" stroke-linejoin="round"/></svg>`,
  );

/** Аватар собеседника в чате. */
export const CHAT_PEER_AVATAR = PARTNER_AVATAR;
/** Мой аватар (для будущего; входящие используют peer). */

export interface PartnerInfoRow {
  label: string;
  value: string | string[];
}
export interface PartnerInfoSection {
  title: string;
  rows: PartnerInfoRow[];
}

export interface FeedDoc {
  files: string[];
}

export interface PartnerSummary {
  id: string;
  /** Название организации. */
  title: string;
  /** Подпись под названием (роль). */
  role: string;
  /** Тег под аватаром в списке: домен-ссылка или «Пайщик». */
  tag: string;
  /** Тег — домен-ссылка (со стрелкой) либо обычная подпись. */
  tagAsLink: boolean;
  /** Описание для карточки списка. */
  description: string;
  /** Обои-обложка плитки профиля (из /public/walls). */
  cover: string;
  /** Аватар организации (из /public/orgs). */
  avatar: string;
}

export interface Partner extends PartnerSummary {
  /** Секции блока «Общие сведения». */
  info: PartnerInfoSection[];
}

/** Общие сведения партнёра «Кооператив Слонёнок». */
const SLONENOK_INFO: PartnerInfoSection[] = [
  {
    title: "Описание",
    rows: [
      {
        label: "",
        value:
          "Кооператив ведёт совместные закупки и логистику для пайщиков. Собираем заявки, подбираем поставщика, выкупаем партию целиком и развозим её по складам участников. За счёт объёма цена выходит ниже розничной, а расходы на доставку делятся между всеми, кто участвовал в заявке.",
      },
    ],
  },
  {
    title: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, наб. канала Грибоедова, 30, лит. Б" },
      { label: "Контактный телефон", value: "+7 (921) 448-19-05" },
      { label: "Домен", value: "slonenok.ru" },
      { label: "E-mail", value: "info@slonenok.ru" },
    ],
  },
  {
    title: "Устав",
    rows: [
      { label: "Регистрационный номер", value: "1089847215503" },
      { label: "Организация", value: "Потребительский кооператив «Слонёнок»" },
      { label: "Почтовый адрес", value: "191186, Санкт-Петербург, наб. канала Грибоедова, 30, лит. Б" },
      {
        label: "ОКВЭД",
        value: [
          "46.90 - Торговля оптовая неспециализированная;",
          "52.10 - Деятельность по складированию и хранению;",
          "49.41 - Деятельность автомобильного грузового транспорта",
        ],
      },
      { label: "ИНН", value: "7838204416" },
      { label: "Кем выдан", value: "Управление Министерства юстиции РФ по Санкт-Петербургу" },
      { label: "Дата решения", value: "03.02.2019" },
      { label: "Дата внесения в ЕГРЮЛ", value: "14.02.2019" },
    ],
  },
];

/** Общие сведения партнёра «Кооператив Гвозди и доски» (Figma 1987:737273). */
const GVOZDI_INFO: PartnerInfoSection[] = [
  {
    title: "Описание",
    rows: [
      {
        label: "",
        value:
          "Оптовые закупки пиломатериалов и метизов для пайщиков. Держим склад в Санкт-Петербурге, отгружаем партии от одного куба и распиливаем доску под размер заказчика. Работаем напрямую с лесопилками Карелии и Вологодской области, поэтому цена держится ниже строительных сетей.",
      },
    ],
  },
  {
    title: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Большой пр. П.С., 45, офис 312" },
      { label: "Контактный телефон", value: "+7 (812) 337-55-24" },
      { label: "Домен", value: "gvozdi.com" },
      { label: "E-mail", value: "office@gvozdi-coop.ru" },
    ],
  },
  {
    title: "Устав",
    rows: [
      { label: "Регистрационный номер", value: "1147847092361" },
      { label: "Организация", value: "Потребительский кооператив «Гвозди и доски»" },
      { label: "Почтовый адрес", value: "197136, Санкт-Петербург, Большой пр. П.С., 45, офис 312" },
      {
        label: "ОКВЭД",
        value: [
          "46.73 - Торговля оптовая лесоматериалами, строительными материалами;",
          "16.10 - Распиловка и строгание древесины;",
          "43.33 - Работы по устройству покрытий полов и облицовке стен",
        ],
      },
      { label: "ИНН", value: "7813129847" },
      { label: "Кем выдан", value: "Управление Министерства юстиции РФ по Санкт-Петербургу" },
      { label: "Дата решения", value: "21.09.2021" },
      { label: "Дата внесения в ЕГРЮЛ", value: "30.09.2021" },
    ],
  },
];

/** Общие сведения партнёра «ИП Салют». */
const SALUT_INFO: PartnerInfoSection[] = [
  {
    title: "Описание",
    rows: [
      {
        label: "",
        value:
          "Монтаж и обслуживание детского игрового оборудования. Собираем площадки под ключ: готовим основание, ставим комплексы, укладываем покрытие и сдаём объект по акту. Дальше ведём площадку по договору обслуживания — сезонные осмотры, протяжка креплений и замена изношенных элементов.",
      },
    ],
  },
  {
    title: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Ленинградская обл., г. Всеволожск, Октябрьский пр., 96" },
      { label: "Контактный телефон", value: "+7 (911) 265-40-77" },
      { label: "Домен", value: "salut.com" },
      { label: "E-mail", value: "salut@salut-ip.ru" },
    ],
  },
  {
    title: "Регистрационные данные",
    rows: [
      { label: "Регистрационный номер", value: "316470400089215" },
      { label: "Организация", value: "ИП Салютов Р. К." },
      { label: "Почтовый адрес", value: "188640, Ленинградская обл., г. Всеволожск, Октябрьский пр., 96" },
      {
        label: "ОКВЭД",
        value: [
          "43.29 - Производство прочих строительно-монтажных работ;",
          "33.12 - Ремонт машин и оборудования;",
          "46.49.4 - Торговля оптовая играми и игрушками",
        ],
      },
      { label: "ИНН", value: "470310528834" },
      { label: "Кем выдан", value: "Межрайонная ИФНС России № 9 по Ленинградской области" },
      { label: "Дата решения", value: "12.05.2020" },
      { label: "Дата внесения в ЕГРИП", value: "18.05.2020" },
    ],
  },
];

/** Организации, с которыми взаимодействует кооператив (Figma 1857:649888). */
export const PARTNERS: Partner[] = [
  {
    id: "slonenok",
    title: "Кооператив Слоненок",
    role: "Партнер кооператива Immatra",
    tag: "Пайщик",
    tagAsLink: false,
    description:
      "Совместные закупки и логистика для пайщиков: собираем заявки, находим поставщика и развозим партию по складам участников. С Immatra работаем по договорам поставки и закрываем документы в срок.",
    cover: "/walls/wall-5.jpg",
    avatar: "/orgs/romashka.png",
    info: SLONENOK_INFO,
  },
  {
    id: "gvozdi",
    title: "Кооператив Гвозди и доски",
    role: "Партнер кооператива Immatra",
    tag: "gvozdi.com",
    tagAsLink: true,
    description:
      "Оптовые закупки пиломатериалов и метизов для пайщиков. Держим склад в Санкт-Петербурге, отгружаем партии от куба и распиливаем доску под размер заказчика.",
    cover: "/walls/wall-6.jpg",
    avatar: "/orgs/clever.jpg",
    info: GVOZDI_INFO,
  },
  {
    id: "salut",
    title: "ИП Салют",
    role: "Партнер кооператива Immatra",
    tag: "salut.com",
    tagAsLink: true,
    description:
      "Монтаж и обслуживание детского игрового оборудования. Собираем площадки под ключ, сдаём по акту и дальше ведём сезонные осмотры и ремонт по договору обслуживания.",
    cover: "/walls/wall-7.jpg",
    avatar: "/orgs/qr.jpg",
    info: SALUT_INFO,
  },
];

export function getPartner(id: string): Partner | undefined {
  return PARTNERS.find((p) => p.id === id);
}

/* ── Лента (Figma 1984:719937) ─────────────────────────────────────────── */
export interface FeedItem {
  title: string;
  date: string;
  text?: string;
  image?: boolean;
  files?: string[];
}
export const FEED_ITEMS: FeedItem[] = [
  {
    title: "Выехали на монтаж площадки в Приморском районе",
    date: "12 марта 2025",
    text: "Бригада вышла на объект: подготовили основание, собрали игровой комплекс и уложили резиновое покрытие. Работы приняли по акту в тот же день, фотоотчёт приложили к договору.",
    image: true,
  },
  {
    title: "Обновили условия отгрузки для пайщиков",
    date: "27 февраля 2025",
    files: ["Условия личной скидки", "Регламент отгрузки со склада", "Прайс-лист на пиломатериалы"],
  },
];

/* ── Чат (Figma 1857:649858) ───────────────────────────────────────────── */
export interface ChatMessage {
  text: string;
  me: boolean;
  time: string;
}
export const CHAT_MESSAGES: ChatMessage[] = [
  { text: "Добрый день! Подскажите, партия доски по нашей заявке уже пришла на склад?", me: true, time: "12:01" },
  { text: "Нужна отгрузка до пятницы, иначе сдвинется монтаж.", me: true, time: "12:02" },
  { text: "Здравствуйте! Партия пришла вчера, комплектуем — отгрузим в четверг утром, успеваете.", me: false, time: "12:03" },
];

/* ── Счёт → Взаиморасчеты (Figma 1857:649850 / 6563:357867) ─────────────── */
export const PARTNER_SUMMARY = [
  { label: "Ваш оборот с компанией", value: "1000 ETH" },
  { label: "Поступило за период", value: "97 ETH" },
  { label: "Расходы за период", value: "518 ETH" },
];

export const PARTNER_TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ПК «Immatra»", to: "ПК «Гвозди и доски»", document: "Счет на оплату", documentSub: "Поставка пиломатериалов", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "9e71b04…3ac2f", time: "12 минут назад", from: "ПК «Immatra»", to: "ИП Салютов Р. К.", document: "Счет на оплату", documentSub: "Монтаж игровой площадки", amount: "1.482100", commission: "0.0140" },
  { code: "214", color: "cyan", hash: "b83f16d…c40a9", time: "3 часа назад", from: "ПК «Слонёнок»", to: "ПК «Immatra»", document: "Счет на оплату", documentSub: "Складское хранение, март", amount: "0.061450", commission: "0.0006" },
  { code: "216", color: "purple", hash: "27ad5c8…f1e63", time: "вчера, 18:42", from: "БФ «VELESTA»", to: "ПК «Immatra»", document: "Взносы и целевые поступления", documentSub: "Целевой взнос по договору НВО", amount: "3.907820", commission: "0.0361" },
  { code: "215", color: "green", hash: "f4102be…89dd7", time: "5 дней назад", from: "Фонд «Живу с Культурой»", to: "ПК «Immatra»", document: "Поступления с маршрутных счетов", documentSub: "Возврат по смете благоустройства", amount: "0.845300", commission: "0.0079" },
];

/** График транзакций (Figma 6563:357867). Подсветка — Янв 2019 (223 ETH). */
export const CHART_POINTS = [
  { label: "Авг 2018", value: 150 },
  { label: "Сен 2018", value: 140 },
  { label: "Окт 2018", value: 195 },
  { label: "Ноя 2018", value: 205 },
  { label: "Дек 2018", value: 200 },
  { label: "Янв 2019", value: 223 },
  { label: "Фев 2019", value: 175 },
  { label: "Мар 2019", value: 210 },
  { label: "Апр 2019", value: 285 },
  { label: "Май 2019", value: 230 },
];
export const CHART_Y_TICKS = [100, 150, 200, 300];
export const CHART_HIGHLIGHT = 5;

/* ── Счёт → Документооборот (Figma 1857:649854) ────────────────────────── */
export interface PartnerDoc {
  type: string;
  name: string;
  status?: string;
  badge?: string;
  date: string;
}
export const PARTNER_DOCS: PartnerDoc[] = [
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", status: "Отвалидирован", badge: "Локальный", date: "17.03.2023" },
  { type: "Сертификат", name: "Сертификат соответствия на игровое оборудование", status: "Отвалидирован", badge: "Локальный", date: "24.08.2023" },
  { type: "Договор", name: "Договор на техническое обслуживание площадок", date: "06.12.2024" },
];

/* ── Счёт → Артефакты (Figma 1857:649862) ──────────────────────────────── */
export type ArtifactState = "share" | "lock" | "person";
export interface PartnerArtifact {
  type: string;
  name: string;
  date: string;
  state: ArtifactState;
}
export const PARTNER_ARTIFACTS: PartnerArtifact[] = [
  { type: "Документ", name: "Документ в свободной форме", date: "09.10.2023", state: "share" },
  { type: "Документ", name: "Регламент приёмки пиломатериалов на складе", date: "14.02.2025", state: "lock" },
  { type: "Патент", name: "Способ модульной сборки игровых площадок", date: "22.04.2025", state: "person" },
];

/* ══════════════════════════════════════════════════════════════════════════
   Раздел «Партнёры» (редизайн, Figma 6760-461828 / 462037 / 462553 / 461737 …).
   Тексты адаптированы под платформу — простые, без вычурности.
   ══════════════════════════════════════════════════════════════════════════ */

/** Простая эмблема-заглушка организации (цветная плитка с подписью). */
function orgLogo(bg: string, label: string, fg = "#ffffff"): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="${bg}"/><text x="60" y="66" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="${fg}" text-anchor="middle">${label}</text></svg>`,
    )
  );
}

export type OrgDocStatus = "Согласован" | "Ожидает участия" | "На согласовании";
/** Группа документа: договора/соглашения либо документы пайщика (для фильтра). */
export type OrgDocGroup = "contract" | "paishik";
export interface OrgDoc {
  type: string;
  name: string;
  amount: string;
  status: OrgDocStatus;
  date: string;
  group: OrgDocGroup;
}

export interface OrgSummary {
  id: string;
  name: string;
  address: string;
  /** Короткое описание для карточки списка (простой текст). */
  short: string;
  rating: number;
  /** Логотип/обложка (data-URI или путь). */
  media: string;
  /** Если задано — над карточкой рисуется баннер «Статус документов» с N ожидающими. */
  banner?: number;
}

export interface Org extends OrgSummary {
  /** Абзацы описания в шапке детального экрана. */
  paragraphs: string[];
  activity: string;
  docs: OrgDoc[];
}

/** Организации, с которыми взаимодействует кооператив (таб «Партнёры»). */
export const ORGS: Org[] = [
  {
    id: "velesta",
    name: "Благотворительный фонд VELESTA",
    address: "Москва, Пресненская наб., 8, стр. 1, офис 704",
    short: "Благотворительный фонд. Помогаем детям и семьям в трудной ситуации: ведём адресный сбор, оплачиваем лечение и реабилитацию. По каждой заявке публикуем отчёт, а с партнёрами работаем по договорам и закрываем документы в срок.",
    rating: 4.8,
    media: orgLogo("#111827", "VELESTA"),
    banner: 1,
    paragraphs: [
      "Благотворительный фонд. Помогаем детям и семьям в трудной ситуации.",
      "Ведём адресный сбор и публикуем отчёт по каждой заявке. С кооперативом работаем по договорам.",
    ],
    activity: "активность 3 часа назад",
    docs: [
      { type: "Договор", name: "Договор НВО", amount: "183 200 ₽", status: "Ожидает участия", date: "19.05.2025", group: "contract" },
      { type: "Соглашение", name: "Соглашение о благотворительном пожертвовании", amount: "267 300 ₽", status: "Согласован", date: "11.04.2025", group: "paishik" },
      { type: "Акт выполненных работ", name: "Акт приёмки выполненных работ", amount: "63 000 ₽", status: "На согласовании", date: "03.06.2025", group: "contract" },
      { type: "Отчёт", name: "Отчёт о целевом расходовании средств", amount: "34 900 ₽", status: "Согласован", date: "28.01.2025", group: "paishik" },
    ],
  },
  {
    id: "sport",
    name: "Фонд «Я расту со спортом»",
    address: "Казань, ул. Баумана, 78",
    short: "Поддержка детского спорта. Оплачиваем секции, форму и поездки на соревнования, помогаем открывать площадки в небольших городах. Работаем по заявкам от тренеров и родителей и отчитываемся по каждому переводу.",
    rating: 4.2,
    media: orgLogo("#ffffff", "#ЯРАСТУ", "#c0392b"),
    paragraphs: [
      "Поддерживаем детский спорт: оплачиваем секции, форму и поездки.",
      "Работаем по заявкам и отчитываемся по каждому переводу.",
    ],
    activity: "активность вчера",
    docs: [
      { type: "Договор", name: "Договор подряда на монтаж площадки", amount: "214 000 ₽", status: "На согласовании", date: "02.09.2024", group: "paishik" },
      { type: "Счет на оплату", name: "Счёт-фактура за консультационные услуги", amount: "12 800 ₽", status: "Согласован", date: "23.11.2024", group: "contract" },
      { type: "Смета", name: "Смета на благоустройство территории", amount: "91 000 ₽", status: "Ожидает участия", date: "08.03.2025", group: "paishik" },
    ],
  },
  {
    id: "dari",
    name: "Фонд «Дари добро»",
    address: "Екатеринбург, ул. Малышева, 51, офис 2210",
    short: "Сбор средств на лечение и реабилитацию. Помогаем адресно — от диагностики до восстановления, сопровождаем семьи на всех этапах. Все поступления и расходы фонда открыты, отчёты публикуем по каждой заявке.",
    rating: 3.9,
    media: orgLogo("#f2b705", "ДАРИ\nДОБРО", "#ffffff"),
    paragraphs: [
      "Собираем средства на лечение и реабилитацию.",
      "Помогаем адресно и публикуем отчёты по заявкам.",
    ],
    activity: "активность 5 дней назад",
    docs: [
      { type: "Соглашение", name: "Соглашение о совместной закупке материалов", amount: "118 600 ₽", status: "На согласовании", date: "06.12.2024", group: "contract" },
      { type: "Договор", name: "Договор на поставку игрового оборудования", amount: "156 700 ₽", status: "Согласован", date: "09.10.2023", group: "paishik" },
    ],
  },
  {
    id: "culture",
    name: "Фонд «Живу с Культурой»",
    address: "Санкт-Петербург, Невский пр., 100",
    short: "Культурный фонд. Поддерживаем выставки, спектакли и образовательные проекты, помогаем молодым авторам находить площадки и аудиторию. Проекты ведём вместе с партнёрами кооператива и отчитываемся по каждому этапу.",
    rating: 4.5,
    media: orgLogo("#ffffff", "ЖИВУ", "#e84393"),
    banner: 1,
    paragraphs: [
      "Культурный фонд. Поддерживаем выставки, спектакли и образование.",
      "Ведём проекты вместе с партнёрами кооператива.",
    ],
    activity: "активность сегодня",
    docs: [
      { type: "Договор", name: "Договор на организацию выставки", amount: "214 000 ₽", status: "Ожидает участия", date: "08.03.2025", group: "contract" },
      { type: "Соглашение", name: "Соглашение о совместном проведении фестиваля", amount: "324 500 ₽", status: "Согласован", date: "14.02.2025", group: "contract" },
      { type: "Счет на оплату", name: "Счёт на оплату типографских услуг", amount: "8 400 ₽", status: "На согласовании", date: "28.01.2025", group: "paishik" },
      { type: "Акт выполненных работ", name: "Акт об оказании услуг по проведению лекций", amount: "47 500 ₽", status: "Согласован", date: "19.07.2024", group: "paishik" },
    ],
  },
  {
    id: "druzya",
    name: "Фонд «Друзья»",
    address: "Москва, ул. Тверская, 15, офис 203",
    short: "Волонтёрский фонд. Помогаем приютам и пожилым людям: собираем корма и вещи, организуем поездки и уход. Распределяем помощь по заявкам и держим партнёров в курсе по каждой отправке.",
    rating: 3.7,
    media: orgLogo("#4aa6a0", "ДРУЗЬЯ"),
    banner: 3,
    paragraphs: [
      "Волонтёрский фонд. Помогаем приютам и пожилым людям.",
      "Организуем сбор и распределяем помощь по заявкам.",
    ],
    activity: "активность в этом месяце",
    docs: [
      { type: "Договор", name: "Договор на поставку кормов для приютов", amount: "63 000 ₽", status: "Ожидает участия", date: "03.06.2025", group: "contract" },
      { type: "Заявка", name: "Заявка на участие в программе", amount: "12 800 ₽", status: "На согласовании", date: "15.06.2024", group: "paishik" },
    ],
  },
];

export function getOrg(id: string): Org | undefined {
  return ORGS.find((o) => o.id === id);
}

/** Организации для таба «Найти нового партнёра» (обложки-фото). */
const U = "https://images.unsplash.com/";
export const FIND_ORGS: OrgSummary[] = [
  { id: "birthday", name: "Фонд «С Днём Рождения»", address: "Новосибирск, Красный пр., 22", short: "Организуем праздники для детей из детских домов и больниц: подарки, поездки и мастер-классы. Работаем с волонтёрами по всей стране и отчитываемся по каждому событию.", rating: 4.3, media: `${U}photo-1530103862676-de8c9debad1d?w=240&q=80` },
  { id: "klen", name: "Фонд «Клён»", address: "Санкт-Петербург, Лесной пр., 63, корп. 2", short: "Экологические проекты и озеленение городов. Высаживаем деревья, восстанавливаем парки и проводим субботники вместе с местными сообществами. Все сборы и расходы фонда открыты.", rating: 4.6, media: `${U}photo-1507525428034-b723cf961d3e?w=240&q=80` },
  { id: "vincent", name: "Организация «Vincent»", address: "Москва, ул. Большая Никитская, 24", short: "Поддержка художников и культурных инициатив. Помогаем с материалами, площадками и выставками, продвигаем молодых авторов. Работаем по договорам и ведём прозрачную отчётность.", rating: 4.9, media: `${U}photo-1541961017774-22349e4a1262?w=240&q=80` },
  { id: "lestnica", name: "Фонд «Лестница»", address: "Нижний Новгород, ул. Рождественская, 24", short: "Помогаем подросткам с образованием и профессией: курсы, наставники и стажировки. Сопровождаем ребят от выбора направления до первой работы и отчитываемся по каждой программе.", rating: 4.0, media: `${U}photo-1497633762265-9d179a990aa6?w=240&q=80` },
  { id: "mayak", name: "Фонд «Маяк»", address: "Калининград, Ленинский пр., 30", short: "Сопровождаем семьи в сложных жизненных ситуациях: консультации, юридическая и материальная помощь. Помогаем адресно по заявкам и держим партнёров в курсе результатов.", rating: 3.8, media: `${U}photo-1502920917128-1aa500764cbd?w=240&q=80` },
];

/** Документы от сотрудников (таб «Ваши сотрудники»). */
export interface EmployeeDoc {
  type: string;
  name: string;
  staff: string;
  status: OrgDocStatus;
  date: string;
  /** Подсветить строку (ожидает участия). */
  highlight?: boolean;
}
export const EMPLOYEE_DOCS: EmployeeDoc[] = [
  { type: "Договор", name: "Договор НВО", staff: "Козлова А. В.", status: "Ожидает участия", date: "19.05.2025", highlight: true },
  { type: "Договор", name: "Договор на поставку грунта и щебня", staff: "Михайлов Д. С.", status: "На согласовании", date: "11.04.2025" },
];

/** Соответствие статуса документа цвету бейджа DS. */
export const DOC_STATUS_COLOR: Record<OrgDocStatus, "green" | "orange" | "grey"> = {
  "Согласован": "green",
  "Ожидает участия": "orange",
  "На согласовании": "grey",
};

/* ── Договор (детальный документ, Figma 6760-460186 / 461111) ─────────────── */
export interface ContractTx { action: string; party: string; date: string }
export interface ContractPost { title: string; date: string; text?: string; author?: string; image: string }
export interface OrgContract {
  id: string;
  name: string;
  number: string;
  kor: string;
  amount: string;
  comment: string;
  customer: string;
  executor: string;
  attachedName: string;
  attachedMeta: string;
  chat: { me?: boolean; text: string; time?: string }[];
  /** Базовые транзакции (до подписи). */
  tx: ContractTx[];
  /** Строка, добавляемая сверху при подписании исполнителем. */
  signTx: ContractTx;
  process: ContractPost[];
}

/** Договор НВО фонда Velesta (оранжевый документ «Ожидает участия»). */
export const VELESTA_CONTRACT: OrgContract = {
  id: "velesta-nvo",
  name: "Договор НВО",
  number: "3422244244224",
  kor: "342",
  amount: "183 200 ₽",
  comment: "—",
  customer: "Благотворительный фонд Velesta",
  executor: "ИП Слоненок",
  attachedName: "Договор с ИП «Слоненок»",
  attachedMeta: "PDF · 1 MB",
  chat: [
    { text: "Привет, менеджер фонда. Подпиши, пожалуйста, договор.", time: "12:15" },
    { text: "Привет, сотрудник. Подписал договор, ждём исполнителя.", time: "12:35" },
    { me: true, text: "Привет всем. Сейчас подпишу.", time: "12:55" },
  ],
  tx: [
    { action: "Подпись менеджера", party: "Velesta", date: "19.05.2025 - 12:30" },
    { action: "Добавление консультанта", party: "Velesta", date: "19.05.2025 - 12:00" },
    { action: "Добавление договора", party: "Velesta", date: "19.05.2025 - 11:30" },
  ],
  signTx: { action: "Подпись исполнителя", party: "Elephant", date: "19.05.2025 - 13:00" },
  process: [
    {
      title: "Выезд команды фонда на объект",
      date: "20 мая 2025",
      text: "Команда фонда выехала на площадку: приняли работы, сверили объёмы со сметой и сняли фотоотчёт для публикации.",
      image: `${U}photo-1512941937669-90a1b58e7e9c?w=800&q=80`,
    },
    {
      title: "Информация от консультанта",
      date: "26 мая 2025",
      text: "Помощь распределена по заявкам, отчёт опубликован.",
      author: "ИП Наталья Верная",
      image: `${U}photo-1517245386807-bb43f82c33c4?w=800&q=80`,
    },
  ],
};

export function getContractForDoc(docName: string): OrgContract | undefined {
  return docName === VELESTA_CONTRACT.name ? VELESTA_CONTRACT : undefined;
}
