import { type DocKind } from "../../../flow/company-create/_components/reg-flow";

/**
 * Конфиг видов документа документооборота между партнёрами: договор / счёт на
 * оплату / акт выполненных работ. Метки экранов + авто-последовательность
 * транзакций и сообщений чата (1:1 из Figma 6760-482282…482829 / 497034…497365).
 *
 * Флоу всех трёх видов идентичен, меняется только слово «Договор» и авто-прогресс.
 * Акт — терминальный: у готового акта нет блока «Документы» (нельзя вложить).
 */

export type PartyRole = "executor" | "manager" | "validator";

export interface DocStep {
  tx: { action: string; role: PartyRole; date: string };
  chat: { text: string; time: string };
}

export interface KindConfig {
  /** «Договор» / «Счет на оплату» / «Акт выполненных работ». */
  doc: string;
  /** Заголовок формы: «Добавление договора». */
  formTitle: string;
  /** Плейсхолдер названия: «Название договора*». */
  nameLabel: string;
  /** Кнопка сабмита формы: «Добавить договор». */
  addBtn: string;
  /** tx создания: «Добавление договора» / «Добавлен акт выполненных работ». */
  txAdd: string;
  /** Имя прикреплённого файла. */
  attachedName: string;
  /** Заголовок секции процесса. */
  processTitle: string;
  /** Терминальный документ (акт) — без блока «Документы». */
  terminal: boolean;
  /** Сумма обязательна (счёт/акт — да, договор — нет). */
  amountRequired: boolean;
  /** Подпись участников чата в активном состоянии. */
  participants: string;
  /** Дата tx «Подпись исполнителя» / «Добавление…». */
  baseTxDate: string;
  /** Чат после подписи (до авто-шагов). */
  baseChat: { me?: boolean; text: string; time: string }[];
  /** Авто-шаги: каждые ~2с добавляется tx (сверху) + сообщение в чат. */
  steps: DocStep[];
  /** Участник tx создания (по умолчанию «Elephant»). */
  addParty?: string;
  /** Действие tx, добавляемой сразу при подписи (по умолчанию «Подпись исполнителя»). */
  signTxAction?: string;
  /** Участник tx подписи (по умолчанию «Elephant»). */
  signTxParty?: string;
}

export const KINDS: Record<DocKind, KindConfig> = {
  contract: {
    doc: "Договор",
    formTitle: "Добавление договора",
    nameLabel: "Название договора*",
    addBtn: "Добавить договор",
    txAdd: "Добавление договора",
    attachedName: "Договор с фондом",
    processTitle: "Процесс исполнения договора",
    terminal: false,
    amountRequired: false,
    participants: "2 Участника",
    baseTxDate: "11.04.2025 - 11:00",
    baseChat: [
      { me: true, text: "Привет, фонд. Можете подписать?", time: "11:10" },
      { text: "Привет, исполнитель. Сейчас к цели прикрепим. Рады сотрудничеству.", time: "11:45" },
    ],
    steps: [],
  },
  invoice: {
    doc: "Счет на оплату",
    formTitle: "Добавление счета на оплату",
    nameLabel: "Название счета на оплату*",
    addBtn: "Добавить счет на оплату",
    txAdd: "Добавление счета на оплату",
    attachedName: "Счет на оплату с фондом",
    processTitle: "Процесс исполнения счёта на оплату",
    terminal: false,
    amountRequired: true,
    participants: "2 Участника",
    baseTxDate: "11.04.2025 - 11:00",
    baseChat: [
      { me: true, text: "Привет, менеджер фонда. Подпиши и оплати счет?", time: "11:45" },
      { text: "Привет, исполнитель. Сейчас подпишу. Рады сотрудничеству.", time: "11:46" },
    ],
    steps: [
      { tx: { action: "Подпись менеджера", role: "manager", date: "11.04.2025 - 12:30" }, chat: { text: "Подписал счет на оплату. Сейчас отправлю валидатору.", time: "12:31" } },
      { tx: { action: "Подпись валидатора", role: "validator", date: "11.04.2025 - 13:45" }, chat: { text: "Проверил и подписал. Замечаний нет, всё в порядке.", time: "13:46" } },
      { tx: { action: "Подпись менеджера", role: "manager", date: "11.04.2025 - 14:30" }, chat: { text: "Спасибо, подписал счет. Оплатим до конца недели.", time: "14:31" } },
    ],
  },
  act: {
    doc: "Акт выполненных работ",
    formTitle: "Добавление акта выполненных работ",
    nameLabel: "Название акта выполненных работ*",
    addBtn: "Добавить акт выполненных работ",
    txAdd: "Добавлен акт выполненных работ",
    attachedName: "Акт выполненных работ",
    processTitle: "Процесс исполнения акта выполненных работ",
    terminal: true,
    amountRequired: true,
    participants: "3 Участника",
    baseTxDate: "11.04.2025 - 11:00",
    baseChat: [
      { me: true, text: "Привет, менеджер фонда. Подпиши акт вып. раб?", time: "11:00" },
      { text: "Привет, исполнитель. Сейчас подпишу. Рады сотрудничеству.", time: "11:05" },
    ],
    steps: [
      { tx: { action: "Подпись валидатора", role: "validator", date: "11.04.2025 - 12:15" }, chat: { text: "Проверил объёмы по акту, замечаний нет — подписал.", time: "12:16" } },
      { tx: { action: "Подпись менеджера", role: "manager", date: "11.04.2025 - 13:30" }, chat: { text: "Спасибо, подписал акт. Работы принимаем.", time: "13:31" } },
    ],
  },
  // Договор внутри цели (Фонд): две транзакции фонда (Добавление договора +
  // Подпись менеджера, обе VELESTA) → через 3с подпись исполнителя (Elephant) →
  // через 1с «Согласован».
  goalcontract: {
    doc: "Договор",
    formTitle: "Добавление договора",
    nameLabel: "Название договора*",
    addBtn: "Добавить договор",
    txAdd: "Добавление договора",
    attachedName: "Договор с фондом",
    processTitle: "Процесс исполнения договора",
    terminal: false,
    amountRequired: false,
    participants: "2 Участника",
    baseTxDate: "11.04.2025 - 11:00",
    baseChat: [
      { me: true, text: "Привет, фонд. Можете подписать?", time: "11:10" },
      { text: "Привет, исполнитель. Сейчас к цели прикрепим. Рады сотрудничеству.", time: "11:45" },
    ],
    addParty: "VELESTA",
    signTxAction: "Подпись менеджера",
    signTxParty: "VELESTA",
    steps: [
      { tx: { action: "Подпись исполнителя", role: "executor", date: "11.04.2025 - 14:00" }, chat: { text: "Подписал договор со стороны исполнителя. Рады сотрудничеству.", time: "14:00" } },
    ],
  },
};

/** Дропдаун «Добавить документ» на странице партнёра (все три вида). */
export const PARTNER_DOC_ITEMS: { value: DocKind; label: string }[] = [
  { value: "contract", label: "Договор" },
  { value: "invoice", label: "Счет на оплату" },
  { value: "act", label: "Акт выполненных работ" },
];

/** Дропдаун «Добавить документ» внутри документа (вложение: счёт/акт). */
export const NESTED_DOC_ITEMS: { value: DocKind; label: string }[] = [
  { value: "invoice", label: "Счет на оплату" },
  { value: "act", label: "Акт выполненных работ" },
];
