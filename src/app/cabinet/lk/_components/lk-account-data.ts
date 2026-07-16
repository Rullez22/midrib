import { type Transaction } from "@/components/ds";
import { type AccountDocRow, type AccountArtifactRow } from "../../_components/account-tabs";

/**
 * Данные экрана «Лицевой счёт» ЛК (Figma 1857:649778/649786/649794). Одинаковы
 * для обеих ролей (chair/payer). Транзакции/доки/артефакты — 1:1 из макета.
 */

/* Взаиморасчёты — таблица транзакций (Figma 2658:389147). */
export const LK_TRANSACTIONS: Transaction[] = [
  { code: "214", color: "cyan", hash: "5c243af… 07db8", time: "29 секунд назад", from: "Кооператив «Immatra»", to: "ИП Салютов Р. К.", document: "Счёт на оплату", documentSub: "Договор на поставку игрового оборудования", documentLink: true, amount: "0.229937", commission: "0.0022" },
  { code: "214", color: "cyan", hash: "9b17e04… 3f2a1", time: "3 минуты назад", from: "Кооператив «Immatra»", to: "Кооператив «Гвозди и доски»", document: "Счёт на оплату", documentSub: "Соглашение о совместной закупке материалов", documentLink: true, amount: "0.583104", commission: "0.0041" },
  { code: "214", color: "cyan", hash: "41d8c6b… e05d7", time: "12 минут назад", from: "Кооператив «Immatra»", to: "Кооператив «Слонёнок»", document: "Счёт на оплату", documentSub: "Договор на техническое обслуживание", documentLink: true, amount: "0.041250", commission: "0.0009" },
  { code: "216", color: "purple", hash: "7ea2f19… b84c3", time: "1 час назад", from: "Антонов И. А.", to: "Кооператив «Immatra»", document: "Взносы и целевые поступления", documentSub: "Паевой взнос за II квартал", documentLink: true, amount: "0.127860", commission: "0.0015" },
  { code: "215", color: "green", hash: "2fc59d8… 61e9b", time: "5 часов назад", from: "Подразделение «Администрация»", to: "Кооператив «Immatra»", document: "Поступления с маршрутных счетов", documentSub: "Смета на благоустройство территории", documentLink: true, amount: "0.094512", commission: "0.0011" },
  { code: "214", color: "cyan", hash: "6a03df2… 9c14e", time: "8 часов назад", from: "Кооператив «Immatra»", to: "ООО «Петрушка»", document: "Счёт на оплату", documentSub: "Счёт-фактура за консультационные услуги", documentLink: true, amount: "0.012480", commission: "0.0003" },
  { code: "214", color: "cyan", hash: "b7e14c9… 20fa6", time: "вчера, 11:26", from: "Кооператив «Immatra»", to: "ИП Салютов Р. К.", document: "Счёт на оплату", documentSub: "Акт приёмки выполненных работ", documentLink: true, amount: "1.746300", commission: "0.0162" },
  { code: "216", color: "purple", hash: "3d92a5f… c807b", time: "2 дня назад", from: "Козлова А. В.", to: "Кооператив «Immatra»", document: "Взносы и целевые поступления", documentSub: "Вступительный паевой взнос", documentLink: true, amount: "0.305170", commission: "0.0028" },
  { code: "215", color: "green", hash: "e58b073… 4d61a", time: "4 дня назад", from: "Подразделение «Логистика»", to: "Кооператив «Immatra»", document: "Поступления с маршрутных счетов", documentSub: "Распределение по маршруту склад-объект", documentLink: true, amount: "0.068930", commission: "0.0008" },
  { code: "214", color: "cyan", hash: "4f18ed6… b3720", time: "6 дней назад", from: "Кооператив «Immatra»", to: "Кооператив «Гвозди и доски»", document: "Счёт на оплату", documentSub: "Смета на монтаж игрового комплекса", documentLink: true, amount: "0.837950", commission: "0.0077" },
  { code: "216", color: "purple", hash: "9f27be4… a53c0", time: "9 дней назад", from: "Михайлов Д. С.", to: "Кооператив «Immatra»", document: "Взносы и целевые поступления", documentSub: "Членский взнос за III квартал", documentLink: true, amount: "0.213640", commission: "0.0020" },
  { code: "214", color: "cyan", hash: "7b60fa1… 8e29d", time: "16 дней назад", from: "Кооператив «Immatra»", to: "Кооператив «Слонёнок»", document: "Счёт на оплату", documentSub: "Договор на поставку грунта и щебня", documentLink: true, amount: "3.591820", commission: "0.0331" },
];

/* Документооборот (Figma 1857:649786). */
export const LK_DOCS: AccountDocRow[] = [
  { type: "Свидетельство", name: "Свидетельство о государственной регистрации программы ЭВМ", status: "Отвалидирован", badge: "Локальный", date: "17.03.2023" },
  { type: "Сертификат", name: "Сертификат соответствия системы менеджмента качества", status: "Отвалидирован", badge: "Локальный", date: "09.10.2023" },
  { type: "Договор", name: "Договор подряда на монтаж площадки", date: "22.04.2025" },
];

/* Артефакты (Figma 1857:649794). */
export const LK_ARTIFACTS: AccountArtifactRow[] = [
  { type: "Документ", name: "Отчёт о целевом расходовании средств за 2024 год", date: "19.05.2025", state: "share" },
  { type: "Документ", name: "Методика оценки заявок пайщиков на участие в программах", date: "06.12.2024", state: "lock" },
  { type: "Патент", name: "Способ учёта паевых взносов в распределённом реестре", date: "14.02.2025", state: "person" },
];
