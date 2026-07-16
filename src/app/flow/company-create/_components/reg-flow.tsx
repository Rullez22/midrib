"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { VerificationGroup } from "@/components/ds";
import type { TemplateDocStage } from "../../../cabinet/document/_components/documents-data";

/**
 * Общее состояние под-флоу «Создание формы регистрации» (шаги 7 → 8).
 * Живёт в layout компании-create, поэтому переживает клиентскую навигацию между
 * шагами: то, что выбрано на шаге 7 (страны/уровни/приоритет/возраст),
 * подхватывается на шаге 8.
 */

export const COUNTRIES = [
  { code: "at", label: "Австрия" },
  { code: "be", label: "Бельгия" },
  { code: "bg", label: "Болгария" },
  { code: "ru", label: "Россия" },
  { code: "gr", label: "Греция" },
  { code: "de", label: "Германия" },
];

export const GROUPS: VerificationGroup[] = [
  {
    label: "Локальная",
    columns: [
      { label: "Желтая", color: "orange" },
      { label: "Зеленая", color: "green" },
    ],
  },
  {
    label: "Международная",
    columns: [
      { label: "Желтая", color: "orange" },
      { label: "Зеленая", color: "green" },
    ],
  },
];

// Порядок колонок таблицы: 0 Локальная-Жёлтая · 1 Локальная-Зелёная ·
// 2 Международная-Жёлтая · 3 Международная-Зелёная.
export const PRIORITY_ITEMS = [
  "Зеленая международная",
  "Желтая международная",
  "Зеленая локальная",
  "Желтая локальная",
];

/** Метка приоритета → индекс колонки таблицы. */
export const PRIORITY_TO_COL: Record<string, number> = {
  "Зеленая международная": 3,
  "Желтая международная": 2,
  "Зеленая локальная": 1,
  "Желтая локальная": 0,
};

export const AGE_OPTIONS = ["Без ограничений", "7+", "16+", "18+"];

/** Приглашённые пайщики (мок) — единый источник для таблицы пайщиков и засева. */
export const PAISHIKI_NAMES = [
  "Илья Антонов",
  "Розалина Курт",
  "Александр Дмитров",
  "Дмитрий Александров",
  "Виктор Морозов",
];

/** Кандидаты в пайщики для таба «Согласование совета» (левая колонка shuttle) —
 *  засев по умолчанию. Приглашённые через форму добавляются сюда же. */
export const COUNCIL_CANDIDATES = [
  "Илья Антонов",
  "Мария Егорова",
  "Сергей Лебедев",
  "Валерий Варламов",
  "Оксана Кузнецова",
];

/** Код страны → язык локализации (для редактора основания и локализаций). */
export const COUNTRY_LANG: Record<string, string> = {
  ru: "Русский",
  bg: "Болгарский",
  at: "Немецкий",
  be: "Нидерландский",
  gr: "Греческий",
  de: "Немецкий",
};

/** Основания GDPR + пояснения для тултипа (Figma 2671:398591…398611). */
export const BASES: { title: string; tip: string }[] = [
  {
    title: "Согласие",
    tip: "Базовое основание для обработки персональных данных Пользователя. Вы можете использовать его, если нет других оснований. Согласие Пользователя должно быть добровольным. Пользователь в любой момент вправе отозвать выданное им согласие на обработку своих персональных данных.",
  },
  {
    title: "Договор",
    tip: "Вы можете использовать это основание, когда обрабатываете персональные данные Пользователя в целях исполнения договора, стороной которого является Пользователь, или в целях заключения такого договора.",
  },
  {
    title: "Правовое обязательство",
    tip: "Выберите это основание, если Вы обязаны обрабатывать персональные данные Пользователя на основании закона или иного нормативного акта, применимого к Вам.",
  },
  {
    title: "Жизненно важные интересы",
    tip: "Это надлежащее основание для ситуаций, когда Вы обрабатываете персональные данные Пользователя для защиты жизненно важных интересов Пользователя или другого человека.",
  },
  {
    title: "Общественный интерес",
    tip: "Это основание для обработки персональных данных Пользователя, если такая обработка нужна для выполнения задачи в рамках публичных интересов или в целях реализации возложенных на Вас публичных полномочий.",
  },
  {
    title: "Законные интересы",
    tip: "Если нет иных оснований для обработки персональных данных Пользователя, но у Вас или третьего лица присутствует интерес в такой обработке. Учитывайте, что такой интерес должен быть сбалансирован с правами и свободами Пользователя, чьи персональные данные Вы обрабатываете.",
  },
];

const COL_COUNT = GROUPS.reduce((n, g) => n + g.columns.length, 0);

/** Локализация основания (описание на одном языке). */
export interface BasisLocalization {
  /** Код страны/языка локализации (значение комбобокса). */
  language: string;
  description: string;
  isDefault: boolean;
  /** Дата создания, DD.MM.YYYY. */
  date: string;
}

/** Сохранённый выбор экрана документов (для восстановления при «карандаше»). */
export interface DocSelection {
  type: "general" | "personal";
  identity: string[];
  docs: Record<string, string[]>;
  /** Добавленные «другие документы»: по коду страны → ключу документа. */
  altDocs?: Record<string, Record<string, string[]>>;
}

