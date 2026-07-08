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

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat eLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat Pellentesque scelerisque tempus, consequat eLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque tempus, consequat";

/** Общие сведения партнёра «Кооператив Гвозди и доски» (Figma 1987:737273). */
const GVOZDI_INFO: PartnerInfoSection[] = [
  {
    title: "Описание",
    rows: [
      {
        label: "",
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea nunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet dnunc diam augue viverra facilisis nullam amet, tristique. Augue laoreet diam et, proin. Viverra nec.",
      },
    ],
  },
  {
    title: "Контактная информация",
    rows: [
      { label: "Местонахождение", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      { label: "Контактный телефон", value: "+7 (992) 223-22-22" },
      { label: "Домен", value: "slon@slon.ru" },
      { label: "E-mail", value: "immatra@immatra.ru" },
    ],
  },
  {
    title: "Устав",
    rows: [
      { label: "Регистрационный номер", value: "484848930202" },
      { label: "Организация", value: "Потребительский кооператив Гвозди и доски" },
      { label: "Почтовый адрес", value: "Санкт-Петербург, Дегтярный переулок, 11 лит А" },
      {
        label: "ОКВЭД",
        value: [
          "81.22 - Деятельность по чистке и уборке жилых зданий и нежилых помещений прочая;",
          "81.29.1 - Дезинфекция, дезинсекция, дератизация зданий, промышленного оборудования;",
          "64.19 - Денежное посредничество прочее",
        ],
      },
      { label: "ИНН", value: "45267345678" },
      { label: "Кем выдан", value: "Управление министерства юстиции РФ по Санкт-Петербургу" },
      { label: "Дата решения", value: "15.12.2005" },
      { label: "Дата внесения в ЮГРЮЛ", value: "25.12.2005" },
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
    description: LOREM,
    cover: "/walls/wall-5.jpg",
    avatar: "/orgs/romashka.png",
    info: GVOZDI_INFO,
  },
  {
    id: "gvozdi",
    title: "Кооператив Гвозди и доски",
    role: "Партнер кооператива Immatra",
    tag: "gvozdi.com",
    tagAsLink: true,
    description: LOREM,
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
    description: LOREM,
    cover: "/walls/wall-7.jpg",
    avatar: "/orgs/qr.jpg",
    info: GVOZDI_INFO,
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
    title: "Departure to the site of installation",
    date: "Август 23, 2019",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A, sed pulvinar scelerisque maecenas volutpat. Ornare in massa, blandit est, venenatis posuere felis, dolor. Dictumst ultricies turpis at a senectus.",
    image: true,
  },
  {
    title: "Departure to the site of installation",
    date: "Август 23, 2019",
    files: ["Личная скидка", "При уступлении склада", "Дневник №1"],
  },
];

/* ── Чат (Figma 1857:649858) ───────────────────────────────────────────── */
export interface ChatMessage {
  text: string;
  me: boolean;
  time: string;
}
export const CHAT_MESSAGES: ChatMessage[] = [
  { text: "Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu", me: true, time: "12:01" },
  { text: "Commodo tristique sapien tellus", me: true, time: "12:02" },
  { text: "Commodo tristique sapien tellus pellentesque. Nunc amet bibendum convallis quisqu", me: false, time: "12:03" },
];

/* ── Счёт → Взаиморасчеты (Figma 1857:649850 / 6563:357867) ─────────────── */
export const PARTNER_SUMMARY = [
  { label: "Ваш оборот с компанией", value: "1000 ETH" },
  { label: "Поступило за период", value: "97 ETH" },
  { label: "Расходы за период", value: "518 ETH" },
];

export const PARTNER_TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счет на оплату", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "216", color: "purple", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Взносы и целевые поступления", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
  { code: "215", color: "green", hash: "5c243af…07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Поступления с маршрутных счетов", documentSub: "Закупка площадок", amount: "0.229937", commission: "0.0022" },
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
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", status: "Отвалидирован", badge: "Локальный", date: "09.01.2020" },
  { type: "Сертификат", name: "Сертификат соответствия", status: "Отвалидирован", badge: "Локальный", date: "09.01.2020" },
  { type: "Договор", name: "Оплата за проектирование площадок", date: "09.01.2020" },
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
  { type: "Документ", name: "Документ в свободной форме", date: "09.01.2020", state: "share" },
  { type: "Документ", name: 'Сочинение на тему: "Как я провел Лето"', date: "09.01.2020", state: "lock" },
  { type: "Патент", name: "Изобретение плазменного реактора", date: "09.01.2020", state: "person" },
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

const ORG_ADDRESS = "123317, г. Москва, Пресненская наб., д. 8, стр. 1";

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
    address: ORG_ADDRESS,
    short: "Благотворительный фонд. Помогаем детям и семьям в трудной ситуации: ведём адресный сбор, оплачиваем лечение и реабилитацию. По каждой заявке публикуем отчёт, а с партнёрами работаем по договорам и закрываем документы в срок.",
    rating: 5,
    media: orgLogo("#111827", "VELESTA"),
    banner: 1,
    paragraphs: [
      "Благотворительный фонд. Помогаем детям и семьям в трудной ситуации.",
      "Ведём адресный сбор и публикуем отчёт по каждой заявке. С кооперативом работаем по договорам.",
    ],
    activity: "активность 2 дня назад",
    docs: [
      { type: "Договор", name: "Договор НВО", amount: "100 000 ₽", status: "Ожидает участия", date: "12.01.2020", group: "contract" },
      { type: "Договор", name: "Закупка площадок", amount: "50 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
      { type: "Договор", name: "Оплата за проектирование площадок", amount: "25 000 ₽", status: "На согласовании", date: "09.01.2020", group: "contract" },
      { type: "Договор", name: "Проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
    ],
  },
  {
    id: "sport",
    name: "Фонд «Я расту со спортом»",
    address: ORG_ADDRESS,
    short: "Поддержка детского спорта. Оплачиваем секции, форму и поездки на соревнования, помогаем открывать площадки в небольших городах. Работаем по заявкам от тренеров и родителей и отчитываемся по каждому переводу.",
    rating: 4,
    media: orgLogo("#ffffff", "#ЯРАСТУ", "#c0392b"),
    paragraphs: [
      "Поддерживаем детский спорт: оплачиваем секции, форму и поездки.",
      "Работаем по заявкам и отчитываемся по каждому переводу.",
    ],
    activity: "активность 2 дня назад",
    docs: [
      { type: "Договор", name: "Сборка площадок", amount: "10 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
      { type: "Договор", name: "Оплата за проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "contract" },
      { type: "Договор", name: "Проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
    ],
  },
  {
    id: "dari",
    name: "Фонд «Дари добро»",
    address: ORG_ADDRESS,
    short: "Сбор средств на лечение и реабилитацию. Помогаем адресно — от диагностики до восстановления, сопровождаем семьи на всех этапах. Все поступления и расходы фонда открыты, отчёты публикуем по каждой заявке.",
    rating: 3,
    media: orgLogo("#f2b705", "ДАРИ\nДОБРО", "#ffffff"),
    paragraphs: [
      "Собираем средства на лечение и реабилитацию.",
      "Помогаем адресно и публикуем отчёты по заявкам.",
    ],
    activity: "активность 2 дня назад",
    docs: [
      { type: "Договор", name: "Договор №1", amount: "40 000 ₽", status: "Согласован", date: "09.01.2020", group: "contract" },
      { type: "Договор", name: "Проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
    ],
  },
  {
    id: "culture",
    name: "Фонд «Живу с Культурой»",
    address: ORG_ADDRESS,
    short: "Культурный фонд. Поддерживаем выставки, спектакли и образовательные проекты, помогаем молодым авторам находить площадки и аудиторию. Проекты ведём вместе с партнёрами кооператива и отчитываемся по каждому этапу.",
    rating: 4,
    media: orgLogo("#ffffff", "ЖИВУ", "#e84393"),
    banner: 1,
    paragraphs: [
      "Культурный фонд. Поддерживаем выставки, спектакли и образование.",
      "Ведём проекты вместе с партнёрами кооператива.",
    ],
    activity: "активность 2 дня назад",
    docs: [
      { type: "Договор", name: "Договор №1", amount: "90 000 ₽", status: "Ожидает участия", date: "12.01.2020", group: "contract" },
      { type: "Договор", name: "Договор №2", amount: "30 000 ₽", status: "Согласован", date: "12.01.2020", group: "contract" },
      { type: "Счет на оплату", name: "Счет на оплату №1", amount: "50 000 ₽", status: "На согласовании", date: "11.01.2020", group: "paishik" },
      { type: "Договор", name: "Проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
    ],
  },
  {
    id: "druzya",
    name: "Фонд «Друзья»",
    address: ORG_ADDRESS,
    short: "Волонтёрский фонд. Помогаем приютам и пожилым людям: собираем корма и вещи, организуем поездки и уход. Распределяем помощь по заявкам и держим партнёров в курсе по каждой отправке.",
    rating: 3,
    media: orgLogo("#4aa6a0", "ДРУЗЬЯ"),
    banner: 3,
    paragraphs: [
      "Волонтёрский фонд. Помогаем приютам и пожилым людям.",
      "Организуем сбор и распределяем помощь по заявкам.",
    ],
    activity: "активность 2 дня назад",
    docs: [
      { type: "Договор", name: "Договор №1", amount: "30 000 ₽", status: "Ожидает участия", date: "12.01.2020", group: "contract" },
      { type: "Договор", name: "Проектирование площадок", amount: "25 000 ₽", status: "Согласован", date: "09.01.2020", group: "paishik" },
    ],
  },
];

export function getOrg(id: string): Org | undefined {
  return ORGS.find((o) => o.id === id);
}

/** Организации для таба «Найти нового партнёра» (обложки-фото). */
const U = "https://images.unsplash.com/";
export const FIND_ORGS: OrgSummary[] = [
  { id: "birthday", name: "Фонд «С Днём Рождения»", address: ORG_ADDRESS, short: "Организуем праздники для детей из детских домов и больниц: подарки, поездки и мастер-классы. Работаем с волонтёрами по всей стране и отчитываемся по каждому событию.", rating: 3, media: `${U}photo-1530103862676-de8c9debad1d?w=240&q=80` },
  { id: "klen", name: "Фонд «Клён»", address: ORG_ADDRESS, short: "Экологические проекты и озеленение городов. Высаживаем деревья, восстанавливаем парки и проводим субботники вместе с местными сообществами. Все сборы и расходы фонда открыты.", rating: 3, media: `${U}photo-1507525428034-b723cf961d3e?w=240&q=80` },
  { id: "vincent", name: "Организация «Vincent»", address: ORG_ADDRESS, short: "Поддержка художников и культурных инициатив. Помогаем с материалами, площадками и выставками, продвигаем молодых авторов. Работаем по договорам и ведём прозрачную отчётность.", rating: 5, media: `${U}photo-1541961017774-22349e4a1262?w=240&q=80` },
  { id: "lestnica", name: "Фонд «Лестница»", address: ORG_ADDRESS, short: "Помогаем подросткам с образованием и профессией: курсы, наставники и стажировки. Сопровождаем ребят от выбора направления до первой работы и отчитываемся по каждой программе.", rating: 3, media: `${U}photo-1497633762265-9d179a990aa6?w=240&q=80` },
  { id: "mayak", name: "Фонд «Маяк»", address: ORG_ADDRESS, short: "Сопровождаем семьи в сложных жизненных ситуациях: консультации, юридическая и материальная помощь. Помогаем адресно по заявкам и держим партнёров в курсе результатов.", rating: 3, media: `${U}photo-1502920917128-1aa500764cbd?w=240&q=80` },
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
  { type: "Договор", name: "Договор НВО", staff: "Петров И.", status: "Ожидает участия", date: "12.01.2020", highlight: true },
  { type: "Договор", name: "Договор на поставку земли", staff: "Иванов И.", status: "На согласовании", date: "12.01.2020" },
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
  amount: "100 000 ₽",
  comment: "—",
  customer: "Благотворительный фонд Velesta",
  executor: "ИП Слоненок",
  attachedName: "Договор с ИП «Слоненок»",
  attachedMeta: "PDF · 1 MB",
  chat: [
    { text: "Привет, менеджер фонда. Подпиши, пожалуйста, договор.", time: "12:15" },
    { text: "Привет, сотрудник. Подписал договор, ждём исполнителя.", time: "12:20" },
    { me: true, text: "Привет всем. Сейчас подпишу.", time: "13:45" },
  ],
  tx: [
    { action: "Подпись менеджера", party: "Velesta", date: "11.01.2020 - 12:30" },
    { action: "Добавление консультанта", party: "Velesta", date: "11.01.2020 - 12:00" },
    { action: "Добавление договора", party: "Velesta", date: "11.01.2020 - 11:30" },
  ],
  signTx: { action: "Подпись исполнителя", party: "Elephant", date: "11.01.2020 - 13:00" },
  process: [
    {
      title: "Some kind of publication",
      date: "January 11, 2020",
      text: "A team of like-minded people of our foundation left for the site.",
      image: `${U}photo-1512941937669-90a1b58e7e9c?w=800&q=80`,
    },
    {
      title: "Information from consultant",
      date: "January 11, 2020",
      text: "Помощь распределена по заявкам, отчёт опубликован.",
      author: "ИП Наталья Верная",
      image: `${U}photo-1517245386807-bb43f82c33c4?w=800&q=80`,
    },
  ],
};

export function getContractForDoc(docName: string): OrgContract | undefined {
  return docName === VELESTA_CONTRACT.name ? VELESTA_CONTRACT : undefined;
}
