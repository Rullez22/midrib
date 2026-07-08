import { type Transaction } from "@/components/ds";
import { type AccountDocRow, type AccountArtifactRow } from "../../_components/account-tabs";

/**
 * Данные экрана «Лицевой счёт» ЛК (Figma 1857:649778/649786/649794). Одинаковы
 * для обеих ролей (chair/payer). Транзакции/доки/артефакты — 1:1 из макета.
 */

/* Взаиморасчёты — таблица транзакций (Figma 2658:389147). */
export const LK_TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Закупка площадок", documentLink: true, amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Закупка площадок", documentLink: true, amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Закупка площадок", documentLink: true, amount: "0.229937", commission: "0.0022" },
  { code: "216", color: "purple", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Взносы и целевые поступления", documentSub: "Закупка площадок", documentLink: true, amount: "0.229937", commission: "0.0022" },
  { code: "215", color: "green", hash: "5c243af… 07db8", time: "29 секунд назад", from: "ООО «Ромашка»", to: "ООО «Петрушка»", document: "Поступления с маршрутных счетов", documentSub: "Закупка площадок", documentLink: true, amount: "0.229937", commission: "0.0022" },
];

/* Документооборот (Figma 1857:649786). */
export const LK_DOCS: AccountDocRow[] = [
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", status: "Отвалидирован", badge: "Локальный", date: "09.01.2020" },
  { type: "Сертификат", name: "Сертификат соответствия", status: "Отвалидирован", badge: "Локальный", date: "09.01.2020" },
  { type: "Договор", name: "Оплата за проектирование площадок", date: "09.01.2020" },
];

/* Артефакты (Figma 1857:649794). */
export const LK_ARTIFACTS: AccountArtifactRow[] = [
  { type: "Документ", name: "Документ в свободной форме", date: "09.01.2020", state: "share" },
  { type: "Документ", name: 'Сочинение на тему: "Как я провел Лето"', date: "09.01.2020", state: "lock" },
  { type: "Патент", name: "Изобретение плазменного реактора", date: "09.01.2020", state: "person" },
];
