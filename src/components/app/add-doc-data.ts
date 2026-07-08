/**
 * Данные флоу «Добавить документ» (шаг 1 из 5 — выбор верификации).
 * Источник: Figma «Паспорт / Шаг 1 из 5» 7009:572133 и «Подробнее»
 * 7009:572098. Экраны /app/documents/add и /app/documents/add/detail?id=…
 *
 * 4 типа верификации: регион (international/local) × цвет (yellow/green).
 * Экран «Подробнее» — на основе жёлтой международной, адаптирован под все.
 */
export type VerifColor = "yellow" | "green";
export type VerifRegion = "international" | "local";

export interface VerifItem {
  id: string;
  region: VerifRegion;
  color: VerifColor;
  /** «Желтый тип» / «Зеленый тип». */
  typeLabel: string;
  price: string;
  cardDesc: string;
  // Экран «Подробнее»:
  bannerTitle: string;
  bannerSubtitle: string;
  bannerDesc: string;
}

/** Фоновые цвета карточек (жёлтый / зелёный из макета). */
export const VERIF_BG: Record<VerifColor, string> = {
  yellow: "#f0b429",
  green: "#7cb342",
};

export const VERIFS: VerifItem[] = [
  {
    id: "intl-yellow",
    region: "international",
    color: "yellow",
    typeLabel: "Желтый тип",
    price: "5 WEI",
    cardDesc: "Дистанционная верификация по международным стандартам",
    bannerTitle: "Желтая международная верификация",
    bannerSubtitle: "Персонифицированный аккаунт",
    bannerDesc:
      "Желтая верификация позволяет привязать ваши паспортные данные к биометрии и подтвердить личность документально.",
  },
  {
    id: "intl-green",
    region: "international",
    color: "green",
    typeLabel: "Зеленый тип",
    price: "6 WEI",
    cardDesc: "Личная верификация по международным стандартам",
    bannerTitle: "Зеленая международная верификация",
    bannerSubtitle: "Верифицированный аккаунт",
    bannerDesc:
      "Зеленая верификация подтверждает вашу личность при личной встрече по международным стандартам.",
  },
  {
    id: "local-yellow",
    region: "local",
    color: "yellow",
    typeLabel: "Желтый тип",
    price: "15 WEI",
    cardDesc:
      "Дистанционная верификация в соответствии с местными требованиями законодательства",
    bannerTitle: "Желтая локальная верификация",
    bannerSubtitle: "Персонифицированный аккаунт",
    bannerDesc:
      "Желтая верификация позволяет дистанционно подтвердить ваши данные в соответствии с местными требованиями законодательства.",
  },
  {
    id: "local-green",
    region: "local",
    color: "green",
    typeLabel: "Зеленый тип",
    price: "25 WEI",
    cardDesc:
      "Личная верификация в соответствии с местными требованиями законодательства",
    bannerTitle: "Зеленая локальная верификация",
    bannerSubtitle: "Верифицированный аккаунт",
    bannerDesc:
      "Зеленая верификация подтверждает вашу личность при личной встрече в соответствии с местными требованиями законодательства.",
  },
];

/** Преимущества (общие для всех типов) — экран «Подробнее». */
export type FeatureIcon = "chat" | "globe" | "star" | "lock";
export const VERIF_FEATURES: { icon: FeatureIcon; text: string }[] = [
  { icon: "chat", text: "Личные данные подтверждены нотариусом по вашим документам" },
  {
    icon: "globe",
    text: "Лицензия принимается большинством сервисов, за исключением финансовых",
  },
  {
    icon: "star",
    text: "Только вы решаете какую именно информацию предоставить конкретному сервису",
  },
  { icon: "lock", text: "Безопасность ваших данных гарантирована системой блокчейн" },
];

export const REGION_TITLE: Record<VerifRegion, string> = {
  international: "Международная верификация",
  local: "Локальная верификация",
};