/** Черновик пользовательского соглашения (вкладка «Черновики»). */
export interface PpDraft {
  title: string;
  date: string;
}

/** Вопрос голосования по платежу (Разовый/Стабильный), отправленный «на совет». */
export interface PaymentVote {
  id: string;
  /** Заголовок вопроса в списке «Вопросы». */
  title: string;
  /** Сумма платежа на одного получателя, напр. "0.02". */
  amount: string;
  /** Название документа-основания. */
  docName: string;
  /** Выбранные получатели (пайщики/юрлица). */
  recipients: { name: string; mid: string; legal: boolean }[];
  /** Тип вопроса: разовый/стабильный платёж, массовое/персональное подключение,
   *  финансовый отчёт («report»), создание токена («token») или добавление
   *  пайщиков в кооператив («member» — «Согласование совета»). */
  kind?: "once" | "stable" | "mass" | "personal" | "report" | "token" | "member";
  /** Создание токена: название создаваемого токена (→ имя в табе «Токены»). */
  tokenName?: string;
  /** Создание токена: выбранные вопросы голосования (заголовки). */
  questions?: string[];
  /** Создание токена: выбранное основание (read-only в детали). */
  baseDoc?: { type: string; name: string; date: string };
  /** Массовое/персональное подключение: количество долей на пайщика. */
  shares?: number;
  /** Финансовый отчёт: период отчёта (текст). */
  period?: string;
  /** Стабильный: выбранный пайщик-плательщик (для карточки «Выбранный пайщик»). */
  payer?: { name: string; description: string; avatarSrc: string };
  /** Стабильный: настройка распределения «Настройка %». */
  distribution?: {
    target: number;
    subs: { name: string; pct: number }[];
    payerShare: number;
    days: string;
    sum: string;
  };
  /** Ответ текущего пользователя. */
  choice: "За" | "Против" | null;
  /** Голосование завершено. */
  done: boolean;
}

/** Иконка-состояние токена в табе «Токены»: person/lock/share (см. StateIcon). */
export type TokenIcon = "person" | "lock" | "share";

/** Токен пайщика (таб «Токены» → «Ваши токены»). */
export interface CoopToken {
  name: string;
  icon: TokenIcon;
  /** Вопросы голосования, привязанные к токену (детальный экран). */
  questions: string[];
}

/** Токены «Ваши» по умолчанию (засев — единый источник для таба «Токены»). */
const DEFAULT_TOKENS: CoopToken[] = [
  { name: "Маркетинговые токены", icon: "person", questions: ["Вопрос 1", "Вопрос 2", "Вопрос 3"] },
  { name: "Токены для управления", icon: "lock", questions: ["Вопрос 1", "Вопрос 2", "Вопрос 3"] },
  { name: "Счет разработки ПО", icon: "share", questions: ["Вопрос 1", "Вопрос 2", "Вопрос 3"] },
];

