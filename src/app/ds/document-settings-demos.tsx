"use client";

/**
 * Демки DocumentSettings — выбор типа настроек и запрашиваемых документов.
 * Источник: Figma «UI фичи» / Типы настроек (288:643).
 * Reuse: DocumentSettings (внутри Radio · Checkbox · Accordion · Flag).
 */
import { DocumentSettings, type DocSettingsCategory } from "@/components/ds";

const PRICE = { intl: 0.5, local: 0.3 };
const CATEGORIES: DocSettingsCategory[] = [
  { name: "Все документы", docs: ["Паспорт", "Заграничный паспорт", "СНИЛС", "ИНН"].map((name) => ({ name, ...PRICE })) },
  { name: "Удостоверяющие личность", docs: ["Паспорт", "Водительское удостоверение"].map((name) => ({ name, ...PRICE })) },
  { name: "Образование", docs: ["Диплом", "Аттестат"].map((name) => ({ name, ...PRICE })) },
];

export function DocumentSettingsDemos() {
  return (
    <div className="max-w-[1120px]">
      <DocumentSettings
        identityFields={["Имя", "Фамилия", "Отчество", "Пол", "E-mail", "Телефон", "Дата рождения", "Место рождения", "Что-то еще"]}
        countries={[
          { code: "ru", label: "Россия", categories: CATEGORIES },
          { code: "bg", label: "Болгария", categories: CATEGORIES },
        ]}
      />
    </div>
  );
}
