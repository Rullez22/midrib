/**
 * Данные документов (экран /app/document?id=…).
 * Источник шаблона: Figma «Свидетельство о рождении» 7009:568165.
 * Каждый документ — таблица полей + список верификаций:
 *   тип «global» (глобус → Международный) / «local» (метка → Локальный),
 *   цвет-статус green (подтверждён) / orange (на проверке).
 * У документа обычно 3–4 верификации (1:1 с плитками в списке документов).
 */
export type TileColor = "green" | "orange";
export type VerifType = "global" | "local";

export interface Verification {
  type: VerifType;
  color: TileColor;
}
export interface DocField {
  label: string;
  value: string;
}
export interface DocDetail {
  title: string;
  verifications: Verification[];
  fields: DocField[];
}

const g = (color: TileColor): Verification => ({ type: "global", color });
const l = (color: TileColor): Verification => ({ type: "local", color });

export const DOCUMENTS: Record<string, DocDetail> = {
  birth: {
    title: "Свидетельство о рождении",
    verifications: [g("green"), l("green")],
    fields: [
      { label: "Тип документа", value: "Паспорт РФ" },
      { label: "Фамилия", value: "Иванов" },
      { label: "Имя", value: "Иван" },
      { label: "Отчество", value: "Петрович" },
      { label: "Номер документа", value: "1234 567890" },
      { label: "Место выдачи", value: "76 ОМ Ленинского р-на, Пермь" },
      { label: "Дата выдачи", value: "12.04.1997" },
    ],
  },
  med: {
    title: "Мидицинское освидетельствование",
    verifications: [g("green"), g("orange"), l("green"), l("orange")],
    fields: [
      { label: "Тип документа", value: "Мед. заключение" },
      { label: "Фамилия", value: "Иванов" },
      { label: "Имя", value: "Иван" },
      { label: "Отчество", value: "Петрович" },
      { label: "Номер документа", value: "086/у-2020" },
      { label: "Место выдачи", value: "Городская поликлиника №1, Пермь" },
      { label: "Дата выдачи", value: "15.03.2020" },
    ],
  },
  spravka: {
    title: "Справка",
    verifications: [g("green"), l("green"), l("orange")],
    fields: [
      { label: "Тип документа", value: "Справка" },
      { label: "Фамилия", value: "Иванов" },
      { label: "Имя", value: "Иван" },
      { label: "Отчество", value: "Петрович" },
      { label: "Номер документа", value: "№ 452-С" },
      { label: "Место выдачи", value: "МФЦ Ленинского р-на, Пермь" },
      { label: "Дата выдачи", value: "02.06.2021" },
    ],
  },
  driver: {
    title: "Водительское удостоверение",
    verifications: [g("orange"), g("green"), l("orange")],
    fields: [
      { label: "Тип документа", value: "Вод. удостоверение" },
      { label: "Фамилия", value: "Иванов" },
      { label: "Имя", value: "Иван" },
      { label: "Отчество", value: "Петрович" },
      { label: "Номер документа", value: "59 12 345678" },
      { label: "Категории", value: "B, C" },
      { label: "Место выдачи", value: "ГИБДД Пермского края" },
      { label: "Дата выдачи", value: "20.08.2019" },
    ],
  },
  marriage: {
    title: "Брачное свидетельство",
    verifications: [g("green"), l("green"), l("green"), l("orange")],
    fields: [
      { label: "Тип документа", value: "Свидетельство о браке" },
      { label: "Фамилия", value: "Иванов" },
      { label: "Имя", value: "Иван" },
      { label: "Отчество", value: "Петрович" },
      { label: "Номер документа", value: "II-ВГ № 123456" },
      { label: "Место выдачи", value: "ЗАГС Ленинского р-на, Пермь" },
      { label: "Дата выдачи", value: "11.09.2018" },
    ],
  },
};

export const VERIF_LABEL: Record<VerifType, string> = {
  global: "Международный:",
  local: "Локальный:",
};
