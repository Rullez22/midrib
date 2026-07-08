/**
 * Конфиг карточек сервисов «… имеет доступ к вашим данным».
 * Используется /app/service/[id] (детальная карточка) и производными
 * экранами (удаление/чат). Разные сервисы — разный состав полей.
 * Источник: Figma 7009:573827 (PayPal), 7009:573911 (Университет).
 */

export interface DetailGroup {
  doc: string;
  fields: string[];
}

export interface DetailSection {
  caption: string;
  groups: DetailGroup[];
  /** Показать ссылку «Редактировать доступ» сразу после этой секции. */
  editLinkAfter?: boolean;
}

export interface ServiceDetail {
  /** Заголовок в шапке. */
  name: string;
  /** Подзаголовок-строка: «Сервис/ВУЗ имеет доступ к вашим данным». */
  accessLabel: string;
  sections: DetailSection[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  paypal: {
    name: "PayPal",
    accessLabel: "Сервис имеет доступ к вашим данным",
    sections: [
      {
        caption: "На основании согласия",
        editLinkAfter: true,
        groups: [
          { doc: "Паспорт РФ", fields: ["Фамилия", "Имя", "Дата рождения"] },
          { doc: "Водительское удостоверение", fields: ["Фамилия", "Имя"] },
        ],
      },
      {
        caption: "На основании договора",
        groups: [
          { doc: "Паспорт РФ", fields: ["Номер паспорта", "Кода подразделения"] },
        ],
      },
    ],
  },
  university: {
    name: "Университет имени Пушкина",
    accessLabel: "ВУЗ имеет доступ к вашим данным",
    sections: [
      {
        caption: "На основании согласия",
        editLinkAfter: true,
        groups: [
          { doc: "Паспорт РФ", fields: ["Фамилия", "Имя", "Дата рождения"] },
          { doc: "Дипломы и аттестаты", fields: ["Аттестат"] },
        ],
      },
    ],
  },
};

/** Имя сервиса для производных экранов (удаление/чат/revoked). */
export function serviceName(id: string): string {
  return SERVICE_DETAILS[id]?.name ?? "PayPal";
}
