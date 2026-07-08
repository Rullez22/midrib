/**
 * Данные флоу «Добавить документ» (шаги 2–5).
 * Источники: Figma «Выберите страну» 7009:568983, «Выберите документ»
 * 7009:572046, «Заполните форму» 7009:569200, «Подтверждение» 7009:569291,
 * «Проверка» 7009:569361.
 */
export interface Country {
  flag: string;
  name: string;
}

export const POPULAR_COUNTRIES: Country[] = [
  { flag: "🇷🇺", name: "Российская федерация" },
  { flag: "🇬🇧", name: "Великобритания" },
  { flag: "🇩🇪", name: "Германия" },
  { flag: "🇺🇸", name: "США" },
];

export const ALL_COUNTRIES: Country[] = [
  { flag: "🇦🇺", name: "Австралия" },
  { flag: "🇦🇹", name: "Австрия" },
  { flag: "🇦🇿", name: "Азербайджан" },
  { flag: "🇦🇱", name: "Албания" },
  { flag: "🇩🇿", name: "Алжир" },
  { flag: "🇦🇷", name: "Аргентина" },
  { flag: "🇦🇲", name: "Армения" },
  { flag: "🇧🇾", name: "Беларусь" },
  { flag: "🇧🇪", name: "Бельгия" },
  { flag: "🇧🇬", name: "Болгария" },
  { flag: "🇧🇷", name: "Бразилия" },
  { flag: "🇭🇺", name: "Венгрия" },
  { flag: "🇻🇳", name: "Вьетнам" },
  { flag: "🇬🇷", name: "Греция" },
  { flag: "🇬🇪", name: "Грузия" },
  { flag: "🇩🇰", name: "Дания" },
  { flag: "🇪🇬", name: "Египет" },
  { flag: "🇮🇱", name: "Израиль" },
  { flag: "🇮🇳", name: "Индия" },
  { flag: "🇮🇩", name: "Индонезия" },
  { flag: "🇪🇸", name: "Испания" },
  { flag: "🇮🇹", name: "Италия" },
  { flag: "🇰🇿", name: "Казахстан" },
  { flag: "🇨🇦", name: "Канада" },
  { flag: "🇨🇳", name: "Китай" },
  { flag: "🇰🇷", name: "Корея" },
  { flag: "🇱🇻", name: "Латвия" },
  { flag: "🇱🇹", name: "Литва" },
  { flag: "🇳🇱", name: "Нидерланды" },
  { flag: "🇳🇴", name: "Норвегия" },
  { flag: "🇵🇱", name: "Польша" },
  { flag: "🇵🇹", name: "Португалия" },
  { flag: "🇷🇸", name: "Сербия" },
  { flag: "🇹🇷", name: "Турция" },
  { flag: "🇺🇦", name: "Украина" },
  { flag: "🇫🇮", name: "Финляндия" },
  { flag: "🇫🇷", name: "Франция" },
  { flag: "🇨🇿", name: "Чехия" },
  { flag: "🇨🇭", name: "Швейцария" },
  { flag: "🇸🇪", name: "Швеция" },
  { flag: "🇯🇵", name: "Япония" },
];

export type PriceTone = "free" | "paid";
export interface DocType {
  name: string;
  price: string;
  tone: PriceTone;
}
export interface DocTypeGroup {
  title: string;
  items: DocType[];
}

export const DOC_TYPE_GROUPS: DocTypeGroup[] = [
  {
    title: "Документы удостоверяющие личность",
    items: [
      { name: "Паспорт", price: "Free", tone: "free" },
      { name: "Заграничный паспорт", price: "Free", tone: "free" },
      { name: "Водительское удостоверение", price: "WEI", tone: "paid" },
    ],
  },
  {
    title: "Документы на право управления",
    items: [
      { name: "Свидетельство о браке", price: "5 WEI", tone: "paid" },
      { name: "Мидицинское освидетельствование", price: "5 WEI", tone: "paid" },
    ],
  },
];

/** Итоговые данные (демо) — экраны «Подтверждение» / «Проверка». */
export const CONFIRM_FIELDS: { label: string; value: string }[] = [
  { label: "Тип документа", value: "Паспорт РФ" },
  { label: "Фамилия", value: "Иванов" },
  { label: "Имя", value: "Иван" },
  { label: "Отчество", value: "Петрович" },
  { label: "Дата рождения", value: "12.01.1991" },
  { label: "Пол", value: "Мужской" },
  { label: "Номер документа", value: "1234 567890" },
  { label: "Орган выдавший документ", value: "76 ОМ Ленинского р-на, Пермь" },
  { label: "Дата выдачи", value: "12.04.2002" },
  { label: "Код подразделения", value: "0132424" },
];