interface RegFlowValue {
  name: string;
  setName: (v: string) => void;
  /** Матрица [страна][колонка] отметок таблицы верификации. */
  checks: boolean[][];
  setCheck: (row: number, col: number, value: boolean) => void;
  /** Порядок приоритета (метки). */
  priority: string[];
  setPriority: (v: string[]) => void;
  /** Выбранное возрастное ограничение. */
  age: string;
  setAge: (v: string) => void;
  /** Созданные основания ПО СТРАНАМ: страна → основание → список локализаций. */
  bases: Record<string, Record<string, BasisLocalization[]>>;
  addLocalization: (country: string, title: string, loc: BasisLocalization) => void;
  updateLocalization: (country: string, title: string, index: number, loc: BasisLocalization) => void;
  removeLocalization: (country: string, title: string, index: number) => void;
  /** Выбор на экране документов (для отображения в форме и восстановления):
   *  type — режим настройки (общая/персональная); identity — отмеченные поля
   *  идентификации; docs — ключи документов («категория/документ») по коду
   *  страны; altDocs — добавленные «другие документы» по стране и документу. */
  docSelection: DocSelection | null;
  setDocSelection: (v: DocSelection) => void;
  /** Страна, для которой открыт редактор. */
  activeCountry?: string;
  setActiveCountry: (code?: string) => void;
  /** Основание, открытое в редакторе. */
  activeBasis?: string;
  setActiveBasis: (title?: string) => void;
  /** Индекс редактируемой локализации (undefined — добавление новой). */
  activeLoc?: number;
  setActiveLoc: (index?: number) => void;
  /** Форма регистрации опубликована (ПС создано) — для экрана пайщиков. */
  published: boolean;
  setPublished: (v: boolean) => void;
  /** Черновики пользовательского соглашения (вкладка «Черновики»). */
  drafts: PpDraft[];
  addDraft: (d: PpDraft) => void;
  removeDraft: (index: number) => void;
  /** Приглашённые пайщики (имена) — «пайщики completed»; переживает навигацию. */
  invitedMembers: string[];
  addInvitedMembers: (names: string[]) => void;
  /** Кандидаты для согласования совета (левая колонка shuttle в табе «Совет»).
   *  Приглашённые через форму попадают сюда, а не сразу в «Действующие». */
  councilCandidates: string[];
  addCouncilCandidates: (names: string[]) => void;
  removeCouncilCandidates: (names: string[]) => void;
  /** Слоты коллектива совета (индексы пайщиков, null — пусто). Переживает навигацию. */
  councilSlots: (number | null)[];
  setCouncilSlots: (slots: (number | null)[]) => void;
  /** Голосование запущено («Запустить голосование») — статусы «На голосовании»,
   *  оранжевая кнопка «Вопросы голосования» в сайдбаре. Переживает навигацию. */
  votingStarted: boolean;
  startVoting: () => void;
  /** Этап формирования совета: 0 — члены совета, 1 — председатель совета,
   *  2 — председатель правления, 3 — всё назначено. Переживает навигацию. */
  councilStage: number;
  /** Какой этап открыт на экране голосования (клик по вопросу). null — текущий.
   *  Завершённые этапы (< councilStage) открываются в режиме «только результаты». */
  councilViewStage: number | null;
  setCouncilViewStage: (s: number | null) => void;
  /** Завершить голосование текущего этапа → следующий этап (сброс votingStarted). */
  advanceCouncilStage: () => void;
  /** Назначенные председатели: [совета, правления] (индексы пайщиков, null — пусто). */
  chairs: (number | null)[];
  setChairs: (chairs: (number | null)[]) => void;
  /** Счета разблокированы (клик по баннеру «Завершить настройку») — пункт «Счета»
   *  доступен в боковом меню. Переживает навигацию. */
  accountsUnlocked: boolean;
  unlockAccounts: () => void;
  /** Досидить совет до завершённого состояния (членов + председатели назначены,
   *  councilStage=3). Для самосогласованности при прямом заходе на экраны счетов. */
  seedCouncilDone: () => void;
  /** Посеять КОНКРЕТНЫЙ этап совета (0 — члены, 1 — пред. совета, 2 — пред.
   *  правления): предыдущие этапы заполнены, текущий слот пуст (для выбора). Для
   *  прямого захода на «Деятельность» нужного этапа по ссылке. */
  seedCouncilStage: (n: number) => void;
  /** Распределение % целевого счёта: target (целевой) + subs (подсчёта). null —
   *  ещё не распределяли (на счетах показываются 0%). Переживает навигацию. */
  distribution: { target: number; subs: number[] } | null;
  /** Запустить голосование по распределению %: сохранить раскладку, поставить
   *  вопрос «на голосование» (подсветка в вопросах + оранжевая иконка в меню). */
  startAccountsVote: (d: { target: number; subs: number[] }) => void;
  /** Вопрос распределения сейчас на голосовании (активная подсветка). */
  accountsVoteStarted: boolean;
  /** Голосование по распределению завершено → проценты применены к счетам. */
  accountsVoteDone: boolean;
  /** Завершить голосование по распределению (применить проценты к счетам). */
  finishAccountsVote: () => void;
  /** Черновик нового подсчёта (на голосовании). null — не создаём. */
  podschetDraft: PodschetDraft | null;
  /** Созданные подсчёта (добавляются на счета после успешного голосования). */
  extraPodscheta: { name: string; pct: number }[];
  /** Голосование по созданию подсчёта запущено (активный вопрос + оранжевая иконка). */
  podschetVoteStarted: boolean;
  /** Голосование по созданию подсчёта завершено (подсчёт добавлен на счета). */
  podschetVoteDone: boolean;
  /** Запустить голосование по созданию подсчёта (сохранить черновик). */
  startPodschetVote: (draft: PodschetDraft) => void;
  /** Завершить: добавить подсчёт на счета, обновить распределение целевого счёта. */
  finishPodschetVote: () => void;
  /** Стадия «Отправка уставных документов на валидацию» (баннер на счетах):
   *  idle — старт («Запустить голосование») · voting — идёт голосование
   *  (оранжевый + «Проголосовать») · searching — поиск валидатора (серый+спиннер)
   *  · found — валидатор найден (оранжевый) · processing — обрабатывается (жёлтый). */
  validationStage: ValidationStage;
  /** Запустить голосование за отправку устава → voting (вопрос активен, оранжевая иконка). */
  startValidationVote: () => void;
  /** Завершить голосование за отправку → searching (поиск валидатора). */
  finishValidationVote: () => void;
  /** Подтвердить найденного валидатора → processing. */
  confirmValidator: () => void;
  /** Завершить работу с валидатором (крестик в чате) → validated (документ
   *  отвалидирован, баннер «Отправка на юрисдикцию»). */
  completeValidation: () => void;
  /** Вопросы голосования по платежам (Разовый/Стабильный) — отправлены «на совет». */
  paymentVotes: PaymentVote[];
  /** Создать вопрос голосования по платежу → вернуть id. */
  submitPaymentVote: (v: Omit<PaymentVote, "id" | "choice" | "done">) => string;
  /** Проголосовать За/Против по вопросу платежа. */
  castPaymentVote: (id: string, choice: "За" | "Против") => void;
  /** Завершить голосование по вопросу платежа. Для kind="token" — добавляет
   *  созданный токен в таб «Токены». */
  finishPaymentVote: (id: string) => void;
  /** Токены пайщика (таб «Токены» → «Ваши токены»). Переживает навигацию. */
  tokens: CoopToken[];
  /** Засидить ВЕСЬ флоу до финала (всё готово: совет/счета/распределение/подсчёт/
   *  валидация). Для прямого захода на финальный экран по ссылке. */
  seedFinal: () => void;
  /** Этап создаваемого по шаблону документа (плашка в табе «Документооборот»
   *  счёта). null — документ ещё не создан. Переживает навигацию кабинет↔флоу. */
  templateDocStage: TemplateDocStage | null;
  setTemplateDocStage: (s: TemplateDocStage | null) => void;
  /** Этап документа по СТОРОННЕМУ шаблону (отдельная плашка). null — не создан. */
  externalDocStage: TemplateDocStage | null;
  setExternalDocStage: (s: TemplateDocStage | null) => void;
  /** Подписанные договоры партнёров (id). Переживает навигацию список↔документ:
   *  подписанный документ становится «Согласован», а оранжевая плашка уходит. */
  signedContracts: string[];
  signContract: (id: string) => void;
  /** Договоры, созданные через «Добавить документ» → «Договор» (из формы).
   *  Живут в списке «Документооборот» партнёра как «Ожидает участия», затем
   *  «Согласован» после финализации. Переживают клиентскую навигацию. */
  createdContracts: CreatedContract[];
  /** Создать документ из формы. Возвращает его id (для роутинга на деталь). */
  addCreatedContract: (data: NewContractData) => string;
  /** Идемпотентно засеять готовый документ с конкретным id (напр. документы цели). */
  ensureContract: (c: CreatedContract) => void;
  /** Обновить документ (из формы в режиме «Редактировать»). */
  updateCreatedContract: (id: string, data: NewContractData) => void;
  getCreatedContract: (id: string) => CreatedContract | undefined;
  /** «Подписать» → signed=true; далее авто-прогресс до «Согласован». */
  signCreatedContract: (id: string) => void;
  /** Добавить консультанта к договору (beforeSign фиксируется на момент вызова). */
  addConsultant: (id: string, data: ConsultantData) => void;
  /** «Завершить консультацию» — фиксирует tx «Добавление консультанта». */
  finishConsultation: (id: string) => void;
  /** «Обычные» документы партнёров со статусом «На согласовании», которые
   *  согласовались (через 5с после открытия). Ключ — id документа (orgdoc-N).
   *  Переживает навигацию: и плашка в списке, и деталь становятся «Согласован». */
  approvedOrgDocs: string[];
  approveOrgDoc: (key: string) => void;
  /** Флоу «Оценка и закрытие договора» (исключение для партнёра «Живу с Культурой»,
   *  «Договор на организацию выставки»). Статус: Ожидает участия → Оценка (открыт) → Закрыт (2 отзыва +3с). */
  cultureStarted: boolean;
  cultureReviews: number;
  cultureClosed: boolean;
  startCultureReview: () => void;
  addCultureReview: () => void;
}

