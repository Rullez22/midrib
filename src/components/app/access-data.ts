/**
 * Данные экрана согласия/доступа (чек-лист «На основании согласия»).
 * Источники: Figma «Midhub» 7009:567341, «Иванов…» 7009:572753.
 * Используются экраном /app/access?id=… (компонент AccessDetail).
 */
export interface AccessItem {
  label: string;
  checked: boolean;
}
export interface AccessField {
  label: string;
  value: string;
}
export interface AccessDetail {
  title: string;
  /** Подзаголовок-баннер под шапкой. */
  access: string;
  /** Заголовок серой секции. */
  basis: string;
  date: string;
  /** Чек-лист доступа (что вы предоставили). */
  items?: AccessItem[];
  /** Поля документа (что вам предоставили) — вместо чек-листа. */
  fields?: AccessField[];
  /** Нижняя кнопка (напр. «Закрыть доступ»). Нет — без кнопки. */
  action?: string;
}

const WORK_ITEMS: AccessItem[] = [
  { label: "ФИО", checked: true },
  { label: "Фото", checked: true },
  { label: "Дата рождения", checked: true },
  { label: "Телефон", checked: false },
  { label: "Паспортные данные", checked: false },
  { label: "Место регистрации", checked: false },
];

function work(title: string): AccessDetail {
  return {
    title,
    access: "Имеет доступ к вашим данным",
    basis: "На основании согласия",
    date: "Доступ открыт 11.12.18",
    items: WORK_ITEMS,
  };
}

export const ACCESS_DETAILS: Record<string, AccessDetail> = {
  miller: work("Miller"),
  vasilek: work("Сервис «Василек»"),
  midhub: work("Midhub"),
  ivanov: {
    title: "Иванов Александр Тимурович",
    access: "Получил доступ к вашим данным",
    basis: "На основании соглашения",
    date: "Доступ открыт 11.12.18",
    items: [
      { label: "ФИО", checked: true },
      { label: "Аттестат", checked: true },
      { label: "Диплом", checked: true },
      { label: "Телефон", checked: false },
      { label: "Паспортные данные", checked: false },
      { label: "Место регистрации", checked: false },
    ],
    action: "Закрыть доступ",
  },
  kovalev: {
    title: "Ковалев Андрей Викторович",
    access: "Вы получили доступ к данным",
    basis: "На основании соглашения",
    date: "Доступ открыт 11.12.18",
    fields: [
      { label: "Тип документа", value: "Паспорт РФ" },
      { label: "Фамилия", value: "Ковалев" },
      { label: "Имя", value: "Андрей" },
      { label: "Отчество", value: "Викторович" },
      { label: "Номер документа", value: "2411 542819" },
      { label: "Место выдачи", value: "ТП № 19 Калининского района, г. Москва" },
      { label: "Дата выдачи", value: "21.11.1990" },
    ],
    action: "Отказаться от доступа",
  },
};
