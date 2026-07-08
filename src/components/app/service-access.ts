/**
 * Данные доступа сервиса к персональным данным пользователя.
 * Используются экранами флоу «Сервис запрашивает доступ» (кейс 1):
 * запрос доступа (grant / edit), детальная карточка сервиса, экран удаления.
 * Источник: Figma 7009:573389 (запрос), 7009:573827 (карточка).
 */

export interface AccessField {
  id: string;
  label: string;
  /** Отмечено ли поле по умолчанию (галочка в запросе доступа). */
  defaultChecked: boolean;
}

export interface AccessGroup {
  id: string;
  /** Заголовок группы-документа (серая плашка): «Паспорт РФ» и т.п. */
  doc: string;
  fields: AccessField[];
}

export interface AccessBasis {
  id: string;
  /** Подпись-основание: «На основании согласия» / «…договора». */
  caption: string;
  groups: AccessGroup[];
}

/** Полная структура доступа (одинакова для всех сервисов демо-флоу). */
export const SERVICE_ACCESS: AccessBasis[] = [
  {
    id: "consent",
    caption: "На основании согласия",
    groups: [
      {
        id: "passport-consent",
        doc: "Паспорт РФ",
        fields: [
          { id: "c-surname", label: "Фамилия", defaultChecked: true },
          { id: "c-name", label: "Имя", defaultChecked: true },
          { id: "c-birth", label: "Дата рождения", defaultChecked: true },
        ],
      },
      {
        id: "license-consent",
        doc: "Водительское удостоверение",
        fields: [
          { id: "l-surname", label: "Фамилия", defaultChecked: true },
          { id: "l-name", label: "Имя", defaultChecked: true },
        ],
      },
    ],
  },
  {
    id: "contract",
    caption: "На основании договора",
    groups: [
      {
        id: "passport-contract",
        doc: "Паспорт РФ",
        fields: [
          { id: "k-passnum", label: "Номер паспорта", defaultChecked: false },
          { id: "k-dept", label: "Кода подразделения", defaultChecked: false },
        ],
      },
    ],
  },
];

/** Начальное состояние галочек (id поля → отмечено). */
export function defaultSelection(): Record<string, boolean> {
  const sel: Record<string, boolean> = {};
  for (const basis of SERVICE_ACCESS) {
    for (const group of basis.groups) {
      for (const field of group.fields) sel[field.id] = field.defaultChecked;
    }
  }
  return sel;
}