/** Данные формы создания документа (договор / счёт / акт). */
export interface NewContractData {
  orgId: string;
  /** Вид документа: договор / счёт на оплату / акт выполненных работ. */
  kind: DocKind;
  /** Родительский документ, внутри которого создан (вложенный). null — создан
   *  на странице партнёра (отдельный документ в списке документооборота). */
  parentId: string | null;
  /** Заказчик — название партнёра/фонда (для шапки документа). */
  customer: string;
  name: string;
  number: string;
  code: string;
  amount: string;
  comment: string;
  attachedName: string;
  attachedMeta: string;
}

/** Консультант, добавленный к договору (шаг «Консультант»). */
export interface ConsultantData {
  name: string;
  amount: string;
  task: string;
}

/** Созданный договор партнёра (мок, из формы). */
export interface CreatedContract extends NewContractData {
  id: string;
  executor: string;
  /** Исполнитель подписал (я). После этого идёт авто-прогресс. */
  signed: boolean;
  /** Сколько авто-шагов (транзакций/сообщений) уже появилось после подписи. */
  step: number;
  /** Документ согласован обеими сторонами (финал). */
  finalized: boolean;
  /** Консультант добавлен (окно консультации доступно). */
  consultant: (ConsultantData & { beforeSign: boolean }) | null;
  /** Консультация завершена — tx «Добавление консультанта» в блокчейне. */
  consultationDone: boolean;
}

/** Через сколько мс после подписи договор становится «Согласован» (мок). */
export const CONTRACT_FINALIZE_MS = 5000;

/** Вид документа документооборота между партнёрами.
 *  `goalcontract` — договор внутри цели (Фонд): 2 транзакции фонда, затем через
 *  3с подпись исполнителя и через 1с переход в готовый договор. */
export type DocKind = "contract" | "invoice" | "act" | "goalcontract";

/** Авто-прогресс после подписи по видам документа (мок):
 *  - `steps`     — сколько транзакций/сообщений появляется автоматически;
 *  - `stepMs`    — интервал появления шага (мс);
 *  - `finalizeMs`— пауза после последнего шага до «Согласован».
 *  Договор: без промежуточных шагов, финал через 5с. Счёт: 3 шага каждые 2с,
 *  финал +2с. Акт: 2 шага каждые 2с, финал +3с. */
export const KIND_PROGRESS: Record<DocKind, { steps: number; stepMs: number; finalizeMs: number }> = {
  contract: { steps: 0, stepMs: 2000, finalizeMs: 5000 },
  invoice: { steps: 3, stepMs: 2000, finalizeMs: 2000 },
  act: { steps: 2, stepMs: 2000, finalizeMs: 3000 },
  goalcontract: { steps: 1, stepMs: 3000, finalizeMs: 1000 },
};

export type ValidationStage = "idle" | "voting" | "searching" | "found" | "processing" | "validated";
/** Длительность «поиска валидатора» (скелетон/спиннер), мс. Мок — настраивается. */
export const VALIDATION_SEARCH_MS = 8000;

/** Черновик нового подсчёта (форма «Создание нового подсчета»). */
export interface PodschetDraft {
  name: string;
  type: "pool" | "matryoshka";
  okved: string[];
  purpose: string;
  /** % целевого счёта и трёх базовых подсчётов; остаток (буфер) — доля нового подсчёта. */
  target: number;
  subs: number[];
}

const RegFlowContext = createContext<RegFlowValue | null>(null);

export function RegFlowProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [checks, setChecks] = useState<boolean[][]>(() =>
    COUNTRIES.map(() => Array.from({ length: COL_COUNT }, () => false)),
  );
  const [priority, setPriority] = useState<string[]>(PRIORITY_ITEMS);
  const [age, setAge] = useState(AGE_OPTIONS[0]);
  const [bases, setBases] = useState<Record<string, Record<string, BasisLocalization[]>>>({});
  const [docSelection, setDocSelection] = useState<DocSelection | null>(null);
  const [activeCountry, setActiveCountry] = useState<string>();
  const [activeBasis, setActiveBasis] = useState<string>();
  const [activeLoc, setActiveLoc] = useState<number>();
  const [published, setPublished] = useState(false);
  const [drafts, setDrafts] = useState<PpDraft[]>([]);
  const addDraft = (d: PpDraft) => setDrafts((prev) => [...prev, d]);
  const removeDraft = (index: number) => setDrafts((prev) => prev.filter((_, i) => i !== index));
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const addInvitedMembers = (names: string[]) => setInvitedMembers((prev) => [...prev, ...names]);
  const [councilCandidates, setCouncilCandidates] = useState<string[]>(COUNCIL_CANDIDATES);
  const addCouncilCandidates = (names: string[]) =>
    setCouncilCandidates((prev) => [...prev, ...names.filter((n) => !prev.includes(n))]);
  const removeCouncilCandidates = (names: string[]) =>
    setCouncilCandidates((prev) => prev.filter((n) => !names.includes(n)));
  const [councilSlots, setCouncilSlots] = useState<(number | null)[]>([null, null, null]);
  const [votingStarted, setVotingStarted] = useState(false);
  // Запуск голосования подразумевает настроенный совет: если слоты пусты (напр.
  // прямой заход на экран голосования), заполняем первыми пайщиками.
  const startVoting = () => {
    setVotingStarted(true);
    setCouncilSlots((prev) => (prev.every((s) => s == null) ? [0, 1, 2] : prev));
  };
  const [councilStage, setCouncilStage] = useState(0);
  const [councilViewStage, setCouncilViewStage] = useState<number | null>(null);
  const [chairs, setChairs] = useState<(number | null)[]>([null, null]);
  const [accountsUnlocked, setAccountsUnlocked] = useState(false);
  const unlockAccounts = () => setAccountsUnlocked(true);
  const seedCouncilDone = () => {
    setCouncilSlots((prev) => (prev.every((s) => s == null) ? [0, 1, 2] : prev));
    setChairs((prev) => [prev[0] ?? 3, prev[1] ?? 4]);
    setVotingStarted(false);
    setCouncilStage(3);
  };
  const seedCouncilStage = (n: number) => {
    const stage = Math.max(0, Math.min(n, 2));
    setCouncilSlots(stage >= 1 ? [0, 1, 2] : [null, null, null]); // члены готовы с этапа 1
    setChairs([stage >= 2 ? 3 : null, null]); // пред. совета готов с этапа 2
    setVotingStarted(false);
    setCouncilStage(stage);
  };
  const [distribution, setDistribution] = useState<{ target: number; subs: number[] } | null>(null);
  const [accountsVoteStarted, setAccountsVoteStarted] = useState(false);
  const [accountsVoteDone, setAccountsVoteDone] = useState(false);
  // Оранжевую иконку «Вопросы голосования» держит сам accountsVoteStarted —
  // votingStarted (статусы совета) трогать не нужно.
  const startAccountsVote = (d: { target: number; subs: number[] }) => {
    setDistribution(d);
    setAccountsVoteStarted(true);
    setAccountsVoteDone(false);
  };
  const finishAccountsVote = () => {
    setAccountsVoteStarted(false);
    setAccountsVoteDone(true);
  };
  const [podschetDraft, setPodschetDraft] = useState<PodschetDraft | null>(null);
  const [extraPodscheta, setExtraPodscheta] = useState<{ name: string; pct: number }[]>([]);
  const [podschetVoteStarted, setPodschetVoteStarted] = useState(false);
  const [podschetVoteDone, setPodschetVoteDone] = useState(false);
  const startPodschetVote = (draft: PodschetDraft) => {
    setPodschetDraft(draft);
    setPodschetVoteStarted(true);
    setPodschetVoteDone(false);
  };
  // Вопросы голосования по платежам — переживают навигацию между экранами кабинета.
  const [paymentVotes, setPaymentVotes] = useState<PaymentVote[]>([]);
  const [paymentVoteSeq, setPaymentVoteSeq] = useState(0);
  const submitPaymentVote = (v: Omit<PaymentVote, "id" | "choice" | "done">) => {
    const id = `pay-${paymentVoteSeq}`;
    setPaymentVoteSeq((n) => n + 1);
    setPaymentVotes((prev) => [{ ...v, id, choice: null, done: false }, ...prev]);
    return id;
  };
  const castPaymentVote = (id: string, choice: "За" | "Против") =>
    setPaymentVotes((prev) => prev.map((p) => (p.id === id ? { ...p, choice } : p)));
  // Токены пайщика: дефолтные + созданные через голосование (kind="token").
  const [tokens, setTokens] = useState<CoopToken[]>(DEFAULT_TOKENS);
  const finishPaymentVote = (id: string) => {
    const v = paymentVotes.find((p) => p.id === id);
    // Завершённое голосование за создание токена → токен появляется в табе «Токены».
    if (v?.kind === "token" && v.tokenName) {
      const name = v.tokenName;
      setTokens((prev) =>
        prev.some((t) => t.name === name)
          ? prev
          : [{ name, icon: "share", questions: v.questions ?? [] }, ...prev],
      );
    }
    // Завершённое согласование совета → пайщики переходят в «Действующие».
    if (v?.kind === "member") {
      const names = v.recipients.map((r) => r.name);
      setInvitedMembers((prev) => [...prev, ...names.filter((n) => !prev.includes(n))]);
    }
    setPaymentVotes((prev) => prev.map((p) => (p.id === id ? { ...p, done: true } : p)));
  };

  // Этап in-flow документа по шаблону — переживает навигацию между табом
  // «Документооборот» счёта и флоу создания документа (resume по клику плашки).
  const [templateDocStage, setTemplateDocStage] = useState<TemplateDocStage | null>(null);
  const [externalDocStage, setExternalDocStage] = useState<TemplateDocStage | null>(null);
  const [signedContracts, setSignedContracts] = useState<string[]>([]);
  const signContract = (id: string) =>
    setSignedContracts((prev) => (prev.includes(id) ? prev : [...prev, id]));

  // ── Договоры, созданные из формы «Добавить документ» → «Договор» ──────
  const [createdContracts, setCreatedContracts] = useState<CreatedContract[]>([]);
  const [contractSeq, setContractSeq] = useState(0);
  const addCreatedContract = (data: NewContractData) => {
    const id = `created-${contractSeq}`;
    setContractSeq((n) => n + 1);
    setCreatedContracts((prev) => [
      ...prev,
      {
        ...data,
        id,
        executor: "ИП Слоненок",
        signed: false,
        step: 0,
        finalized: false,
        consultant: null,
        consultationDone: false,
      },
    ]);
    return id;
  };
  const ensureContract = (c: CreatedContract) =>
    setCreatedContracts((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
  const updateCreatedContract = (id: string, data: NewContractData) =>
    setCreatedContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const getCreatedContract = (id: string) => createdContracts.find((c) => c.id === id);
  const signCreatedContract = (id: string) =>
    setCreatedContracts((prev) => prev.map((c) => (c.id === id ? { ...c, signed: true } : c)));
  const addConsultant = (id: string, data: ConsultantData) =>
    setCreatedContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, consultant: { ...data, beforeSign: !c.signed } } : c)),
    );
  const finishConsultation = (id: string) =>
    setCreatedContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, consultationDone: true } : c)),
    );
  const [approvedOrgDocs, setApprovedOrgDocs] = useState<string[]>([]);
  const approveOrgDoc = (key: string) =>
    setApprovedOrgDocs((prev) => (prev.includes(key) ? prev : [...prev, key]));

  // ── «Оценка и закрытие договора» (culture / выставка) ───────────────────
  const [cultureStarted, setCultureStarted] = useState(false);
  const [cultureReviews, setCultureReviews] = useState(0);
  const [cultureClosed, setCultureClosed] = useState(false);
  const startCultureReview = () => setCultureStarted(true);
  const addCultureReview = () => setCultureReviews((n) => Math.min(2, n + 1));
  // Два отзыва оставлены → через 3с договор закрывается.
  useEffect(() => {
    if (cultureReviews < 2 || cultureClosed) return;
    const t = setTimeout(() => setCultureClosed(true), 3000);
    return () => clearTimeout(t);
  }, [cultureReviews, cultureClosed]);
  // Авто-прогресс подписанного документа: сначала появляются N транзакций/
  // сообщений (каждые stepMs), затем через finalizeMs он становится «Согласован».
  // Таймер живёт в провайдере (всегда смонтирован).
  useEffect(() => {
    const pending = createdContracts.find((c) => c.signed && !c.finalized);
    if (!pending) return;
    const prog = KIND_PROGRESS[pending.kind];
    if (pending.step < prog.steps) {
      const t = setTimeout(() => {
        setCreatedContracts((prev) =>
          prev.map((c) => (c.id === pending.id ? { ...c, step: c.step + 1 } : c)),
        );
      }, prog.stepMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCreatedContracts((prev) =>
        prev.map((c) => (c.id === pending.id ? { ...c, finalized: true } : c)),
      );
    }, prog.finalizeMs);
    return () => clearTimeout(t);
  }, [createdContracts]);

  const [validationStage, setValidationStage] = useState<ValidationStage>("idle");
  const startValidationVote = () => setValidationStage("voting");
  const finishValidationVote = () => setValidationStage("searching");
  const confirmValidator = () => setValidationStage("processing");
  const completeValidation = () => setValidationStage("validated");
  // Полный сид финала: всё, что вводилось/проходилось во флоу — готово.
  const seedFinal = () => {
    if (invitedMembers.length === 0) setInvitedMembers(PAISHIKI_NAMES);
    setPublished(true);
    setCouncilSlots((prev) => (prev.every((s) => s == null) ? [0, 1, 2] : prev));
    setChairs((prev) => [prev[0] ?? 3, prev[1] ?? 4]);
    setVotingStarted(false);
    setCouncilStage(3);
    setAccountsUnlocked(true);
    setDistribution((prev) => prev ?? { target: 40, subs: [20, 20, 20] });
    setAccountsVoteDone(true);
    setExtraPodscheta((prev) => (prev.length ? prev : [{ name: "Маркетинговый счет", pct: 10 }]));
    setPodschetVoteDone(true); // нужно для показа баннера «Отправка на валидацию»
    setValidationStage("validated");
  };
  // «Поиск валидатора» (searching) сам завершается через таймаут → found.
  // Живёт в провайдере (всегда смонтирован), поэтому не зависит от страницы.
  useEffect(() => {
    if (validationStage !== "searching") return;
    const t = setTimeout(() => setValidationStage("found"), VALIDATION_SEARCH_MS);
    return () => clearTimeout(t);
  }, [validationStage]);

  const finishPodschetVote = () => {
    setPodschetVoteStarted(false);
    setPodschetVoteDone(true);
    if (podschetDraft) {
      // Остаток (буфер) распределения — доля нового подсчёта.
      const buffer = 100 - podschetDraft.target - podschetDraft.subs.reduce((a, b) => a + b, 0);
      // Обновляем распределение целевого счёта на значения из формы и фиксируем его
      // как применённое (счета показывают «настроенный» вид с процентами).
      setDistribution({ target: podschetDraft.target, subs: podschetDraft.subs });
      setAccountsVoteDone(true);
      setExtraPodscheta((prev) => [...prev, { name: podschetDraft.name, pct: Math.max(0, buffer) }]);
    }
  };
  // Завершение голосования этапа → следующий этап; голосование сбрасывается.
  // Перед переходом фиксируем избранных текущего этапа: если слоты ещё пусты
  // (напр. прямой заход на голосование без ручного выбора) — засеваем пайщиками
  // по умолчанию, чтобы они отображались «Активными» на следующем этапе.
  const advanceCouncilStage = () => {
    setVotingStarted(false);
    setCouncilViewStage(null);
    if (councilStage === 0) {
      setCouncilSlots((prev) => (prev.every((s) => s == null) ? [0, 1, 2] : prev));
    } else if (councilStage === 1) {
      setChairs((prev) => (prev[0] == null ? [3, prev[1]] : prev));
    } else if (councilStage === 2) {
      setChairs((prev) => (prev[1] == null ? [prev[0], 4] : prev));
    }
    setCouncilStage((s) => Math.min(s + 1, 3));
  };

  const setCheck = (row: number, col: number, value: boolean) =>
    setChecks((prev) =>
      prev.map((r, ri) => (ri === row ? r.map((v, ci) => (ci === col ? value : v)) : r)),
    );

  // Единственная локализация «по умолчанию»: если новая помечена default —
  // снимаем флаг с остальных.
  const normalize = (list: BasisLocalization[], keepDefault: number) =>
    list.map((l, i) => (keepDefault >= 0 && l.isDefault && i !== keepDefault ? { ...l, isDefault: false } : l));

  /** Обновить список локализаций основания страны через функцию. */
  const mutate = (
    country: string,
    title: string,
    fn: (list: BasisLocalization[]) => BasisLocalization[] | null,
  ) =>
    setBases((prev) => {
      const countryBases = { ...(prev[country] ?? {}) };
      const result = fn(countryBases[title] ?? []);
      if (result == null || result.length === 0) delete countryBases[title];
      else countryBases[title] = result;
      const next = { ...prev };
      if (Object.keys(countryBases).length === 0) delete next[country];
      else next[country] = countryBases;
      return next;
    });

  const addLocalization = (country: string, title: string, loc: BasisLocalization) =>
    mutate(country, title, (list) => {
      const out = [...list, loc];
      return loc.isDefault ? normalize(out, out.length - 1) : out;
    });
  const updateLocalization = (country: string, title: string, index: number, loc: BasisLocalization) =>
    mutate(country, title, (list) => {
      const out = list.map((l, i) => (i === index ? loc : l));
      return loc.isDefault ? normalize(out, index) : out;
    });
  const removeLocalization = (country: string, title: string, index: number) =>
    mutate(country, title, (list) => list.filter((_, i) => i !== index));

  return (
    <RegFlowContext.Provider
      value={{
        name,
        setName,
        checks,
        setCheck,
        priority,
        setPriority,
        age,
        setAge,
        bases,
        addLocalization,
        updateLocalization,
        removeLocalization,
        docSelection,
        setDocSelection,
        activeCountry,
        setActiveCountry,
        activeBasis,
        setActiveBasis,
        activeLoc,
        setActiveLoc,
        published,
        setPublished,
        drafts,
        addDraft,
        removeDraft,
        invitedMembers,
        addInvitedMembers,
        councilCandidates,
        addCouncilCandidates,
        removeCouncilCandidates,
        councilSlots,
        setCouncilSlots,
        votingStarted,
        startVoting,
        councilStage,
        councilViewStage,
        setCouncilViewStage,
        advanceCouncilStage,
        chairs,
        setChairs,
        accountsUnlocked,
        unlockAccounts,
        seedCouncilDone,
        seedCouncilStage,
        distribution,
        startAccountsVote,
        accountsVoteStarted,
        accountsVoteDone,
        finishAccountsVote,
        podschetDraft,
        extraPodscheta,
        podschetVoteStarted,
        podschetVoteDone,
        startPodschetVote,
        finishPodschetVote,
        validationStage,
        startValidationVote,
        finishValidationVote,
        confirmValidator,
        completeValidation,
        paymentVotes,
        submitPaymentVote,
        castPaymentVote,
        finishPaymentVote,
        tokens,
        seedFinal,
        templateDocStage,
        setTemplateDocStage,
        externalDocStage,
        signedContracts,
        signContract,
        setExternalDocStage,
        createdContracts,
        addCreatedContract,
        ensureContract,
        updateCreatedContract,
        getCreatedContract,
        signCreatedContract,
        addConsultant,
        finishConsultation,
        approvedOrgDocs,
        approveOrgDoc,
        cultureStarted,
        cultureReviews,
        cultureClosed,
        startCultureReview,
        addCultureReview,
      }}
    >
      {children}
    </RegFlowContext.Provider>
  );
}

export function useRegFlow() {
  const ctx = useContext(RegFlowContext);
  if (ctx == null) throw new Error("useRegFlow должен использоваться внутри RegFlowProvider");
  return ctx;
}

/**
 * Гарантирует «completed»-состояние пайщиков на поздних этапах флоу (совет,
 * голосование): пайщики уже приглашены и ПП создано. Если состояние пусто (напр.
 * прямой заход), засевает приглашённых + published. В легит-флоу — no-op.
 * Нужен, чтобы клик «Пайщики» из сайдбара вёл на страницу с пайщиками, а не на
 * изначальную форму приглашения.
 */
export function useEnsureInvited() {
  const flow = useRegFlow();
  useEffect(() => {
    if (flow.invitedMembers.length === 0) flow.addInvitedMembers(PAISHIKI_NAMES);
    if (!flow.published) flow.setPublished(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Гарантирует «настроенную платформу» на экранах счетов: пайщики приглашены, ПП
 * создано, совет полностью сформирован (councilStage=3), счета разблокированы.
 * Нужен, чтобы при ПРЯМОМ заходе по ссылке на счета (напр. /21 после сброса
 * in-memory состояния) боковое меню было синхронно с контентом — без повторного
 * прохождения флоу. В легит-флоу (пришли из «Деятельности») — no-op.
 */
export function useEnsureAccountsReady() {
  const flow = useRegFlow();
  useEffect(() => {
    if (flow.invitedMembers.length === 0) flow.addInvitedMembers(PAISHIKI_NAMES);
    if (!flow.published) flow.setPublished(true);
    if (flow.councilStage < 3) flow.seedCouncilDone();
    if (!flow.accountsUnlocked) flow.unlockAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Гарантирует ФИНАЛЬНОЕ состояние флоу: всё пройдено и готово (совет, счета,
 * распределение, подсчёт, валидация документа). Для прямого захода по ссылке на
 * финальный экран — «всё готово».
 */
export function useEnsureFinal() {
  const flow = useRegFlow();
  useEffect(() => {
    flow.seedFinal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
